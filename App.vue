<template>
  <div>
    <h2>Canvas Image Smoothing (Vue)</h2>
    <input type="file" @change="handleUpload" />
    <label>
      <input type="checkbox" v-model="grayscale" /> Convert to Grayscale
    </label>
    <select v-model="size">
      <option value="3">3x3</option>
      <option value="5">5x5</option>
    </select>
    <br><br>
    <canvas ref="originalCanvas" width="300" height="300" @mousemove="showPixelInfo"></canvas>
    <canvas ref="smoothedCanvas" width="300" height="300"></canvas>
    <div>{{ pixelInfo }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const originalCanvas = ref(null);
const smoothedCanvas = ref(null);
const grayscale = ref(false);
const size = ref(3);
const pixelInfo = ref('');

function handleUpload(event) {
  const file = event.target.files[0];
  const ctx = originalCanvas.value.getContext('2d');
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, 300, 300);
    if (grayscale.value) convertToGrayscale(ctx);
    smoothImage();
  };
  img.src = URL.createObjectURL(file);
}

function convertToGrayscale(ctx) {
  const imageData = ctx.getImageData(0, 0, 300, 300);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
    data[i] = data[i+1] = data[i+2] = avg;
  }
  ctx.putImageData(imageData, 0, 0);
}

function smoothImage() {
  const oCtx = originalCanvas.value.getContext('2d');
  const sCtx = smoothedCanvas.value.getContext('2d');
  const imageData = oCtx.getImageData(0, 0, 300, 300);
  const output = sCtx.createImageData(imageData);
  const { data } = imageData;
  const outData = output.data;
  const half = Math.floor(size.value / 2);

  for (let y = 0; y < 300; y++) {
    for (let x = 0; x < 300; x++) {
      let r = 0, g = 0, b = 0, a = 0, count = 0;

      for (let dy = -half; dy <= half; dy++) {
        for (let dx = -half; dx <= half; dx++) {
          const ny = y + dy, nx = x + dx;
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
}

function showPixelInfo(e) {
  const rect = originalCanvas.value.getBoundingClientRect();
  const x = Math.floor(e.clientX - rect.left);
  const y = Math.floor(e.clientY - rect.top);
  const ctx = originalCanvas.value.getContext('2d');
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  pixelInfo.value = `(${x}, ${y}): R=${pixel[0]} G=${pixel[1]} B=${pixel[2]} A=${pixel[3]}`;
}
</script>
