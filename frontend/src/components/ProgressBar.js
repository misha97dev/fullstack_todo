import React from "react";

const ProgressBar = ({ progress }) => {
  const colors = ["red", "green", "black", "yellow", "blue"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return (
    <div className="progress-bar">
      <div
        className="progress-bar__level"
        style={{ width: `${progress}%`, background: `${randomColor}` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
