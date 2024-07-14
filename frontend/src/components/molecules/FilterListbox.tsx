import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react'

type Keys = string[]
type Props = {
  text: string
  valueMap: { [key: string]: string }
  onSelect: (keys: Keys) => void
}

export interface FilterListboxRef {
  reset: () => void;
}

const FilterListbox = ({ text, valueMap, onSelect }: Props, ref: ForwardedRef<FilterListboxRef>) => {
  const [selectedKeys, setSelectedKeys] = useState<Keys>([])

  useEffect(() => onSelect(selectedKeys), [selectedKeys, onSelect])
  const reset = () => setSelectedKeys([])
  useImperativeHandle(ref, () => ({ reset }))

  const name = text + (selectedKeys.length ? ` (${selectedKeys.length})` : '')

  return <Listbox value={selectedKeys} onChange={setSelectedKeys} multiple>
    <ListboxButton className='flex py-1.5 px-2 justify-center items-center gap-0.5 rounded-sm bg-[#DBE0F1] data-[open]:bg-[#132D59] data-[open]:text-white'>
      <p className='flex items-center gap-2.5 text-nowrap'>{name}</p>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.99995 9.53333L4.19995 5.33333L9.79995 5.33333L6.99995 9.53333Z" fill="black"/>
      </svg>
    </ListboxButton>
    <ListboxOptions anchor="bottom">
      {Object.entries(valueMap).map(([key, value]) => (
        <ListboxOption key={key} value={key} className="data-[focus]:bg-blue-100">
          {value}
        </ListboxOption>
      ))}
    </ListboxOptions>
  </Listbox>
}

export default forwardRef<FilterListboxRef, Props>(FilterListbox)