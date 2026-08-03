window.addEventListener("load", () => {
  const canvas = document.getElementById('canvas');
  if (!canvas) {
    console.error("No se encontró el elemento canvas");
    return;
  }
  const ctx = canvas.getContext('2d');

  // ==========================================================
  // --- CONFIGURACIÓN PRINCIPAL (AQUÍ MODIFICAS LOS VALORES) ---
  // ==========================================================
  const VELOCIDAD_RAMAS = 90; // Velocidad de crecimiento del árbol
  const TOTAL_PETALOS = 100;    // <-- CAMBIA ESTE NÚMERO PARA MÁS O MENOS CORAZONES VOLANDO
  const PALETA_CORAZONES = [
    '#d90429', '#ef233c', '#ff4d6d', '#ff758f', 
    '#c9184a', '#800f2f', '#ff0054', '#ffb3c1'
  ];

  // --- CAPA DE PÉTALOS CON VIENTO ---
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

  // --- DIBUJAR UN CORAZÓN INDIVIDUAL ---
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

  // --- GENERAR LA COPA DE ÁRBOL EN FORMA DE CORAZÓN GIGANTE ---
  function drawHeartCanopy(centerX, centerY) {
    const totalLeaves = 280; // Cantidad de hojas en la copa
    let count = 0;

    function addLeaf() {
      if (count >= totalLeaves) return;

      const t = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()); 
      
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

      const scale = 7.5; 
      const leafX = centerX + hx * scale * r;
      const leafY = centerY + hy * scale * r;

      const color = PALETA_CORAZONES[Math.floor(Math.random() * PALETA_CORAZONES.length)];
      const size = Math.random() * 0.8 + 0.5;

      drawHeart(ctx, leafX, leafY, size, color);
      count++;

      setTimeout(addLeaf, 15);
    }

    addLeaf();
  }

  // --- DIBUJO DE LAS RAMAS DEL ÁRBOL (CON PÉTALOS EN LAS RAMAS) ---
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

    // Cuando la rama es pequeña, DIBUJAMOS EL CORAZÓN EN LA PUNTA DE LA RAMA
    if (len < 15) {
      const color = PALETA_CORAZONES[Math.floor(Math.random() * PALETA_CORAZONES.length)];
      drawHeart(ctx, endX, endY, Math.random() * 0.8 + 0.5, color);
      return; 
    }

    setTimeout(() => {
      drawBranch(endX, endY, len * 0.76, angle - 16 + (Math.random() * 6 - 3), branchWidth * 0.7);
      drawBranch(endX, endY, len * 0.76, angle + 16 + (Math.random() * 6 - 3), branchWidth * 0.7);
    }, VELOCIDAD_RAMAS);
  }

  // Posición del árbol (derecha y abajo)
  const startX = canvas.width * 0.76;
  const startY = canvas.height * 0.88;

  // 1. Nace el tronco, las ramas y sus pétalos individuales
  drawBranch(startX, startY, 115, 0, 15);

  // 2. Aflora la copa en forma de corazón gigante sobre las ramas
  setTimeout(() => {
    drawHeartCanopy(startX, startY - 215);
  }, 1200);


  // --- PÉTALOS VOLANDO CON VIENTO HACIA LA IZQUIERDA ---
  const petals = [];
  for (let i = 0; i < TOTAL_PETALOS; i++) {
    petals.push({
      x: startX - Math.random() * 100, 
      y: (startY - 220) + (Math.random() - 0.5) * 120,
      size: Math.random() * 0.6 + 0.35,
      speedX: -(Math.random() * 1.8 + 0.8), // Viento hacia la izquierda
      speedY: Math.random() * 0.8 + 0.3,    // Caída suave
      angle: Math.random() * Math.PI * 2,
      color: PALETA_CORAZONES[Math.floor(Math.random() * PALETA_CORAZONES.length)],
      opacity: Math.random() * 0.7 + 0.3
    });
  }

  function animatePetals() {
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    petals.forEach(p => {
      p.x += p.speedX; 
      p.y += p.speedY; 
      p.angle += 0.03;

      const currentY = p.y + Math.sin(p.angle) * 0.8;

      if (p.x < -20 || p.y > particleCanvas.height + 20) {
        p.x = startX + (Math.random() - 0.5) * 80;
        p.y = (startY - 220) + (Math.random() - 0.5) * 100;
      }

      drawHeart(pCtx, p.x, currentY, p.size, p.color, p.opacity);
    });

    requestAnimationFrame(animatePetals);
  }
  
  setTimeout(() => {
    animatePetals();
  }, 1800);


  // --- EFECTO MÁQUINA DE ESCRIBIR ---
  const text = "Falta muy poco para tu cumpleaños, y no puedo esperar para celebrar tu día y llenarte de abrazos, besos y sorpresas.\n\nGracias por existir y dejarme compartir un pedacito de tu vida conmigo.\n\n¡Te adoro mi cuchitura hermosa! ❤️";
  let index = 0;

  function typeWriter() {
    const typedTextElem = document.getElementById("typed-text");
    if (typedTextElem && index < text.length) {
      typedTextElem.innerHTML += text.charAt(index);
      index++;
      setTimeout(typeWriter, 40);
    }
  }
  setTimeout(typeWriter, 500);


  // --- CONTADOR REGRESIVO ---
  const targetDate = new Date(2026, 10, 12, 0, 0, 0).getTime(); 

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

      countdownElem.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
      countdownElem.innerText = "¡Llegó el día! 🎉❤️";
    }
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();
});
