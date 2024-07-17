import { useMutation, gql } from '@apollo/client'
import { useAuth } from '@/context/AuthContext'
import MainButton from './atoms/MainButton'

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

  return <MainButton onClick={onClick}>Delete account</MainButton>
}

export default DeleteAccountButton