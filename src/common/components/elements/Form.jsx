import { useFormik } from "formik";
import React from "react";
import { Input } from "../elements/Input";

export const Form = ({
  initialValues,
  onSubmit,
  inputFields = [],
  buttonText,
}) => {
  const formik = useFormik({
    initialValues,
    onSubmit,
  });
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full flex flex-col items-center justify-center gap-5"
    >
      {inputFields.map((field, index) => (
        <Input
          key={index}
          className="text-center !bg-white/20"
          {...field}
          onChange={formik.handleChange}
        />
      ))}
      {buttonText && (
        <button
          className="text-black bg-green-500 py-1 px-2 rounded-md font-semibold"
          type="submit"
        >
          {buttonText}
        </button>
      )}
    </form>
  );
};
