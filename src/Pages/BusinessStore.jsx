import React from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../Component/Navbar'
import BusinessStoreComponent from '../Component/BusinessStore'
import Footer from '../Component/Footer'
import UpgradeToBusinessStore from '../Component/UpgradeToBusinessStore'

function BusinessStore() {
  const userDetails = useSelector((store) => store.auth?.userDetail?.data || {})
  const businessStore = useSelector((store) => store.store.businessStore)

  // Check if user has a business store
  const hasBusinessStore = Boolean(businessStore?.data?.id || userDetails?.is_business_store)

  // If user doesn't have a business store, show upgrade page
  if (!hasBusinessStore) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-background pt-20">
          <div className="page-container py-8">
            <UpgradeToBusinessStore />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
        <Navbar />
        <BusinessStoreComponent />
        <Footer />
    </div>
  )
}

export default BusinessStore