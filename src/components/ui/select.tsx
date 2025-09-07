import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

interface SelectTriggerProps {
  className?: string
  children: React.ReactNode
  onClick?: () => void
  "aria-expanded"?: boolean
}

interface SelectContentProps {
  className?: string
  children: React.ReactNode
  isOpen: boolean
}

interface SelectItemProps {
  className?: string
  value: string
  children: React.ReactNode
  onClick?: () => void
  isSelected?: boolean
}

const Select = ({ value, onValueChange, children }: SelectProps) => {
  return <div className="relative">{children}</div>
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, onClick, "aria-expanded": ariaExpanded, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="combobox"
      aria-expanded={ariaExpanded}
      onClick={onClick}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
)
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ children }: { children: React.ReactNode }) => (
  <span>{children}</span>
)

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, isOpen, ...props }, ref) => {
    if (!isOpen) return null
    
    return (
      <div
        ref={ref}
        className={cn(
          "absolute top-full z-50 mt-1 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
          className
        )}
        {...props}
      >
        <div className="p-1">
          {children}
        </div>
      </div>
    )
  }
)
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, value, children, onClick, isSelected = false, ...props }, ref) => (
    <div
      ref={ref}
      role="option"
      onClick={onClick}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  )
)
SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}
