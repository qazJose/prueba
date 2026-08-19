window.addEventListener("load", () => {
  const canvas = document.getElementById('canvas');
  if (!canvas) {
    console.error("No se encontró el elemento canvas");
    return;
  }
  const ctx = canvas.getContext('2d');

  // --- CONFIGURACIÓN PRINCIPAL ---
  const VELOCIDAD_RAMAS = 90;
  const TOTAL_PETALOS = 90;
  const PALETA_CORAZONES = [
    '#d90429', '#ef233c', '#ff4d6d', '#ff758f', 
    '#c9184a', '#800f2f', '#ff0054', '#ffb3c1'
  ];

  const esMovil = window.innerWidth < 768;

  // --- CAPA DE PÉTALOS Y FUEGOS ARTIFICIALES ---
  const particleCanvas = document.createElement('canvas');
  particleCanvas.style.position = 'absolute';
  particleCanvas.style.top = '0';
  particleCanvas.style.left = '0';
  particleCanvas.style.width = '100%';
  particleCanvas.style.height = '100%';
  particleCanvas.style.zIndex = '1';
  particleCanvas.style.pointerEvents = 'none';
  document.querySelector('.container').appendChild(particleCanvas);
  const pCtx = particleCanvas.getContext('2d');

  function resizeCanvases() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }
  resizeCanvases();
  window.addEventListener('resize', resizeCanvases);

  // --- DIBUJAR CORAZÓN ---
  function drawHeart(context, x, y, size, color, alpha = 1) {
    context.save();
    context.globalAlpha = alpha;
    context.beginPath();
    context.translate(x, y);
    context.scale(size, size);
    context.moveTo(0, 0);
    context.bezierCurveTo(-5, -5, -10, 2, 0, 10);
    context.bezierCurveTo(10, 2, 5, -5, 0, 0);
    context.fillStyle = color;
    context.fill();
    context.restore();
  }

  // --- DIBUJAR COPA DEL ÁRBOL ---
  function drawHeartCanopy(centerX, centerY) {
    const totalLeaves = esMovil ? 320 : 420;
    let count = 0;

    function addLeaf() {
      if (count >= totalLeaves) return;

      const t = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()); 
      
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

      const scale = esMovil ? 5.5 : 7.5;
      const leafX = centerX + hx * scale * r;
      const leafY = centerY + hy * scale * r;

      const color = PALETA_CORAZONES[Math.floor(Math.random() * PALETA_CORAZONES.length)];
      const size = (Math.random() * 0.85 + 0.5) * (esMovil ? 0.85 : 1);

      drawHeart(ctx, leafX, leafY, size, color);
      count++;

      setTimeout(addLeaf, 10);
    }

    addLeaf();
  }

  // --- DIBUJO DEL ÁRBOL ---
  function drawBranch(x, y, len, angle, branchWidth) {
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = "#4a2c1d";
    ctx.lineWidth = branchWidth;
    ctx.lineCap = "round";

    const rad = (angle * Math.PI) / 180;
    const endX = x + len * Math.sin(rad);
    const endY = y - len * Math.cos(rad);

    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.restore();

    if (len < (esMovil ? 14 : 18)) {
      for (let i = 0; i < 3; i++) {
        const offsetX = (Math.random() - 0.5) * (esMovil ? 12 : 16);
        const offsetY = (Math.random() - 0.5) * (esMovil ? 12 : 16);
        const color = PALETA_CORAZONES[Math.floor(Math.random() * PALETA_CORAZONES.length)];
        drawHeart(ctx, endX + offsetX, endY + offsetY, Math.random() * 0.8 + 0.5, color);
      }
      return; 
    }

    setTimeout(() => {
      drawBranch(endX, endY, len * 0.78, angle - 20 + (Math.random() * 6 - 3), branchWidth * 0.75);
      drawBranch(endX, endY, len * 0.78, angle + 20 + (Math.random() * 6 - 3), branchWidth * 0.75);

      if (branchWidth > 8 && Math.random() > 0.4) {
        drawBranch(endX, endY, len * 0.68, angle + (Math.random() * 14 - 7), branchWidth * 0.65);
      }
    }, VELOCIDAD_RAMAS);
  }

  // INICIAR ÁRBOL
  function iniciarAnimacionArbol() {
    const startX = esMovil ? canvas.width * 0.8 : canvas.width * 0.82;
    const startY = esMovil ? canvas.height * 0.95 : canvas.height * 0.92;
    const longitudInicial = esMovil ? 90 : 115;
    const grosorInicial = esMovil ? 18 : 22;
    const alturaCopa = esMovil ? 160 : 210;

    drawBranch(startX, startY, longitudInicial, 0, grosorInicial);

    setTimeout(() => {
      drawHeartCanopy(startX, startY - alturaCopa);
    }, 1200);

    // Pétalos volando hacia la izquierda
    for (let i = 0; i < TOTAL_PETALOS; i++) {
      petals.push({
        x: startX - Math.random() * 60, 
        y: (startY - alturaCopa) + (Math.random() - 0.5) * 100,
        size: Math.random() * 0.6 + 0.35,
        speedX: -(Math.random() * 1.4 + 0.6),
        speedY: Math.random() * 0.7 + 0.3,
        angle: Math.random() * Math.PI * 2,
        color: PALETA_CORAZONES[Math.floor(Math.random() * PALETA_CORAZONES.length)],
        opacity: Math.random() * 0.7 + 0.3
      });
    }

    setTimeout(animateParticles, 1600);
  }

  // --- FUEGOS ARTIFICIALES Y PÉTALOS ---
  const petals = [];
  const fireworks = [];

  function createHeartFirework(x, y) {
    const particleCount = esMovil ? 28 : 45;
    const color = PALETA_CORAZONES[Math.floor(Math.random() * PALETA_CORAZONES.length)];

    for (let i = 0; i < particleCount; i++) {
      const t = (Math.PI * 2 / particleCount) * i;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

      fireworks.push({
        x: x,
        y: y,
        vx: hx * (Math.random() * 0.14 + 0.09),
        vy: hy * (Math.random() * 0.14 + 0.09),
        size: Math.random() * 0.5 + 0.3,
        color: color,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008
      });
    }
  }

  function launchRandomFirework() {
    const x = Math.random() * (particleCanvas.width * 0.7) + (particleCanvas.width * 0.1);
    const y = Math.random() * (particleCanvas.height * 0.35) + (particleCanvas.height * 0.1);
    createHeartFirework(x, y);
  }

  function animateParticles() {
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    petals.forEach(p => {
      p.x += p.speedX; 
      p.y += p.speedY; 
      p.angle += 0.03;

      const currentY = p.y + Math.sin(p.angle) * 0.8;

      if (p.x < -20 || p.y > particleCanvas.height + 20) {
        const startX = esMovil ? canvas.width * 0.8 : canvas.width * 0.82;
        const startY = esMovil ? canvas.height * 0.95 : canvas.height * 0.92;
        const alturaCopa = esMovil ? 160 : 210;
        p.x = startX + (Math.random() - 0.5) * 70;
        p.y = (startY - alturaCopa) + (Math.random() - 0.5) * 80;
      }

      drawHeart(pCtx, p.x, currentY, p.size, p.color, p.opacity);
    });

    for (let i = fireworks.length - 1; i >= 0; i--) {
      const f = fireworks[i];
      f.x += f.vx;
      f.y += f.vy;
      f.vy += 0.02;
      f.alpha -= f.decay;

      if (f.alpha <= 0) {
        fireworks.splice(i, 1);
      } else {
        drawHeart(pCtx, f.x, f.y, f.size, f.color, f.alpha);
      }
    }

    requestAnimationFrame(animateParticles);
  }

  // --- MÁQUINA DE ESCRIBIR ---
  const text = " 🎉🥳\n¡FELIZ CUMPLEAÑOS MI CUCHITURA HERMOSA! ❤️\nHoy celebro tu vida, tu sonrisa y la persona increíble que eres. Espero que este día esté lleno de momentos mágicos como tú. no puedo esperar para verte, compartir y llenarte de  besos y abrazos .\nGracias por existir y dejarme compartir un pedacito de tu vida conmigo.\n¡Te adoro mi cuchitura hermosa! ❤️ ¡Te quiero con todo mi corazón! ";
  let index = 0;

  function typeWriter() {
    const typedTextElem = document.getElementById("typed-text");
    if (typedTextElem && index < text.length) {
      typedTextElem.innerHTML += text.charAt(index) === '\n' ? '<br>' : text.charAt(index);
      index++;
      setTimeout(typeWriter, 38);
    }
  }

  // --- CONTADOR Y APERTURA DE SOBRE ---
  const targetDate = new Date(2026, 10, 12, 0, 0, 0).getTime(); 
  let sobreAbierto = false;

  function updateCountdown() {
    const countdownElem = document.getElementById("countdown");
    if (!countdownElem) return;

    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      countdownElem.innerText = `${days}d ${hours}h ${minutes}m ${segundosPad(seconds)}s`;
    } else {
      clearInterval(intervaloContador);
      
countdownElem.innerText = " ";
      if (!sobreAbierto) {
        sobreAbierto = true;
        
        // Abrir sobre
        const wrapper = document.getElementById("envelope-wrapper");
        if (wrapper) wrapper.classList.add("open");

        const titleElem = document.getElementById("countdown-title");
        if (titleElem) titleElem.innerText = "🐼(❁´◡`❁)😍😍😍";

        // Disparar árbol, fuegos artificiales y texto
        iniciarAnimacionArbol();
        launchRandomFirework();
        setInterval(launchRandomFirework, 700);

        setTimeout(typeWriter, 1100);
      }
    }
  }

  function segundosPad(num) {
    return num < 10 ? '0' + num : num;
  }

  const intervaloContador = setInterval(updateCountdown, 1000);
  updateCountdown();
});