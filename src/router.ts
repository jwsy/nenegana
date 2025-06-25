type Route = '#/home' | '#/practice' | '#/quiz'

type RouteChangeCallback = (route: Route) => void

class Router {
  private callbacks: RouteChangeCallback[] = []

  constructor() {
    window.addEventListener('hashchange', this.handleHashChange.bind(this))
    // Handle initial route
    this.handleHashChange()
  }

  private handleHashChange() {
    const route = this.getCurrentRoute()
    this.callbacks.forEach((callback) => callback(route))
  }

  getCurrentRoute(): Route {
    const hash = window.location.hash as Route
    // Default to home if no hash or invalid hash
    if (hash === '#/home' || hash === '#/practice' || hash === '#/quiz') {
      return hash
    }
    return '#/home'
  }

  navigate(route: Route) {
    window.location.hash = route
  }

  onRouteChange(callback: RouteChangeCallback) {
    this.callbacks.push(callback)
  }
}

export const router = new Router()
export type { Route }