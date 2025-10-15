# AI Audio-Visual News Portal — React Project (Ready-to-run ZIP)

This version is packaged for immediate download and use. Just extract the ZIP, open a terminal in the extracted folder, and run `npm install` followed by `npm start`.

---

## ZIP Folder Structure

```
ai-news-portal-react/
├── package.json
├── public/
│   └── index.html
└── src/
    ├── index.js
    ├── App.js
    └── index.css
```

---

### package.json

```json
{
  "name": "ai-news-portal",
  "version": "1.0.0",
  "private": true,
  "homepage": "https://piyaldasofficial2025-source.github.io/ai-news-portal",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  },
  "devDependencies": {
    "gh-pages": "^5.0.0"
  }
}
```

---

### public/index.html

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>AI Audio-Visual Global News Portal</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

---

### src/index.js

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

---

### src/index.css

```css
:root{--bg:#f3f4f6;--card:#fff;--accent:#2563eb;--muted:#6b7280}
*{box-sizing:border-box}
body{font-family:Inter,Arial,Helvetica,sans-serif;margin:0;background:var(--bg);color:#111}
header{background:#000;color:#fff;padding:18px;text-align:center}
.controls{margin-top:10px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
button{border:0;cursor:pointer;border-radius:8px;padding:8px 12px;font-size:14px}
.lang{background:#e5e7eb;color:#111}
.lang.active{background:var(--accent);color:#fff}
.refresh{background:#10b981;color:#fff}
.container{max-width:1100px;margin:18px auto;display:grid;grid-template-columns:2fr 1fr;gap:16px;padding:12px}
main, aside{background:var(--card);border-radius:12px;padding:16px;box-shadow:0 6px 18px rgba(0,0,0,0.06)}
article{border-bottom:1px solid #eee;padding-bottom:12px;margin-bottom:12px}
iframe{width:100%;height:250px;border-radius:8px;border:0}
.error{background:#ef4444;color:#fff;padding:10px;text-align:center;border-radius:8px;margin:12px auto;max-width:1100px}
.loader{color:var(--muted);text-align:center;padding:20px}
a.read{color:var(--accent);text-decoration:underline;margin-left:8px}
```

---

### src/App.js

```javascript
import React, { useEffect, useState } from 'react';

export default function App() {
  const [lang, setLang] = useState('en');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updated, setUpdated] = useState('—');

  const endpoints = {
    en: 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://feeds.bbci.co.uk/news/rss.xml'),
    hi: 'https://newsdata.io/api/1/news?apikey=pub_fefd285deecd4e7cbb8dd38b5923adb1&language=hi',
    ta: 'https://newsdata.io/api/1/news?apikey=pub_fefd285deecd4e7cbb8dd38b5923adb1&language=ta'
  };

  const liveEmbeds = {
    en: 'https://www.bbc.com/news/av/embed/p08t2g54/53999932',
    hi: 'https://www.tv9hindi.com/live-tv',
    ta: 'https://www.24x7liveindia.com/embed/puthiyathalaimurai'
  };

  useEffect(() => {
    fetchNews();
    const id = setInterval(fetchNews, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, [lang]);

  async function fetchNews() {
    setLoading(true); setError(''); setArticles([]);
    try {
      const res = await fetch(endpoints[lang]);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const list = (data.results || data.items || []).slice(0, 10).map(a => ({
        title: a.title || a.heading || 'Untitled',
        description: a.description || a.content || '',
        link: a.link || a.url || ''
      }));
      if (!list.length) throw new Error('No articles found');
      setArticles(list);
      setUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      setError('Failed to load news: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) { alert('TTS not supported'); return; }
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === 'hi' ? 'hi-IN' : (lang === 'ta' ? 'ta-IN' : 'en-US');
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(utter.lang)) || voices.find(v => v.lang.includes('en')) || voices[0];
    if (voice) utter.voice = voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  return (
    <div>
      <header>
        <h1>AI Audio-Visual Global News Portal</h1>
        <div className="controls">
          <button className={`lang ${lang==='en'?'active':''}`} onClick={() => setLang('en')}>English</button>
          <button className={`lang ${lang==='hi'?'active':''}`} onClick={() => setLang('hi')}>हिन्दी</button>
          <button className={`lang ${lang==='ta'?'active':''}`} onClick={() => setLang('ta')}>தமிழ்</button>
          <button className="refresh" onClick={fetchNews}>🔄 Refresh</button>
        </div>
      </header>
      {error && <div className="error">{error}</div>}
      <div className="container">
        <main>
          {loading ? <div className="loader">Loading news…</div> : (
            articles.map((a,i) => (
              <article key={i}>
                <h3>{a.title}</h3>
                <p dangerouslySetInnerHTML={{__html:a.description}}></p>
                <div style={{display:'flex',gap:8}}>
                  <button style={{background:'#2563eb',color:'#fff'}} onClick={() => speak(a.title + '. ' + a.description)}>🔊 Listen Full</button>
                  {a.link && <a className="read" href={a.link} target="_blank" rel="noreferrer">Read more</a>}
                </div>
              </article>
            ))
          )}
        </main>
        <aside>
          <h4>Live Video</h4>
          <iframe title="live" src={liveEmbeds[lang]} allowFullScreen></iframe>
          <div style={{marginTop:12,color:'#6b7280',textAlign:'center'}}>Last updated: {updated}</div>
        </aside>
      </div>
    </div>
  );
}
```

---

### Instructions

1. Extract the ZIP file to your computer.
2. Open a terminal in the folder and run:
   ```bash
   npm install
   npm start
   ```
3. The app will open automatically in your browser at `http://localhost:3000`.
4. To build and deploy:
   ```bash
   npm run build
   npm run deploy
   ```
