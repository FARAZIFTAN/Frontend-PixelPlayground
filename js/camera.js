// Ambil elemen video & tombol
const startBtn = document.getElementById("startCamera");
const video = document.getElementById("cameraPreview");
let lastStream = null;

// Fungsi untuk nyalakan kamera
// Fungsi untuk stop stream lama
function stopLastStream() {
  if (lastStream) {
    lastStream.getTracks().forEach(track => track.stop());
    lastStream = null;
    video.srcObject = null;
  }
}

// Fungsi untuk nyalakan kamera dengan optimasi
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
    };
  } catch (err) {
    alert("Kamera tidak bisa diakses: " + err.message);
    console.error("Error akses kamera:", err);
  }
}

// Event listener tombol
startBtn.addEventListener("click", startCamera);
