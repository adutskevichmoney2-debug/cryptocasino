"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, left, right, className, type, id, ...rest },
  ref,
) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputId = id || rest.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-[13px] font-semibold text-sub">
          {label}
        </label>
      )}
      <div className="relative">
        {left && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mute">
            {left}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={isPassword ? (show ? "text" : "password") : type}
          className={cn(
            "h-11 w-full rounded-[10px] border bg-field px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-mute",
            left && "pl-10",
            (right || isPassword) && "pr-10",
            error
              ? "border-danger/70 focus:border-danger"
              : "border-line focus:border-em/70",
            className,
          )}
          aria-invalid={!!error}
          {...rest}
        />
        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-mute transition-colors hover:text-sub"
          >
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        ) : (
          right && <span className="absolute right-3 top-1/2 -translate-y-1/2">{right}</span>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-mute">{hint}</p>
      ) : null}
    </div>
  );
});
