import { useMutation, gql } from '@apollo/client'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/atoms/Button'
import TextInput from '@/components/atoms/TextInput'

const registerMutation = gql`
  mutation Register ($firstname: String!, $lastname: String!, $email: String!, $password: String!) {
    register(email: $email, firstname: $firstname, lastname: $lastname, password: $password) {
      id
      firstname
      lastname
      email
    }
  }
`

type Inputs = {
  firstname: string
  lastname: string
  email: string
  password: string
}

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
  } = useForm<Inputs>()
  
  const { setAuthUser } = useAuth()

  const [registerMutate] = useMutation(registerMutation)

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const res = await registerMutate({ variables: data })
    if (res.data.register.id) {
      setAuthUser(res.data.register)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col items-center w-64 gap-2 my-2'>
          <div className='flex w-full gap-2'>
            <TextInput placeholder='Firstname' {...register('firstname', { required: true })} />
            <TextInput placeholder='Lastname' {...register('lastname', { required: true })} />
          </div>
          <TextInput placeholder='email' type='email' {...register('email', { required: true })} />
          <TextInput placeholder='password' type='password' {...register('password', { required: true })} />
          <Button onClick={handleSubmit(onSubmit)} text='Register' />
        </div>
      </form>
    </div>
    )
}

export default RegisterForm


