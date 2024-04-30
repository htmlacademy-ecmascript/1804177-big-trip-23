import {render, RenderPosition} from '../render.js';
import Sortings from '../view/sortings.js';
import EditForm from '../view/edit-form.js';
import Waypoints from '../view/waypoints.js';
import EventList from '../view/event-list.js';

const AMOUNT_POINTS = 3;

export default class MainPresenter {
  eventListComponent = new EventList();

  constructor({container}) {
    this.container = container;
  }

  init() {
    render(new Sortings(), this.container);
    render(this.eventListComponent, this.container);
    render(new EditForm(), this.eventListComponent.getElement(), RenderPosition.AFTERBEGIN);
    for (let i = 0; i < AMOUNT_POINTS; i++) {
      render(new Waypoints(), this.eventListComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }
}
