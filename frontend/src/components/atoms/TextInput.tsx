import { forwardRef } from 'react'

type Props = Record<string, any>;

const TextInput = (props: Props, ref: React.ForwardedRef<HTMLInputElement>) => {
 return <input className='px-1 w-full' {...props} ref={ref} />
}

export default forwardRef(TextInput)