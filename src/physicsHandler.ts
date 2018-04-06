const autoBind = require('auto-bind');

class PhysicsHandler {
  public positions: any;
  constructor() {
    autoBind(this);
    this.positions = {
      Paddle1: {
        y: 0,
        vel: 0,
      },
      Paddle2: {
        y: 0,
        vel: 0,
      },
      Ball: {
        y: 0,
        x: 0,
      },
    };
  }

  updatePaddle(name: string, y: number, vel: number) {
    const p = this.positions[name];
    if (!p) return;
    p.y = y;
    p.vel = vel;
  }

  updateBall(x: number, y: number) {
    this.positions.ball.x = x;
    this.positions.ball.y = y;
  }
}

export default new PhysicsHandler();