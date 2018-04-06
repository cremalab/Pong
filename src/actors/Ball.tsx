import * as React from 'react';
import styled from 'styled-components';
import director from '../director';
import { TimelineLite, Power2, TweenLite, Linear } from 'gsap';
import autoBind from 'auto-bind';
import { spacing, physics } from '../constants';

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
        bounceY: this.bounceY,
        bounceX: this.bounceX
      }
    );
  }

  enter(dur: number, tl: TimelineLite) {
    console.log('entering');
    const now = tl.time();
    tl.from(this.container, dur, {
      opacity: 0,
      ease: Power2.easeOut
    }, now);
    setInterval(this.move, 50);
  }

  move() {
    TweenLite.to(this.motion, 0.05, {
      xPos: `+=${this.motion.xVelocity}`,
      yPos: `+=${this.motion.yVelocity}`,
      ease: Linear.easeNone
    });
    TweenLite.to(this.container, 0.05, {
      x: `+=${this.motion.xVelocity}`,
      y: `+=${this.motion.yVelocity}`,
      ease: Linear.easeNone
    });
  }

  exit(dur: number, tl: TimelineLite) {
    const now = tl.time();
    tl.to(this.container, dur, {
      opacity: 0,
      ease: Power2.easeIn
    }, now);
  }

  bounceY(dur: number, tl: TimelineLite) {
    this.motion.yVelocity = this.motion.yVelocity * -1;
  }

  bounceX(dur: number, tl: TimelineLite, payload: any) {
    const { velocityDelta } = payload;
    this.motion.xVelocity = this.motion.xVelocity * -1;
    this.motion.yVelocity = this.motion.yVelocity + velocityDelta;
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
