import React from "react";
import { useForm } from "react-hook-form";

const FocusContentForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const hanldeFocusSubmit = async ({ time, title }) => {};
  return (
    <form
      onSubmit={handleSubmit(hanldeFocusSubmit)}
      className="add-note__form add-note__form--settings"
    >
      <div className="add-note__form-group">
        <label htmlFor="time" className="add-note__label">
          Duration in minutes
        </label>
        <input
          name="time"
          type="number"
          placeholder="25"
          className="add-note__input add-note__input--number"
          {...register("time", {
            required: true,
          })}
        />
        {errors.time && errors.time?.type === "required" && (
          <span className="block w-full text-red-500 p-0.5 mt-0.5">
            time cannot be blank
          </span>
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
          {...register("title", {
            required: true,
          })}
          type="text"
          name="note"
          placeholder="Enter input"
          className="add-note__input"
        />
        {errors.title && errors.title?.type === "required" && (
          <span className="block w-full text-red-500 p-0.5 mt-0.5">
            title cannot be blank
          </span>
        )}
      </div>
      <div className="add-note__form-group">
        <div className="add-note__inner-group">
          <input
            id="desktop-notification"
            className="add-note__checkbox"
            type="checkbox"
            name="desktop-notification"
          />
          <label
            htmlFor="desktop-notification"
            className="add-note__checkbox--text"
          >
            Show desktop notification when complete
          </label>
        </div>
      </div>
      <div className="add-note__form-group">
        <div className="add-note__inner-group">
          <input
            type="checkbox"
            name="tab-notification"
            id="tab-notification"
            className="add-note__checkbox"
          />
          <label
            htmlFor="tab-notification"
            className="add-note__checkbox--text"
          >
            {" "}
            Show new tab notification when complete
          </label>
        </div>
      </div>
      <div className="add-note__form-group">
        <button className="add-note__button">Save</button>
      </div>
    </form>
  );
};
export default FocusContentForm;
