import './styles.sass'

class WubbleApp extends HTMLElement {
    audioCtx: AudioContext
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    message: HTMLDivElement
    wordsPool: string[] = [
        'Boom', 'Zap', 'Wobble', 'Fizz', 'Bop', 'Bang', 'Glitch', 'Spark', 'Pop', 'Zing', 'Wham',
        'Funk', 'Twist', 'Zoom', 'Crack', 'Bam', 'Clash', 'Splat', 'BangBang', 'Zwoop', 'Kaboom',
        'Whizz', 'Thunk', 'Fwoosh', 'Smash', 'BoomZap', 'Twack', 'Womp', 'Blam', 'Shhh', 'Blorp',
        'Blitz', 'Flick', 'Snapp', 'Whack', 'Kablam', 'ZingZap', 'ThunkBang', 'BopBop'
    ]

    lastKeyTime = 0
    waveEnergy = 0

    constructor() {
        super()
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
        this.canvas = document.createElement('canvas')
        this.canvas.className = 'wubble-bg'
        this.ctx = this.canvas.getContext('2d')!

        document.body.appendChild(this.canvas)
        window.addEventListener('resize', () => this.resizeCanvas())
        this.resizeCanvas()
        requestAnimationFrame(() => this.drawWave())

        this.message = document.createElement('div')
        this.message.className = 'wubble-message'
        this.message.textContent = 'PRESS KEYS'
        document.body.appendChild(this.message)

        document.addEventListener('touchstart', e => this.handleKey(e as any))
        document.addEventListener('keydown', e => this.handleKey(e as any))
        setInterval(() => this.checkInactivity(), 200)
    }

    resizeCanvas() {
        const scale = window.devicePixelRatio || 1
        this.canvas.width = window.innerWidth * scale
        this.canvas.height = window.innerHeight * scale
        this.ctx.setTransform(1, 0, 0, 1, 0, 0)
        this.ctx.scale(scale, scale)
    }

    drawWave(time = 0) {
        const ctx = this.ctx
        const { width, height } = this.canvas
        ctx.clearRect(0, 0, width, height)
        const amplitude = height * (0.15 + this.waveEnergy * 0.25)
        const freq = 0.002 + this.waveEnergy * 0.004
        const lineWidth = 6
        ctx.beginPath()
        for (let x = 0; x < width; x++) {
            const y = height / 2 + Math.sin(x * freq + time * 0.002) * amplitude
            const hue = (x / width) * 360 + time * 0.25
            ctx.strokeStyle = `hsl(${hue},100%,60%)`
            ctx.lineWidth = lineWidth
            if (x === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
        }
        ctx.stroke()
        this.waveEnergy = Math.max(0, this.waveEnergy - 0.01)
        requestAnimationFrame(t => this.drawWave(t))
    }

    handleKey(_: Event) {
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume()
        this.lastKeyTime = Date.now()
        this.waveEnergy = Math.min(1, this.waveEnergy + 0.4)
        this.message.style.opacity = '0'

        let wordText = this.wordsPool[Math.floor(Math.random() * this.wordsPool.length)]
        wordText = wordText.split('').sort(() => Math.random() - 0.5).join('')
        const word = document.createElement('div')
        word.className = 'word'
        word.textContent = wordText

        const hue = Math.floor(Math.random() * 360)
        word.style.color = `hsl(${hue},100%,60%)`
        word.style.textShadow = `
            0 0 10px hsl(${hue},100%,70%),
            0 0 30px hsl(${hue},100%,50%)
        `
        document.body.appendChild(word)

        let x = window.innerWidth / 2 + (Math.random() * 200 - 100)
        let y = window.innerHeight / 2 + (Math.random() * 200 - 100)
        let vx = (Math.random() - 0.5) * 8
        let vy = -6 + (Math.random() - 0.5) * 4
        let opacity = 1

        const animate = () => {
            vy += 0.18
            x += vx
            y += vy
            opacity = Math.max(0, opacity - 0.012)
            const scale = 0.8 + opacity * 0.5
            word.style.transform = `translate(${x}px,${y}px) scale(${scale})`
            word.style.opacity = `${opacity}`
            if (opacity > 0) requestAnimationFrame(animate)
            else word.remove()
        }
        requestAnimationFrame(animate)

        this.playWobble()
    }

    checkInactivity() {
        if (Date.now() - this.lastKeyTime > 2500) {
            const baseText = 'PRESS KEYS'
            this.message.textContent = baseText.split('').sort(() => Math.random() - 0.5).join('')
            this.message.style.opacity = '1'
        }
    }

    playWobble() {
        try {
            const now = this.audioCtx.currentTime
            const osc = this.audioCtx.createOscillator()
            const types: OscillatorType[] = ['sine', 'triangle']
            osc.type = types[Math.floor(Math.random() * types.length)]
            osc.frequency.value = 35 + Math.random() * 45

            const gain = this.audioCtx.createGain()
            gain.gain.setValueAtTime(0, now)
            gain.gain.linearRampToValueAtTime(0.25 + Math.random() * 0.1, now + 0.05)
            gain.gain.linearRampToValueAtTime(0, now + 0.5 + Math.random() * 0.3)

            const filter = this.audioCtx.createBiquadFilter()
            filter.type = 'lowpass'
            filter.frequency.value = 200 + Math.random() * 200

            const lfo = this.audioCtx.createOscillator()
            const lfoGain = this.audioCtx.createGain()
            lfo.type = 'sine'
            lfo.frequency.value = 1 + Math.random() * 3
            lfoGain.gain.value = 10 + Math.random() * 20
            lfo.connect(lfoGain)
            lfoGain.connect(osc.frequency)

            const panner = this.audioCtx.createStereoPanner()
            panner.pan.value = Math.random() * 0.6 - 0.3

            osc.connect(filter)
            filter.connect(gain)
            gain.connect(panner)
            panner.connect(this.audioCtx.destination)

            osc.start(now)
            osc.stop(now + 0.5 + Math.random() * 0.4)
            lfo.start(now)
            lfo.stop(now + 0.5 + Math.random() * 0.4)
        } catch { }
    }
}

customElements.define('wubble-app', WubbleApp)
