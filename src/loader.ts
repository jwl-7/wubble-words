class PacmanLoader extends HTMLElement {
    constructor() {
        super()
        const wrapper = document.createElement('div')
        wrapper.className = 'pacman-loader'
        for (let i = 0; i < 5; i++) {
            wrapper.appendChild(document.createElement('div'))
        }
        this.appendChild(wrapper)
    }
}

customElements.define('pacman-loader', PacmanLoader)
