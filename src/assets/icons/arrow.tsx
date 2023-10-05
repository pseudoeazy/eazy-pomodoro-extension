import React from "react";

interface Props {
  opacity: string;
}
function Arrow({ opacity }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill="#000"
        fillOpacity="0.54"
        d="M12 20l1.41-1.41L7.83 13H20v-2H7.83l5.58-5.59L12 4l-8 8 8 8z"
        opacity={opacity}
      ></path>
    </svg>
  );
}

export default Arrow;
