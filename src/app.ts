import './styles.sass'

class WubbleApp extends HTMLElement {
    private container: HTMLDivElement
    private panel: HTMLDivElement
    private wordsPool: string[] = ['Boom','Zap','Wobble','Fizz','Bop','Bang','Glitch','Spark','Pop','Zing','Wham','Funk','Twist','Zoom','Crack']

    constructor() {
        super()
        this.container = document.createElement('div')
        this.container.className = 'wubble-container'
        this.appendChild(this.container)

        this.panel = document.createElement('div')
        this.panel.className = 'glass-panel'
        this.panel.textContent = 'Press any key!'
        this.container.appendChild(this.panel)

        document.addEventListener('keydown', e => this.handleKey(e))
    }

    private handleKey(e: KeyboardEvent) {
        const wordText = this.wordsPool[Math.floor(Math.random() * this.wordsPool.length)]
        const word = document.createElement('div')
        word.className = 'word'
        word.textContent = wordText
        document.body.appendChild(word) // append to body for absolute/fixed positioning

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
    }
}

customElements.define('wubble-app', WubbleApp)
