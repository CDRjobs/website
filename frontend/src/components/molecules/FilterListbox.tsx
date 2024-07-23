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
  const reset = () => setSelectedKeys(multiple ? [] : null)
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
    <ListboxButton ref={listboxButtonRef} className='group bg-[#DBE0F1] data-[open]:text-white rounded-sm data-[open]:bg-[#132D59] data-[hover]:bg-[#B5C2FF] data-[open]:data-[hover]:bg-[#132D59]'>
      <div className='inline-flex py-1.5 px-2 items-center gap-0.5 sm:py-1.5 transition-[width]'>
          <p className='flex items-center text-base font-normal leading-[1.375] text-nowrap'>{name}</p>
          <svg width='14' height='14' viewBox='0 0 14 14'>
            <path d='M6.99995 9.53333L4.19995 5.33333L9.79995 5.33333L6.99995 9.53333Z' className='fill-black group-data-[open]:fill-white' />
          </svg>
        </div>
    </ListboxButton>
    <ListboxOptions anchor='bottom start' className='flex w-[23.25rem] py-6 [--anchor-gap:0.5rem] flex-col items-center gap-3 rounded-[0.625rem] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.08),0_-4px_4px_0_rgba(0,0,0,0.08)]'>
      <div className='flex pr-4 justify-end items-center gap-1.5 self-stretch'>
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' className='cursor-pointer' onClick={() => listboxButtonRef.current?.click()}>
          <path d='M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z' fill='black'/>
        </svg>
      </div>
      {Object.entries(valueMap).map(([key, value]) => (
        <ListboxOption key={key} value={key} className='group cursor-pointer select-none flex py-3.5 px-4 items-center gap-1.5 self-stretch border-b border-solid border-[#EEE] data-[focus]:bg-[rgba(112,135,240,0.10)]'>
            <p className='flex-[1_0_0] text-base font-medium leading-5'>{value}</p>
            <svg className='group-data-[selected]:hidden' width='20' height='20' viewBox='0 0 20 20' fill='none'>
              <path fillRule='evenodd' clipRule='evenodd' d='M9.99996 16.6667C11.7681 16.6667 13.4638 15.9643 14.714 14.714C15.9642 13.4638 16.6666 11.7681 16.6666 9.99999C16.6666 8.23188 15.9642 6.53619 14.714 5.28594C13.4638 4.0357 11.7681 3.33332 9.99996 3.33332C8.23185 3.33332 6.53616 4.0357 5.28591 5.28594C4.03567 6.53619 3.33329 8.23188 3.33329 9.99999C3.33329 11.7681 4.03567 13.4638 5.28591 14.714C6.53616 15.9643 8.23185 16.6667 9.99996 16.6667ZM9.99996 18.3333C14.6025 18.3333 18.3333 14.6025 18.3333 9.99999C18.3333 5.39749 14.6025 1.66666 9.99996 1.66666C5.39746 1.66666 1.66663 5.39749 1.66663 9.99999C1.66663 14.6025 5.39746 18.3333 9.99996 18.3333Z' fill='#CCCCCC'/>
            </svg>
            <svg className='hidden group-data-[selected]:block' width='20' height='20' viewBox='0 0 20 20' fill='none'>
              <path fillRule='evenodd' clipRule='evenodd' d='M10 17.5C10.9849 17.5 11.9602 17.306 12.8701 16.9291C13.7801 16.5522 14.6069 15.9997 15.3033 15.3033C15.9997 14.6069 16.5522 13.7801 16.9291 12.8701C17.306 11.9602 17.5 10.9849 17.5 10C17.5 9.01509 17.306 8.03982 16.9291 7.12987C16.5522 6.21993 15.9997 5.39314 15.3033 4.6967C14.6069 4.00026 13.7801 3.44781 12.8701 3.0709C11.9602 2.69399 10.9849 2.5 10 2.5C8.01088 2.5 6.10322 3.29018 4.6967 4.6967C3.29018 6.10322 2.5 8.01088 2.5 10C2.5 11.9891 3.29018 13.8968 4.6967 15.3033C6.10322 16.7098 8.01088 17.5 10 17.5ZM9.80667 13.0333L13.9733 8.03333L12.6933 6.96667L9.11 11.2658L7.25583 9.41083L6.0775 10.5892L8.5775 13.0892L9.2225 13.7342L9.80667 13.0333Z' fill='#7087F0'/>
            </svg>
        </ListboxOption>
      ))}
    </ListboxOptions>
  </Listbox>
}

export default forwardRef<FilterListboxRef, Props>(FilterListbox)