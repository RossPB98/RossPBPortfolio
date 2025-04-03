// Create the top glow element
const topGlow = document.createElement('div');
topGlow.classList.add('top-glow');
document.body.appendChild(topGlow);

// Create the bottom glow element (new)
const bottomGlow = document.createElement('div');
bottomGlow.classList.add('bottom-glow');
document.body.appendChild(bottomGlow);

// Add this to your existing script.js
document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Set 'About' link as active on page load
    const aboutLink = document.querySelector('a[href="#about"]');
    if (aboutLink) {
        aboutLink.classList.add('active');
    }

    function updateActiveLink() {
        let current = '';
        const scrollPosition = window.scrollY;

        // If at top of page, set About as active
        if (scrollPosition < 1500) {
            current = 'about';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollPosition >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                }
            });
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Update active link on scroll
    window.addEventListener('scroll', updateActiveLink);

    // Update active link on page load
    updateActiveLink();

    // Add scroll animation observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});