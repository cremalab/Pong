const autoBind = require('auto-bind');
import { spacing } from './constants';
import director from './director';
import { addTeam1Score, addTeam2Score } from './scoring';

var lastBounce = Date.now();

class PhysicsHandler {
  public positions: any;
  constructor() {
    autoBind(this);
    this.positions = {
      Paddle1: {
        y: 0,
        vel: 0,
        x: spacing.paddleWidth
      },
      Paddle2: {
        y: 0,
        vel: 0,
        x: spacing.fullWidth - 2 * spacing.paddleWidth
      },
      Ball: {
        y: 0,
        x: 0,
      },
    };

    setInterval(() => {
      console.log('Paddle2', this.positions.Paddle2);
      console.log('Ball', this.positions.Ball);
    }, 1000);
  }

  updatePaddle(name: string, y: number, vel: number) {
    const p = this.positions[name];
    if (!p) return;
    if (name === 'Paddle1') {
      setTimeout(() => {
        director.dispatch({
          type: 'motion', payload: { actor: 'Paddle1', motion: 'moveTo', duration: 1, y: this.positions.Ball.y - 700 }
        });
        this.positions.Paddle1.y = this.positions.Ball.y - 700;
      }, 1000);
    }
    p.y = y;
    p.vel = vel;
  }

  updateBall(x: number, y: number) {
    this.positions.Ball.x = x;
    this.positions.Ball.y = y;
    if (y <= 580) {
      director.dispatch({
        type: 'motion', payload: { actor: 'Ball', motion: 'yPositive', duration: 1 }
      });
    } else if (y >= spacing.fullHeight + 370) {
      director.dispatch({
        type: 'motion', payload: { actor: 'Ball', motion: 'yNegative', duration: 1 }
      });
    }
    if (x <= 700) {
      addTeam1Score();
      director.dispatch({
        type: 'motion', payload: { actor: 'Ball', motion: 'reset', duration: 1, velocityDelta: 0 }
      });
      return;
    } else if (x >= spacing.fullWidth + 700) {
      addTeam2Score();
      director.dispatch({
        type: 'motion', payload: { actor: 'Ball', motion: 'reset', duration: 1, velocityDelta: 0 }
      });
      return;
    }
    this.checkPaddleBounce(x, y, this.positions.Paddle1);
    this.checkPaddleBounce(x, y, this.positions.Paddle2);
  }

  checkPaddleBounce(x: number, y: number, paddle: { y: number, vel: number, x: number }) {
    // check if ball is within paddle square
    const shiftX = 720;
    const shiftY = 480;
    const topBound = paddle.y + shiftY;
    const bottomBound = paddle.y + spacing.paddleHeight + shiftY;
    const leftBound = paddle.x + shiftX;
    const rightBound = paddle.x + spacing.paddleWidth + shiftX;
    if (x > leftBound && x < rightBound && y > topBound && y < bottomBound) {
      console.log('BOUNCE');
      const now = Date.now();
      if (now - lastBounce > 300) {
        lastBounce = now;
        director.dispatch({
          type: 'motion', payload: { actor: 'Ball', motion: 'bounce', duration: 1, velocityDelta: paddle.vel }
        });
      }
    }
  }
}

export default new PhysicsHandler();