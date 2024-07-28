import * as amplitude from '@amplitude/analytics-browser'

const initializeAmplitude = () => {
  amplitude.init(
    process.env.NEXT_PUBLIC_AMPLITUDE_KEY!,
    { 
      serverZone: 'EU',
      defaultTracking: true,
    },
  )
}

export default initializeAmplitude