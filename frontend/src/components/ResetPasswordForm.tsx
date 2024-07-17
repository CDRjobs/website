'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, gql } from '@apollo/client'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext'
import MainButton from '@/components/atoms/MainButton'
import TextInput from '@/components/atoms/TextInput'

const ResetPasswordMutation = gql`
  mutation ResetPassword ($password: String!, $userId: String!, $token: String!) {
    resetPassword(password: $password, userId: $userId token: $token) {
      id
      firstname
      lastname
      email
    }
  }
`

type Props = {
  userId: string,
  token: string,
}

type Inputs = {
  password: string
}

const ResetPasswordForm = ({ userId, token }: Props) => {
  const { register, handleSubmit } = useForm<Inputs>()
  const { setAuthUser } = useAuth()
  const router = useRouter()
  const [ResetPasswordMutate] = useMutation(ResetPasswordMutation)
  const [isTokenInvalid, setIsTokenInvalid] = useState(false)

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const res = await ResetPasswordMutate({ variables: { userId, token, password: data.password} })
      if (res.data.resetPassword.id) {
        setAuthUser(res.data.resetPassword)
        router.push('/app/quizz')
      } else {
        setIsTokenInvalid(true)
      }
    } catch (e) {
      setIsTokenInvalid(true)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col items-center w-64 gap-2 my-2'>
          <TextInput placeholder='New password' type='password' {...register('password', { required: true })} />
          <MainButton onClick={handleSubmit(onSubmit)}>Reset password</MainButton>
          {isTokenInvalid && <p>The token has expired</p>}
        </div>
      </form>
    </div>
    )
}

export default ResetPasswordForm


