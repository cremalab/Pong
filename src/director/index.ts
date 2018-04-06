const autoBind = require('auto-bind');
import { TimelineLite } from 'gsap';
import { Action } from '../typings';

class Director {
  public subscriptions: ((action: Action) => void)[];
  public tl: TimelineLite;
  public loop: boolean;

  onComplete: () => void;
  onStart: () => void;

  constructor() {
    autoBind(this);
    this.subscriptions = [];
    this.tl = new TimelineLite();
    this.tl.timeScale(1);
    this.loop = true;
  }

  createTimeline() {
    const tl = new TimelineLite();
    this.tl = tl;
  }

  subscribe(method: (action: Action) => void) {
    this.subscriptions.push(method);
  }

  dispatch(action: Action) {
    this.subscriptions.forEach(handler => handler(action));
  }

  // create an onAction function for the actor and subscribe it to the Director
  registerMotions(actor: any, actorName: string | string[], handlers: any) {  // replace these 'anys'
    const director = this;
    // register actor's entry motion
    actor.componentDidMount = (function () {
      if (handlers.enter) {
        handlers.enter(actor.props.entryDuration || 0, director.tl);
      }
    }).bind(actor);

    // register actor's timeline cleanup
    actor.componentWillUnmount = (function () {
      if (actor.tl) {
        actor.tl.clear();
        actor.tl.eventCallback('onComplete', () => 0);
        delete actor.tl;
      }
    }).bind(actor);

    // register all the other action handlers
    const actionHandler = (function (action: Action) {
      const actionActor = action.payload ? action.payload.actor : '';

      if (actionActor === actorName) {
        if (action.type === 'exit' && handlers.exit) {
          return handlers.exit(action.payload.duration, director.tl, action.payload);
        }
        if (action.type === 'motion' && action.payload.motion in handlers) {
          const handler = handlers[action.payload.motion];
          handler(action.payload.duration, director.tl, action.payload);

        }
      }
    }).bind(actor);

    this.subscribe(actionHandler);
  }

}

export default new Director();