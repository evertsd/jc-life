import React from 'react';
import { GAME_BITS, MS_PER_ITERATION } from './constants';
import { clearBoard, getMaxPosition, process } from './util';
import { Button } from '../Components';

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
  PAUSED: 3,
  TEARDOWN: 4
};

const initialContextValue = (() => ({
  height: getMaxPosition(GAME_BITS),
  width: getMaxPosition(GAME_BITS),
  updates: { clear: [], draw: [] }
}))();

const GameContext = React.createContext(initialContextValue);

class GameStateHandler extends React.Component {
     constructor(props) {
         super(props);

         this.gameLoop = undefined;
         this.state = {
           isRestarting: true,
           isStopping: false,
           iterations: 0,
           status: GAME_STATUS.STOPPED,
         };
     }

     update() {
       try {
         const { pieces, ...updates } = process(this.state.pieces, this.props.opts);

         if (Object.keys(pieces).length === 0 || (
           updates.clear.length === 0 &&
           updates.draw.length === 0
         ))
          this.stop();

         const newState = { pieces, updates, iterations: this.state.iterations + 1 };
         this.setState(newState);

         return newState;
       } catch (e) {
         console.error(e);
         console.log('Stopping execution');
         this.stop();
       }

       return {};
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
           ...this.props.buildInitialState(this.props.opts),
           iterations: 0,
           status: GAME_STATUS.STARTING
         });
       }
       else if (this.state.status === GAME_STATUS.STARTING) {
         this.setState({
           status: GAME_STATUS.PAUSED,
           isRestarting: false
         });
       }
     }

     stopGame() {
       if (this.state.status === GAME_STATUS.TEARDOWN) {
         const { pieces, ...updates } = clearBoard(this.state.pieces);

         this.setState({
           isStopping: false,
           iterations: 0,
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

     onPause() {
       this.stop();
       console.info('board', this.state.pieces);
       this.setState({ status: GAME_STATUS.PAUSED });
     }

     onIterate() {
       const newState = this.update();
       console.info('board', newState.pieces);
     }

     onStart() {
       this.start();
       this.setState({ status: GAME_STATUS.RUNNING });
     }

     render = () => (
       <React.Fragment>
         <div className="ph3 bg-white">
           <h2>Iteration: {this.state.iterations}</h2>
         </div>
         <div className="ph3 pb3 bg-white bb">
           <Button onClick={this.onRestart.bind(this)}>Restart</Button>
           {this.state.status === GAME_STATUS.PAUSED ? (
             <React.Fragment>
               <Button className="mh2" onClick={this.onIterate.bind(this)}>Next</Button>
               <Button onClick={this.onStart.bind(this)}>Start</Button>
             </React.Fragment>
           ) : (
             <Button className="mh2" onClick={this.onPause.bind(this)}>Pause</Button>
           )}
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
