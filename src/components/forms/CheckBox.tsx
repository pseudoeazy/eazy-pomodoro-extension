import React, { ChangeEvent, FormEvent, useState } from "react";

interface Props {
  name: string;
  label: string;
}
function Checkbox({ name, label }: Props) {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setIsChecked(checked);
  };
  return (
    <div className="add-note__form-group">
      <div className="add-note__inner-group">
        <input
          name={name}
          type="checkbox"
          id={name}
          className="add-note__checkbox"
          defaultChecked={isChecked}
          onChange={handleChange}
        />
        <label htmlFor={name} className="add-note__checkbox--text">
          {label}
        </label>
      </div>
    </div>
  );
}

export default Checkbox;
