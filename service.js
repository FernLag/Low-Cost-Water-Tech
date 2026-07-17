const CACHE_NAME = "nodeflow-cache-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./main.js",
  "./styles.css",
  "./NodeFlow_image.png",
  "./consent.pdf",
];

const DB_NAME = "nodeflow-queue";
const STORE = "submissions";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, {
        keyPath: "id",
        autoIncrement: true,
      });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function queueSubmission(payload) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).add({ payload, ts: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getAllSubmissions() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function deleteSubmission(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

const SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbzBDJalu2LdNU2UC-ySZJlxW5dh_3Djhq73sBU4JycPbOGjfBLdSuepAJs9jiIKUH1uUw/exec";

async function flushQueue() {
  const items = await getAllSubmissions();
  for (const item of items) {
    try {
      await fetch(SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(item.payload),
      });
      await deleteSubmission(item.id);
    } catch (_) {
      break;
    }
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.allSettled(APP_SHELL.map((url) => cache.add(url))),
      ),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.url.startsWith("https://script.google.com/")) {
    event.respondWith(
      fetch(request.clone()).catch(async () => {
        try {
          const payload = await request.clone().json();
          await queueSubmission(payload);
        } catch (_) {}
        return new Response(JSON.stringify({ queued: true }), {
          headers: { "Content-Type": "application/json" },
        });
      }),
    );
    return;
  }

  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((resp) => {
          if (resp.ok && new URL(request.url).origin === self.location.origin) {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return resp;
        })
        .catch(() => cached);
    }),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "flush-queue") {
    event.waitUntil(flushQueue());
  }
  if (event.data === "skip-waiting") {
    self.skipWaiting();
  }
});

self.addEventListener("sync", (event) => {
  if (event.tag === "flush-queue") {
    event.waitUntil(flushQueue());
  }
});
