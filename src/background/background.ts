import { Messages } from "../types/messages";
import { Focus, ShortBreak } from "../types/settings";
import { TimerStatus } from "../types/time";
import {
  getFocusSettings,
  getShortBreakSettings,
  getStoredStatus,
  saveFocusSettings,
  saveNotes,
  saveShortBreakSettings,
  setStoredStatus,
} from "../utils/storage";

const EAZY_POMODORO_TIMER = "EAZY_POMODORO_TIMER";
const EAZY_POMODORO_TIMER_SHORT_BREAK = "EAZY_POMODORO_TIMER_SHORT_BREAK";

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

function startShortBreakAlarm() {
  chrome.storage.local.get(["sBTimer", "shortBreak"], (result) => {
    const { shortBreak } = result;
    const sBTimer = shortBreak.shortBreakTimer * 60; // convert minute to seconds
    chrome.storage.local.set({
      sBTimer,
    });

    chrome.alarms.create(EAZY_POMODORO_TIMER_SHORT_BREAK, {
      periodInMinutes: 1 / 60,
    });
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

function stopShortBreakAlarm() {
  setStoredStatus(TimerStatus.PAUSED).then(() => {
    getShortBreakSettings().then((shortBreak) => {
      const sBTimer = shortBreak.shortBreakTimer * 60; // reset timer
      chrome.storage.local.set({ sBTimer });
    });

    chrome.alarms.clear(EAZY_POMODORO_TIMER_SHORT_BREAK);
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
    timer: 25 * 60, // convert minute to seconds
    sBTimer: 5 * 60, // convert minute to seconds
    status: TimerStatus.DEFAULT,
  });

  saveFocusSettings({
    focusTimer: 25,
    focusTitle: "Hello, 25 minutes has passed!",
    focusDesktopNotification: true,
    focusTabNotification: false,
  });

  saveShortBreakSettings({
    shortBreakTimer: 5,
    shortBreakTitle: "Break Over, 5 minutes has passed!",
    isShortBreakDesktopNotification: true,
    isShortBreakTabNotification: false,
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

  if (alarmInfo.name === EAZY_POMODORO_TIMER_SHORT_BREAK) {
    chrome.storage.local.get(["status", "sBTimer", "shortBreak"], (result) => {
      let status: TimerStatus = result.status;
      const shortBreak: ShortBreak = result.shortBreak;

      if (status === TimerStatus.RESTING) {
        const sBTimer = result.sBTimer - 1;

        if (sBTimer <= 0) {
          stopShortBreakAlarm();
          if (shortBreak.isShortBreakDesktopNotification) {
            showNotification(shortBreak.shortBreakTitle);
          }

          chrome.tabs.query({ active: true }, function (tabs) {
            const activeTab = tabs[0];
            if (activeTab) {
              chrome.tabs.sendMessage(
                activeTab.id,
                {
                  type: Messages.SHORTBREAK_OVER,
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
        chrome.storage.local.set({ sBTimer });
      }
    });
  }
});

async function processTimerStatus(status: TimerStatus): Promise<void> {
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
      startShortBreakAlarm();
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
