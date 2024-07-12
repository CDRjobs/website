import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Label } from '@headlessui/react'
import { useEffect, useState } from 'react'
import mapbox from '@/lib/mapbox'
import { SearchBoxSuggestion } from '@mapbox/search-js-core'
import useMapboxSessionId from '@/app/hooks/useMapboxSessionId'

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

  return <Field className='w-full'>
    <Combobox value={selectedSug} onChange={setSelectedSug}>
      <ComboboxInput
        aria-label="city/country"
        displayValue={(sug: SearchBoxSuggestion) => sug ? `${sug.name} ${sug.place_formatted}` : 'Country or City'}
        onChange={(event) => onTyping(event.target.value)}
        className='w-full'
      />
      <ComboboxOptions anchor="bottom">
        {suggestions.map((sug) => (
          <ComboboxOption key={sug.mapbox_id} value={sug} className="data-[focus]:bg-blue-100">
            {sug.name} {sug.place_formatted}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  </Field>
}

export default MapboxSearch