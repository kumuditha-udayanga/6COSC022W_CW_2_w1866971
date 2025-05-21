import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return format(date, "MMM d, yyyy")
  } catch (error) {
    return dateString
  }
}
