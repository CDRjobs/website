import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Field, Label } from '@headlessui/react'
import { useEffect, useState } from 'react'

const categories = {
  strategyAndConsulting: 'Stragegy and Consulting',
  sustainability: 'Sustainability',
  operationsAndProjectManagement: 'Operations and Project Management',
  researchAndDevelopment: 'Research and Development',
  businessDevelopmentAndSales: 'Business Development and Sales',
  policy: 'Policy',
  engineering: 'Engineering',
  softwareEngineering: 'Sofware Engineering',
  marketingAndCommunications: 'Marketing and Communications',
  administrativeAndSupport: 'Administrative and Support',
  financialAndLegal: 'Financial and Legal',
  humanResourcesAndPeopleManagement: 'Human Resources and People Management',
  maintenanceAndTechnicians: 'Maintenance and Technicians',
}

type CategoriesKeys = keyof typeof categories

type Props = {
  onSelect: (categoryKey: string | null) => void
}

const CategoryListbox = ({ onSelect }: Props) => {
  const [selectedCatKey, setSelectedCatKey] = useState<CategoriesKeys | null>(null)

  useEffect(() => { onSelect(selectedCatKey) }, [selectedCatKey, onSelect])

  return <Field className='w-full'>
  <Listbox value={selectedCatKey} onChange={setSelectedCatKey}>
    <ListboxButton className='w-full'>{selectedCatKey ? categories[selectedCatKey]: 'Category'}</ListboxButton>
    <ListboxOptions anchor="bottom">
      {Object.entries(categories).map(([key, value]) => (
        <ListboxOption key={key} value={key} className="data-[focus]:bg-blue-100">
          {value}
        </ListboxOption>
      ))}
    </ListboxOptions>
  </Listbox>
</Field>
}

export default CategoryListbox