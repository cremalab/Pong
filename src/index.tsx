import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Stage from './stage';
import director from './director';
import registerServiceWorker from './registerServiceWorker';
import 'gsap/ModifiersPlugin';
import './global.css';
import Nes from 'nes';

// import { TweenLite } from 'gsap';

// TweenLite.ticker.fps(40);

ReactDOM.render(
  <Stage />,
  document.getElementById('root') as HTMLElement
);

// subscribe a logging function
// director.subscribe((action) => {
//   console.log(action, director.tl.time());
// });

// initialize director
director.createTimeline();

director.dispatch({
  type: 'enter', payload: { actor: 'Paddle1', duration: 1 }
});
director.dispatch({
  type: 'enter', payload: { actor: 'Paddle2', duration: 1 }
});
setTimeout(() => {

  director.dispatch({
    type: 'enter', payload: { actor: 'Ball', duration: 1 }
  });
}, 500);

// setTimeout(() => {
//   director.dispatch({
//     type: 'motion', payload: { actor: 'Ball', motion: 'bounceX', duration: 1, velocityDelta: 50 }
//   });
// }, 1000);

// setTimeout(() => {
//   director.dispatch({
//     type: 'motion', payload: { actor: 'Paddle1', motion: 'setVerticalVelocity', duration: 1, velocity: 30 }
//   });
// }, 2000);
// setTimeout(() => {
//   director.dispatch({
//     type: 'motion', payload: { actor: 'Paddle2', motion: 'setVerticalVelocity', duration: 1, velocity: 10 }
//   });
// }, 1000);

//   director.dispatch({
//     type: 'motion', payload: { actor: 'Paddle2', motion: 'setVerticalVelocity', duration: 1, velocity: 0 }
//   });

export const setP2Velocity = (v: number) => {
  director.dispatch({
    type: 'motion', payload: { actor: 'Paddle2', motion: 'setVerticalVelocity', duration: 1, velocity: v * 50 }
  });
};

registerServiceWorker();

const sizeToHeight = () => {
  var newHeight = window.innerHeight;
  const root = document.getElementById('root') as HTMLElement;
  root.style.transform = `scale(${newHeight / 1000})`;
  root.scrollTop = 0;
};

// scale the whole dang thing to the height
window.onresize = sizeToHeight;

sizeToHeight();

registerServiceWorker();

async function doSocket() {
  const client = new Nes.Client('ws://df8e47a1.ngrok.io');

  await client.connect();
  const handler = (update: any, flags: any) => {
    // console.log(update);
    setP2Velocity(update);
  };

  client.subscribe('/action', handler);
}

doSocket();