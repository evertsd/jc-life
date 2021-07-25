import React from 'react';
import * as heuristic from './heuristics/growth';
import { buildInitialState, process } from './util';
import { GAME_BITS, MS_PER_ITERATION } from '../constants';
import { getMaxPosition } from '../util';

/*
interface GameState {
    cursorMove: CursorMove; // number, string?
    cursor: Ornament[];
    columnHeight: number[];
}
*/

const initialContextValue = (() => ({
  height: getMaxPosition(GAME_BITS),
  width: getMaxPosition(GAME_BITS),
  updates: { clear: [], draw: [] }
}))();

const GameContext = React.createContext(initialContextValue);

class GameStateHandler extends React.Component {
     constructor(props) {
         super(props);

         const opts = {
           bits: GAME_BITS,
           sampleSize: 128,
           executionIterations: 32
         };

         this.gameLoop = undefined;
         this.state = { ...buildInitialState(heuristic, opts) };
     }

     update() {
       try {
         const { pieces, ...updates } = process(this.state.pieces, this.state.opts);

         if (Object.keys(pieces).length === 0 || (
           updates.clear.length === 0 &&
           updates.draw.length === 0
        ))
          clearInterval(this.gameLoop);

         this.setState({ pieces, updates });
       } catch (e) {
         console.error(e);
         console.log('Stopping execution');
         clearInterval(this.gameLoop);
       }
     }

     componentDidMount() {
        this.gameLoop = setInterval(this.update.bind(this), MS_PER_ITERATION);
     }

     componentWillUnmount() {
       console.info('componentWillUnmount');
       clearInterval(this.gameLoop);
     }

     render = () => (
         <GameContext.Provider value={{ ...initialContextValue, updates: this.state.updates }}>
             {this.props.children}
         </GameContext.Provider>
     );
}

export const withGameUpdates = WrappedComponent => {
    return props => (
        <GameContext.Consumer>
            {value => <WrappedComponent {...props} {...value} />}
        </GameContext.Consumer>
    );
};

export default GameStateHandler;
