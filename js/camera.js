// Ambil elemen video & tombol 
const startBtn = document.getElementById("startCamera");
const captureBtn = document.getElementById("capturePhoto");
const video = document.getElementById("cameraPreview");
const canvas = document.getElementById("photoCanvas");
const countdownEl = document.getElementById("countdown");
const layoutSelect = document.getElementById("layout");
const gallery = document.getElementById("gallery");

let lastStream = null;
let capturedPhotos = []; // simpan semua foto sementara

// Fungsi stop stream lama
function stopLastStream() {
  if (lastStream) {
    lastStream.getTracks().forEach(track => track.stop());
    lastStream = null;
    video.srcObject = null;
  }
}

// Fungsi untuk nyalakan kamera
async function startCamera() {
  stopLastStream();
  try {
    const constraints = {
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30, max: 60 }
      },
      audio: false
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    lastStream = stream;
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play();
      captureBtn.disabled = false;
    };
  } catch (err) {
    alert("Kamera tidak bisa diakses: " + err.message);
    console.error("Error akses kamera:", err);
  }
}

// Ambil 1 foto dari kamera (mirror)
function captureSinglePhoto() {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = video.videoWidth;
  tempCanvas.height = video.videoHeight;

  const ctx = tempCanvas.getContext("2d");
  ctx.save();
  ctx.scale(-1, 1);
  ctx.drawImage(video, -tempCanvas.width, 0, tempCanvas.width, tempCanvas.height);
  ctx.restore();

  return tempCanvas;
}

// Fungsi ambil foto multiple sesuai layout
function capturePhoto() {
  const layout = layoutSelect ? layoutSelect.value : "1";
  const numPhotos = layout === "single" ? 1 : parseInt(layout);

  capturedPhotos = []; // reset array
  let currentShot = 0;

  function takeNextPhoto() {
    if (currentShot < numPhotos) {
      let counter = 3;
      countdownEl.textContent = counter;
      countdownEl.classList.remove("hidden");

      const interval = setInterval(() => {
        counter--;
        if (counter > 0) {
          countdownEl.textContent = counter;
        } else {
          clearInterval(interval);
          countdownEl.classList.add("hidden");
          countdownEl.textContent = "";

          // ambil 1 foto
          const photo = captureSinglePhoto();
          capturedPhotos.push(photo);
          currentShot++;

          // tunggu sebentar lalu ambil foto berikutnya
          setTimeout(takeNextPhoto, 1000);
        }
      }, 1000);

    } else {
      // semua foto terkumpul → gabungkan
      renderLayout(layout);
    }
  }

  takeNextPhoto();
}

// Gabungkan foto ke layout + frame
function renderLayout(layout) {
  const context = canvas.getContext("2d");

  // Canvas disamakan dengan ukuran frame photostrip
  canvas.width = 591;
  canvas.height = 1772;

  context.clearRect(0, 0, canvas.width, canvas.height);

  const slots = layoutConfig[layout]; // ambil config posisi dari layoutConfig.js
  if (!slots) {
    console.error("Layout tidak ditemukan:", layout);
    return;
  }

  // gambar semua foto ke slot masing-masing
  capturedPhotos.forEach((photoCanvas, i) => {
    if (i < slots.length) {
      const slot = slots[i];
      context.drawImage(photoCanvas, slot.x, slot.y, slot.w, slot.h);
    }
  });

  // Tambahkan frame PNG sesuai layout
  const frameName = `Layout ${layout} foto.png`;
  const frameImg = new Image();
  frameImg.src = `assets/frames/${frameName}`;
  frameImg.onload = () => {
    context.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

    canvas.classList.remove("hidden");

    // Simpan hasil ke galeri juga
    const img = new Image();
    img.src = canvas.toDataURL("image/png");
    gallery.appendChild(img);
  };
}

// Event listener tombol
startBtn.addEventListener("click", startCamera);
captureBtn.addEventListener("click", capturePhoto);
