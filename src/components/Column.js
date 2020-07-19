import Element from './Elment.js';
import Note from './Note.js';

export default class Column extends Element {
  constructor(data) {
    super();

    this.key = data.key;
    this.notes = [];

    data.notes.map((note) => {
      this.notes.push({
        key: note.key,
        dom: new Note(note).render(),
      });
    });

    this.setElement();
  }

  insertAt(index, ...newItems) {
    return [
      ...this.notes.slice(0, index),
      ...newItems,
      ...this.notes.slice(index),
    ];
  }

  setElement() {
    const column = document.createElement('ul');
    column.className = 'column';
    column.dataset.key = this.key;

    this.notes.map((data) => {
      column.appendChild(data.dom);
    });

    this.element = column;
  }
}
