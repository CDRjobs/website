import React from 'react'

type Props = {
  children: React.ReactNode
  onClick: (event: React.MouseEvent) => void
  loading?: boolean
  disabled?: boolean
  fixedSize?: boolean
}

const Button = (props: Props) => {
  return (
    <button
      onClick={props.onClick}
      disabled={props.loading || props.disabled}
      className={`${props.fixedSize ? 'sm:w-72' : ''} relative flex py-2.5 px-2 flex-col justify-center items-center gap-2.5 flex-[1_0_0] rounded bg-[#7087F0] self-stretch md:self-auto md:py-3.5`}
    >
      <div className={`absolute inset-0 flex justify-center items-center transition-opacity duration-300 ${props.loading ? 'opacity-100' : 'opacity-0'}`}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 100 100'
          preserveAspectRatio='xMidYMid'
          style={{ shapeRendering: 'auto', display: 'block', background: 'transparent' }}
          width='16'
          height='16'
          xmlnsXlink='http://www.w3.org/1999/xlink'
        >
          <g>
            <path stroke='none' fill='#ffffff' d='M10 50A40 40 0 0 0 90 50A40 42.5 0 0 1 10 50'>
              <animateTransform
                values='0 50 51.25;360 50 51.25'
                keyTimes='0;1'
                repeatCount='indefinite'
                dur='1.25s'
                type='rotate'
                attributeName='transform'
              ></animateTransform>
            </path>
            <g></g>
          </g>
        </svg>
      </div>
      <div className={`flex items-center gap-2.5 transition-opacity duration-300 ${props.loading ? 'opacity-0' : 'opacity-100'}`}>
        <p className='text-white text-lg font-medium leading-5'>
          {props.children}
        </p>
      </div>
    </button>
  )
}

export default Button
