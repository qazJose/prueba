document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('canvas');
  if (!canvas) {
    console.error("No se encontró el elemento canvas");
    return;
  }
  const ctx = canvas.getContext('2d');

  // Ajustar tamaño del canvas al tamaño de la pantalla
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // --- DIBUJO DEL ÁRBOL Y CORAZONES ---

  function drawHeart(x, y, size, color) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.scale(size, size);
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-5, -5, -10, 2, 0, 10);
    ctx.bezierCurveTo(10, 2, 5, -5, 0, 0);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function drawBranch(startX, startY, len, angle, branchWidth) {
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = "#5c3a21";
    ctx.lineWidth = branchWidth;
    ctx.lineCap = "round";
    ctx.translate(startX, startY);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();

    if (len < 10) {
      const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#c77dff', '#e63946'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      drawHeart(0, -len, Math.random() * 0.8 + 0.5, randomColor);
      ctx.restore();
      return;
    }

    setTimeout(() => {
      drawBranch(0, -len, len * 0.78, -15 + Math.random() * 10, branchWidth * 0.7);
      drawBranch(0, -len, len * 0.78, 15 - Math.random() * 10, branchWidth * 0.7);
    }, 40);

    ctx.restore();
  }

  // Iniciar árbol en la parte inferior derecha
  const startX = canvas.width * 0.65;
  const startY = canvas.height * 0.9;
  
  // Retraso ligero para garantizar que el navegador conozca el tamaño real de la pantalla
  setTimeout(() => {
    drawBranch(startX, startY, 110, 0, 12);
  }, 200);

  // --- EFECTO MÁQUINA DE ESCRIBIR ---

  const text = "Falta muy poco para tu cumpleaños, y no puedo esperar para celebrar tu día y llenarte de abrazos, besos y sorpresas.\n\nGracias por existir y hacerme tan feliz.\n\n¡Te amo! ❤️";
  let index = 0;

  function typeWriter() {
    const typedTextElem = document.getElementById("typed-text");
    if (typedTextElem && index < text.length) {
      typedTextElem.innerHTML += text.charAt(index);
      index++;
      setTimeout(typeWriter, 50);
    }
  }
  setTimeout(typeWriter, 800);

  // --- CONTADOR REGRESIVO ---

  const targetDate = new Date(2026, 7, 3, 0, 0, 0).getTime(); 

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