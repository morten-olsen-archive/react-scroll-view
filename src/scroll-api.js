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

  setDomElement(element) {
    this.element = element;
    Object.keys(this.listeners).forEach((name) => {
      if (this.domEvents.includes(name)) {
        this.element.addEventListener(name, this.handleDomEvent);
      }
    });
  }

  getEvents(name) {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
      if (this.element && this.domEvents.includes(name)) {
        this.element.addEventListener(name, this.handleDomEvent);
      }
    }
    return this.listeners[name];
  }

  disconnectDom() {
    if (this.element) {
      Object.keys(this.listeners).forEach((name) => {
        if (this.domEvents.includes(name)) {
          this.element.removeEventListener(name, this.handleDomEvent);
        }
      });
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
    this.getEvents(name).remove(fn);
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
    return publicApi.reduce((output, key) => {
      output[key] = this[key];
      return output;
    }, baseApi);
  }
}

export default ScrollApi;
