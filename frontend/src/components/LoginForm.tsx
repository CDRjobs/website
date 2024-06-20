import { useMutation, gql } from '@apollo/client'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/atoms/Button'
import TextInput from '@/components/atoms/TextInput'

const LoginMutation = gql`
  mutation Login ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      firstname
      lastname
      email
    }
  }
`

type Inputs = {
  email: string
  password: string
}

const LoginForm = () => {
  const {
    register,
    handleSubmit,
  } = useForm<Inputs>()
  
  const { setAuthUser } = useAuth()

  const [loginMutate] = useMutation(LoginMutation)

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const res = await loginMutate({ variables: data })
    if (res.data.login.id) {
      setAuthUser(res.data.login)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col items-center w-64 gap-2 my-2'>
          <TextInput placeholder='email' type='email' {...register('email', { required: true })} />
          <TextInput placeholder='password' type='password' {...register('password', { required: true })} />
          <Button onClick={handleSubmit(onSubmit)} text='Login' />
          <a href='/app/auth/forgot-password'>forgotten password?</a>
        </div>
      </form>
    </div>
    )
}

export default LoginForm


