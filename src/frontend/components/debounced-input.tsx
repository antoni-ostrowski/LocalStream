import { useEffect, useState, type InputHTMLAttributes } from "react"
import { Input } from "./ui/input"

export default function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 250,
  ...props
}: {
  value: string
  onChange: (value: string) => void
  debounce?: number
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <Input
      {...props}
      value={value}
      type="text"
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
