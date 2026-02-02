function baseUrl() {
  return `${window.location.origin}${window.location.pathname.replace(/\/index\.html$/, "").replace(/\/$/, "")}`;
}

function apiBase() {
  return baseUrl();
}

async function getJson(path) {
  const url = `${apiBase()}${path}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

function setEndpointLinks() {
  const b = apiBase();
  document.getElementById("charsUrl").href = `${b}/api/v1/characters.json`;
  document.getElementById("quotesUrl").href = `${b}/api/v1/quotes.json`;
  document.getElementById("episodesUrl").href = `${b}/api/v1/episodes.json`;

  document.getElementById("charsUrl").textContent = `GET ${b}/api/v1/characters.json`;
  document.getElementById("quotesUrl").textContent = `GET ${b}/api/v1/quotes.json`;
  document.getElementById("episodesUrl").textContent = `GET ${b}/api/v1/episodes.json`;
}

async function loadCharacters() {
  const out = document.getElementById("out");
  const list = document.getElementById("charList");
  out.textContent = "Loading characters...";
  list.innerHTML = "";

  const chars = await getJson("/api/v1/characters.json");
  out.textContent = pretty(chars);

  for (const c of chars) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = `${c.name} (${c.id})`;
    a.addEventListener("click", async (e) => {
      e.preventDefault();
      const detail = await getJson(c.href);
      out.textContent = pretty(detail);
    });
    li.appendChild(a);
    list.appendChild(li);
  }
}

async function randomQuote() {
  const out = document.getElementById("out");
  out.textContent = "Loading quotes...";
  const quotes = await getJson("/api/v1/quotes.json");
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  out.textContent = pretty(q);
}

document.addEventListener("DOMContentLoaded", () => {
  setEndpointLinks();
  document.getElementById("btnLoadChars").addEventListener("click", () => loadCharacters().catch(e => {
    document.getElementById("out").textContent = `Error: ${e.message}`;
  }));
  document.getElementById("btnRandomQuote").addEventListener("click", () => randomQuote().catch(e => {
    document.getElementById("out").textContent = `Error: ${e.message}`;
  }));
});
