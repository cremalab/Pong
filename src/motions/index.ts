import { TimelineLite, Power2, Ease } from 'gsap';
import { ActorComponent } from '../typings';
// import wobbler from '../motions/wobbler';

export function moveTo(actor: ActorComponent, top: number | string, left: number | string, ease: Ease = Power2.easeInOut) {
  return (function (dur: number, tl: TimelineLite) {
    const now = tl.time();
    tl.to(actor.container, dur, {
      top,
      left,
      ease
    }, now);
  }).bind(actor);
}

export function moveBy(actor: ActorComponent, x: number | string, y: number | string, ease: Ease = Power2.easeInOut) {
  return (function (dur: number, tl: TimelineLite) {
    const now = tl.time();
    tl.to(actor.container, dur, {
      x,
      y,
      ease
    }, now);
  }).bind(actor);
}
