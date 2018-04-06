import * as React from 'react';
import styled from 'styled-components';
import director from '../director';
import { TimelineLite, Power2, TweenLite, Linear } from 'gsap';
import autoBind from 'auto-bind';
import { spacing, physics, engine } from '../constants';
import physicsHandler from '../physicsHandler';

const Div = styled.div`
  position: absolute;
  height: ${spacing.ballWidth}px;
  width: ${spacing.ballWidth}px;
  background-color: #AAAAAA;
  border-radius: 50%;
`;

interface Props {
  actorName: string;
  entryDuration?: number;
  top: number;
  left: number;
}

class Paddle extends React.Component<Props>  {
  container: HTMLElement;
  motion: {
    xVelocity: number;
    yVelocity: number;
    xPos: number;
    yPos: number;
  };
  constructor(props: Props) {
    super(props);
    autoBind(this);

    this.motion = {
      xVelocity: physics.horizontalVelocity,
      yVelocity: physics.defaultVerticalVelocity,
      xPos: this.props.left, yPos: this.props.top
    };
    director.registerMotions(this, props.actorName,
      {
        enter: this.enter,
        exit: this.exit,
        yPositive: this.yPositive,
        yNegative: this.yNegative,
        xPositive: this.xPositive,
        xNegative: this.xNegative,
        bounce: this.bounce,
        reset: this.reset,
      }
    );
  }

  enter(dur: number, tl: TimelineLite) {
    const now = tl.time();
    tl.from(this.container, dur, {
      opacity: 0,
      ease: Power2.easeOut
    }, now);
    setInterval(this.move.bind(this), engine.ballUpdateMs);
  }

  move() {
    TweenLite.set(this.motion, {
      xPos: `+=${this.motion.xVelocity}`,
      yPos: `+=${this.motion.yVelocity}`,
      ease: Linear.easeNone
    });
    TweenLite.set(this.container, {
      x: `+=${this.motion.xVelocity}`,
      y: `+=${this.motion.yVelocity}`,
      ease: Linear.easeNone
    });
    setTimeout(() => {

      physicsHandler.updateBall(this.motion.xPos, this.motion.yPos);
    }, engine.ballUpdateMs / 1000);
  }

  exit(dur: number, tl: TimelineLite) {
    const now = tl.time();
    tl.to(this.container, dur, {
      opacity: 0,
      ease: Power2.easeIn
    }, now);
  }

  yPositive(dur: number, tl: TimelineLite) {
    if (this.motion.yVelocity <= 0)
      this.motion.yVelocity = Math.abs(this.motion.yVelocity);
  }

  yNegative(dur: number, tl: TimelineLite) {
    this.motion.yVelocity = Math.abs(this.motion.yVelocity) * -1;
  }

  xPositive(dur: number, tl: TimelineLite, payload: any) {
    const { velocityDelta } = payload;
    this.motion.xVelocity = Math.abs(this.motion.xVelocity);
    this.motion.yVelocity = this.motion.yVelocity + velocityDelta;
  }

  xNegative(dur: number, tl: TimelineLite, payload: any) {
    const { velocityDelta } = payload;
    this.motion.xVelocity = Math.abs(this.motion.xVelocity) * -1;
    this.motion.yVelocity = this.motion.yVelocity + velocityDelta;
  }

  bounce(dur: number, tl: TimelineLite, payload: any) {
    const { velocityDelta } = payload;
    this.motion.xVelocity = this.motion.xVelocity * -1;
    this.motion.yVelocity = this.motion.yVelocity + velocityDelta;
  }

  reset(dur: number, tl: TimelineLite, payload: any) {
    this.motion = {
      xVelocity: physics.horizontalVelocity,
      yVelocity: physics.defaultVerticalVelocity,
      xPos: this.props.left, yPos: this.props.top
    };
    tl.set(this.container, {
      x: `${this.motion.xVelocity}`,
      y: `${this.motion.yVelocity}`,
    }, tl.time());
  }
  render() {
    return (
      <Div
        innerRef={ref => { if (ref) this.container = ref; }}
      />
    );
  }
}

export default Paddle;
