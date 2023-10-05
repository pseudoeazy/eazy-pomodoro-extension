import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ className, children }: Props) {
  let classNames = "container";
  if (className) {
    classNames += ` ${className}`;
  }
  return <div className={classNames}>{children}</div>;
}
