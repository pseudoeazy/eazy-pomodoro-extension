import { Messages } from "../types/messages";
import { Focus } from "../types/settings";
import { TimerStatus } from "../types/time";
import {
  getStoredStatus,
  saveFocusSettings,
  saveNotes,
  setStoredStatus,
} from "../utils/storage";

const EAZY_POMODORO_TIMER = "EAZY_POMODORO_TIMER";

let startFocusAlarm = () => {
  chrome.alarms.get(EAZY_POMODORO_TIMER, (alarmExist) => {
    if (!alarmExist) {
      startFocusAlarm = () => {
        chrome.alarms.create(EAZY_POMODORO_TIMER, {
          periodInMinutes: 1 / 60,
        });
      };
    }
    startFocusAlarm();
  });
};

function stopFocusingAlarm() {
  const timer = 0;
  setStoredStatus(TimerStatus.DEFAULT).then(() => {
    chrome.storage.local.set({ timer }, function () {
      chrome.storage.local.get(["timer"], (result) => {
        console.log({ resetTimer: result.timer });
      });
    });
    chrome.alarms.clear(EAZY_POMODORO_TIMER);
  });
}

function showNotification(message: string) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon.png",
    title: EAZY_POMODORO_TIMER,
    message,
  });
}

chrome.runtime.onInstalled.addListener(() => {
  //add default settings
  chrome.storage.local.set({
    timer: 0,
    status: TimerStatus.DEFAULT,
  });

  saveFocusSettings({
    focusTimer: 1,
    focusTitle: "Hello, 25 minutes has passed!",
    focusDesktopNotification: true,
    focusTabNotification: true,
  });

  saveNotes([
    {
      id: Date.now(),
      title: "example task name",
      description: "example task description",
      isChecked: false,
    },
  ]);
});

chrome.alarms.onAlarm.addListener((alarmInfo) => {
  if (alarmInfo.name === EAZY_POMODORO_TIMER) {
    chrome.storage.local.get(["timer", "status", "focus"], (result) => {
      let status: TimerStatus = result.status;
      const focus: Focus = result.focus;

      if (status === TimerStatus.FOCUSING) {
        const timer = result.timer + 1;

        if (result.timer === 60 * Number(focus.focusTimer)) {
          status = TimerStatus.DEFAULT;
          if (focus.focusDesktopNotification) {
            showNotification(focus.focusTitle);
          }
        }
        chrome.storage.local.set({ timer });
      }

      if (status === TimerStatus.DEFAULT) {
        stopFocusingAlarm();
        chrome.runtime.sendMessage({ type: Messages.RESET_STATUS });
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            const activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {
              type: Messages.RESET_STATUS,
            });
          }
        );
      }
    });
  }
});

async function processTimerStatus(status: TimerStatus) {
  switch (status) {
    case TimerStatus.DEFAULT:
      stopFocusingAlarm();
      break;

    case TimerStatus.FOCUSING:
      startFocusAlarm();
      break;

    case TimerStatus.PAUSED:
      break;

    case TimerStatus.RESTING:
      break;
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === Messages.TIMER_STATUS) {
    processTimerStatus(msg.status);
    setStoredStatus(msg.status).then(() => {
      getStoredStatus().then((storedStatus) => sendResponse(storedStatus));
    });
    return true;
  }
});
