const canvas = document.getElementById('fluid-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let mouse = {
    x: width / 2,
    y: height / 2,
    vx: 0,
    vy: 0,
    lastX: width / 2,
    lastY: height / 2
};

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
});

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.vx = mouse.x - mouse.lastX;
    mouse.vy = mouse.y - mouse.lastY;
    mouse.lastX = mouse.x;
    mouse.lastY = mouse.y;
});

window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.vx = mouse.x - mouse.lastX;
        mouse.vy = mouse.y - mouse.lastY;
        mouse.lastX = mouse.x;
        mouse.lastY = mouse.y;
    }
}, { passive: true });

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseRadius = Math.random() * 80 + 40; 
        this.radius = this.baseRadius;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        
    
        const colors = [
            'rgba(147, 51, 234, 0.4)',  
            'rgba(21, 0, 255, 0.5)',   
            'rgba(231, 19, 19, 0.3)', 
            'rgba(255, 255, 255, 0.25)'  
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        if (this.x - this.radius < 0 || this.x + this.radius > width) this.vx *= -1;
        if (this.y - this.radius < 0 || this.y + this.radius > height) this.vy *= -1;
        this.x += this.vx;
        this.y += this.vy;
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.hypot(dx, dy);

        if (distance < 300) {
            let force = (300 - distance) / 300;
            this.x -= (dx / distance) * force * mouse.vx * 0.5;
            this.y -= (dy / distance) * force * mouse.vy * 0.5;
            
            this.radius = this.baseRadius + force * 30;
        } else {
            if (this.radius > this.baseRadius) this.radius -= 1;
        }
    }

    draw() {
        ctx.beginPath();
        let gradient = ctx.createRadialGradient(this.x, this.y, this.radius * 0.1, this.x, this.y, this.radius);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(11, 2, 20, 0)');
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

let particles = [];
function initParticles() {
    particles = [];
    const numberOfParticles = Math.floor((width * height) / 30000);
    for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;
        particles.push(new Particle(x, y));
    }
}

function animate() {
    ctx.fillStyle = 'rgba(11, 2, 20, 0.08)'; 
    ctx.fillRect(0, 0, width, height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    mouse.vx *= 0.95;
    mouse.vy *= 0.95;

    requestAnimationFrame(animate);
}

initParticles();
animate();