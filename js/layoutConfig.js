// js/layoutConfig.js
// Konfigurasi slot posisi foto berdasarkan layout
// Ukuran frame standar photostrip: 591 x 1772 px

const layoutConfig = {
  "1": [
    { x: 40, y: 100, w: 510, h: 1570 } // 1 foto penuh panjang
  ],
  "2": [
    { x: 40, y: 100,  w: 510, h: 780 }, // slot atas
    { x: 40, y: 950,  w: 510, h: 720 }  // slot bawah
  ],
  "3": [
    { x: 40, y: 80,   w: 510, h: 500 }, // slot 1
    { x: 40, y: 630,  w: 510, h: 500 }, // slot 2
    { x: 40, y: 1180, w: 510, h: 500 }  // slot 3
  ],
  "4": [
    { x: 40,  y: 80,  w: 250, h: 400 }, // kiri atas
    { x: 300, y: 80,  w: 250, h: 400 }, // kanan atas
    { x: 40,  y: 600, w: 250, h: 400 }, // kiri bawah
    { x: 300, y: 600, w: 250, h: 400 }  // kanan bawah
  ],
  "6": [
    { x: 40,  y: 80,   w: 250, h: 250 },
    { x: 300, y: 80,   w: 250, h: 250 },
    { x: 40,  y: 400,  w: 250, h: 250 },
    { x: 300, y: 400,  w: 250, h: 250 },
    { x: 40,  y: 720,  w: 250, h: 250 },
    { x: 300, y: 720,  w: 250, h: 250 }
  ],
  "8": [
    { x: 40,  y: 80,   w: 250, h: 200 },
    { x: 300, y: 80,   w: 250, h: 200 },
    { x: 40,  y: 320,  w: 250, h: 200 },
    { x: 300, y: 320,  w: 250, h: 200 },
    { x: 40,  y: 560,  w: 250, h: 200 },
    { x: 300, y: 560,  w: 250, h: 200 },
    { x: 40,  y: 800,  w: 250, h: 200 },
    { x: 300, y: 800,  w: 250, h: 200 }
  ]
};
