import { InputHTMLAttributes, forwardRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const ClayInput = forwardRef<HTMLInputElement, Props>(({ label, className = "", id, ...rest }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-muted">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`clay-inset rounded-clay-sm px-4 py-2.5 text-ink placeholder:text-muted/70 outline-none w-full ${className}`}
        {...rest}
      />
    </div>
  );
});
ClayInput.displayName = "ClayInput";
