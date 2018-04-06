import * as React from 'react';
import { actorComponentAndProps } from './props';
import director from '../director';
const autoBind = require('auto-bind');
import styled from 'styled-components';
import { Action } from '../typings';
import { spacing } from '../constants';
// 'Stage' component - adds and removes Actors to the stage.

const Outer = styled.div`
  width: ${spacing.fullWidth}px;
  height: ${spacing.fullHeight}px;
  background: #222333;
  position: relative;
`;

interface State {
  actors: string[];
  lastDuration?: Action;
}

class Stage extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    autoBind(this);

    this.state = {
      actors: [],
    };
    // subscribe to actions from the director
    director.subscribe(this.onChange);
  }

  onChange(action: { type: string, payload?: any }) {
    const actors = this.state.actors;
    if (action.type === 'enter' && !actors.includes(action.payload.actor)) {
      const added = this.state.actors.concat(action.payload.actor as string);
      this.setState({ actors: added, lastDuration: action.payload.duration });
    } else if (action.type === 'remove') {
      const removed = this.state.actors.filter(actor => actor !== action.payload.actor);
      this.setState({ actors: removed, lastDuration: action.payload.duration });
    }

    if (action.type === 'clearStage')
      this.setState({ actors: [] });
  }

  render() {
    const { actors } = this.state;
    return (
      <Outer id="wallOuter">
        {actors.filter(name => actorComponentAndProps[name] !== undefined)
          .map((name) => {
            const Actor = actorComponentAndProps[name];
            return <Actor.component
              entryDuration={this.state.lastDuration}
              key={name}
              actorName={name}
              {...Actor.props}
            />;
          })
        }
      </Outer>
    );
  }
}

export default Stage;
