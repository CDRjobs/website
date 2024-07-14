import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useForm, SubmitHandler } from 'react-hook-form'
import TextInput from './atoms/TextInput'
import Button from './atoms/MainButton'

const ForgotPasswordMutation = gql`
  mutation ForgotPassword ($email: String!) {
    forgotPassword(email: $email)
  }
`

type Inputs = {
  email: string
}

const ForgotPasswordForm = () => {
  const { register, handleSubmit } = useForm<Inputs>()
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [forgotPasswordMutate] = useMutation(ForgotPasswordMutation)

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const res = await forgotPasswordMutate({ variables: data })
    if (res.data.forgotPassword) {
      setHasSubmitted(true)
    }
  }


  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col items-center w-64 gap-2 my-2'>
          <TextInput placeholder='Email' type='email' {...register('email', { required: true })} />
          <Button onClick={handleSubmit(onSubmit)} text='Send reset link' disabled={hasSubmitted} />
          {hasSubmitted && <p>If you have an account, a reset link has been sent to your email address</p>}
        </div>
      </form>
    </div>
    )
}

export default ForgotPasswordForm