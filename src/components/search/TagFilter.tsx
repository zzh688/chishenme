import { PRESET_TAGS } from '../../types'

interface TagFilterProps {
  selectedTags: string[]
  onToggle: (tag: string) => void
}

export default function TagFilter({ selectedTags, onToggle }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {PRESET_TAGS.map(tag => {
        const active = selectedTags.includes(tag)
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              active
                ? 'bg-[#7DB892] text-white'
                : 'bg-white border border-[#E8E8E0] text-[#888]'
            }`}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
