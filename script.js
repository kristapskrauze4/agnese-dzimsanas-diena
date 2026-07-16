// ---------- Step navigation ----------
const steps = Array.from(document.querySelectorAll(".step"));
const dotsWrap = document.getElementById("progressDots");
let currentStep = 1;

steps.forEach((_, i) => {
  const dot = document.createElement("div");
  dot.className = "dot";
  dot.dataset.step = i + 1;
  dot.addEventListener("click", () => {
    if (i + 1 < currentStep) goToStep(i + 1);
  });
  dotsWrap.appendChild(dot);
});

function goToStep(n) {
  currentStep = n;
  steps.forEach((s) => s.classList.toggle("active", Number(s.dataset.step) === n));
  Array.from(dotsWrap.children).forEach((dot, i) => {
    dot.classList.toggle("current", i + 1 === n);
    dot.classList.toggle("done", i + 1 < n);
  });
  resetScroll();
}

function resetScroll() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
}

document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep < steps.length) goToStep(currentStep + 1);
  });
});

document.querySelectorAll("[data-back]").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep > 1) goToStep(currentStep - 1);
  });
});

goToStep(1);

// ---------- Floating hearts on step 1 ----------
const floaters = document.querySelector(".floaters");
const floaterEmojis = ["💛", "🎈", "✨", "🩷"];

function spawnFloater() {
  const el = document.createElement("span");
  el.className = "floater";
  el.textContent = floaterEmojis[Math.floor(Math.random() * floaterEmojis.length)];
  el.style.left = Math.random() * 90 + "%";
  el.style.setProperty("--drift", Math.random() * 60 - 30 + "px");
  el.style.animationDuration = 6 + Math.random() * 4 + "s";
  floaters.appendChild(el);
  setTimeout(() => el.remove(), 11000);
}

setInterval(spawnFloater, 900);
spawnFloater();

// ---------- Cake candles ----------
const candlesWrap = document.getElementById("candles");
const CANDLE_COUNT = 5;
let candlesLit = CANDLE_COUNT;

for (let i = 0; i < CANDLE_COUNT; i++) {
  const candle = document.createElement("div");
  candle.className = "candle";
  candle.innerHTML = '<div class="flame"></div><div class="smoke"></div>';
  candle.addEventListener("click", () => blowCandle(candle));
  candlesWrap.appendChild(candle);
}

function blowCandle(candle) {
  if (candle.classList.contains("out")) return;
  candle.classList.add("out");
  candlesLit--;
  if (candlesLit === 0) {
    setTimeout(() => {
      launchConfetti();
      document.getElementById("cakeHint").textContent = "Lai vēlēšanās piepildās! 🎉";
      const nextBtn = document.getElementById("cakeNextBtn");
      nextBtn.classList.remove("btn-hidden");
    }, 300);
  }
}

// ---------- Confetti ----------
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
let confettiPieces = [];
let confettiRunning = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const confettiColors = ["#e8b4b8", "#d4af7a", "#f5efe6", "#d98f96", "#fff6c9"];

