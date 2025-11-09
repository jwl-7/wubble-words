import './styles.sass'

class WubbleApp extends HTMLElement {
    private audioCtx: AudioContext
    private container: HTMLDivElement
    private wordsPool: string[] = [
        'Boom', 'Zap', 'Wobble', 'Fizz', 'Bop', 'Bang', 'Glitch',
        'Spark', 'Pop', 'Zing', 'Wham', 'Funk', 'Twist', 'Zoom', 'Crack',
        'Bam', 'Clash', 'Splat', 'BangBang', 'Zwoop', 'Kaboom', 'Whizz', 'Thunk',
        'Fwoosh', 'Smash', 'BoomZap', 'Twack', 'Womp', 'Blam', 'Shhh', 'Blorp',
        'Blitz', 'Flick', 'Snapp', 'Whack', 'Kablam', 'ZingZap', 'ThunkBang', 'BopBop'
    ]

    constructor() {
        super()
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()

        this.container = document.createElement('div')
        this.container.className = 'wubble-container'
        this.appendChild(this.container)

        document.addEventListener('keydown', e => this.handleKey(e))
    }

    private handleKey(_: KeyboardEvent) {
        let wordText = this.wordsPool[Math.floor(Math.random() * this.wordsPool.length)]
        wordText = wordText.split('').sort(() => Math.random() - 0.5).join('')
        const word = document.createElement('div')
        word.className = 'word'
        word.textContent = wordText

        const hue = Math.floor(Math.random() * 360)
        word.style.color = `hsl(${hue}, 100%, 60%)`
        word.style.textShadow = `
        0 0 10px hsl(${hue}, 100%, 70%),
        0 0 30px hsl(${hue}, 100%, 50%)
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
            word.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
            word.style.opacity = `${opacity}`
            if (opacity > 0) requestAnimationFrame(animate)
            else word.remove()
        }

        requestAnimationFrame(animate)
        this.playWobble()
    }

    private playWobble() {
        try {
            const now = this.audioCtx.currentTime
            const osc = this.audioCtx.createOscillator()
            osc.type = 'triangle'
            osc.frequency.value = 50 + Math.random() * 20

            const gain = this.audioCtx.createGain()
            gain.gain.setValueAtTime(0, now)
            gain.gain.linearRampToValueAtTime(0.3, now + 0.02)
            gain.gain.linearRampToValueAtTime(0, now + 0.6)

            const lfo = this.audioCtx.createOscillator()
            lfo.type = 'sine'
            lfo.frequency.value = 3 + Math.random() * 5

            const lfoGain = this.audioCtx.createGain()
            lfoGain.gain.value = 40 + Math.random() * 20

            lfo.connect(lfoGain)
            lfoGain.connect(osc.frequency)

            osc.connect(gain)
            gain.connect(this.audioCtx.destination)

            osc.start(now)
            osc.stop(now + 0.6)
            lfo.start(now)
            lfo.stop(now + 0.6)
        } catch { }
    }
}

customElements.define('wubble-app', WubbleApp)
