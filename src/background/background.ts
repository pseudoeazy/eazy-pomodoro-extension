import { Messages } from "../types/messages";
import { Focus } from "../types/settings";
import { TimerStatus } from "../types/time";
import {
  getFocusSettings,
  getStoredStatus,
  saveFocusSettings,
  saveNotes,
  setStoredStatus,
} from "../utils/storage";

const EAZY_POMODORO_TIMER = "EAZY_POMODORO_TIMER";

function startFocusAlarm() {
  chrome.storage.local.get(["timer", "focus"], (result) => {
    const { focus, timer } = result;
    const isDefault = timer === focus.focusTimer * 60;

    if (isDefault || timer <= 0) {
      const timer = focus.focusTimer * 60; // convert minute to seconds
      chrome.storage.local.set({
        timer,
      });
      chrome.alarms.create(EAZY_POMODORO_TIMER, {
        periodInMinutes: 1 / 60,
      });
    }
  });
}

function stopFocusingAlarm() {
  setStoredStatus(TimerStatus.DEFAULT).then(() => {
    getFocusSettings().then((focus) => {
      const timer = focus.focusTimer * 60; // reset timer
      chrome.storage.local.set({ timer }, function () {});
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
    timer: 0.3 * 60, // convert minute to seconds
    status: TimerStatus.DEFAULT,
  });

  saveFocusSettings({
    focusTimer: 0.3,
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
        const timer = result.timer - 1;
        console.log({ timer });
        if (result.timer <= 0) {
          status = TimerStatus.DEFAULT;
        }
        chrome.storage.local.set({ timer });
      }

      if (status === TimerStatus.DEFAULT) {
        stopFocusingAlarm();

        if (focus.focusDesktopNotification) {
          showNotification(focus.focusTitle);
        }

        chrome.tabs.query({ active: true }, function (tabs) {
          const activeTab = tabs[0];
          if (activeTab) {
            chrome.tabs.sendMessage(
              activeTab.id,
              {
                type: Messages.RESET_STATUS,
              },
              (response) => {
                if (chrome.runtime.lastError) {
                  // Handle the error, e.g., the popup is closed.
                  console.log("error:", chrome.runtime.lastError);
                  return;
                } else {
                  console.log("response from content:" + response);
                }
              }
            );
          }
        });
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
      console.log("paused ", status);
      break;

    case TimerStatus.RESTING:
      console.log("resting: ", status);
      break;
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === Messages.TIMER_STATUS) {
    processTimerStatus(msg.status);
    setStoredStatus(msg.status).then(() => {
      getStoredStatus().then((storedStatus) => sendResponse(storedStatus));
    });
  }

  if (chrome.runtime.lastError) {
    // Handle the error, e.g., the popup is closed.
    console.log("error:", chrome.runtime.lastError);
    return true;
  }
  return true;
});
