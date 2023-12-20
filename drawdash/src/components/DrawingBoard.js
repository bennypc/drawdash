import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const DrawingBoard = () => {
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState([]);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(5);
  const isDrawing = useRef(false);

  useEffect(() => {
    // Disable scrolling when touching the canvas
    const canvasElement = document.getElementById('canvas-container');
    if (canvasElement) {
      canvasElement.addEventListener('touchstart', handleTouchStart, {
        passive: false
      });
      canvasElement.addEventListener('touchmove', handleTouchMove, {
        passive: false
      });
      canvasElement.addEventListener('touchend', handleTouchEnd, {
        passive: false
      });
    }

    return () => {
      // Clean up event listeners
      if (canvasElement) {
        canvasElement.removeEventListener('touchstart', handleTouchStart);
        canvasElement.removeEventListener('touchmove', handleTouchMove);
        canvasElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, []);

  // Fixed canvas dimensions
  const canvasWidth = 800; // Adjust the width as needed
  const canvasHeight = 600; // Adjust the height as needed

  const handleStartDrawing = (pos) => {
    isDrawing.current = true;
    setLines([...lines, { tool, points: [pos.x, pos.y], color, size }]);
  };

  const handleDrawing = (point) => {
    if (!isDrawing.current) {
      return;
    }
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleStopDrawing = () => {
    isDrawing.current = false;
  };

  const handleMouseDown = (e) => {
    const pos = e.target.getStage().getPointerPosition();
    handleStartDrawing(pos);
  };

  const handleMouseMove = (e) => {
    const point = e.target.getStage().getPointerPosition();
    handleDrawing(point);
  };

  const handleMouseUp = () => {
    handleStopDrawing();
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const stage = e.target.getStage();
    const pos = {
      x: touch.clientX - stage.x(),
      y: touch.clientY - stage.y()
    };
    handleStartDrawing(pos);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const stage = e.target.getStage();
    const point = {
      x: touch.clientX - stage.x(),
      y: touch.clientY - stage.y()
    };
    handleDrawing(point);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleStopDrawing();
  };

  return (
    <div>
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
