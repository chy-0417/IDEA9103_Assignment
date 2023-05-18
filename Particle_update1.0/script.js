const canvas = document.getElementById('playground');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const numParticles = 500;
const attractionDistance = 100;
const minRadius = 0.1;
const maxRadius = 10;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
    this.radius = 3;
    this.radiusDelta = Math.random() * 0.08 - 0.04;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
  }

  update(mouse) {
    this.x += this.vx;
    this.y += this.vy;

    if (mouse.x !== undefined && mouse.y !== undefined) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < attractionDistance) {
        this.vx += dx / distance;
        this.vy += dy / distance;
      }
    }

    if (this.x < 0 || this.x > canvas.width) {
      this.vx = -this.vx;
    }
    if (this.y < 0 || this.y > canvas.height) {
      this.vy = -this.vy;
    }

    // Change particle size randomly when no mouse interaction.
    if (mouse.x === undefined && mouse.y === undefined) {
      this.radius += this.radiusDelta;

      if (this.radius > maxRadius || this.radius < minRadius) {
        this.radiusDelta = -this.radiusDelta;
      }
    }
  }
}

for (let i = 0; i < numParticles; i++) {
  particles.push(new Particle());
}

const mouse = { x: undefined, y: undefined };

canvas.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

canvas.addEventListener('mouseout', () => {
  mouse.x = undefined;
  mouse.y = undefined;
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const particle of particles) {
    particle.update(mouse);
    particle.draw();
  }

  requestAnimationFrame(animate);
}

animate();
