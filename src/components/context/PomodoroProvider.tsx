import React, { useEffect, useReducer } from "react";
import { TimerStatus } from "../../types/time";
import {
  PomodoroAppState,
  PomodoroAction,
  Actions,
  PomodoroContext,
} from "./PomodoroContext";
import { getStoredStatus } from "../../utils/storage";
import { Messages } from "../../types/messages";

const pomodoroReducer = (
  state: PomodoroAppState,
  action: PomodoroAction
): PomodoroAppState => {
  switch (action.type) {
    case Actions.STATUS:
      return { ...state, status: action.payload };
    case Actions.NOTES:
      return { ...state, notes: action.payload };

    default:
      return state;
  }
};

const initialState: PomodoroAppState = {
  notes: [],
  status: TimerStatus.DEFAULT,
};

interface Props {
  children: React.ReactNode;
}

const PomodoroProvider: React.FC<Props> = ({ children }) => {
  const [pomodoro, updatePomodoro] = useReducer(pomodoroReducer, initialState);

  useEffect(() => {
    getStoredStatus().then((status) =>
      updatePomodoro({ type: Actions.STATUS, payload: status })
    );

    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === Messages.RESET_STATUS) {
        getStoredStatus().then((status) =>
          updatePomodoro({ type: Actions.STATUS, payload: status })
        );
      }
      if (message.type === Messages.SHORTBREAK_OVER) {
        getStoredStatus().then((status) =>
          updatePomodoro({ type: Actions.STATUS, payload: status })
        );
      }
    });
  }, []);
  return (
    <PomodoroContext.Provider value={{ pomodoro, updatePomodoro }}>
      {children}
    </PomodoroContext.Provider>
  );
};

export default PomodoroProvider;
