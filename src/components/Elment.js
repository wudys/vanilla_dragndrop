export default class Element {
  render() {
    if (this.setEventListener) {
      this.setEventListener();
    }

    return this.element;
  }
}
