export default class Hover {
  constructor() {
    this.layer = null;
  }

  clear() {
    if (this.layer) {
      this.layer.parentNode.removeChild(this.layer);
    }

    this.layer = null;
  }

  hidden(bool) {
    this.layer.style.hidden = `${bool}`;
  }

  copy(dom, x, y) {
    const layer = dom.cloneNode(true);
    layer.classList.add('hover');

    dom.appendChild(layer);

    this.layer = layer;
    this.tracking(x, y);
  }

  tracking(x, y) {
    this.layer.style.left = x - this.layer.offsetWidth / 2 + 'px';
    this.layer.style.top = y - this.layer.offsetHeight / 2 + 'px';
  }
}
