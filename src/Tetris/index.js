import React from 'react';
import { BOARD, MS_PER_MOVE, POSITION_INCREMENT } from './constants';
import { getCollision, generateOrnament } from './util';

/*
interface GameState {
    cursorMove: CursorMove; // number, string?
    cursor: Ornament[];
    columnHeight: number[];
}
*/

const buildInitialUpdates = () => ({ clear: [], draw: [] });
const GameContext = React.createContext(buildInitialUpdates());

class GameStateHandler extends React.Component {
     constructor(props) {
         super(props);

         this.state = {
             cursor: generateOrnament(),
             columnHeights: new Array(BOARD.width).fill(0),
             updates: buildInitialUpdates(),
         };
     }

     update = () => {
         const updates = buildInitialUpdates();
         let nextCursor;
         const { columnHeights, cursor } = this.state;
         const collisionUpdates = getCollision(columnHeights, cursor)

         if (collisionUpdates !== undefined) {
             nextCursor = generateOrnament();
             updates.draw.push(nextCursor)
         } else {
             nextCursor = {
                 ...cursor,
                 position: {
                     x: cursor.position.x,
                     y: cursor.position.y + POSITION_INCREMENT,
                 },
             };

             updates.clear.push(cursor);
             updates.draw.push(nextCursor);
         }

         this.setState({
             columnHeights: collisionUpdates || columnHeights,
             cursor: nextCursor,
             updates,
         });
     }

     componentDidMount() {
        setInterval(this.update, MS_PER_MOVE);
     }

     render = () => (
         <GameContext.Provider value={this.state.updates}>
             {this.props.children}
         </GameContext.Provider>
     );
}

export const withGameUpdates = WrappedComponent => {
    return props => (
        <GameContext.Consumer>
            {updates => <WrappedComponent {...props} updates={updates} />}
        </GameContext.Consumer>
    );
};

export default GameStateHandler;