function launchConfetti() {
  confettiPieces = [];
  for (let i = 0; i < 140; i++) {
    confettiPieces.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 60,
      y: canvas.height * 0.35,
      vx: (Math.random() - 0.5) * 8,
      vy: -Math.random() * 10 - 4,
      size: 6 + Math.random() * 6,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 12,
      gravity: 0.25 + Math.random() * 0.15,
    });
  }
  if (!confettiRunning) {
    confettiRunning = true;
    requestAnimationFrame(animateConfetti);
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let alive = false;
  confettiPieces.forEach((p) => {
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.spin;
    if (p.y < canvas.height + 20) alive = true;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    ctx.restore();
  });
  if (alive) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// ---------- Song player ----------
const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const vinyl = document.getElementById("vinyl");
const iconPlay = document.getElementById("iconPlay");
const iconPause = document.getElementById("iconPause");
const songFallback = document.getElementById("songFallback");

let songMissing = false;

audio.addEventListener("error", () => {
  songMissing = true;
  songFallback.style.display = "block";
  playBtn.style.opacity = "0.5";
  playBtn.style.pointerEvents = "none";
});

playBtn.addEventListener("click", () => {
  if (songMissing) return;
  if (audio.paused) {
    audio.play().catch(() => {
      songMissing = true;
      songFallback.style.display = "block";
    });
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => {
  vinyl.classList.add("spinning");
  iconPlay.style.display = "none";
  iconPause.style.display = "block";
});

audio.addEventListener("pause", () => {
  vinyl.classList.remove("spinning");
  iconPlay.style.display = "block";
  iconPause.style.display = "none";
});

audio.addEventListener("ended", () => {
  vinyl.classList.remove("spinning");
  iconPlay.style.display = "block";
  iconPause.style.display = "none";
});

// ---------- Photo gallery (add more by editing this list) ----------
const media = [
  { type: "image", src: "assets/photos/photo1.jpg", alt: "Kaķis" },
  { type: "image", src: "assets/photos/photo2.jpg", alt: "Mēs abi" },
  { type: "image", src: "assets/photos/photo3.jpg", alt: "Dēls ar kaķi" },
  { type: "image", src: "assets/photos/photo4.jpg", alt: "Kaķis" },
  { type: "video", src: "assets/videos/video1.mp4" },
  { type: "video", src: "assets/videos/video2.mp4" },
];

const photoGrid = document.getElementById("photoGrid");
media.forEach((m) => {
  const slot = document.createElement("div");
  slot.className = "photo-slot";

  if (m.type === "video") {
    const video = document.createElement("video");
    video.src = m.src;
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.onerror = () => {
      slot.removeChild(video);
      slot.textContent = "🐾";
    };
    slot.appendChild(video);
  } else {
    const img = document.createElement("img");
    img.alt = m.alt;
    img.loading = "lazy";
    img.src = m.src;
    img.onerror = () => {
      slot.removeChild(img);
      slot.textContent = "🐾";
    };
    slot.appendChild(img);
  }

  photoGrid.appendChild(slot);
});

// ---------- Coupons ----------
const coupons = [
  { icon: "💆", title: "Muguras/Pēdu masāža", desc: "Jebkurā vakarā, kad vēlies" },
  { icon: "🍽️", title: "Vakariņas no manis", desc: "Es gatavoju, tu atpūties" },
  { icon: "🎬", title: "Filmu vakars pēc tavas izvēles", desc: "Varbūt pat pa vidam nepļāpāšu" },
  { icon: "🛏️", title: "Brokastis gultā", desc: "Bez pukstēšanas piecelšos" },
  { icon: "🧺", title: "Izbrauciens pie dabas ar pikniku", desc: "Segu, groziņu un labu laiku līdzi" },
  { icon: "🚶", title: "Pastaiga pēc tavas izvēles", desc: "Tajā skaitā sēņošana" },
];

const couponGrid = document.getElementById("couponGrid");

coupons.forEach((c, index) => {
  const card = document.createElement("div");
  card.className = "coupon-card";
  card.innerHTML = `
    <div class="coupon-icon">${c.icon}</div>
    <div class="coupon-body">
      <p class="coupon-title">${c.title}</p>
      <p class="coupon-desc">${c.desc}</p>
    </div>
    <button class="coupon-download" data-index="${index}">Lejupielādēt</button>
  `;
  couponGrid.appendChild(card);
});

function isIOS() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

couponGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".coupon-download");
  if (!btn) return;
  const coupon = coupons[Number(btn.dataset.index)];
  downloadCoupon(coupon, btn);
});

async function downloadCoupon(coupon, btn) {
  const originalLabel = btn.textContent;
  btn.textContent = "...";

  try {
    const dataUrl = await renderCouponImage(coupon);
    if (isIOS()) {
      // iOS Safari (and every browser built on it, including in-app
      // browsers) refuses to auto-download a generated image — this is
      // an OS-level restriction, not something a website can work around.
      showCouponPreview(dataUrl);
    } else {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = coupon.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-kupons.png";
      link.click();
    }
  } catch (e) {
    alert("Nevarēju sagatavot attēlu — mēģini vēlreiz.");
  } finally {
    btn.textContent = originalLabel;
  }
}

