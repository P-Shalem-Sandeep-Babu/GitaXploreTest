document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('divineForm');
    const outputSection = document.getElementById('outputSection');
    const outputText = document.getElementById('outputText');
    const audioBtn = document.getElementById('playAudioBtn');

    // Read URL parameters and populate the input field
    const urlParams = new URLSearchParams(window.location.search);
    const textParam = urlParams.get('text');
    if (textParam) {
        document.getElementById('userName').value = decodeURIComponent(textParam);
    }

    let currentMessage = "";

    // Create a single persistent hidden audio player once
    const audioPlayer = document.createElement("audio");
    audioPlayer.preload = "auto";
    document.body.appendChild(audioPlayer);

    // Single persistent click listener on the button
    audioBtn.addEventListener('click', () => {
        if (audioPlayer.src) {
            audioPlayer.currentTime = 0;
            audioPlayer.play().catch(err => console.error("Audio play error:", err));
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('userName').value;
        const lang = document.getElementById('userLanguage').value || 'english';

        // Disable button while waiting for response
        audioBtn.disabled = true;
        audioBtn.textContent = "⏳ Loading...";
        currentMessage = "";

        let data = null;
        try {
            const response = await fetch("https://gitaversebackend.onrender.com/get-meaning", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ shloka: name, language: lang })
            });
            data = await response.json();
            if (data.text) {
                currentMessage = data.text;
            }
        } catch (err) {
            console.error("FastAPI error:", err);
        }

        // Reveal the output section
        outputSection.style.visibility = 'visible';

        // Start Typewriter Animation, then glow the button when done
        const glowOnComplete = (data && data.audio_url) ? () => {
            audioBtn.classList.remove('btn-glow');
            void audioBtn.offsetWidth; // force reflow to restart animation
            audioBtn.classList.add('btn-glow');
            setTimeout(() => audioBtn.classList.remove('btn-glow'), 2000);
        } : null;

        typeWriter(currentMessage, outputText, glowOnComplete);

        // Enable button and load audio if backend returned audio_url
        if (data && data.audio_url) {
            audioPlayer.src = "https://gitaversebackend.onrender.com" + data.audio_url;
            audioBtn.disabled = false;
            audioBtn.textContent = "🔊 Listen";
        } else {
            // No audio available
            audioBtn.disabled = true;
            audioBtn.textContent = "🔊 Listen";
        }
    });

    function typeWriter(text, element, onComplete) {
        element.textContent = '';
        let i = 0;
        const speed = 50;
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else if (onComplete) {
                onComplete();
            }
        }
        type();
    }

    // --- Particle System for Dust Motes ---
    const canvas = document.getElementById('dustCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    let mouse = { x: null, y: null, radius: 100 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.depth = Math.random();

            if (this.depth > 0.6) {
                this.size = Math.random() * 2 + 1.5;
                this.speedMultiplier = 0.7;
                this.baseOpacity = 0.7;
            } else if (this.depth > 0.3) {
                this.size = Math.random() * 1.5 + 0.5;
                this.speedMultiplier = 0.4;
                this.baseOpacity = 0.5;
            } else {
                this.size = Math.random() * 1 + 0.2;
                this.speedMultiplier = 0.2;
                this.baseOpacity = 0.3;
            }

            this.speedX = (Math.random() - 0.5) * this.speedMultiplier;
            this.speedY = (Math.random() - 0.5) * this.speedMultiplier;
            this.opacity = this.baseOpacity;
            this.twinkleSpeed = Math.random() * 0.01 + 0.002;
            this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
        }

        update() {
            this.opacity += this.twinkleSpeed * this.twinkleDir;
            if (this.opacity >= this.baseOpacity + 0.2 || this.opacity >= 1) {
                this.opacity = Math.min(this.opacity, 1);
                this.twinkleDir = -1;
            } else if (this.opacity <= this.baseOpacity - 0.2 || this.opacity <= 0.1) {
                this.opacity = Math.max(this.opacity, 0.1);
                this.twinkleDir = 1;
            }

            if (mouse.x != null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius && distance > 0) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x += forceDirectionX * force * 2;
                    this.y += forceDirectionY * force * 2;
                }
            }

            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const particleCount = Math.min(window.innerWidth * 0.5, 400);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateParticles();
});