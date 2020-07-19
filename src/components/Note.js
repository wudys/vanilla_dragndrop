import Element from './Elment.js';

export default class Note extends Element {
  constructor(data) {
    super();

    this.key = data.key;
    this.title = data.title;
    this.name = data.name;

    this.setElement();
  }

  setElement() {
    const note = document.createElement('li');
    note.className = 'note';
    note.dataset.key = this.key;
    note.innerText = `${this.title}`;

    this.element = note;
  }
}
