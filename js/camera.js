// Ambil elemen
const startBtn = document.getElementById("startCamera");
const captureBtn = document.getElementById("capturePhoto");
const video = document.getElementById("cameraPreview");
const canvas = document.getElementById("photoCanvas");
const countdownEl = document.getElementById("countdown");
const layoutSelect = document.getElementById("layout");
const gallery = document.getElementById("gallery");

let lastStream = null;
let capturedPhotos = [];

// Hentikan stream lama
function stopLastStream() {
  if (lastStream) {
    lastStream.getTracks().forEach(track => track.stop());
    lastStream = null;
    video.srcObject = null;
  }
}

// Nyalakan kamera
async function startCamera() {
  stopLastStream();
  try {
    const constraints = {
      video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
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

// Ambil 1 foto
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
  const layout = layoutSelect ? layoutSelect.value : "single";
  const numPhotos = layout === "single" ? 1 : parseInt(layout);

  capturedPhotos = [];
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
      // semua foto terkumpul → gabungkan + frame
      renderLayout(layout);
    }
  }

  takeNextPhoto();
}

// Gabungkan foto ke layout + tambahkan frame
function renderLayout(layout) {
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const numPhotos = layout === "single" ? 1 : parseInt(layout);
  const cols = 2;
  const rows = Math.ceil(numPhotos / cols);

  const cellWidth = canvas.width / cols;
  const cellHeight = canvas.height / rows;

  context.clearRect(0, 0, canvas.width, canvas.height);

  let photoIndex = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (photoIndex >= capturedPhotos.length) break;

      context.drawImage(
        capturedPhotos[photoIndex],
        c * cellWidth,
        r * cellHeight,
        cellWidth,
        cellHeight
      );
      photoIndex++;
    }
  }

  // Tambahkan frame PNG sesuai layout
  const frameImg = new Image();
  frameImg.src = `assets/frames/frame-${layout === "single" ? "1" : layout}.png`;
  frameImg.onload = () => {
    context.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

    // tampilkan canvas
    canvas.classList.remove("hidden");

    // simpan ke galeri
    const img = new Image();
    img.src = canvas.toDataURL("image/png");
    gallery.appendChild(img);
  };
}

// Event listener
startBtn.addEventListener("click", startCamera);
captureBtn.addEventListener("click", capturePhoto);
