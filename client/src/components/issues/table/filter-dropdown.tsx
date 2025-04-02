import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface FilterOption {
  value: string
  label: string
}

interface FilterDropdownProps {
  title: string
  options: FilterOption[]
  currentValue?: string
  onChange: (value: string) => void
  groupOptions?: boolean
  width?: string
}

export default function FilterDropdown({
  title,
  options,
  currentValue,
  onChange,
  groupOptions = false,
  width = "w-40",
}: FilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-1">
          {title}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={width}>
        <DropdownMenuLabel>Filter by {title?.toLowerCase()}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {groupOptions ? (
          <DropdownMenuGroup>
            {options.map((option) => (
              <DropdownMenuItem key={option.value} onClick={() => onChange(option.value)}>
                <Check className={cn("mr-2 h-4 w-4", currentValue === option.value ? "opacity-100" : "opacity-0")} />
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        ) : (
          options.map((option) => (
            <DropdownMenuItem key={option.value} onClick={() => onChange(option.value)}>
              <Check className={cn("mr-2 h-4 w-4", currentValue === option.value ? "opacity-100" : "opacity-0")} />
              {option.label}
            </DropdownMenuItem>
          ))
        )}
        {currentValue && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onChange("")}>Clear filter</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}