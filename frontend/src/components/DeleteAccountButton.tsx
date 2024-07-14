import { useMutation, gql } from '@apollo/client'
import { useAuth } from '@/context/AuthContext'
import Button from './atoms/MainButton'

const deleteAccountMutation = gql`
  mutation DeleteAccount {
    deleteAccount {
      id
    }
  }
`

const DeleteAccountButton = () => {
  const { setAuthUser } = useAuth()
  const [deleteAccountMutate] = useMutation(deleteAccountMutation)

  const onClick = async () => {
    const res = await deleteAccountMutate()
    if (res.data.deleteAccount.id) {
      setAuthUser(null)
    }
  }

  return <Button onClick={onClick} text='Delete account' />
}

export default DeleteAccountButton