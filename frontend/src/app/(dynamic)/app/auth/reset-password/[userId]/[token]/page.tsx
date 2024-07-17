'use client'

import ResetPasswordForm from '@/components/ResetPasswordForm'

const Page = (props: { params: { userId: string, token: string } }) => {
  const { userId, token } = props.params

  return <div>
    <ResetPasswordForm userId={userId} token={token} />
  </div>
}

export default Page


