import Element from './Elment.js';
import Column from './Column.js';
import Hover from './Hover.js';

const TagName = {
  UL: 'UL',
  LI: 'LI',
};

const MouseButton = {
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2,
};

const datas = {
  key: '1',
  columns: [
    {
      key: 1,
      title: 'Todo',
      notes: [
        {
          key: 1,
          title: '첫번째 할일',
          name: 'crong',
        },
        {
          key: 2,
          title: '두번째 할일',
          name: 'pobi',
        },
      ],
    },
    {
      key: 2,
      title: 'Doing',
      notes: [
        {
          key: 3,
          title: '세번째 할일',
          name: 'woowa',
        },
        {
          key: 4,
          title: '네번째 할일',
          name: 'boost',
        },
      ],
    },
    {
      key: 3,
      title: 'Done',
      notes: [
        {
          key: 5,
          title: '다섯번째 할일',
          name: 'superman',
        },
      ],
    },
  ],
};

export default class Page extends Element {
  constructor() {
    super();
    this.li = null;
    this.previewNote = null;
    this.hover = new Hover();

    this.columns = [];
    datas.columns.map((data) => {
      this.columns.push(new Column(data).render());
    });

    this.setElement();
  }

  getHeader() {
    const header = document.createElement('header');
    header.className = 'header';
    header.innerText = '여기에는 로고가 위치합니다.';

    return header;
  }

  setColumns(wrapper) {
    this.columns.map((column) => {
      wrapper.appendChild(column);
    });
  }

  setElement() {
    const container = document.createElement('div');
    container.className = 'container';

    const header = this.getHeader();
    const content = document.createElement('div');
    content.className = 'kanban';
    this.setColumns(content);

    container.appendChild(header);
    container.appendChild(content);

    this.element = container;
  }

  findNearColumn(event, nodes, optionCheckTop = true) {
    // 컬럼의 Y축보다 포인터가 위에 있다면, 컬럼을 반환하지 않는 옵션
    if (optionCheckTop && nodes[0].offsetTop > event.y) {
      return null;
    }

    let nearValue = null;
    return nodes.reduce((acc, dom) => {
      let data = acc;

      const middleX = dom.offsetLeft + dom.offsetWidth / 2;
      const newNearValue = Math.abs(event.x - middleX);

      if (nearValue === null || nearValue >= newNearValue) {
        nearValue = newNearValue;
        data = dom;
      }

      return data;
    }, null);
  }

  findNearNote(event, nodes) {
    return Array.from(nodes).reduce(
      (acc, dom) => {
        if (dom.classList.contains('hover')) {
          return;
        }

        const data = acc;
        const middleY = dom.offsetTop + dom.offsetHeight / 2;
        const nearValue = Math.abs(event.y - middleY);

        if (data.nearValue === null || data.nearValue >= nearValue) {
          data.nearValue = nearValue;
          data.dom = dom;
          data.isAfter = event.y > middleY;
        }

        return data;
      },
      { nearValue: null, dom: null, isAfter: null },
    );
  }

  endDrag() {
    this.hover.clear();
    this.li.classList.remove('drag');
    this.li = null;
  }

  moveWithPointer(event) {
    const targetNote = this.li;
    const previousColumn = targetNote.closest('ul');

    const currentColumn = this.findNearColumn(event, this.columns, true);

    if (!currentColumn) {
      return;
    }

    const nearNote = this.findNearNote(event, currentColumn.childNodes);
    if (nearNote.dom === null) {
      // 컬럼에 노트가 없을 땐, 컬럼에 추가함.
      currentColumn.appendChild(targetNote);
    } else {
      if (nearNote.isAfter) {
        nearNote.dom.after(targetNote);
      } else {
        nearNote.dom.before(targetNote);
      }
    }
  }

  _mousedown(e) {
    if (!e.button === MouseButton.LEFT) {
      return;
    }

    const target = e.target;

    if (this.li === null && target.tagName === TagName.LI) {
      this.li = target;
      this.hover.copy(target, e.x, e.y);
      target.classList.add('drag');
    }
  }

  _mousemove(e) {
    if (this.li === null) {
      return;
    }

    this.hover.tracking(e.x, e.y);
    this.moveWithPointer(e);
  }

  _mouseup(e) {
    if (this.li === null) {
      return;
    }

    this.moveWithPointer(e);
    this.endDrag();
  }

  _mouseleave(e) {
    if (this.li !== null) {
      this.endDrag();
    }
  }

  setEventListener() {
    this.element.addEventListener('mousedown', (e) => this._mousedown(e));
    this.element.addEventListener('mousemove', (e) => this._mousemove(e));
    this.element.addEventListener('mouseup', (e) => this._mouseup(e));
    this.element.addEventListener('mouseleave', (e) => this._mouseleave(e));
  }
}
