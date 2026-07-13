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
  window.scrollTo(0, 0);
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

// ---------- Photo gallery (placeholders — swap in real photos by editing this list) ----------
const photos = [
  { src: "assets/photos/photo1.jpg", alt: "Mēs abi" },
  { src: "assets/photos/photo2.jpg", alt: "Mēs abi" },
  { src: "assets/photos/photo3.jpg", alt: "Dēls" },
  { src: "assets/photos/photo4.jpg", alt: "Kaķis" },
  { src: "assets/photos/photo5.jpg", alt: "Kaķis" },
  { src: "assets/photos/photo6.jpg", alt: "Mēs abi" },
];

const photoGrid = document.getElementById("photoGrid");
photos.forEach((p) => {
  const slot = document.createElement("div");
  slot.className = "photo-slot";
  const img = document.createElement("img");
  img.alt = p.alt;
  img.loading = "lazy";
  img.src = p.src;
  img.onerror = () => {
    slot.removeChild(img);
    slot.textContent = "🐾";
  };
  slot.appendChild(img);
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

couponGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".coupon-download");
  if (!btn) return;
  const coupon = coupons[Number(btn.dataset.index)];
  downloadCoupon(coupon, btn);
});

function downloadCoupon(coupon, btn) {
  const render = document.createElement("div");
  render.className = "coupon-render";
  render.innerHTML = `
    <div class="r-icon">${coupon.icon}</div>
    <p class="r-title">${coupon.title}</p>
    <p class="r-desc">${coupon.desc}</p>
    <p class="r-footer">Kupons priekš Agneses</p>
  `;
  document.body.appendChild(render);

  const originalLabel = btn.textContent;
  btn.textContent = "...";

  html2canvas(render, { backgroundColor: null, scale: 2 })
    .then((canvasEl) => {
      const link = document.createElement("a");
      link.download = coupon.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-kupons.png";
      link.href = canvasEl.toDataURL("image/png");
      link.click();
    })
    .catch(() => {
      alert("Nevarēju lejupielādēt attēlu — mēģini vēlreiz.");
    })
    .finally(() => {
      render.remove();
      btn.textContent = originalLabel;
    });
}

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
