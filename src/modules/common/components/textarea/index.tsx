import {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  TextareaHTMLAttributes,
} from "react"
import { clx } from "@medusajs/ui"

export type TextareaProps = {
  label: string
  name: string
  rows?: number
  required?: boolean
  errors?: Record<string, string>
  touched?: Record<string, boolean>
} & TextareaHTMLAttributes<HTMLTextAreaElement>

const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      name,
      rows = 3,
      required = false,
      errors,
      touched,
      className,
      ...props
    },
    ref
  ) => {
    const hasError = errors && errors[name] && touched && touched[name]

    return (
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor={name}
            className={clx(
              "text-left text-base-regular",
              hasError && "text-rose-500"
            )}
          >
            {label}
            {required && <span className="text-rose-500">*</span>}
          </label>
        </div>
        <textarea
          ref={ref}
          id={name}
          name={name}
          rows={rows}
          className={clx(
            "py-2 px-4 w-full border rounded-md text-base-regular transition-colors focus:outline-none resize-none",
            hasError
              ? "border-rose-500"
              : "border-gray-300 focus:border-ui-fg-base",
            className
          )}
          {...props}
        />
        {hasError && (
          <div className="text-rose-500 text-small-regular mt-2">
            {errors[name]}
          </div>
        )}
      </div>
    )
  }
)

TextArea.displayName = "TextArea"

export default TextArea
