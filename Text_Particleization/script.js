const canvas = document.getElementById('playground');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const numParticles = 1000;
const attractionDistance = 100;

const text = 'Hello!';
const fontSize = 180;

ctx.font = `${fontSize}px Arial`;
const textWidth = ctx.measureText(text).width;
const textX = (canvas.width - textWidth) / 2;
const textY = (canvas.height - fontSize) / 2;

ctx.fillText(text, textX, textY);
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
    this.radius = 2;
    this.originalX = x;
    this.originalY = y;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
  }

  update(mouse) {
    if (mouse.x !== undefined && mouse.y !== undefined) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < attractionDistance) {
        this.vx += dx / distance;
        this.vy += dy / distance;
      } else {
        this.vx += (this.originalX - this.x) / 1000;
        this.vy += (this.originalY - this.y) / 1000;
      }
    }

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

for (let y = 0; y < canvas.height; y++) {
  for (let x = 0; x < canvas.width; x++) {
    const alpha = imageData.data[(y * canvas.width + x) * 4 + 3];
    if (alpha > 128) {
      particles.push(new Particle(x, y));
    }
  }
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
