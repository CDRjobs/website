import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react'

type Keys = string[] | string | null
type Props = {
  text: string
  valueMap: { [key: string]: string }
  onSelect: (keys: Keys) => void
  multiple?: boolean
}

export interface FilterListboxRef {
  reset: () => void;
}

const FilterListbox = ({ text, valueMap, onSelect, multiple = false }: Props, ref: ForwardedRef<FilterListboxRef>) => {
  const [selectedKeys, setSelectedKeys] = useState<Keys>(multiple ? [] : null)

  useEffect(() => onSelect(selectedKeys), [selectedKeys, onSelect])
  const reset = () => setSelectedKeys([])
  useImperativeHandle(ref, () => ({ reset }))

  const name = text + (multiple
    ? (selectedKeys?.length ? ` (${selectedKeys.length})` : '')
    : (selectedKeys ? ' (1)' : ''))

  const onChangeSelectedKeys = (value: Keys) => {
    if (!multiple && value === selectedKeys) {
      setSelectedKeys(null)
    } else {
      setSelectedKeys(value)
    }
  }

  return <Listbox value={selectedKeys} onChange={onChangeSelectedKeys} multiple={multiple}>
    <ListboxButton>
      {({ open, hover }) => <div className={`flex py:1 px-2 justify-center items-center gap-0.5 rounded-sm ${ open || hover ? 'bg-[#132D59] text-white' : 'bg-[#DBE0F1]'} sm:py-1.5 transition-[width]`}>
          <p className='flex items-center text-base font-normal leading-[1.375] text-nowrap'>{name}</p>
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M6.99995 9.53333L4.19995 5.33333L9.79995 5.33333L6.99995 9.53333Z" className={open ? 'fill-white' : 'fill-black' }/>
          </svg>
        </div>}
    </ListboxButton>
    <ListboxOptions anchor="bottom start" className='border'>
      {Object.entries(valueMap).map(([key, value]) => (
        <ListboxOption key={key} value={key}>
          {({ focus, selected }) => <div className={`${selected ? 'bg-[#DBE0F1]' : focus ? 'bg-[#EFEFF8]' : 'bg-white' } px-2 cursor-pointer transition-[width] min-w-[var(--button-width)]`}>
            {value}
            </div>}
        </ListboxOption>
      ))}
    </ListboxOptions>
  </Listbox>
}

export default forwardRef<FilterListboxRef, Props>(FilterListbox)
