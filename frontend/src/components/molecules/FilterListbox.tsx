import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Field } from '@headlessui/react'
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

  useEffect(() => { onSelect(selectedKeys) }, [selectedKeys, onSelect])
  const reset = () => { setSelectedKeys([]) }
  useImperativeHandle(ref, () => ({ reset }))

  const name = text + (selectedKeys.length ? ` (${selectedKeys.length})` : '')

  return <Field className='inline'>
    <Listbox value={selectedKeys} onChange={setSelectedKeys} multiple>
      <ListboxButton>{name}</ListboxButton>
      <ListboxOptions anchor="bottom">
        {Object.entries(valueMap).map(([key, value]) => (
          <ListboxOption key={key} value={key} className="data-[focus]:bg-blue-100">
            {value}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  </Field>
}

export default forwardRef<FilterListboxRef, Props>(FilterListbox)