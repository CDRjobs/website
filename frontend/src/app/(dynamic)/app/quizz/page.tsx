'use client'

import { useAuth } from '@/context/AuthContext'
import RegisterForm from '@/components/RegisterForm'
import LogoutButton from '@/components/LogoutButton'
import LoginForm from '@/components/LoginForm'
import DeleteAccountButton from '@/components/DeleteAccountButton'

const Page = () => {
  const { authUser } = useAuth()

  return <div>
    {authUser && <div className='flex flex-col items-center w-64 gap-2 my-2'>
      <LogoutButton />
      <DeleteAccountButton />
      </div>}
    {!authUser && <RegisterForm />}
    {!authUser && <LoginForm />}
  </div>
}

export default Page


