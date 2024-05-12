import { render, RenderPosition } from '../render.js';
import SortingsView from '../view/sortingsView.js';
import EditFormView from '../view/edit-formView.js';
import WaypointView from '../view/waypointView.js';
import EventListView from '../view/event-listView.js';

export default class MainPresenter {
  eventListComponent = new EventListView();

  constructor({container, pointModel}) {
    this.container = container;
    this.pointModel = pointModel;
  }

  init() {
    const points = this.pointModel.getPoints();
    const destinations = this.pointModel.getDestinations();
    const offers = this.pointModel.getOffers();
    render(new SortingsView(), this.container);
    render(this.eventListComponent, this.container);
    points.forEach((point) => {
      render(new EditFormView(point, destinations, offers), this.eventListComponent.getElement(), RenderPosition.AFTERBEGIN);
      render(new WaypointView(point, destinations, offers), this.eventListComponent.getElement(), RenderPosition.BEFOREEND);
    });
  }
}
