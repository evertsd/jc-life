import React from 'react';
import RawCanvas from './Canvas';
import Game, { withGameUpdates } from './Life';

const Canvas = withGameUpdates(RawCanvas);

const App = () => (
    <div style={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: '#4868F2',
            padding: '4rem 0',
        }}>
        <Game>
            <Canvas />
        </Game>
    </div>
);

export default App;
