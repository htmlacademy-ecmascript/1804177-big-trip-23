import {render, RenderPosition} from '../render.js';
import SortingsView from '../view/sortingsView.js';
import EditFormView from '../view/edit-formView.js';
import WaypointView from '../view/waypointView.js';
import EventListView from '../view/event-listView.js';

const AMOUNT_POINTS = 3;

export default class MainPresenter {
  eventListComponent = new EventListView();

  constructor({container}) {
    this.container = container;
  }

  init() {
    render(new SortingsView(), this.container);
    render(this.eventListComponent, this.container);
    render(new EditFormView(), this.eventListComponent.getElement(), RenderPosition.AFTERBEGIN);
    for (let i = 0; i < AMOUNT_POINTS; i++) {
      render(new WaypointView(), this.eventListComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }
}
