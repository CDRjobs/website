import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Label } from '@headlessui/react'
import { useEffect, useState } from 'react'
import mapbox from '@/lib/mapbox'
import { SearchBoxSuggestion } from '@mapbox/search-js-core'
import useMapboxSessionId from '@/hooks/useMapboxSessionId'

type Props = {
  onSelect: (suggestion: SearchBoxSuggestion | null) => void
}

const MapboxSearch = ({ onSelect }: Props) => {
  const [suggestions, setSuggestions] = useState<SearchBoxSuggestion[]>([])
  const [selectedSug, setSelectedSug] = useState<SearchBoxSuggestion | null>(null)
  const sessionToken = useMapboxSessionId()

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

  useEffect(() => { onSelect(selectedSug) }, [selectedSug, onSelect])

  return <Combobox value={selectedSug} onChange={setSelectedSug}>
    <div className='flex h-12 py-1 justify-center items-center gap-3 flex-[1_0_0] flex-wrap'>
      <div className='flex p-1.5 items-center gap-1.5 flex-[1_0_0] self-stretch border-b border-solid border-[#7087F0]'>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 0.666656C9.5913 0.666656 11.1174 1.2988 12.2426 2.42402C13.3679 3.54923 14 5.07536 14 6.66666C14 9.15066 12.1067 11.7533 8.4 14.5333C8.2846 14.6199 8.14425 14.6667 8 14.6667C7.85575 14.6667 7.7154 14.6199 7.6 14.5333C3.89333 11.7533 2 9.15066 2 6.66666C2 5.07536 2.63214 3.54923 3.75736 2.42402C4.88258 1.2988 6.4087 0.666656 8 0.666656ZM8 4.66666C7.46957 4.66666 6.96086 4.87737 6.58579 5.25244C6.21071 5.62752 6 6.13622 6 6.66666C6 7.19709 6.21071 7.7058 6.58579 8.08087C6.96086 8.45594 7.46957 8.66666 8 8.66666C8.53043 8.66666 9.03914 8.45594 9.41421 8.08087C9.78929 7.7058 10 7.19709 10 6.66666C10 6.13622 9.78929 5.62752 9.41421 5.25244C9.03914 4.87737 8.53043 4.66666 8 4.66666Z" fill="#777777"/>
        </svg>
        <ComboboxInput
          aria-label="city/country"
          displayValue={(sug: SearchBoxSuggestion) => sug && `${sug.name} ${sug.place_formatted}`}
          onChange={(event) => onTyping(event.target.value)}
          placeholder='City/Country'
          className='flex-[1_0_0] text-lg font-normal leading-5 text-nowrap text-ellipsis'
        />
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 13L6 7H14L10 13Z" fill="#777777"/>
        </svg>
      </div>
      <ComboboxOptions anchor="bottom">
        {suggestions.map((sug) => (
          <ComboboxOption key={sug.mapbox_id} value={sug} className="data-[focus]:bg-blue-100">
            {sug.name} {sug.place_formatted}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </div>
  </Combobox>
}

export default MapboxSearch
