chrome.runtime.onInstalled.addListener(() => {
  console.log('Spydy Reminder extension installed');
});

chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.storage.local.get([alarm.name], (result) => {
    const reminder = result[alarm.name];
    if (!reminder) {
      return;
    }

    chrome.notifications.create(reminder.id, {
      type: 'image',
      iconUrl: chrome.runtime.getURL('images/logo.png'),
      title: 'Spydy Reminder',
      message: reminder.message || 'You have a reminder ready.',
      imageUrl: chrome.runtime.getURL('images/spider-man-coming-down.png'),
      priority: 2,
      requireInteraction: true,
    });

    chrome.windows.create({
      url: chrome.runtime.getURL(`reminder.html?message=${encodeURIComponent(reminder.message)}`),
      type: 'normal',
      state: 'fullscreen',
    });

    chrome.storage.local.remove(alarm.name);
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.action === 'closeReminder') {
    const closeWindow = (windowId) => {
      if (windowId != null) {
        chrome.windows.remove(windowId, () => {
          sendResponse({ closed: true });
        });
      } else {
        sendResponse({ closed: false });
      }
    };

    if (sender && sender.tab && sender.tab.windowId != null) {
      closeWindow(sender.tab.windowId);
      return true;
    }

    chrome.windows.getCurrent((currentWindow) => {
      closeWindow(currentWindow ? currentWindow.id : null);
    });
    return true;
  }
});
