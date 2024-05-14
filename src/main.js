import MainPresenter from './presenter/main-presenter.js';
import { render, RenderPosition } from './render.js';
import InfoView from './view/info-view.js';
import FiltersView from './view/filters-view.js';
import PointModel from './model/point-model.js';

const tripMainElement = document.querySelector('.trip-main');
const tripControlsElement = tripMainElement.querySelector('.trip-controls');
const tripEventsElement = document.querySelector('.trip-events');

const pointModel = new PointModel();
pointModel.init();

render(new InfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
render(new FiltersView(), tripControlsElement);

const presenter = new MainPresenter({container: tripEventsElement, pointModel});

presenter.init();
