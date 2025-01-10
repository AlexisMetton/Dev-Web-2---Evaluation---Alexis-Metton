import React from "react";
import { useTheme } from "@/layouts/themeProvider/ThemeProvider";

const CustomInput = React.forwardRef(({ type, name, label, errorMessage, ...rest }, ref) => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className={`text-sm font-medium ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label || name}
      </label>
      <input
        ref={ref}
        type={type}
        id={name}
        name={name}
        className={`border rounded-md px-3 py-2 text-sm ${
          errorMessage ? "border-red-500" : theme === "dark" ? "border-gray-600" : "border-gray-300"
        } ${
          theme === "dark"
            ? "bg-black text-white placeholder-gray-400"
            : "bg-white text-black"
        }`}
        {...rest}
      />
      {errorMessage && (
        <p className="text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
});

export default CustomInput;
