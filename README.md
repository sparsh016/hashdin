 README.md – Image Smoothing App (React.js & Vue.js)
This project provides a simple web-based image processor built using React.js and Vue.js, enabling users to upload an image, apply grayscale conversion, perform image smoothing using a 3x3 or 5x5 neighborhood, and view pixel RGBA values on hover using the HTML5 Canvas API.

🧩 Files Overview
✅ App.js (React.js)
Entry point for the React application.

Renders the ImageSmoother component.

✅ ImageSmoother.js (React.js)
Handles:

Image upload

Grayscale conversion

3x3 / 5x5 neighborhood smoothing

Displaying pixel (R, G, B, A) values on hover

Utilizes two canvas elements: one for the original image and one for the smoothed result.

✅ App.vue (Vue 3)
Vue equivalent of the React app.

Implements the same features as ImageSmoother.js:

Uploading and drawing image

Smoothing based on selected kernel size

Optional grayscale filter

Pixel data display on hover

🖥️ Features
📤 Upload any local image file

🎨 Optional grayscale conversion using weighted average method

🧮 Smoothing using:

3×3 or 5×5 mean filter

👁️ Live display of RGBA values of hovered pixel

🖼️ Two canvas views:

Original image

Smoothed image output

🛠️ Technologies Used
React.js (Functional Components + Hooks)

Vue.js (Composition API with <script setup>)

HTML5 Canvas API

JavaScript ES6+

🚀 How to Run
React Version:
Create app:

bash
Copy
Edit
npx create-react-app image-smoothing
Replace src/ with App.js, ImageSmoother.js, and index.js

Run:

bash
Copy
Edit
npm start
Vue Version:
Create app with Vite:

bash
Copy
Edit
npm create vite@latest image-smoothing-vue -- --template vue
cd image-smoothing-vue
npm install
Replace src/App.vue with the provided App.vue code

Run:

bash
Copy
Edit
npm run dev
