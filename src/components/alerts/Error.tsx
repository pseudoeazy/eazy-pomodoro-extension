import React from "react";

interface Props {
  text: string;
}
export default function Error({ text }: Props) {
  return <small className="alert__error">{text}</small>;
}
