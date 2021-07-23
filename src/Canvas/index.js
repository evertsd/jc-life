import React, { useEffect, useRef } from 'react';

const drawRect = ctx => ({ color, position, size }) => {
    ctx.fillStyle = color;
    ctx.fillRect(position.x, position.y, size.width, size.height);
}

const clearRect = ctx => ({ position, size }) => {
    console.info('Canvas.clearRect, position, size', position, size);
    ctx.clearRect(position.x, position.y, size.width, size.height);
}

const useCanvasUpdates = updates => {
    const cel = useRef(null);

    useEffect(() => {
        const ref = cel ? cel.current : undefined;
        const ctx = ref && ref.getContext ? ref.getContext('2d') : undefined;

        if (!ctx) {
            return;
        }

        (updates.clear || []).forEach(clearRect(ctx));

        (updates.draw || []).forEach(drawRect(ctx));
    });

    return cel;
};

const Canvas = ({ updates }) => {
    const cel = useCanvasUpdates(updates);

    return (
        <canvas
            ref={cel}
            type="text"
            height="468"
            width="144"
            fillStyle="#FFF"
            style={{ border: '1px solid #EFEFEF', backgroundColor: '#F6F6F6' }}
        />
    );
};

Canvas.defaultProps = {
    updates: {
        clear: [],
        draw: [],
    }
}

export default Canvas;
