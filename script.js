// ========== Номер варіанту для API (замініть на свій номер у журналі) ==========
const VARIANT_NUMBER = 5;

// ========== 1. localStorage — інформація про ОС та браузер ==========
function collectBrowserInfo() {
  const info = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    languages: navigator.languages ? navigator.languages.join(', ') : 'N/A',
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio || 'N/A',
    hardwareConcurrency: navigator.hardwareConcurrency || 'N/A',
    maxTouchPoints: navigator.maxTouchPoints || 0,
    vendor: navigator.vendor,
    appName: navigator.appName,
    appVersion: navigator.appVersion,
  };
  return info;
}

function saveToLocalStorage(info) {
  const data = JSON.stringify(info, null, 2);
  localStorage.setItem('browserInfo', data);
}

function loadFromLocalStorage() {
  return localStorage.getItem('browserInfo');
}

function displayInFooter() {
  const info = collectBrowserInfo();
  saveToLocalStorage(info);
  const pre = document.getElementById('browser-info');
  const formatted = Object.entries(info)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  pre.textContent = formatted;
}

// ========== 2. API — коментарі з JSONPlaceholder ==========
async function fetchComments() {
  try {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${VARIANT_NUMBER}/comments`
    );
    if (!res.ok) throw new Error('Помилка запиту');
    const comments = await res.json();
    return comments;
  } catch (e) {
    console.error('Помилка завантаження коментарів:', e);
    return [];
  }
}

function renderComments(comments) {
  const container = document.getElementById('comments-container');
  if (!comments.length) {
    container.innerHTML = '<p class="loading">Коментарів не знайдено.</p>';
    return;
  }
  container.innerHTML = comments
    .map(
      (c) => `
    <div class="comment-card">
      <p class="comment-name">${escapeHtml(c.name)}</p>
      <p class="comment-email">${escapeHtml(c.email)}</p>
      <p class="comment-body">${escapeHtml(c.body)}</p>
    </div>
  `
    )
    .join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ========== 3. Модальне вікно після 1 хвилини ==========
const MODAL_DELAY_MS = 60 * 1000; // 1 хвилина

function showModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('visible');
}

function hideModal() {
  document.getElementById('modal-overlay').classList.remove('visible');
}

function setupModalTimer() {
  setTimeout(() => {
    showModal();
  }, MODAL_DELAY_MS);
}

// ========== 4. Тема дня/ночі ==========
const DAY_START = 7;  // 07:00
const DAY_END = 21;   // 21:00

function getCurrentHour() {
  return new Date().getHours();
}

function isDayTime() {
  const h = getCurrentHour();
  return h >= DAY_START && h < DAY_END;
}

function setTheme(isNight) {
  document.body.classList.toggle('night-mode', isNight);
  localStorage.setItem('themeOverride', isNight ? 'night' : 'day');
}

function applyTheme() {
  const override = localStorage.getItem('themeOverride');
  let isNight;
  if (override === 'day') isNight = false;
  else if (override === 'night') isNight = true;
  else isNight = !isDayTime();
  setTheme(isNight);
}

function toggleTheme() {
  const isNight = document.body.classList.toggle('night-mode');
  localStorage.setItem('themeOverride', isNight ? 'night' : 'day');
}

// ========== Лічильник відвідувань ==========
function updateVisitCount() {
  let count = parseInt(localStorage.getItem('visitCount') || '0', 10);
  count += 1;
  localStorage.setItem('visitCount', count);
  const el = document.getElementById('visit-count');
  if (el) el.textContent = count;
}

// ========== Ініціалізація ==========
document.addEventListener('DOMContentLoaded', async () => {
  updateVisitCount();
  displayInFooter();

  const comments = await fetchComments();
  renderComments(comments);

  setupModalTimer();

  applyTheme();

  document.getElementById('themeBtn').addEventListener('click', toggleTheme);

  document.getElementById('modalClose').addEventListener('click', hideModal);
  document
    .getElementById('modal-overlay')
    .addEventListener('click', (e) => {
      if (e.target.id === 'modal-overlay') hideModal();
    });

  // Перевірка часу для автоматичної теми кожну хвилину (якщо немає ручного вибору)
  setInterval(() => {
    if (!localStorage.getItem('themeOverride')) {
      setTheme(!isDayTime());
    }
  }, 60000);
});
