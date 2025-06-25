import { router, type Route } from './router'
import { createHomeView } from './views/HomeView'
import { createPracticeView } from './views/PracticeView'
import { createQuizView } from './views/QuizView'

export class App {
  private container: HTMLElement
  private currentView: HTMLElement | null = null

  constructor(container: HTMLElement) {
    this.container = container
    
    // Listen for route changes
    router.onRouteChange(this.handleRouteChange.bind(this))
    
    // Initial render
    this.handleRouteChange(router.getCurrentRoute())
  }

  private handleRouteChange(route: Route) {
    // Remove current view
    if (this.currentView) {
      this.currentView.remove()
    }

    // Create new view based on route
    switch (route) {
      case '#/home':
        this.currentView = createHomeView()
        break
      case '#/practice':
        this.currentView = createPracticeView()
        break
      case '#/quiz':
        this.currentView = createQuizView()
        break
      default:
        this.currentView = createHomeView()
        break
    }

    // Append new view to container
    this.container.appendChild(this.currentView)
  }
}