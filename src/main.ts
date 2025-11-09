import './styles.sass'
import './loader'
import './app'

function init() {
    const root = document.getElementById('root')
    if (!root) throw new Error('Root element not found')

    const loader = document.createElement('pacman-loader')
    root.appendChild(loader)

    requestAnimationFrame(() => {
        setTimeout(() => {
            if (root.contains(loader)) {
                root.removeChild(loader)
            }

            const app = document.createElement('wubble-app')
            root.appendChild(app)
        }, 2000)
    })
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
} else {
    init()
}
