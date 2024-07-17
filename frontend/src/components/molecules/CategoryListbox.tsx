import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react'

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

export interface CategoryListboxRef {
  reset: () => void;
}

const CategoryListbox = ({ onSelect }: Props, ref: ForwardedRef<CategoryListboxRef>) => {
  const [selectedCatKey, setSelectedCatKey] = useState<CategoriesKeys | null>(null)

  useEffect(() => { onSelect(selectedCatKey) }, [selectedCatKey, onSelect])
  const reset = () => setSelectedCatKey(null)
  useImperativeHandle(ref, () => ({ reset }))

  return <Listbox value={selectedCatKey} onChange={setSelectedCatKey}>
    <div className='flex py-1 justify-center items-center gap-3 max-sm:self-stretch sm:h-12 sm:flex-[1_0_0] sm:flex-wrap'>
      <ListboxButton className='flex p-1.5 items-center gap-2 flex-[1_0_0] border-b border-solid border-[#7087F0] sm:self-stretch'>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_5_78)">
            <path d="M6.3 8.4H0.7V12.6C0.7 12.9713 0.8475 13.3274 1.11005 13.5899C1.3726 13.8525 1.7287 14 2.1 14H11.9C12.2713 14 12.6274 13.8525 12.8899 13.5899C13.1525 13.3274 13.3 12.9713 13.3 12.6V8.4H7.7V9.8H6.3V8.4ZM6.3 7.7H0V3.5C0 2.73 0.63 2.1 1.4 2.1H4.2V1.4C4.2 1.0287 4.3475 0.672601 4.61005 0.410051C4.8726 0.1475 5.2287 0 5.6 0L8.4 0C8.7713 0 9.1274 0.1475 9.38995 0.410051C9.6525 0.672601 9.8 1.0287 9.8 1.4V2.1H12.6C12.9713 2.1 13.3274 2.2475 13.5899 2.51005C13.8525 2.7726 14 3.1287 14 3.5V7.7H7.7V6.3H6.3V7.7ZM8.4 2.1V1.4H5.6V2.1H8.4Z" fill="#777777"/>
          </g>
          <defs>
            <clipPath id="clip0_5_78">
              <rect width="14" height="14" fill="white"/>
            </clipPath>
          </defs>
        </svg>
        <div className='w-full table table-fixed'>
          <p className='flex-[1_0_0] text-sm leading-4 text-left font-normal truncate sm:text-lg sm:leading-5'>
            {selectedCatKey && categories[selectedCatKey]}
            {!selectedCatKey && <span className='text-[#9ca3af]'>Job Category</span>}
          </p>
        </div>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 13L6 7H14L10 13Z" fill="#777777"/>
        </svg>
      </ListboxButton>
    </div>
    <ListboxOptions anchor="bottom start" className='flex py-5 px-4 [--anchor-gap:0.5rem] flex-col items-center gap-2 rounded-[0.625rem] min-w-[10rem] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.08),0_-4px_4px_0_rgba(0,0,0,0.08)]'>
      <div className='flex flex-col items-center gap-2.5 self-stretch'>
        {Object.entries(categories).map(([key, value]) => (
          <ListboxOption key={key} value={key} className='group cursor-pointer select-none flex h-8 py-1 px-0.5 items-center gap-1.5 self-stretch border-b border-solid border-[#CCC] data-[focus]:bg-[rgba(112,135,240,0.10)]'>
              <p className='flex-[1_0_0] text- pr-2 font-medium leading-6'>{value}</p>
          </ListboxOption>
        ))}
      </div>
    </ListboxOptions>
  </Listbox>
}


export default forwardRef(CategoryListbox)