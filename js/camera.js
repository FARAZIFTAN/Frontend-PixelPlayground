// Ambil elemen video & tombol
const startBtn = document.getElementById("startCamera");
const captureBtn = document.getElementById("capturePhoto");
const video = document.getElementById("cameraPreview");
const canvas = document.getElementById("photoCanvas");
const countdownEl = document.getElementById("countdown");
const layoutSelect = document.getElementById("layout");

let lastStream = null;

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
      captureBtn.disabled = false; // aktifkan tombol capture
    };
  } catch (err) {
    alert("Kamera tidak bisa diakses: " + err.message);
    console.error("Error akses kamera:", err);
  }
}

// Fungsi ambil foto dengan countdown & layout
function capturePhoto() {
  let counter = 3;
  countdownEl.textContent = counter;
  countdownEl.classList.remove("hidden");

  const interval = setInterval(() => {
    counter--;
    if (counter > 0) {
      countdownEl.textContent = counter;
    } else {
      clearInterval(interval);

      const context = canvas.getContext("2d");
      const layout = layoutSelect ? layoutSelect.value : "single";

      // Samakan ukuran canvas dengan video preview
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.save();
      context.scale(-1, 1); // mirror horizontal

      if (layout === "single") {
        // 1 Foto penuh
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);

      } else {
        // Layout kelipatan 2 (2, 4, 6, 8)
        const numPhotos = parseInt(layout);
        const cols = 2; // default 2 kolom
        const rows = Math.ceil(numPhotos / cols);

        const cellWidth = canvas.width / cols;
        const cellHeight = canvas.height / rows;

        let photoIndex = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (photoIndex >= numPhotos) break;

            const x = -((c + 1) * cellWidth);
            const y = r * cellHeight;

            context.drawImage(video, x, y, cellWidth, cellHeight);
            photoIndex++;
          }
        }
      }

      context.restore();
      canvas.classList.remove("hidden");

      // Hapus angka countdown setelah capture
      setTimeout(() => {
        countdownEl.classList.add("hidden");
        countdownEl.textContent = "";
      }, 300);
    }
  }, 1000);
}

// Event listener tombol
startBtn.addEventListener("click", startCamera);
captureBtn.addEventListener("click", capturePhoto);
