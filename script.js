// --- Custom Ghost Cursor Trail Effect ---
const cursorTrail = document.querySelector('[data-cursor-trail]');
const dots = document.querySelectorAll('.cursor-dot');

let mouseX = 0, mouseY = 0;
// Array to store positions for each dot
const positions = Array.from({ length: dots.length }, () => ({ x: 0, y: 0 }));

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorTrail.classList.add('active'); // Show dots on move
});

function animateCursor() {
    // Lead dot follows mouse closely
    positions[0].x += (mouseX - positions[0].x) * 0.3;
    positions[0].y += (mouseY - positions[0].y) * 0.3;

    // Each subsequent dot follows the one before it
    for (let i = 1; i < dots.length; i++) {
        // Higher ease makes the tail tighter; lower makes it loose
        const ease = 0.5;
        positions[i].x += (positions[i - 1].x - positions[i].x) * ease;
        positions[i].y += (positions[i - 1].y - positions[i].y) * ease;
    }

    // Apply positions and scale down the tail
    dots.forEach((dot, index) => {
        dot.style.left = `${positions[index].x}px`;
        dot.style.top = `${positions[index].y}px`;
        // Make the tail progressively smaller
        const scale = (dots.length - index) / dots.length;
        dot.style.transform = `translate(-50%, -50%) scale(${scale})`;
    });

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Show/Hide interactions for cursor
document.addEventListener('mouseleave', () => cursorTrail.classList.remove('active'));
document.addEventListener('mouseenter', () => cursorTrail.classList.add('active'));

// --- 3D Hover Tilt Effect ---
const tiltCards = document.querySelectorAll('[data-tilt]');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();

        // Calculate mouse position relative to card center
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Intensity of tilt
        const multiplier = 20;

        const rotateX = (-y / rect.height) * multiplier;
        const rotateY = (x / rect.width) * multiplier;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        // Add ambient glow effect moving with cursor
        const glowX = ((e.clientX - rect.left) / rect.width) * 100;
        const glowY = ((e.clientY - rect.top) / rect.height) * 100;

        card.style.background = `
            radial-gradient(
                circle at ${glowX}% ${glowY}%, 
                rgba(255, 255, 255, 0.08) 0%, 
                rgba(255, 255, 255, 0.02) 40%, 
                rgba(255, 255, 255, 0.01) 100%
            )
        `;
    });

    card.addEventListener('mouseleave', () => {
        // Reset transform and background
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.background = 'var(--glass-bg)';
    });
});

// --- Scroll Reveal Animations ---
const revealElements = document.querySelectorAll('.reveal');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Reveal once
        }
    });
}, observerOptions);

revealElements.forEach(el => observer.observe(el));

// Trigger reveal for elements instantly on screen (like hero)
setTimeout(() => {
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('active');
        }
    });
}, 100);
