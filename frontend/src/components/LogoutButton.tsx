import { useMutation, gql } from '@apollo/client'
import { useAuth } from '@/context/AuthContext'
import Button from './atoms/MainButton'

const LogoutMutation = gql`
  mutation Logout {
    logout
  }
`

const LogoutButton = () => {
  const { setAuthUser } = useAuth()
  const [logoutMutate] = useMutation(LogoutMutation)

  const onClick = async () => {
    const res = await logoutMutate()
    if (res.data.logout) {
      setAuthUser(null)
    }
  }

  return <Button onClick={onClick} text='Logout' />
}

export default LogoutButton