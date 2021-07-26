import React from 'react';
import * as heuristic from './heuristics/growth';
import { buildInitialState } from './util';
import { GAME_BITS, MS_PER_ITERATION } from '../constants';
import { clearBoard, getMaxPosition, process } from '../../Game/utils';

/*
interface GameState {
    cursorMove: CursorMove; // number, string?
    cursor: Ornament[];
    columnHeight: number[];
}
*/

const GAME_STATUS = {
  STOPPED: 0,
  STARTING: 1,
  RUNNING: 2,
  TEARDOWN: 3
};

const initialContextValue = (() => ({
  height: getMaxPosition(GAME_BITS),
  width: getMaxPosition(GAME_BITS),
  updates: { clear: [], draw: [] }
}))();

const opts = {
  bits: GAME_BITS,
  sampleSize: 128,
  executionIterations: 32
};

const GameContext = React.createContext(initialContextValue);

class GameStateHandler extends React.Component {
     constructor(props) {
         super(props);

         this.gameLoop = undefined;
         this.state = {
           status: GAME_STATUS.STOPPED,
           isRestarting: true,
           isStopping: false
         };
     }

     update() {
       try {
         const { pieces, ...updates } = process(this.state.pieces, this.state.opts);

         if (Object.keys(pieces).length === 0 || (
           updates.clear.length === 0 &&
           updates.draw.length === 0
        ))
          this.stop();

         this.setState({ pieces, updates });
       } catch (e) {
         console.error(e);
         console.log('Stopping execution');
         this.stop();
       }
     }

     start() {
       this.gameLoop = setInterval(this.update.bind(this), MS_PER_ITERATION);
     }

     stop() {
       if (this.gameLoop)
        clearInterval(this.gameLoop);

       this.gameLoop = undefined;
     }

     componentDidMount() {
        this.start();
     }

     componentWillUnmount() {
       this.stop();
     }

     restartGame(previousState) {
       if (this.state.status === GAME_STATUS.TEARDOWN) {
         const { pieces, ...updates } = clearBoard(this.state.pieces);

         this.setState({
           pieces,
           status: GAME_STATUS.STOPPED,
           updates
         });
       }
       else if (this.state.status === GAME_STATUS.STOPPED) {
         this.setState({
           ...buildInitialState(heuristic, opts),
           status: GAME_STATUS.STARTING
         });
       }
       else if (this.state.status === GAME_STATUS.STARTING) {
         this.setState({
           status: GAME_STATUS.RUNNING,
           isRestarting: false
         }, this.start.bind(this));
       }
     }

     stopGame() {
       if (this.state.status === GAME_STATUS.TEARDOWN) {
         const { pieces, ...updates } = clearBoard(this.state.pieces);

         this.setState({
           isStopping: false,
           pieces,
           status: GAME_STATUS.STOPPED,
           updates
         });
       }
     }

     componentDidUpdate() {
       if (this.state.isRestarting)
         this.restartGame();
       else if (this.state.isStopping)
         this.stopGame();
     }

     onRestart() {
       this.stop();
       this.setState({ isRestarting: true, status: GAME_STATUS.TEARDOWN });
     }

     onStop() {
       this.stop();
       this.setState({ isStopping: true, status: GAME_STATUS.TEARDOWN });
     }

     render = () => (
       <React.Fragment>
         <div>
           <button onClick={this.onRestart.bind(this)}>Restart</button>
         </div>
         <GameContext.Provider value={{ ...initialContextValue, updates: this.state.updates }}>
             {this.props.children}
         </GameContext.Provider>
       </React.Fragment>
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
