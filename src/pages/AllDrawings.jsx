import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const AllDrawings = () => {
  const [drawings, setDrawings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/drawings')
      .then(res => {
        console.log(res.data); 
        setDrawings(res.data);
      })
      .catch(err => console.error('Error fetching drawings:', err));
  }, []);

  const drawOnCanvas = (canvas, drawing) => {
    const ctx = canvas.getContext('2d');

   
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    if (drawing.type === 'line') {
      const { startPoint, endPoint, borderColor, borderThickness } = drawing;
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderThickness;
      ctx.stroke();
    } else if (drawing.type === 'circle') {
      const { center, radius, borderColor, borderThickness, fillColor } = drawing;
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = fillColor || 'transparent';
      ctx.fill();
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderThickness;
      ctx.stroke();
    } else if (drawing.type === 'rectangle') {
      const { startPoint, endPoint, borderColor, borderThickness, fillColor } = drawing;
      const width = endPoint.x - startPoint.x;
      const height = endPoint.y - startPoint.y;
      ctx.beginPath();
      ctx.rect(startPoint.x, startPoint.y, width, height);
      ctx.fillStyle = fillColor || 'transparent';
      ctx.fill();
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderThickness;
      ctx.stroke();
    } else if (drawing.type === 'text') {
      const { content, position, fontSize, color, fontStyle } = drawing;
      ctx.font = `${fontStyle || 'normal'} ${fontSize || 16}px Arial`;
      ctx.fillStyle = color || '#000';
      ctx.fillText(content, position.x, position.y);
    }
  };

  return (
    <div>
      <h1>All Drawings</h1>

      {drawings.map((drawing, index) => (
        <div key={drawing._id} style={{ marginBottom: '20px' }}>
          <h2>Drawing Type: {drawing.type}</h2>
          <canvas
            ref={canvas => canvas && drawOnCanvas(canvas, drawing)}
            width={500}
            height={500}
            style={{ border: '1px solid black' }}
          />
          
          {drawing.type === 'line' && (
            <>
              <p>Start Point: ({drawing.startPoint.x}, {drawing.startPoint.y})</p>
              <p>End Point: ({drawing.endPoint.x}, {drawing.endPoint.y})</p>
              <p>Border Color: {drawing.borderColor}</p>
              <p>Border Thickness: {drawing.borderThickness}</p>
            </>
          )}
          {drawing.type === 'circle' && (
            <>
              <p>Center: ({drawing.center.x}, {drawing.center.y})</p>
              <p>Radius: {drawing.radius}</p>
              <p>Border Color: {drawing.borderColor}</p>
              <p>Fill Color: {drawing.fillColor || 'None'}</p>
              <p>Border Thickness: {drawing.borderThickness}</p>
            </>
          )}
          {drawing.type === 'rectangle' && (
            <>
              <p>Start Point: ({drawing.startPoint.x}, {drawing.startPoint.y})</p>
              <p>End Point: ({drawing.endPoint.x}, {drawing.endPoint.y})</p>
              <p>Border Color: {drawing.borderColor}</p>
              <p>Fill Color: {drawing.fillColor || 'None'}</p>
              <p>Border Thickness: {drawing.borderThickness}</p>
            </>
          )}
          {drawing.type === 'text' && (
            <>
              <p>Content: {drawing.content}</p>
              <p>Position: ({drawing.position.x}, {drawing.position.y})</p>
              <p>Font Size: {drawing.fontSize}</p>
              <p>Color: {drawing.color}</p>
              <p>Font Style: {drawing.fontStyle || 'normal'}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AllDrawings;