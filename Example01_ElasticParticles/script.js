const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const numParticles = 100;
const maxDistance = 200;
const mouse = { x: undefined, y: undefined };

canvas.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

canvas.addEventListener('mouseout', () => {
  mouse.x = undefined;
  mouse.y = undefined;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
    this.radius = 3;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) {
      this.vx = -this.vx;
    }
    if (this.y < 0 || this.y > canvas.height) {
      this.vy = -this.vy;
    }
  }
}

function connectParticles(p1, p2, mouseInfluence = false) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const modifiedMaxDistance = mouseInfluence ? maxDistance / 2 : maxDistance;

  if (distance < modifiedMaxDistance) {
    ctx.strokeStyle = `rgba(51, 51, 51, ${1 - distance / modifiedMaxDistance})`;
    ctx.lineWidth = mouseInfluence ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }
}

for (let i = 0; i < numParticles; i++) {
  particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const particle of particles) {
    particle.update();
    particle.draw();
  }

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      connectParticles(particles[i], particles[j]);
    }
    if (mouse.x !== undefined && mouse.y !== undefined) {
      connectParticles(particles[i], mouse, true);
    }
  }

  requestAnimationFrame(animate);
}

animate();
