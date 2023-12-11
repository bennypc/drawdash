import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const DrawingBoard = () => {
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState([]);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(5);
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 }); // Default dimensions
  const isDrawing = useRef(false);

  useEffect(() => {
    // Update the dimensions after the component mounts
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y], color, size }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div>
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.size}
              tension={0.5}
              lineCap='round'
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
        </Layer>
      </Stage>
      <div className='flex justify-center space-x-2 my-2'>
        <input
          type='color'
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type='range'
          min='1'
          max='20'
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
      </div>
    </div>
  );
};

export default DrawingBoard;
