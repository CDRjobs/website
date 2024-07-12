import { createId } from '@paralleldrive/cuid2'

const useMapboxSessionId = () => {
  let mapboxSessionId = localStorage.getItem('mapboxSessionId')
  if (mapboxSessionId) {
    return mapboxSessionId
  }
  
  mapboxSessionId = createId()
  localStorage.setItem('mapboxSessionId', mapboxSessionId)
  
  return mapboxSessionId
}

export default useMapboxSessionId