import clsx from "clsx";
import React from "react";

export const Input = ({ label, className, ...rest }) => {
  return (
    <div className="w-full flex flex-col">
      {label && (
        <label className="text-primary-900 font-medium pb-1">{label}</label>
      )}
      <input
        className={clsx(
          "w-full p-2 rounded-lg text-xl bg-transparent placeholder:text-gray-400 text-center focus:placeholder:text-transparent focus:outline-none",
          className
        )}
        {...rest}
      />
    </div>
  );
};
