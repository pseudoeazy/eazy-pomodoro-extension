import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Error from "../alerts/Error";
import { Focus } from "../../types/settings";
import { Actions, usePomodoro } from "../context/PomodoroContext";
import { TimerStatus } from "../../types/time";
import {
  getFocusSettings,
  getStoredStatus,
  saveFocusSettings,
  setStoredStatus,
} from "../../utils/storage";

const FocusContentForm = () => {
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

  const handleFocusSubmit = async ({ focusTimer, focusTitle }) => {
    setIsLoading(true);
    const formData: Focus = {
      focusTimer,
      focusTitle,
      focusDesktopNotification: isCheckedDesktop,
      focusTabNotification: isCheckedTab,
    };

    setTimeout(() => {
      saveFocusSettings(formData).then(() => {
        chrome.storage.local.get(["focus"], (result) => {
          const { focus } = result;
          const timer = focus.focusTimer * 60; // reset timer
          chrome.storage.local.set({ timer }, function () {
            setIsLoading(false);
          });
        });
        setStoredStatus(TimerStatus.DEFAULT).then(() => {
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
      getFocusSettings().then((storedSetting) => {
        reset({
          focusTimer: storedSetting["focusTimer"],
          focusTitle: storedSetting["focusTitle"],
        });

        setIsCheckedDesktop(storedSetting["focusDesktopNotification"]);
        setIsCheckedTab(storedSetting["focusTabNotification"]);
      });
    }
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <form
      onSubmit={handleSubmit(handleFocusSubmit)}
      className="add-note__form add-note__form--settings"
    >
      <div className="add-note__form-group">
        <label htmlFor="focusTimer" className="add-note__label">
          Duration in minutes
        </label>
        <input
          min={1}
          max={1440}
          id="focusTimer"
          name="focusTimer"
          type="number"
          placeholder="25"
          className="add-note__input add-note__input--number"
          {...register("focusTimer", {
            required: true,
          })}
        />
        {errors["focusTimer"] && errors["focusTimer"]?.type === "required" && (
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
        <label htmlFor="focusTitle" className="add-note__label">
          Textfield Title
        </label>
        <input
          {...register("focusTitle", {
            required: true,
          })}
          type="text"
          name="focusTitle"
          id="focusTitle"
          placeholder="Enter input"
          className="add-note__input"
        />
        {errors["focusTitle"] && errors["focusTitle"]?.type === "required" && (
          <Error text="title cannot be blank" />
        )}
      </div>

      <div className="add-note__form-group">
        <div className="add-note__inner-group">
          <input
            name={"focusDesktopNotification"}
            type="checkbox"
            id={"focusDesktopNotification"}
            className="add-note__checkbox"
            checked={isCheckedDesktop}
            onChange={handleDesktopChange}
          />
          <label
            htmlFor={"focusDesktopNotification"}
            className="add-note__checkbox--text"
          >
            Show desktop notification when complete
          </label>
        </div>
      </div>
      <div className="add-note__form-group">
        <div className="add-note__inner-group">
          <input
            name="focusTabNotification"
            type="checkbox"
            id="focusTabNotification"
            className="add-note__checkbox"
            checked={isCheckedTab}
            onChange={handleTabChange}
          />

          <label
            htmlFor="focusTabNotification"
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
export default FocusContentForm;
