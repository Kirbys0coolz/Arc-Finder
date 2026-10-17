type TagPickerProps = {
  label: string
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
}

export default function TagPicker({
  label,
  options,
  selected,
  onChange,
}: TagPickerProps) {
  function toggle(tag: string) {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag))
    } else {
      onChange([...selected, tag])
    }
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-gray-800">{label}</legend>

      <div className="flex flex-wrap gap-2">
        {options.map((tag) => {
          const isOn = selected.includes(tag)

          return (
            <button
              key={tag}
              type="button"
              aria-pressed={isOn}
              onClick={() => toggle(tag)}
              className={[
                'rounded-full border px-3 py-1 text-sm transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2',
                isOn
                  ? 'border-green-800 bg-green-800 text-white hover:bg-green-900'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-green-700',
              ].join(' ')}
            >
              {tag}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}