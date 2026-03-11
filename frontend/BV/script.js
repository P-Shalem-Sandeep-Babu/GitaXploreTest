document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('divineForm');
    const outputSection = document.getElementById('outputSection');
    const outputText = document.getElementById('outputText');
    const audioBtn = document.getElementById('playAudioBtn');

    const urlParams = new URLSearchParams(window.location.search);
    const textParam = urlParams.get('text');
    if (textParam) {
        document.getElementById('userName').value = decodeURIComponent(textParam);
    }

    let currentMessage = "";
    let selectedLang = "en-US";

    const speechLangMap = {
        "english": "en-US", "hindi": "hi-IN", "telugu": "te-IN", "tamil": "ta-IN",
        "kannada": "kn-IN", "malayalam": "ml-IN", "marathi": "mr-IN", "bengali": "bn-IN",
        "gujarati": "gu-IN", "urdu": "ur-PK", "arabic": "ar-SA", "french": "fr-FR",
        "german": "de-DE", "spanish": "es-ES", "portuguese": "pt-PT", "russian": "ru-RU",
        "japanese": "ja-JP", "korean": "ko-KR", "chinese_simplified": "zh-CN",
        "chinese_traditional": "zh-TW", "italian": "it-IT", "dutch": "nl-NL",
        "turkish": "tr-TR", "polish": "pl-PL", "swedish": "sv-SE", "norwegian": "no-NO",
        "danish": "da-DK", "finnish": "fi-FI", "greek": "el-GR", "hebrew": "he-IL",
        "indonesian": "id-ID", "malay": "ms-MY", "thai": "th-TH", "vietnamese": "vi-VN",
        "romanian": "ro-RO", "hungarian": "hu-HU", "czech": "cs-CZ", "ukrainian": "uk-UA"
    };

    audioBtn.addEventListener('click', () => {
        if (!currentMessage) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentMessage);
        utterance.lang = selectedLang;
        utterance.rate = 0.88;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('userName').value;
        const lang = document.getElementById('userLanguage').value || 'english';
        selectedLang = speechLangMap[lang] || "en-US";

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
            if (data.text) currentMessage = data.text;
        } catch (err) {
            console.error("FastAPI error:", err);
        }

        outputSection.style.visibility = 'visible';

        typeWriter(currentMessage, outputText, () => {
            if (currentMessage) {
                audioBtn.disabled = false;
                audioBtn.textContent = "🔊 Listen";
                audioBtn.classList.remove('btn-glow');
                void audioBtn.offsetWidth;
                audioBtn.classList.add('btn-glow');
                setTimeout(() => audioBtn.classList.remove('btn-glow'), 2000);
            }
        });
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

    const canvas = document.getElementById('dustCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 100 };

    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

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
            if (this.depth > 0.6) { this.size = Math.random() * 2 + 1.5; this.speedMultiplier = 0.7; this.baseOpacity = 0.7; }
            else if (this.depth > 0.3) { this.size = Math.random() * 1.5 + 0.5; this.speedMultiplier = 0.4; this.baseOpacity = 0.5; }
            else { this.size = Math.random() * 1 + 0.2; this.speedMultiplier = 0.2; this.baseOpacity = 0.3; }
            this.speedX = (Math.random() - 0.5) * this.speedMultiplier;
            this.speedY = (Math.random() - 0.5) * this.speedMultiplier;
            this.opacity = this.baseOpacity;
            this.twinkleSpeed = Math.random() * 0.01 + 0.002;
            this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
        }
        update() {
            this.opacity += this.twinkleSpeed * this.twinkleDir;
            if (this.opacity >= this.baseOpacity + 0.2 || this.opacity >= 1) { this.opacity = Math.min(this.opacity, 1); this.twinkleDir = -1; }
            else if (this.opacity <= this.baseOpacity - 0.2 || this.opacity <= 0.1) { this.opacity = Math.max(this.opacity, 0.1); this.twinkleDir = 1; }
            if (mouse.x != null) {
                let dx = this.x - mouse.x, dy = this.y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius && dist > 0) {
                    this.x += (dx / dist) * ((mouse.radius - dist) / mouse.radius) * 2;
                    this.y += (dy / dist) * ((mouse.radius - dist) / mouse.radius) * 2;
                }
            }
            this.x += this.speedX; this.y += this.speedY;
            if (this.x < 0) this.x = canvas.width; if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height; if (this.y > canvas.height) this.y = 0;
        }
        draw() {
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(window.innerWidth * 0.5, 400);
        for (let i = 0; i < count; i++) particles.push(new Particle());
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