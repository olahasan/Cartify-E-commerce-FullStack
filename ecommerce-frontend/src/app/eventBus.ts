type Listener = () => void;

class EventBus {
  private logoutListeners: Listener[] = [];

  onLogout(listener: Listener) {
    this.logoutListeners.push(listener);
  }

  triggerLogout() {
    this.logoutListeners.forEach((listener) => listener());
  }
}

export const eventBus = new EventBus();
