import React from 'react';
import 'tachyons';
import RawCanvas from './Canvas';
import Game, { buildInitialState, opts, withGameUpdates } from './Life';

const Canvas = withGameUpdates(RawCanvas);

const App = () => (
    <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#4868F2',
            padding: '4rem',
        }}>
        <Game buildInitialState={buildInitialState} opts={opts}>
            <Canvas />
        </Game>
    </div>
);

export default App;
