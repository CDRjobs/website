import { Remote } from '@prisma/client'

const remoteMap = {
  yes: 'Remote',
  hybrid: 'Hybrid',
  no: 'On-Site',
}

export const remoteToText = (remote: Remote) => {
  return remoteMap[remote]
}