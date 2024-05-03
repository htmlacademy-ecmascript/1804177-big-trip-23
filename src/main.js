import MainPresenter from './presenter/main-presenter.js';
import { render, RenderPosition } from './render.js';
import InfoView from './view/infoView.js';
import FiltersView from './view/filtersView.js';

const tripMainElement = document.querySelector('.trip-main');
const tripControlsElement = tripMainElement.querySelector('.trip-controls');
const tripEventsElement = document.querySelector('.trip-events');

render(new InfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
render(new FiltersView(), tripControlsElement);

const presenter = new MainPresenter({container: tripEventsElement});

presenter.init();
