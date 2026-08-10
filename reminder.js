const params = new URLSearchParams(window.location.search);
const reminderText = params.get('message') || 'Time for your reminder';

document.getElementById('reminder-text').textContent = reminderText;

const dismissButton = document.getElementById('dismiss-button');
const closeButton = document.getElementById('close-button');
const popupShell = document.querySelector('.popup-shell');

dismissButton.addEventListener('click', () => {
  closeReminderWindow();
});

closeButton.addEventListener('click', () => {
  closeReminderWindow();
});

function closeReminderWindow() {
  if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage({ action: 'closeReminder' }, (response) => {
      if (!response || !response.closed) {
        hideReminder();
      }
    });
  } else {
    hideReminder();
  }
}

function hideReminder() {
  if (popupShell) {
    popupShell.innerHTML = '<div class="dismissed-message">Reminder closed</div>';
    popupShell.style.justifyContent = 'center';
  }
}
