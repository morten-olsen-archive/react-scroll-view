class WindowApi {
  getScrollContainer() {
    return global;
  }
  addEventListener(name, fn) {
    global.window.addEventListener(name, fn);
  }

  removeEventListener(name, fn) {
    global.window.removeEventListener(name, fn);
  }

  scrollTo(x, y) {
    global.window.scrollTop = y;
    global.window.scrollLeft = x;
  }
}

export default new WindowApi();
