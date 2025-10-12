"""
TechBharat.ai — Auto-Updating AI/Tech News Site in Hindi
---------------------------------------------------------
✅ Fetches top AI/Tech news every hour.
✅ Translates to Hindi (optional).
✅ Generates static HTML (index.html) automatically.
✅ Ready for GitHub Pages / Netlify / Vercel deployment.
---------------------------------------------------------
Requires: pip install requests
Optional: Add Google Translate API for Hindi translation.
"""

import os, requests, time, datetime, html, hashlib

# --- CONFIGURATION ---
SITE_TITLE = "TechBharat.ai — AI & टेक न्यूज़ (हिंदी)"
NEWSAPI_KEY = os.getenv("NEWSAPI_KEY") or "YOUR_NEWSAPI_KEY"  # Add your key
OUTPUT_FILE = "index.html"
MAX_NEWS = 10
AUTO_TRANSLATE = False  # Set True if using Google Translate API
TRANSLATE_API_KEY = os.getenv("TRANSLATE_API_KEY")

# --- FUNCTIONS ---

def fetch_news():
    """Fetch AI/Tech headlines from NewsAPI"""
    url = "https://newsapi.org/v2/top-headlines"
    params = {
        "q": "AI OR Artificial Intelligence OR Tech OR Machine Learning",
        "language": "en",
        "pageSize": MAX_NEWS,
        "apiKey": NEWSAPI_KEY,
    }
    r = requests.get(url, params=params, timeout=15)
    r.raise_for_status()
    data = r.json()
    return data.get("articles", [])


def translate_text(text, target="hi"):
    """Optional: translate English → Hindi"""
    if not AUTO_TRANSLATE or not TRANSLATE_API_KEY:
        return text
    try:
        resp = requests.post(
            "https://translation.googleapis.com/language/translate/v2",
            params={"key": TRANSLATE_API_KEY},
            json={"q": text, "target": target},
        )
        return resp.json()["data"]["translations"][0]["translatedText"]
    except Exception:
        return text


def summarize(article):
    """Make short summary (basic)."""
    desc = article.get("description") or ""
    if not desc:
        desc = article.get("title") or ""
    if len(desc) > 250:
        desc = desc[:247] + "..."
    return desc


def generate_html(articles):
    """Generate HTML file."""
    date = datetime.datetime.now().strftime("%d %B %Y, %I:%M %p")
    html_content = f"""<!doctype html>
<html lang="hi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{SITE_TITLE}</title>
<meta name="description" content="TechBharat.ai - ताज़ा AI और टेक खबरें, गाइड और रिव्यू — हिंदी में।">
<style>
body{{font-family:system-ui,-apple-system,Segoe UI,Roboto,'Noto Sans Devanagari',sans-serif;background:#f7f7f7;margin:0;padding:0;color:#111}}
header{{background:#0f172a;color:white;padding:20px;text-align:center}}
.container{{max-width:900px;margin:auto;padding:20px}}
.card{{background:white;margin-bottom:16px;padding:16px;border-radius:10px;box-shadow:0 2px 6px rgba(0,0,0,0.08)}}
.card h2{{margin:0 0 8px 0;font-size:20px}}
.card p{{font-size:15px;line-height:1.6}}
footer{{background:#0f172a;color:white;text-align:center;padding:20px;margin-top:40px;font-size:14px}}
a{{color:#2563eb;text-decoration:none}}
.meta{{color:#555;font-size:13px;margin-bottom:8px}}
</style>
</head>
<body>
<header>
<h1>{SITE_TITLE}</h1>
<p>ताज़ा अपडेट: {date}</p>
</header>
<div class="container">
"""
    for art in articles:
        title = html.escape(art.get("title", ""))
        url = art.get("url", "#")
        src = art.get("source", {}).get("name", "")
        published = art.get("publishedAt", "")[:10]
        summary = html.escape(translate_text(summarize(art)))
        title_hi = html.escape(translate_text(title))
        html_content += f"""
        <div class="card">
          <h2><a href="{url}" target="_blank">{title_hi}</a></h2>
          <div class="meta">{src} · {published}</div>
          <p>{summary}</p>
          <p><a href="{url}" target="_blank">पूरा लेख पढ़ें →</a></p>
        </div>
        """
    html_content += """
</div>
<footer>
© 2025 TechBharat.ai — अपडेट हर घंटे · Developed by TechBharat Bot
</footer>
</body>
</html>
"""
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(html_content)
    print("✅ Site updated:", OUTPUT_FILE)


def main():
    print("⏳ Fetching latest AI news...")
    try:
        articles = fetch_news()
        if not articles:
            print("No new articles found.")
            return
        generate_html(articles)
    except Exception as e:
        print("❌ Error:", e)


if __name__ == "__main__":
    main()
