import React from "react";
import classNames from "classnames";

import "./Icon.scss";

const Icon = ({ color, onClick, className }) => {
  return (
    <i
      onClick={onClick}
      className={classNames("icon", { [`icon_${color}`]: color }, className)}
    ></i>
  );
};

export default Icon;
