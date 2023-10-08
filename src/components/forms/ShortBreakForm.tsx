import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Error from "../alerts/Error";
import { ShortBreak } from "../../types/settings";
import { Actions, usePomodoro } from "../context/PomodoroContext";
import { TimerStatus } from "../../types/time";
import {
  getShortBreakSettings,
  getStoredStatus,
  saveShortBreakSettings,
  setStoredStatus,
} from "../../utils/storage";

const ShortBreakForm = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const { updatePomodoro } = usePomodoro();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckedDesktop, setIsCheckedDesktop] = useState(false);
  const [isCheckedTab, setIsCheckedTab] = useState(false);

  const handleDesktopChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setIsCheckedDesktop(checked);
  };

  const handleTabChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setIsCheckedTab(checked);
  };

  const handleShortBreakSubmit = async ({
    shortBreakTimer,
    shortBreakTitle,
  }) => {
    setIsLoading(true);
    const formData: ShortBreak = {
      shortBreakTimer,
      shortBreakTitle,
      isShortBreakDesktopNotification: isCheckedDesktop,
      isShortBreakTabNotification: isCheckedTab,
    };

    setTimeout(() => {
      saveShortBreakSettings(formData).then(() => {
        chrome.storage.local.get(["shortBreak"], (result) => {
          const { shortBreak } = result;
          const sBTimer = shortBreak.shortBreakTimer * 60; // reset timer
          chrome.storage.local.set({ sBTimer }, function () {
            setIsLoading(false);
          });
        });
        setStoredStatus(TimerStatus.PAUSED).then(() => {
          getStoredStatus().then((storedStatus) => {
            updatePomodoro({ type: Actions.STATUS, payload: storedStatus });
          });
        });
      });
    }, 1000);
  };

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      getShortBreakSettings().then((storedSetting) => {
        reset({
          shortBreakTimer: storedSetting["shortBreakTimer"],
          shortBreakTitle: storedSetting["shortBreakTitle"],
        });

        setIsCheckedDesktop(storedSetting["isShortBreakDesktopNotification"]);
        setIsCheckedTab(storedSetting["isShortBreakTabNotification"]);
      });
    }
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <form
      onSubmit={handleSubmit(handleShortBreakSubmit)}
      className="add-note__form add-note__form--settings"
    >
      <div className="add-note__form-group">
        <label htmlFor="shortBreakTimer" className="add-note__label">
          Duration in minutes
        </label>
        <input
          min={1}
          max={1440}
          name="shortBreakTimer"
          type="number"
          placeholder="25"
          className="add-note__input add-note__input--number"
          {...register("shortBreakTimer", {
            required: true,
          })}
        />
        {errors["shortBreakTimer"] &&
          errors["shortBreakTimer"]?.type === "required" && (
            <Error text="time cannot be blank" />
          )}
      </div>
      <div className="add-note__form-group">
        <span>Timer sound</span>
        <select className="add-note__select">
          <option value="Default">Default</option>
        </select>
      </div>
      <div className="add-note__form-group">
        <label htmlFor="note" className="add-note__label">
          Textfield Title
        </label>
        <input
          {...register("shortBreakTitle", {
            required: true,
          })}
          type="text"
          name="shortBreakTitle"
          placeholder="Enter input"
          className="add-note__input"
        />
        {errors["shortBreakTitle"] &&
          errors["shortBreakTitle"]?.type === "required" && (
            <Error text="title cannot be blank" />
          )}
      </div>

      <div className="add-note__form-group">
        <div className="add-note__inner-group">
          <input
            name={"isShortBreakDesktopNotification"}
            type="checkbox"
            id={"isShortBreakDesktopNotification"}
            className="add-note__checkbox"
            checked={isCheckedDesktop}
            onChange={handleDesktopChange}
          />
          <label
            htmlFor={"isShortBreakDesktopNotification"}
            className="add-note__checkbox--text"
          >
            Show desktop notification when complete
          </label>
        </div>
      </div>
      <div className="add-note__form-group">
        <div className="add-note__inner-group">
          <input
            name="isShortBreakTabNotification"
            type="checkbox"
            id="isShortBreakTabNotification"
            className="add-note__checkbox"
            checked={isCheckedTab}
            onChange={handleTabChange}
          />

          <label
            htmlFor="isShortBreakTabNotification"
            className="add-note__checkbox--text"
          >
            Show new tab notification when complete
          </label>
        </div>
      </div>
      <div className="add-note__form-group">
        <button
          className={`add-note__button ${
            isLoading && "add-note__button--loading"
          }`}
          type="submit"
          disabled={isLoading}
        >
          Save{isLoading ? "..." : ""}
        </button>
      </div>
    </form>
  );
};
export default ShortBreakForm;
