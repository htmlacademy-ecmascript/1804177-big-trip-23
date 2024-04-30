import MainPresenter from './presenter/main-presenter.js';
import { render, RenderPosition } from './render.js';
import Info from './view/info.js';
import Filters from './view/filters.js';

const pageHeaderElement = document.querySelector('.page-header');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const tripControlsElement = tripMainElement.querySelector('.trip-controls');
const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

render(new Info(), tripMainElement, RenderPosition.AFTERBEGIN);
render(new Filters(), tripControlsElement);

const Presenter = new MainPresenter({container: tripEventsElement});

Presenter.init();
