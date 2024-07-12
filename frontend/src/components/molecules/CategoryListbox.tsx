import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Field, Label } from '@headlessui/react'
import { useEffect, useState } from 'react'

const categories = {
  administrativeAndSupport: 'Administrative and Support',
  businessDevelopmentAndSales: 'Business Development and Sales',
  engineering: 'Engineering',
  financialAndLegal: 'Financial and Legal',
  humanResourcesAndPeopleManagement: 'Human Resources and People Management',
  maintenanceAndTechnicians: 'Maintenance and Technicians',
  marketingAndCommunications: 'Marketing and Communications',
  operationsAndProjectManagement: 'Operations and Project Management',
  policy: 'Policy',
  researchAndDevelopment: 'Research and Development',
  softwareEngineering: 'Sofware Engineering',
  strategyAndConsulting: 'Stragegy and Consulting',
  sustainability: 'Sustainability',
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