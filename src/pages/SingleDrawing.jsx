import React, { useState, useRef, useEffect } from 'react';

const SingleDrawing = () => {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('line'); // line, circle, rectangle, text
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawings, setDrawings] = useState([]);
  const [currentDrawing, setCurrentDrawing] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawings.forEach(draw => {
      drawOnCanvas(draw, ctx);
    });

    if (currentDrawing) {
      drawOnCanvas(currentDrawing, ctx);
    }
  }, [drawings, currentDrawing]);

  const startDrawing = (e) => {
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    if (tool === 'text') {
      setTextPosition({ x, y });
    } else {
      setIsDrawing(true);
      setCurrentDrawing({
        type: tool,
        startPoint: { x, y },
        endPoint: { x, y },
        borderColor: '#000000',
        borderThickness: 2,
        fillColor: '#FFFFFF',
      });
    }
  };

  const draw = (e) => {
    if (!isDrawing || tool === 'text') return;
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    setCurrentDrawing(prev => ({
      ...prev,
      endPoint: { x, y }
    }));
  };

  const finishDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setDrawings([...drawings, currentDrawing]);
    setCurrentDrawing(null);
  };

  const handleAddText = () => {
    if (!textInput || !textPosition) return;

    const newText = {
      type: 'text',
      content: textInput,
      position: textPosition,
      fontSize: 20,
      color: '#000000',
      fontStyle: 'normal'
    };
    
    setDrawings([...drawings, newText]);
    setTextInput('');
    setTextPosition(null);
  };

  const drawOnCanvas = (drawing, ctx) => {
    if (drawing.type === 'line') {
      ctx.beginPath();
      ctx.moveTo(drawing.startPoint.x, drawing.startPoint.y);
      ctx.lineTo(drawing.endPoint.x, drawing.endPoint.y);
      ctx.strokeStyle = drawing.borderColor;
      ctx.lineWidth = drawing.borderThickness;
      ctx.stroke();
    } else if (drawing.type === 'circle') {
      const radius = Math.sqrt(
        Math.pow(drawing.endPoint.x - drawing.startPoint.x, 2) +
        Math.pow(drawing.endPoint.y - drawing.startPoint.y, 2)
      );
      ctx.beginPath();
      ctx.arc(drawing.startPoint.x, drawing.startPoint.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = drawing.fillColor;
      ctx.fill();
      ctx.strokeStyle = drawing.borderColor;
      ctx.lineWidth = drawing.borderThickness;
      ctx.stroke();
    } else if (drawing.type === 'rectangle') {
      const width = drawing.endPoint.x - drawing.startPoint.x;
      const height = drawing.endPoint.y - drawing.startPoint.y;
      ctx.beginPath();
      ctx.rect(drawing.startPoint.x, drawing.startPoint.y, width, height);
      ctx.fillStyle = drawing.fillColor;
      ctx.fill();
      ctx.strokeStyle = drawing.borderColor;
      ctx.lineWidth = drawing.borderThickness;
      ctx.stroke();
    } else if (drawing.type === 'text') {
      ctx.font = `${drawing.fontStyle} ${drawing.fontSize}px Arial`;
      ctx.fillStyle = drawing.color;
      ctx.fillText(drawing.content, drawing.position.x, drawing.position.y);
    }
  };

  return (
    <div>
      <h1>Whiteboard</h1>

      <div style={{ marginBottom: '10px' }}>
        <label>Select Tool: </label>
        <select value={tool} onChange={(e) => setTool(e.target.value)}>
          <option value="line">Line</option>
          <option value="circle">Circle</option>
          <option value="rectangle">Rectangle</option>
          <option value="text">Text</option>
        </select>

       
        {tool === 'text' && (
          <>
            <input
              type="text"
              placeholder="Enter text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
            <button onClick={handleAddText}>Add Text</button>
          </>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '1px solid black' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
      />
    </div>
  );
}

export default SingleDrawing