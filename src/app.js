import '@babel/polyfill';

import style from 'assets/stylesheets/style';

import Page from 'components/Page';

const app = document.querySelector('#app');

const page = new Page().render();
app.appendChild(page);
