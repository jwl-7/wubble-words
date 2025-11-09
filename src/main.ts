import './styles.sass'
import './loader'
import './app'

function init() {
    const root = document.getElementById('root')
    if (!root) throw new Error('Root element not found')

    // Create loader
    const loader = document.createElement('pacman-loader')
    root.appendChild(loader)

    // Use requestAnimationFrame to ensure DOM is updated before removing loader
    requestAnimationFrame(() => {
        setTimeout(() => {
            // Safely remove loader
            if (root.contains(loader)) {
                root.removeChild(loader)
            }

            // Mount the app
            const app = document.createElement('wubble-app')
            root.appendChild(app)
        }, 2000)
    })
}

// Wait for DOMContentLoaded before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
} else {
    init()
}
