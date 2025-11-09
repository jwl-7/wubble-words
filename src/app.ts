import './styles.sass'

class WubbleApp extends HTMLElement {
    private audioCtx: AudioContext
    private wordsPool: string[] = [
        'Boom','Zap','Wobble','Fizz','Bop','Bang','Glitch',
        'Spark','Pop','Zing','Wham','Funk','Twist','Zoom','Crack'
    ]

    constructor() {
        super()
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
        document.addEventListener('keydown', e => this.handleKey(e))
    }

    private handleKey(e: KeyboardEvent) {
        const wordText = this.wordsPool[Math.floor(Math.random() * this.wordsPool.length)]
        const word = document.createElement('div')
        word.className = 'word'
        word.textContent = wordText
        document.body.appendChild(word)

        let x = window.innerWidth / 2 + (Math.random() * 200 - 100)
        let y = window.innerHeight / 2 + (Math.random() * 200 - 100)
        let vx = (Math.random() - 0.5) * 6
        let vy = -5 + (Math.random() - 0.5) * 3
        let opacity = 1

        const animate = () => {
            vy += 0.15
            x += vx
            y += vy
            opacity = Math.max(0, opacity - 0.01)
            const scale = 0.8 + opacity * 0.4
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
            const osc = this.audioCtx.createOscillator()
            const gain = this.audioCtx.createGain()
            osc.type = 'triangle'
            osc.frequency.value = 60 + Math.random() * 20 // low frequency for bass
            gain.gain.value = 0.2

            osc.connect(gain)
            gain.connect(this.audioCtx.destination)

            const now = this.audioCtx.currentTime
            osc.start(now)
            osc.stop(now + 0.5)
        } catch (err) {
            console.warn('Audio failed:', err)
        }
    }
}

customElements.define('wubble-app', WubbleApp)
