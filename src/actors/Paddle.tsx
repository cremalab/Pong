import * as React from 'react';
import styled from 'styled-components';
import director from '../director';
import { TimelineLite, Power2, TweenLite, Linear } from 'gsap';
import autoBind from 'auto-bind';
import { spacing, engine } from '../constants';
import physicsHandler from '../physicsHandler';

const PaddleDiv = styled.div`
  position: absolute;
  height: ${spacing.paddleHeight}px;
  width: ${spacing.paddleWidth}px;
  left: ${(p: { left: number, top: number }) => p.left}px;
  top: $0;
  background-color: #AAAAAA;
`;

interface Props {
  actorName: string;
  entryDuration?: number;
  top: number;
  left: number;
}

class Paddle extends React.Component<Props>  {
  container: Element;
  motion: {
    yVelocity: number;
    yPos: number;
  };
  constructor(props: Props) {
    super(props);
    autoBind(this);

    director.registerMotions(this, props.actorName,
      {
        enter: this.enter,
        exit: this.exit,
        moveTo: this.moveTo,
        setVerticalVelocity: this.setVerticalVelocity,
      }
    );
    this.motion = {
      yVelocity: 0,
      yPos: this.props.top
    };
  }

  enter(dur: number, tl: TimelineLite) {
    const now = tl.time();
    tl.from(this.container, dur, {
      opacity: 0,
      ease: Power2.easeOut
    }, now);
    tl.set(this.container, {
      y: 300,
    }, now)
      .set(this.motion, {
        yPos: 300,
      }, now);
    setInterval(this.move, engine.paddleUpdateMs);
  }

  exit(dur: number, tl: TimelineLite) {
    const now = tl.time();
    tl.to(this.container, dur, {
      opacity: 0,
      ease: Power2.easeIn
    }, now);
  }

  moveTo(dur: number, tl: TimelineLite, payload: any) {
    TweenLite.to(this.motion, engine.paddleUpdateMs / 1000, {
      yPos: payload.y,
      modifiers: {
        yPos: (val: number) => {
          const max = spacing.fullWidth - spacing.paddleHeight;
          if (val > max) return max;
          if (val <= 0) return 0;
          return val;
        }
      },
      ease: Linear.easeNone
    });
    TweenLite.to(this.container, engine.paddleUpdateMs / 1000, {
      y: payload.y,
      modifiers: {
        y: (val: number) => {
          const max = spacing.fullHeight - spacing.paddleHeight;
          if (val > max) return max;
          if (val <= 0) return 0;
          return val;
        }
      },
      ease: Linear.easeNone
    });
  }

  move() {
    TweenLite.to(this.motion, engine.paddleUpdateMs / 1000, {
      yPos: `+=${this.motion.yVelocity}`,
      modifiers: {
        yPos: (val: number) => {
          const max = spacing.fullWidth - spacing.paddleHeight;
          if (val > max) return max;
          if (val <= 0) return 0;
          return val;
        }
      },
      ease: Linear.easeNone
    });
    TweenLite.to(this.container, engine.paddleUpdateMs / 1000, {
      y: `+=${this.motion.yVelocity}`,
      modifiers: {
        y: (val: number) => {
          const max = spacing.fullHeight - spacing.paddleHeight;
          if (val > max) return max;
          if (val <= 0) return 0;
          return val;
        }
      },
      ease: Linear.easeNone
    });
    setTimeout(() => {
      physicsHandler.updatePaddle(this.props.actorName, this.motion.yPos, this.motion.yVelocity);
    }, engine.paddleUpdateMs / 1000);
  }

  setVerticalVelocity(dur: number, tl: TimelineLite, payload: any) {
    this.motion.yVelocity = payload.velocity;
  }

  render() {
    return (
      <PaddleDiv
        innerRef={ref => { if (ref) this.container = ref; }}
        top={this.props.top}
        left={this.props.left}
      />
    );
  }

}

export default Paddle;