// Drawn directly with Canvas 2D (no external library, no network call) so
// it renders instantly and reliably even inside restrictive in-app
// browsers (e.g. links opened straight from WhatsApp) where third-party
// CDN scripts can be slow to load or blocked outright.
async function renderCouponImage(coupon) {
  const scale = 2;
  const width = 400 * scale;
  const height = 240 * scale;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const radius = 28 * scale;
  const strokeWidth = 3 * scale;

  roundRectPath(ctx, 0, 0, width, height, radius);
  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, "#f5efe6");
  bgGradient.addColorStop(1, "#fffaf3");
  ctx.fillStyle = bgGradient;
  ctx.fill();

  roundRectPath(ctx, strokeWidth / 2, strokeWidth / 2, width - strokeWidth, height - strokeWidth, radius);
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = "#d4af7a";
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // Safari's Canvas 2D fillText silently refuses to paint color emoji no
  // matter which font is named — a long-standing WebKit bug. Rendering
  // the emoji as SVG <text> (real text-layout engine, not Canvas 2D) and
  // drawing that as an image works reliably everywhere instead.
  const iconSize = 56 * scale;
  try {
    const emojiImg = await loadEmojiImage(coupon.icon, iconSize);
    ctx.drawImage(emojiImg, width / 2 - iconSize / 2, 32 * scale, iconSize, iconSize);
  } catch (e) {
    // if it fails to load for some reason, just skip the icon rather than breaking the whole coupon
  }

  ctx.font = `bold ${22 * scale}px "Segoe UI", sans-serif`;
  ctx.fillStyle = "#5a4636";
  const titleLines = wrapText(ctx, coupon.title, width - 60 * scale);
  let y = 118 * scale;
  titleLines.forEach((line) => {
    ctx.fillText(line, width / 2, y);
    y += 28 * scale;
  });

  ctx.font = `${14 * scale}px "Segoe UI", sans-serif`;
  ctx.fillStyle = "#8a7666";
  const descLines = wrapText(ctx, coupon.desc, width - 80 * scale);
  y += 4 * scale;
  descLines.forEach((line) => {
    ctx.fillText(line, width / 2, y);
    y += 20 * scale;
  });

  ctx.font = `bold ${12 * scale}px "Segoe UI", sans-serif`;
  ctx.fillStyle = "#d4af7a";
  ctx.fillText("KUPONS PRIEKŠ AGNESES", width / 2, height - 24 * scale);

  return canvas.toDataURL("image/png");
}

function loadEmojiImage(emoji, size) {
  return new Promise((resolve, reject) => {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<text x="50%" y="53%" font-size="${size * 0.82}" text-anchor="middle" dominant-baseline="central">${emoji}</text>` +
      `</svg>`;
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  });
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);
  return lines;
}

// Mobile browsers (especially iOS Safari) silently ignore a synthetic
// click on <a download> with a data: URL, so instead we show the coupon
// full-screen and let the user long-press it to save to their photos.
const couponPreviewOverlay = document.getElementById("couponPreviewOverlay");
const couponPreviewImg = document.getElementById("couponPreviewImg");
const couponPreviewClose = document.getElementById("couponPreviewClose");

function showCouponPreview(dataUrl) {
  couponPreviewImg.src = dataUrl;
  couponPreviewOverlay.classList.add("visible");
}

function hideCouponPreview() {
  couponPreviewOverlay.classList.remove("visible");
}

couponPreviewClose.addEventListener("click", hideCouponPreview);
couponPreviewOverlay.addEventListener("click", (e) => {
  if (e.target === couponPreviewOverlay) hideCouponPreview();
});

// ---------- Cat easter egg on closing step ----------
const catEgg = document.getElementById("catEgg");
const heartRain = document.getElementById("heartRain");
const heartEmojis = ["🐾", "💛", "😻", "🩷"];

catEgg.addEventListener("click", () => {
  for (let i = 0; i < 24; i++) {
    setTimeout(() => {
      const span = document.createElement("span");
      span.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      span.style.left = Math.random() * 100 + "%";
      span.style.animationDuration = 2.5 + Math.random() * 2 + "s";
      heartRain.appendChild(span);
      setTimeout(() => span.remove(), 5000);
    }, i * 60);
  }
});
