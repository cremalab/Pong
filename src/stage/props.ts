import Paddle from '../actors/Paddle';
import { spacing } from '../constants';
import Ball from '../actors/Ball';

export const actorComponentAndProps = {
  'Paddle1': {
    component: Paddle,
    props: {
      left: spacing.paddleWidth,
      top: 500,
    }
  },
  'Paddle2': {
    component: Paddle,
    props: {
      left: spacing.fullWidth - 2 * spacing.paddleWidth,
      top: 500,
    }
  },
  'Ball': {
    component: Ball,
    props: {
      left: (spacing.fullWidth + spacing.ballWidth) / 2,
      top: 500,
    }
  },
};