import { Root, Trigger, Portal, Value, Viewport, Content, Item, ItemText } from '@radix-ui/react-select'
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

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
  strategyAndConsulting: 'Strategy and Consulting',
  sustainability: 'Sustainability',
}

type CategoriesKeys = keyof typeof categories

type Props = {
  onSelect: (categoryKey: string | null) => void
}

export interface CategoryListboxRef {
  reset: () => void
}

const CategoryListbox = ({ onSelect }: Props, ref: ForwardedRef<CategoryListboxRef>) => {  
  const triggerButtonRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const onClickExitCross = () => setOpen(false)
  const [selectedCatKey, setSelectedCatKey] = useState<CategoriesKeys | null>(null)

  useEffect(() => { onSelect(selectedCatKey) }, [selectedCatKey, onSelect])

  const placeholder = <span className='text-[#9ca3af]'>Job Category</span>
  
  const reset = () => setSelectedCatKey(null)
  useImperativeHandle(ref, () => ({ reset }))

  return <Root open={open} onOpenChange={setOpen} value={selectedCatKey || undefined} onValueChange={(value: CategoriesKeys) => setSelectedCatKey(value)}>
    <div className='flex py-1 justify-center items-center max-sm:self-stretch sm:h-12 sm:flex-[1_0_0] sm:flex-wrap'>
      <div className='flex p-1.5 items-center gap-2 border-b border-solid border-[#7087F0]'>
        <Trigger ref={triggerButtonRef} aria-label="Job Cagegory" className="flex items-center gap-2 flex-[1_0_0] sm:self-stretch">
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
            {selectedCatKey && <p className='flex-[1_0_0] text-sm leading-4 text-left font-normal truncate sm:text-lg sm:leading-6'>
              <Value>{categories[selectedCatKey]}</Value>
            </p>}
            {!selectedCatKey && <p className='flex-[1_0_0] text-sm text-[#9ca3af] leading-4 text-left font-normal truncate sm:text-lg sm:leading-6'>
              <Value placeholder={placeholder} >Job Category</Value>
            </p>}
          </div>
        </Trigger>
        {!selectedCatKey && <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 13L6 7H14L10 13Z" fill="#777777"/>
        </svg>}
        {selectedCatKey && <svg width='16' height='16' viewBox='0 0 20 20' fill='none' className='cursor-pointer m-0.5' onClick={(e) => { console.log('ouui') ; e.stopPropagation(); setSelectedCatKey(null) }}>
          <path d='M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z' fill='black'/>
        </svg>}
      </div>
      <Portal>
        <Content position="popper" className="max-h-[var(--radix-select-content-available-height)]">
          <Viewport className='flex w-[23.25rem] py-6 my-2 flex-col items-center gap-3 rounded-[0.625rem] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.08),0_-4px_4px_0_rgba(0,0,0,0.08)]' >
            <div className='flex pr-4 justify-end items-center gap-1.5 self-stretch'>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' className='cursor-pointer' onClick={onClickExitCross}>
                <path d='M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z' fill='black'/>
              </svg>
            </div>
            {Object.entries(categories).map(([key, value]) => (
              <Item key={key} value={key} className='group outline-none cursor-pointer select-none flex py-3.5 px-4 items-center gap-1.5 self-stretch border-b border-solid border-[#EEE] data-[highlighted]:bg-[rgba(112,135,240,0.10)]'>
                <div className='flex-[1_0_0] text-base font-medium leading-5'>
                  <ItemText>{value}</ItemText>
                </div>
                <svg className='group-data-[state=checked]:hidden' width='20' height='20' viewBox='0 0 20 20' fill='none'>
                  <path fillRule='evenodd' clipRule='evenodd' d='M9.99996 16.6667C11.7681 16.6667 13.4638 15.9643 14.714 14.714C15.9642 13.4638 16.6666 11.7681 16.6666 9.99999C16.6666 8.23188 15.9642 6.53619 14.714 5.28594C13.4638 4.0357 11.7681 3.33332 9.99996 3.33332C8.23185 3.33332 6.53616 4.0357 5.28591 5.28594C4.03567 6.53619 3.33329 8.23188 3.33329 9.99999C3.33329 11.7681 4.03567 13.4638 5.28591 14.714C6.53616 15.9643 8.23185 16.6667 9.99996 16.6667ZM9.99996 18.3333C14.6025 18.3333 18.3333 14.6025 18.3333 9.99999C18.3333 5.39749 14.6025 1.66666 9.99996 1.66666C5.39746 1.66666 1.66663 5.39749 1.66663 9.99999C1.66663 14.6025 5.39746 18.3333 9.99996 18.3333Z' fill='#CCCCCC'/>
                </svg>
                  <svg className='hidden group-data-[state=checked]:block' width='20' height='20' viewBox='0 0 20 20' fill='none'>
                    <path fillRule='evenodd' clipRule='evenodd' d='M10 17.5C10.9849 17.5 11.9602 17.306 12.8701 16.9291C13.7801 16.5522 14.6069 15.9997 15.3033 15.3033C15.9997 14.6069 16.5522 13.7801 16.9291 12.8701C17.306 11.9602 17.5 10.9849 17.5 10C17.5 9.01509 17.306 8.03982 16.9291 7.12987C16.5522 6.21993 15.9997 5.39314 15.3033 4.6967C14.6069 4.00026 13.7801 3.44781 12.8701 3.0709C11.9602 2.69399 10.9849 2.5 10 2.5C8.01088 2.5 6.10322 3.29018 4.6967 4.6967C3.29018 6.10322 2.5 8.01088 2.5 10C2.5 11.9891 3.29018 13.8968 4.6967 15.3033C6.10322 16.7098 8.01088 17.5 10 17.5ZM9.80667 13.0333L13.9733 8.03333L12.6933 6.96667L9.11 11.2658L7.25583 9.41083L6.0775 10.5892L8.5775 13.0892L9.2225 13.7342L9.80667 13.0333Z' fill='#7087F0'/>
                  </svg>
              </Item>
            ))}
          </Viewport>
        </Content>
      </Portal>
    </div>
	</Root>
}

export default forwardRef(CategoryListbox)
