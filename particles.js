// Declare leaves array in global scope
window.leaves = [];

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

    // Maple Leaf Colors
    const leafColors = [
        '#F7B155', 
        '#F79039',  
        '#FD6E10',  
        '#FD6E10',  
        '#DE300B',
        '#C40806'
    ];

    // Maple Leaf Particle class
    class MapleLeaf {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -50;
            this.size = Math.random() * 20 + 10;
            this.speedY = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = Math.random() * 0.1 - 0.05;
            this.color = leafColors[Math.floor(Math.random() * leafColors.length)];
            this.opacity = Math.random() * 0.7 + 0.3;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            // Draw a simple maple leaf shape
            ctx.beginPath();
            ctx.moveTo(0, -this.size/2);
            ctx.quadraticCurveTo(this.size/2, 0, 0, this.size/2);
            ctx.quadraticCurveTo(-this.size/2, 0, 0, -this.size/2);
            
            ctx.fillStyle = this.color;
            ctx.fill();
            
            ctx.restore();
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;

            // Reset leaf when it goes off screen
            if (this.y > canvas.height + 50) {
                this.reset();
            }
        }
    }

    // Create maple leaves
    function init() {
        // Clear the leaves array first
        window.leaves = [];
        // Amount of leaves to appear
        for (let i = 0; i < 75; i++) {
            window.leaves.push(new MapleLeaf());
        }
    }
    init();

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        window.leaves.forEach(leaf => {
            leaf.update();
            leaf.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
});