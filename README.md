# Spydy Reminder

Spydy Reminder is a small Chrome extension that lets you schedule browser reminder notifications and open a fullscreen reminder window when the alarm triggers.

## Features

- Schedule reminders with a custom message and date/time
- Store reminders in browser local storage
- Show a notification when the reminder is due
- Open a fullscreen reminder window for extra visibility
- Clear individual reminders or all reminders at once
- Quick test button to verify reminder behavior

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** in the top-right corner
3. Click **Load unpacked**
4. Select the `spydyreminder-extension` folder
5. The extension should appear in your toolbar as **Spydy Reminder**

## Usage

1. Click the Spydy Reminder extension icon in the browser toolbar
2. Enter a reminder message
3. Choose a date and time for the reminder
4. Click **Set Reminder**
5. The reminder will appear in the upcoming list
6. When the reminder triggers, a notification appears and a reminder window opens

## Buttons

- **Set Reminder**: Save the reminder and create the alarm
- **Clear All**: Remove all stored reminders and cancel alarms
- **Test**: Schedule a test reminder for 5 seconds later

## Files

- `manifest.json` — Chrome extension metadata and permissions
- `background.js` — service worker that handles alarms and notifications
- `popup.html` — extension popup UI
- `popup.js` — popup behavior, reminder storage, and alarm creation
- `reminder.html` — fullscreen reminder page shown on alarm
- `reminder.js` — logic for the reminder display page
- `popup.css` / `reminder.css` — styling for popup and reminder page

## Notes

- Requires Chrome with manifest v3 support
- Uses `alarms`, `notifications`, and `storage` permissions

## License

This project is provided as-is.
