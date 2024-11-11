type ViewJobButtonProps = {
  url: string
  onClick?: () => any
}

const ViewJobButton = (props: ViewJobButtonProps) => {
  return <a className='flex p-1.5 justify-center items-center gap-0.5 rounded-sm bg-[#132D59]' href={props.url} target='_blank' onClick={props.onClick}>
    <p className='text-white text-sm font-medium leading-4 font-manrope'>View Job</p>
    <svg className='inline' width='17' height='16' viewBox='0 0 17 16' fill='none'>
      <path d='M14.5011 8.92436V13.079C14.5011 13.3238 14.4038 13.5587 14.2307 13.7318C14.0575 13.905 13.8227 14.0022 13.5778 14.0022H3.42211C3.17725 14.0022 2.94242 13.905 2.76928 13.7318C2.59614 13.5587 2.49887 13.3238 2.49887 13.079V2.92325C2.49887 2.67839 2.59614 2.44356 2.76928 2.27041C2.94242 2.09727 3.17725 2 3.42211 2H7.57673M11.2697 2H14.5011M14.5011 2V5.23137M14.5011 2L8.49998 8.00112' stroke='white' strokeWidth='0.923249' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  </a>
}

export default ViewJobButton