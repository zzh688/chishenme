import { Search, X } from 'lucide-react'
import { useRef, useEffect } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
}

export default function SearchBar({ value, onChange, placeholder = '搜索菜品、食材...', autoFocus }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  return (
    <div className="flex items-center gap-2 bg-[#F5F5F0] rounded-xl px-3 py-2.5">
      <Search size={18} className="text-[#bbb] shrink-0" />
      <input
        ref={inputRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-[#333] placeholder-[#ccc] outline-none"
      />
      {value && (
        <button onClick={() => onChange('')} className="text-[#bbb] hover:text-[#666] shrink-0">
          <X size={16} />
        </button>
      )}
    </div>
  )
}
