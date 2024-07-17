import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ForwardedRef, forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from 'react'

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

  const listboxButtonRef = useRef<HTMLButtonElement>(null)

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
    <ListboxButton ref={listboxButtonRef}>
      {({ open, hover }) => <div className={`flex py:1 px-2 justify-center items-center gap-0.5 rounded-sm ${ open || hover ? 'bg-[#132D59] text-white' : 'bg-[#DBE0F1]'} sm:py-1.5 transition-[width]`}>
          <p className='flex items-center text-base font-normal leading-[1.375] text-nowrap'>{name}</p>
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M6.99995 9.53333L4.19995 5.33333L9.79995 5.33333L6.99995 9.53333Z" className={open ? 'fill-white' : 'fill-black' }/>
          </svg>
        </div>}
    </ListboxButton>
    <ListboxOptions anchor="bottom start" className='flex py-5 px-4 [--anchor-gap:0.5rem] flex-col items-center gap-2 rounded-[0.625rem] min-w-[10rem] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.08),0_-4px_4px_0_rgba(0,0,0,0.08)]'>
      <div className='flex flex-col items-center gap-2.5 self-stretch'>
        {Object.entries(valueMap).map(([key, value]) => (
          <ListboxOption key={key} value={key} className='group cursor-pointer select-none flex h-8 py-1 px-0.5 items-center gap-1.5 self-stretch border-b border-solid border-[#CCC] data-[focus]:bg-[rgba(112,135,240,0.10)]'>
              <p className='flex-[1_0_0] text- pr-2 font-medium leading-6'>{value}</p>
              <svg className='group-data-[selected]:hidden ' width='20' height='20' viewBox='0 0 20 20' fill='none'>
                <path fillRule='evenodd' clipRule='evenodd' d='M9.99935 16.667C11.7675 16.667 13.4632 15.9646 14.7134 14.7144C15.9636 13.4641 16.666 11.7684 16.666 10.0003C16.666 8.23222 15.9636 6.53652 14.7134 5.28628C13.4632 4.03604 11.7675 3.33366 9.99935 3.33366C8.23124 3.33366 6.53555 4.03604 5.2853 5.28628C4.03506 6.53652 3.33268 8.23222 3.33268 10.0003C3.33268 11.7684 4.03506 13.4641 5.2853 14.7144C6.53555 15.9646 8.23124 16.667 9.99935 16.667ZM9.99935 18.3337C14.6018 18.3337 18.3327 14.6028 18.3327 10.0003C18.3327 5.39783 14.6018 1.66699 9.99935 1.66699C5.39685 1.66699 1.66602 5.39783 1.66602 10.0003C1.66602 14.6028 5.39685 18.3337 9.99935 18.3337Z' fill='#CCCCCC'/>
              </svg>
              <svg className='hidden group-data-[selected]:block' width='20' height='20' viewBox='0 0 20 20' fill='none'>
                <path fillRule='evenodd' clipRule='evenodd' d='M10 17.5C10.9849 17.5 11.9602 17.306 12.8701 16.9291C13.7801 16.5522 14.6069 15.9997 15.3033 15.3033C15.9997 14.6069 16.5522 13.7801 16.9291 12.8701C17.306 11.9602 17.5 10.9849 17.5 10C17.5 9.01509 17.306 8.03982 16.9291 7.12987C16.5522 6.21993 15.9997 5.39314 15.3033 4.6967C14.6069 4.00026 13.7801 3.44781 12.8701 3.0709C11.9602 2.69399 10.9849 2.5 10 2.5C8.01088 2.5 6.10322 3.29018 4.6967 4.6967C3.29018 6.10322 2.5 8.01088 2.5 10C2.5 11.9891 3.29018 13.8968 4.6967 15.3033C6.10322 16.7098 8.01088 17.5 10 17.5ZM9.80667 13.0333L13.9733 8.03333L12.6933 6.96667L9.11 11.2658L7.25583 9.41083L6.0775 10.5892L8.5775 13.0892L9.2225 13.7342L9.80667 13.0333Z' fill='#7087F0'/>
              </svg>
          </ListboxOption>
        ))}
      </div>
    </ListboxOptions>
  </Listbox>
}

export default forwardRef<FilterListboxRef, Props>(FilterListbox)