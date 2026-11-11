import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  value,
  onChange,
  placeholder,
  label,
  type = "text",
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      {label && (
        <label className="text-xs font-medium text-slate-700">{label}</label>
      )}

      <div className="input-box">
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none placeholder:text-slate-400 text-sm"
          value={value}
          onChange={onChange}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-400 hover:text-purple-600 transition cursor-pointer"
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}

