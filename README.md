# Gitaverse — Bhagavad Gita Retrieval System

> A **deterministic, hallucination-free** multilingual retrieval system for the Bhagavad Gita — serving all 18 chapters (~700 verses) with faithful verse matching across 97 languages.

---

## 🌟 Features

- **Faithful Verse Retrieval** — Exact-match lookup from a structured JSON corpus. No AI hallucination.
- **97 Languages** — Translate any verse into English, Hindi, Telugu, Tamil, Spanish, Arabic, Japanese, and 90+ more.
- **Text-to-Speech** — Browser-native audio playback of translated text in the correct language.
- **18 Chapters Browser** — Explore all chapters with Sanskrit names, verse counts, and descriptions.
- **Contact Form** — EmailJS-powered form to receive messages directly to your inbox.
- **Fully Responsive** — Works on desktop, tablet, and mobile phones.

---

## 🏗️ Architecture

```
gitaverse/
├── backend/                   # FastAPI Python backend
│   ├── backend.py             # Main API server
│   ├── requirements.txt       # Python dependencies
│   └── BhagavatGitaJsonFiles/ # Verse corpus (18 JSON files)
│
├── frontend/
│   └── DASHBOARD/             # Static frontend (deployed root)
│       ├── index.html         # Homepage
│       ├── style.css          # Global styles
│       ├── hamburger-menu.js  # Mobile nav
│       ├── hero.mp4           # Hero background video
│       └── BV/
│           ├── translation.html  # Verse translation page
│           ├── chapters.html     # 18 chapters browser
│           ├── script.js         # Translation + audio logic
│           ├── chapters.js       # Chapter card generator
│           └── style.css         # Scroll/translation styles
│
└── render.yaml                # Render deployment config
```

---

## 🚀 Deployment (Render)

This project is configured for **Render** via `render.yaml`.

| Service | Type | URL |
|---------|------|-----|
| Backend API | Python / FastAPI | `https://gitaversebackend.onrender.com` |
| Frontend | Static Site | `https://gitaverse.onrender.com` |

### Deploy Steps
1. Push to GitHub
2. Go to [render.com](https://render.com) → **New → Blueprint**
3. Connect your GitHub repo — Render auto-detects `render.yaml`
4. Both services deploy automatically

---

## 🛠️ Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn backend:app --reload --port 8000
```

### Frontend
```bash
cd frontend
python -m http.server 8080
# Open http://localhost:8080/DASHBOARD/index.html
```

---

## 🔌 API

### `POST /get-meaning`
Retrieves and translates the closest matching verse.

**Request:**
```json
{
  "shloka": "श्रीभगवानुवाच कुतस्त्वा",
  "language": "telugu"
}
```

**Response:**
```json
{
  "text": "శ్రీ భగవంతుడు పలికెను...",
  "audio_url": "/audio/abc123.mp3"
}
```

---

## 📦 Dependencies

### Backend
| Package | Purpose |
|---------|---------|
| `fastapi` | REST API framework |
| `uvicorn` | ASGI server |
| `pydantic` | Request validation |
| `gTTS` | Text-to-speech generation |
| `mtranslate` | Multilingual translation |

### Frontend
- Vanilla HTML / CSS / JavaScript
- [EmailJS](https://www.emailjs.com) — Contact form
- [Font Awesome](https://fontawesome.com) — Icons
- Google Fonts — Playfair Display, Inter, Cinzel

---

## 👥 Team — TeamXplore

| Name | Role |
|------|------|
| **Preetam Vamshi** | Project Lead — System Architect & Technical Lead |
| **Achyuth** | Frontend Developer |
| **Balaji** | Backend Developer |
| **Sandeep** | Frontend Developer |
| **Shankar** | UI/UX Design |

---

## 📄 License

Academic project — Bhagavad Gita Retrieval System © 2026 TeamXplore.
