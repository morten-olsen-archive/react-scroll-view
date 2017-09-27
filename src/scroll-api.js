const defaultDomEvents = ['scroll', 'touchstart', 'touchmove', 'touchend'];
const publicApi = [
  'addEventListener',
  'removeEventListener',
  'triggerEvent',
  'getScrollContainer',
  'scrollToTop',
  'scrollToBottom',
  'getDistanceToBottom',
  'getDistanceToTop',
  'enableScroll',
  'disableScroll',
];
const bindedApi = [
  'handleDomEvent',
];

class ScrollApi {
  constructor({
    element,
    domEvents = defaultDomEvents,
  } = {}) {
    this.listeners = {};
    this.domEvents = domEvents;
    if (element) {
      this.setDomElement(element);
    }

    [...publicApi, ...bindedApi].forEach((key) => {
      this[key] = this[key].bind(this);
    });
  }

  setDomElement(element, domEventDispatcher) {
    this.element = element;
    this.domEventDispatcher = domEventDispatcher || element;
    Object.keys(this.listeners).forEach((name) => {
      if (this.domEvents.includes(name)) {
        this.domEventDispatcher.addEventListener(name, this.handleDomEvent);
      }
    });
  }

  getEvents(name) {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
      if (this.element && this.domEvents.includes(name)) {
        this.domEventDispatcher.addEventListener(name, this.handleDomEvent);
      }
    }
    return this.listeners[name];
  }

  disconnectDom() {
    if (this.element) {
      Object.keys(this.listeners).forEach((name) => {
        if (this.domEvents.includes(name)) {
          this.domEventDispatcher.removeEventListener(name, this.handleDomEvent);
        }
      });
    }
  }

  disableScroll() {
    if (this.element && !this.disableScrollData) {
      this.disableScrollData = {
        overflow: this.element.style.overflow,
      };
      this.element.style.overflow = 'hidden';
    }
  }

  enableScroll() {
    if (this.element && this.disableScrollData) {
      this.element.style.overflow = this.disableScrollData.overflow;
      this.disableScrollData = undefined;
    }
  }

  scrollToTop() {
    const node = this.getScrollContainer();
    node.scrollTop = 0;
    this.triggerEvent('scroll', {});
  }

  scrollToBottom() {
    const node = this.getScrollContainer();
    node.scrollTop = node.scrollHeight;
    this.triggerEvent('scroll', {});
  }

  scrollToY(y) {
    const node = this.getScrollContainer();
    node.scrollTop = y;
    this.triggerEvent('scroll', {});
  }

  addEventListener(name, fn) {
    this.getEvents(name).push(fn);
  }

  removeEventListener(name, fn) {
    if (this.listeners[name]) {
      this.listeners[name] =
        this.listeners[name].filter(listener => listener !== fn);
    }
  }

  triggerEvent(name, evt) {
    this.getEvents(name).forEach(fn => fn(evt));
  }

  handleDomEvent(evt) {
    this.triggerEvent(evt.type, evt);
  }

  getScrollContainer() {
    return this.element;
  }

  getDistanceToBottom(outerHeight) {
    const node = this.getScrollContainer();
    const currentLocation = node.scrollTop + (outerHeight || node.offsetHeight);
    const actualEnd = node.scrollHeight;
    return actualEnd - currentLocation;
  }

  getDistanceToTop() {
    const node = this.getScrollContainer();
    return node.scrollTop;
  }

  getPublicApi(baseApi = {}) {
    const own = publicApi.reduce((output, key) => {
      output[key] = this[key];
      return output;
    }, {});
    return {
      ...own,
      ...baseApi,
    };
  }
}

export default ScrollApi;
