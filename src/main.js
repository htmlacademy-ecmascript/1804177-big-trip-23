import {render, RenderPosition} from './framework/render.js';
import PointsApiService from './points-api-service.js';

import InfoView from './view/info-view.js';
import NewPointButtonView from './view/new-point-button-view.js';

import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';

import FilterPresenter from './presenter/filter-presenter.js';
import MainPresenter from './presenter/main-presenter.js';

const AUTHORIZATION = 'Basic f5ds4l6y41';
const END_POINT = 'https://23.objects.htmlacademy.pro/big-trip';

const tripMainElement = document.querySelector('.trip-main');
const tripControlsElement = tripMainElement.querySelector('.trip-controls');
const tripEventsElement = document.querySelector('.trip-events');

const filterModel = new FilterModel();
const pointModel = new PointModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

const filterPresenter = new FilterPresenter({
  filterContainer: tripControlsElement,
  filterModel,
  pointModel,
});
render(new InfoView(), tripMainElement, RenderPosition.AFTERBEGIN);

const presenter = new MainPresenter({
  container: tripEventsElement,
  pointModel,
  filterModel,
  onNewPointDestroy: handleNewPointFromClose
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick,
});

function handleNewPointFromClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  presenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

pointModel.init()
  .catch(() => {
    presenter.handleApiError();
    newPointButtonComponent.element.disabled = true;
  })
  .finally(() => render(newPointButtonComponent, tripMainElement, RenderPosition.BEFOREEND));
filterPresenter.init();
presenter.init();
