import React, { Suspense } from 'react'
import ProviderBookingsDashboard from './ProviderBookingsDashboard'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <ProviderBookingsDashboard />
    </Suspense>
  )
}

export default page