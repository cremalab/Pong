import * as React from 'react';
import styled from 'styled-components';
import director from '../director';
import { TimelineLite, Power2 } from 'gsap';
import autoBind from 'auto-bind';
import { spacing } from '../constants';

const PaddleDiv = styled.div`
  position: absolute;
  height: ${spacing.paddleHeight}px;
  width: ${spacing.paddleWidth}px;
  left: ${(p: { left: number, top: number }) => p.left}px;
  top: ${p => p.top}px;
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

  constructor(props: Props) {
    super(props);
    autoBind(this);

    director.registerMotions(this, props.actorName,
      {
        enter: this.enter,
        exit: this.exit,
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
  }

  exit(dur: number, tl: TimelineLite) {
    const now = tl.time();
    tl.to(this.container, dur, {
      opacity: 0,
      ease: Power2.easeIn
    }, now);
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
