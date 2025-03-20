// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Load the maple leaf image
    const leafImage = new Image();
    leafImage.src = 'assets/maple-leaf-clipart-md.png'; // Update with the correct path to your image

    // Heart Particle class
    class HeartParticle {
        constructor() {
            this.size = Math.random() * 20 + 10; // Random size between 10 and 30
            this.x = Math.random() * (canvas.width - this.size);
            this.y = Math.random() * (canvas.height - this.size);
            this.speedY = Math.random() * 2 + 1; // Random downward speed
        }

        draw() {
            // Draw the maple leaf image
            ctx.drawImage(leafImage, this.x, this.y, this.size, this.size);
        }

        update() {
            this.y += this.speedY;

            // Reset position if it goes off the bottom
            if (this.y - this.size > canvas.height) {
                this.y = -this.size;
                this.x = Math.random() * (canvas.width - this.size);
            }
        }
    }

    // Create heart particles
    const hearts = [];
    function init() {
        for (let i = 0; i < 50; i++) {
            hearts.push(new HeartParticle());
        }
    }
    init();

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hearts.forEach(heart => {
            heart.update();
            heart.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
});