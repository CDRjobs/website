import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Label } from '@headlessui/react'
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import mapbox from '@/lib/mapbox'
import { SearchBoxSuggestion, SearchBoxFeatureSuggestion } from '@mapbox/search-js-core'
import useMapboxSessionId from '@/hooks/useMapboxSessionId'

type SelectedLocation = {
  country?: string,
  coordinates?: {
    lat: number,
    long: number,
  }
}

type Props = {
  onSelect: (selectedLocation: SelectedLocation | null) => void
}

export interface LocationComboboxRef {
  reset: () => void;
}

const LocationCombobox = ({ onSelect }: Props, ref: ForwardedRef<LocationComboboxRef>) => {
  const [suggestions, setSuggestions] = useState<SearchBoxSuggestion[]>([])
  const [selectedSug, setSelectedSug] = useState<SearchBoxSuggestion | null | undefined>(null)
  const [selectedFeat, setSelectedFeat] = useState<SearchBoxFeatureSuggestion | null | undefined>(null)
  const sessionToken = useMapboxSessionId()

  const comboboxInputRef = useRef<HTMLInputElement>(null)

  const onTyping = async (value: string) => {
    if (value) {
      const { suggestions: newSuggestions } = await mapbox.suggest(value, {
        sessionToken,
        language: 'en',
        types: 'country,city',
        limit: 3,
      })
  
      setSuggestions(newSuggestions)
    } else {
      setSuggestions([])
    }
  }
  const onSelectSug = async (suggestion: SearchBoxSuggestion | null) => {
    setSelectedSug(suggestion)
    if (suggestion) {
      const { features } = await mapbox.retrieve(suggestion, { sessionToken })
      let newSelectFeat = null
      if (suggestion.feature_type === 'country') {
        newSelectFeat = features.find(f => f.properties.feature_type === 'country')
      } else if (['place', 'region'].includes(suggestion.feature_type)) {
        newSelectFeat = features.find(f => f.properties.feature_type === 'place')
      }
      setSelectedFeat(newSelectFeat)
    } else {
      setSelectedFeat(null)
    }
  }

  const onClickCombobox = () => {
    comboboxInputRef.current?.focus()
  }

  useEffect(() => {
    if (selectedFeat?.properties.feature_type === 'place') {
      onSelect({ coordinates: { lat: selectedFeat.properties.coordinates.latitude, long: selectedFeat.properties.coordinates.longitude }})
    } else if (selectedFeat?.properties.feature_type === 'country') {
      onSelect({ country: selectedFeat.properties.context.country?.country_code.toLowerCase() })
    } else {
      onSelect(null)
    }
  }, [selectedFeat, onSelect])

  const reset = () => {
    setSelectedSug(null)
    setSelectedFeat(null)
  }
  useImperativeHandle(ref, () => ({ reset }))

  return <Combobox value={selectedSug} onChange={onSelectSug}>
    <div onClick={onClickCombobox} className='cursor-pointer flex py-1 justify-center items-center gap-3 max-sm:self-stretch sm:h-12 sm:flex-[1_0_0] sm:flex-wrap'>
      <div className='flex p-1.5 items-center gap-1.5 flex-[1_0_0] border-b border-solid border-[#7087F0] sm:self-stretch'>
        <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
          <path d='M8 0.666656C9.5913 0.666656 11.1174 1.2988 12.2426 2.42402C13.3679 3.54923 14 5.07536 14 6.66666C14 9.15066 12.1067 11.7533 8.4 14.5333C8.2846 14.6199 8.14425 14.6667 8 14.6667C7.85575 14.6667 7.7154 14.6199 7.6 14.5333C3.89333 11.7533 2 9.15066 2 6.66666C2 5.07536 2.63214 3.54923 3.75736 2.42402C4.88258 1.2988 6.4087 0.666656 8 0.666656ZM8 4.66666C7.46957 4.66666 6.96086 4.87737 6.58579 5.25244C6.21071 5.62752 6 6.13622 6 6.66666C6 7.19709 6.21071 7.7058 6.58579 8.08087C6.96086 8.45594 7.46957 8.66666 8 8.66666C8.53043 8.66666 9.03914 8.45594 9.41421 8.08087C9.78929 7.7058 10 7.19709 10 6.66666C10 6.13622 9.78929 5.62752 9.41421 5.25244C9.03914 4.87737 8.53043 4.66666 8 4.66666Z' fill='#777777'/>
        </svg>
        <ComboboxInput
          ref={comboboxInputRef}
          aria-label='city/country'
          displayValue={(sug: SearchBoxSuggestion) => sug && `${sug.name}${sug.place_formatted ? `, ${sug.place_formatted}` : ''}`}
          onChange={(event) => onTyping(event.target.value)}
          placeholder='City/Country'
          size={1}
          className='flex-[1_0_0] text-sm font-normal leading-4 text-nowrap text-ellipsis sm:text-lg sm:leading-6 focus-visible:outline-none'
        />
        {!selectedSug && <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
          <path d='M10 13L6 7H14L10 13Z' fill='#777777'/>
        </svg>}
        {selectedSug && <svg width='20' height='20' viewBox='0 0 20 20' fill='none' className='cursor-pointer' onClick={() => onSelectSug(null)}>
          <path d='M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z' fill='black'/>
        </svg>}
      </div>
      <ComboboxOptions anchor='bottom start' className={`flex w-[23.25rem] py-6 [--anchor-gap:0.5rem] flex-col items-center gap-3 rounded-[0.625rem] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.08),0_-4px_4px_0_rgba(0,0,0,0.08)] ${suggestions?.length ? '' : 'hidden'}`}>
          {suggestions.map((sug) => (
          <ComboboxOption key={sug.mapbox_id} value={sug} className='group cursor-pointer select-none flex py-3.5 px-4 items-center gap-1.5 self-stretch border-b border-solid border-[#EEE] data-[focus]:bg-[rgba(112,135,240,0.10)]'>
            <p className='flex-[1_0_0] text-base font-medium leading-5'>{sug.name}{sug.place_formatted ? `, ${sug.place_formatted}` : ''}</p>
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </div>
  </Combobox>
}

export default forwardRef(LocationCombobox)
