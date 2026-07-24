import React from 'react'
import { useSelector } from 'react-redux'
import UnifiedNavbar from '../Component/UnifiedNavbar'
import MyStoreAds from '../Component/MyStoreAds'
import Footer from '../Component/Footer'
import UpgradeToStore from '../Component/UpgradeToStore'

function MyStore() {
  const userDetails = useSelector((store) => store.auth?.userDetail?.data || {})
  const storeDetail = useSelector((store) => store.store.storeDetail)

  // Check if user has a store
  const hasStore = storeDetail?.data?.store_id || userDetails?.is_has_store

  // If user doesn't have a store, show upgrade page
  if (!hasStore) {
    return (
      <div>
        <UnifiedNavbar />
        <div className="min-h-screen bg-background pt-20">
          <div className="page-container py-8">
            <UpgradeToStore />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
        <UnifiedNavbar />
        <MyStoreAds />
        <Footer />
    </div>
  )
}

export default MyStore