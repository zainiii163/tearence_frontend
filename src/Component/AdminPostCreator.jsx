import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAdsList } from '../slice/ListSlice';
import { getUserDetails } from '../slice/AuthSlice';
import { getStore, getBusinessStore } from '../slice/StoreSlice';
import { createListingWithPosterName } from '../utils/posterHelper';
import { toast } from 'react-hot-toast';
import { FaPlus, FaStore, FaBuilding } from 'react-icons/fa';

const AdminPostCreator = () => {
  const dispatch = useDispatch();
  const { userDetail } = useSelector((state) => state.auth);
  const { businessStore, storeDetail } = useSelector((state) => state.store);
  
  const [showModal, setShowModal] = useState(false);
  const [postData, setPostData] = useState({
    title: '',
    description: '',
    category_id: '',
    price: '',
    currency_id: 1,
    location_id: '',
    posterContext: 'user', // 'user', 'business', 'store'
    selectedBusiness: null,
    selectedStore: null
  });

  useEffect(() => {
    if (!userDetail) {
      dispatch(getUserDetails());
    }
    // Load business and store data for admin
    dispatch(getBusinessStore());
    dispatch(getStore());
  }, [dispatch, userDetail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!postData.title || !postData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let businessStoreData = null;
      let storeDetailData = null;
      let isAdmin = true;

      // Set appropriate business/store context based on selection
      if (postData.posterContext === 'business' && postData.selectedBusiness) {
        businessStoreData = postData.selectedBusiness;
      } else if (postData.posterContext === 'store' && postData.selectedStore) {
        storeDetailData = postData.selectedStore;
      } else if (postData.posterContext === 'business') {
        // Use first available business if none selected
        businessStoreData = businessStore;
      } else if (postData.posterContext === 'store') {
        // Use first available store if none selected
        storeDetailData = storeDetail;
      }

      // Create enhanced listing data with proper poster name
      const enhancedPostData = await createListingWithPosterName(
        postData,
        userDetail?.data || userDetail,
        businessStoreData,
        storeDetailData,
        isAdmin
      );

      await dispatch(
        createAdsList({
          formData: enhancedPostData,
        })
      ).unwrap();

      toast.success('Admin post created successfully');
      setShowModal(false);
      // Reset form
      setPostData({
        title: '',
        description: '',
        category_id: '',
        price: '',
        currency_id: 1,
        location_id: '',
        posterContext: 'user',
        selectedBusiness: null,
        selectedStore: null
      });
    } catch (error) {
      toast.error('Failed to create admin post');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <FaPlus />
        Create Admin Post
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Create Admin Post</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Poster Context Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Post As:</label>
                <div className="grid grid-cols-3 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="posterContext"
                      value="user"
                      checked={postData.posterContext === 'user'}
                      onChange={handleChange}
                    />
                    <span>User ({userDetail?.name})</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="posterContext"
                      value="business"
                      checked={postData.posterContext === 'business'}
                      onChange={handleChange}
                    />
                    <FaBuilding className="text-blue-600" />
                    <span>Business</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="posterContext"
                      value="store"
                      checked={postData.posterContext === 'store'}
                      onChange={handleChange}
                    />
                    <FaStore className="text-green-600" />
                    <span>Store</span>
                  </label>
                </div>
              </div>

              {/* Business/Store Selection */}
              {postData.posterContext === 'business' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Select Business:</label>
                  <select
                    name="selectedBusiness"
                    value={postData.selectedBusiness?.id || ''}
                    onChange={(e) => {
                      const business = Array.isArray(businessStore) 
                        ? businessStore.find(b => b.id === e.target.value)
                        : businessStore;
                      setPostData(prev => ({ ...prev, selectedBusiness: business }));
                    }}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Default Business</option>
                    {Array.isArray(businessStore) && businessStore.map(business => (
                      <option key={business.id} value={business.id}>
                        {business.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {postData.posterContext === 'store' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Select Store:</label>
                  <select
                    name="selectedStore"
                    value={postData.selectedStore?.id || ''}
                    onChange={(e) => {
                      const store = Array.isArray(storeDetail) 
                        ? storeDetail.find(s => s.id === e.target.value)
                        : storeDetail;
                      setPostData(prev => ({ ...prev, selectedStore: store }));
                    }}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Default Store</option>
                    {Array.isArray(storeDetail) && storeDetail.map(store => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Standard Post Fields */}
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={postData.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  name="description"
                  value={postData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded h-32"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category ID</label>
                  <input
                    type="number"
                    name="category_id"
                    value={postData.category_id}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={postData.price}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPostCreator;
