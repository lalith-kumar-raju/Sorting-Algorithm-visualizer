const themeToggle = document.getElementById('themeToggle');

// Always set dark theme as default, ignoring saved preference
document.documentElement.setAttribute('data-theme', 'dark');
localStorage.setItem('theme', 'dark');

function createStars() {
    const starCount = 150;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;

        const size = Math.random() * 3 + 0.5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        const delay = Math.random() * 4;
        const duration = 2 + Math.random() * 3;
        star.style.animationDelay = `${delay}s`;
        star.style.animationDuration = `${duration}s`;

        const brightness = 0.5 + Math.random() * 0.5;
        star.style.opacity = brightness;

        document.body.appendChild(star);
    }
}

// Initialize elements
createStars();

// Update theme toggle to handle clouds
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Replace the existing cursor trail script with this:
function createCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';

    cursor.appendChild(ring);
    cursor.appendChild(dot);
    document.body.appendChild(cursor);

    return cursor;
}

function createParticle(x, y, theme) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Smaller particles for better performance with increased count
    const size = Math.random() * 8 + 3;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    const angle = Math.random() * 360;
    const distance = Math.random() * 120 + 60; // Increased distance
    const duration = Math.random() * 0.6 + 0.4; // Slightly faster animation

    particle.style.animation = `particleFade ${duration}s ease-out forwards`;

    const rad = angle * Math.PI / 180;
    const vx = Math.cos(rad) * distance;
    const vy = Math.sin(rad) * distance;

    particle.style.transform = 'translate(-50%, -50%)';

    requestAnimationFrame(() => {
        particle.style.transform = `translate(${vx}px, ${vy}px) scale(0) rotate(${angle + 360}deg)`;
    });

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), duration * 1000);
}

// Create multiple particles per emission
function createParticleBurst(x, y, count) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            createParticle(
                x + (Math.random() * 10 - 5),
                y + (Math.random() * 10 - 5)
            );
        }, i * 15); // Stagger particle creation
    }
}

let lastX = 0;
let lastY = 0;
let lastEmitTime = 0;

// Update the cursor trail initialization to check for mobile devices
function isMobileDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
}

// Only initialize cursor effects if not on mobile
if (!isMobileDevice()) {
    const cursor = createCustomCursor();
    let isHovering = false;

    document.addEventListener('mousemove', (e) => {
        const currentTime = Date.now();

        // Update custom cursor position
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;

        // Calculate speed for cursor scale effect
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const speed = Math.sqrt(dx * dx + dy * dy);
        const scale = Math.min(1 + speed * 0.01, 1.5);

        cursor.style.transform = `translate(-50%, -50%) scale(${scale})`;

        // Emit particles more frequently and in larger numbers
        if (currentTime - lastEmitTime > 30) {
            const particleCount = Math.min(Math.floor(speed), 8);
            createParticleBurst(e.clientX, e.clientY, particleCount);
            lastEmitTime = currentTime;
        }

        lastX = e.clientX;
        lastY = e.clientY;
    });

    // Add hover effects for interactive elements
    document.querySelectorAll('a, button').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            isHovering = true;
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            isHovering = false;
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
}

document.addEventListener("keydown", function (event) {

    if (event.ctrlKey) {

        event.preventDefault();

    }

    if (event.keyCode == 123) {

        event.preventDefault();

    }

})
document.addEventListener('contextmenu',

    event => event.preventDefault()

)