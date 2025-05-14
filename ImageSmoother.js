import React, { useRef, useState } from 'react';

function ImageSmoother() {
  const originalCanvasRef = useRef(null);
  const smoothedCanvasRef = useRef(null);
  const [pixelInfo, setPixelInfo] = useState('');
  const [grayscale, setGrayscale] = useState(false);
  const [neighborhoodSize, setNeighborhoodSize] = useState(3);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const ctx = originalCanvasRef.current.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 300, 300);
      if (grayscale) applyGrayscale(ctx);
      applySmoothing();
    };
    img.src = URL.createObjectURL(file);
  };

  const applyGrayscale = (ctx) => {
    const imageData = ctx.getImageData(0, 0, 300, 300);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = data[i + 1] = data[i + 2] = avg;
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const applySmoothing = () => {
    const oCtx = originalCanvasRef.current.getContext('2d');
    const sCtx = smoothedCanvasRef.current.getContext('2d');
    const imageData = oCtx.getImageData(0, 0, 300, 300);
    const output = sCtx.createImageData(imageData);
    const { data } = imageData;
    const outData = output.data;
    const sizeHalf = Math.floor(neighborhoodSize / 2);

    for (let y = 0; y < 300; y++) {
      for (let x = 0; x < 300; x++) {
        let r = 0, g = 0, b = 0, a = 0, count = 0;
        for (let dy = -sizeHalf; dy <= sizeHalf; dy++) {
          for (let dx = -sizeHalf; dx <= sizeHalf; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (ny >= 0 && ny < 300 && nx >= 0 && nx < 300) {
              const index = (ny * 300 + nx) * 4;
              r += data[index];
              g += data[index + 1];
              b += data[index + 2];
              a += data[index + 3];
              count++;
            }
          }
        }
        const i = (y * 300 + x) * 4;
        outData[i] = r / count;
        outData[i + 1] = g / count;
        outData[i + 2] = b / count;
        outData[i + 3] = a / count;
      }
    }

    sCtx.putImageData(output, 0, 0);
  };

  const showPixelInfo = (e) => {
    const rect = originalCanvasRef.current.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
    const ctx = originalCanvasRef.current.getContext('2d');
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    setPixelInfo(`(${x}, ${y}): R=${pixel[0]} G=${pixel[1]} B=${pixel[2]} A=${pixel[3]}`);
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      <br /><br />
      <label>
        <input type="checkbox" checked={grayscale} onChange={() => setGrayscale(!grayscale)} />
        Convert to Grayscale First
      </label>
      <br /><br />
      <label>
        Neighborhood Size:&nbsp;
        <select value={neighborhoodSize} onChange={(e) => setNeighborhoodSize(parseInt(e.target.value))}>
          <option value={3}>3x3</option>
          <option value={5}>5x5</option>
        </select>
      </label>
      <br /><br />
      <canvas ref={originalCanvasRef} width="300" height="300" onMouseMove={showPixelInfo} />
      <canvas ref={smoothedCanvasRef} width="300" height="300" />
      <div style={{ marginTop: '10px', fontWeight: 'bold' }}>{pixelInfo}</div>
    </div>
  );
}

export default ImageSmoother;
