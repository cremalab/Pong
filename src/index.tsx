import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Stage from './stage';
import director from './director';
import registerServiceWorker from './registerServiceWorker';
import 'gsap/ModifiersPlugin';
import './global.css';
// import { TweenLite } from 'gsap';

// TweenLite.ticker.fps(40);

ReactDOM.render(
  <Stage />,
  document.getElementById('root') as HTMLElement
);

// subscribe a logging function
director.subscribe((action) => {
  console.log(action, director.tl.time());
});

// initialize director
director.createTimeline();

director.dispatch({
  type: 'enter', payload: { actor: 'Paddle1', duration: 1 }
});
director.dispatch({
  type: 'enter', payload: { actor: 'Paddle2', duration: 1 }
});
director.dispatch({
  type: 'enter', payload: { actor: 'Ball', duration: 1 }
});
setTimeout(() => {
  director.dispatch({
    type: 'motion', payload: { actor: 'Ball', motion: 'bounceX', duration: 1, velocityDelta: 50 }
  });
}, 1000);

setTimeout(() => {
  director.dispatch({
    type: 'motion', payload: { actor: 'Ball', motion: 'bounceY', duration: 1, velocityDelta: 0 }
  });
}, 1500);
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