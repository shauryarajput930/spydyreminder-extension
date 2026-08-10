const form = document.getElementById('reminder-form');
const messageInput = document.getElementById('message');
const whenInput = document.getElementById('when');
const statusEl = document.getElementById('status');
const reminderList = document.getElementById('reminder-list');

const clearAllButton = document.getElementById('clear-all');
const quickTestButton = document.getElementById('quick-test');

document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 5);
  const localDateTime = now.toISOString().slice(0, 16);
  whenInput.value = localDateTime;
  loadReminders();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const message = messageInput.value.trim();
  const dueAt = new Date(whenInput.value).getTime();

  if (!message || Number.isNaN(dueAt)) {
    setStatus('Please enter both a message and a valid time.');
    return;
  }

  const reminder = {
    id: `reminder-${Date.now()}`,
    message,
    dueAt,
  };

  chrome.storage.local.set({ [reminder.id]: reminder }, () => {
    chrome.alarms.create(reminder.id, { when: dueAt });
    setStatus('Reminder saved.');
    form.reset();
    whenInput.value = new Date(Date.now() + 5 * 60000).toISOString().slice(0, 16);
    loadReminders();
  });
});

clearAllButton.addEventListener('click', () => {
  chrome.storage.local.get(null, (items) => {
    const reminderIds = Object.values(items)
      .filter((item) => item && item.id && item.message && item.dueAt)
      .map((reminder) => reminder.id);

    if (!reminderIds.length) {
      setStatus('No reminders to clear.');
      return;
    }

    chrome.storage.local.remove(reminderIds, () => {
      chrome.alarms.clearAll(() => {
        setStatus('All reminders cleared.');
        loadReminders();
      });
    });
  });
});

quickTestButton.addEventListener('click', () => {
  const reminder = {
    id: `reminder-test-${Date.now()}`,
    message: 'Spider-Man reminder test',
    dueAt: Date.now() + 5000,
  };

  chrome.storage.local.set({ [reminder.id]: reminder }, () => {
    chrome.alarms.create(reminder.id, { when: reminder.dueAt });
    setStatus('Test reminder set for 5 seconds.');
    loadReminders();
  });
});

function setStatus(message) {
  statusEl.textContent = message;
}

function loadReminders() {
  chrome.storage.local.get(null, (items) => {
    const reminders = Object.values(items)
      .filter((item) => item && item.id && item.message && item.dueAt)
      .sort((a, b) => a.dueAt - b.dueAt);

    if (!reminders.length) {
      reminderList.innerHTML = '<li class="empty">No reminders yet. Add one above.</li>';
      return;
    }

    reminderList.innerHTML = '';

    reminders.forEach((reminder) => {
      const item = document.createElement('li');
      item.className = 'reminder-item';
      item.innerHTML = `
        <div class="reminder-details">
          <span class="reminder-message">${escapeHtml(reminder.message)}</span>
          <span class="reminder-time">${new Date(reminder.dueAt).toLocaleString()}</span>
        </div>
        <button class="delete-btn" data-id="${reminder.id}">Delete</button>
      `;
      reminderList.appendChild(item);
    });
  });
}

reminderList.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('.delete-btn');
  if (!deleteButton) {
    return;
  }

  const id = deleteButton.getAttribute('data-id');
  chrome.storage.local.remove(id, () => {
    chrome.alarms.clear(id, () => {
      setStatus('Reminder removed.');
      loadReminders();
    });
  });
});

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
