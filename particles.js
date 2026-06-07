document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("neuron-canvas");
    const ctx = canvas.getContext("2d");

    let width, height;
    let particles = [];
    
    // Configurable settings
    const config = {
        particleCount: 120, // Number of neurons
        maxDistance: 150,   // Distance to draw connections
        baseColor: "56, 189, 248", // RGB for var(--accent) #38bdf8
        speedScale: 0.5
    };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.z = Math.random() * 2 + 0.5; // Simulate 3D depth (size and speed multiplier)
            
            // Random direction
            const angle = Math.random() * Math.PI * 2;
            const speed = (Math.random() * 1.5 + 0.5) * config.speedScale;
            this.vx = Math.cos(angle) * speed / this.z;
            this.vy = Math.sin(angle) * speed / this.z;
            
            this.radius = 2 * this.z;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges smoothly
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${config.baseColor}, ${0.4 * this.z})`;
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        // Clear screen with a slight trail effect or just clear
        ctx.clearRect(0, 0, width, height);

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < config.maxDistance) {
                    ctx.beginPath();
                    // Thicker/more opaque lines for closer particles to simulate 3D focus
                    const opacity = (1 - dist / config.maxDistance) * 0.5;
                    ctx.strokeStyle = `rgba(${config.baseColor}, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener("resize", () => {
        resize();
    });

    init();
    animate();
});
