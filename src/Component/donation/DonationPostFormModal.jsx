import React, { useState, useEffect } from 'react';
import { MdCancel } from 'react-icons/md';
import { FaHeart, FaUpload, FaPlus, FaTrash } from 'react-icons/fa';
import donationAPI from '../../api/donationAPI';
import { mapDonationToForm, resolveStorageUrl } from '../../utils/dashboardEditMappers';

const DonationPostFormModal = ({ onClose, onSuccess, editDonation = null }) => {
  const isEditing = Boolean(editDonation?.id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    story: '',
    category: 'disaster',
    organizer_name: '',
    organizer_email: '',
    organizer_phone: '',
    goal_amount: '',
    currency: 'USD',
    deadline: '',
    country: '',
    city: '',
    cover_image: null,
    images: [],
    video_url: '',
    beneficiaries: [{ name: '', relationship: '', age: '' }],
    use_of_funds: '',
    milestones: [{ milestone: '', expected_date: '' }],
  });

  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);

  const categories = [
    { id: 'medical', name: 'Medical' },
    { id: 'education', name: 'Education' },
    { id: 'disaster', name: 'Disaster Relief' },
    { id: 'community', name: 'Community' },
    { id: 'animals', name: 'Animals' },
    { id: 'environment', name: 'Environment' },
    { id: 'other', name: 'Other' },
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'PKR'];

  useEffect(() => {
    if (!editDonation) return;
    setFormData(mapDonationToForm(editDonation));
    const cover = editDonation.cover_image || editDonation.image;
    if (cover) setCoverImagePreview(resolveStorageUrl(cover));
    const extraImages = Array.isArray(editDonation.images)
      ? editDonation.images
      : typeof editDonation.images === 'string'
        ? (() => { try { return JSON.parse(editDonation.images); } catch { return []; } })()
        : [];
    if (extraImages.length) {
      setAdditionalImagePreviews(extraImages.map((img) => resolveStorageUrl(img)).filter(Boolean));
    }
  }, [editDonation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, cover_image: file }));
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setAdditionalImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeAdditionalImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addBeneficiary = () => {
    setFormData(prev => ({
      ...prev,
      beneficiaries: [...prev.beneficiaries, { name: '', relationship: '', age: '' }]
    }));
  };

  const removeBeneficiary = (index) => {
    setFormData(prev => ({
      ...prev,
      beneficiaries: prev.beneficiaries.filter((_, i) => i !== index)
    }));
  };

  const handleBeneficiaryChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      beneficiaries: prev.beneficiaries.map((b, i) => 
        i === index ? { ...b, [field]: value } : b
      )
    }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { milestone: '', expected_date: '' }]
    }));
  };

  const removeMilestone = (index) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const handleMilestoneChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((m, i) => 
        i === index ? { ...m, [field]: value } : m
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await donationAPI.updateDonation(editDonation.id, formData);
      } else {
        await donationAPI.createDonation(formData);
      }
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.errors || err.message || 'Failed to create donation campaign');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4" onClick={onClose}>
      <div className="rounded-lg border bg-card text-card-foreground shadow-lg w-full max-w-4xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto relative p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute right-2 sm:right-4 top-2 sm:top-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 sm:h-10 sm:w-10"
          onClick={onClose}
        >
          <MdCancel className="h-4 w-4" />
        </button>

        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 pr-8 sm:pr-12">
          <h2 className="text-xl sm:text-2xl font-semibold leading-none tracking-tight">
            {isEditing ? 'Edit Donation Campaign' : 'Create Donation Campaign'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isEditing ? 'Update your campaign details below' : 'Fill in the details to create a new donation campaign'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {typeof error === 'string' ? error : Object.values(error).flat().join(', ')}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium mb-1">Campaign Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Give your campaign a compelling title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Brief description of your campaign (min 50 characters)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Your Story</label>
              <textarea
                name="story"
                value={formData.story}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Tell the story behind your campaign"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Currency *</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {currencies.map(curr => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Organizer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Organizer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Organizer Name *</label>
                <input
                  type="text"
                  name="organizer_name"
                  value={formData.organizer_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Your name or organization name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Organizer Email *</label>
                <input
                  type="email"
                  name="organizer_email"
                  value={formData.organizer_email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Your email address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Organizer Phone</label>
              <input
                type="text"
                name="organizer_phone"
                value={formData.organizer_phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Your phone number (optional)"
              />
            </div>
          </div>

          {/* Step 3: Funding Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Funding Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Goal Amount *</label>
                <input
                  type="number"
                  name="goal_amount"
                  value={formData.goal_amount}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Amount you want to raise"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Campaign deadline (optional)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Your country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Your city (optional)"
                />
              </div>
            </div>
          </div>

          {/* Step 4: Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Media</h3>
            
            <div>
              <label className="block text-sm font-medium mb-1">Cover Image</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <FaUpload />
                  <span>Upload Cover Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden"
                  />
                </label>
                {coverImagePreview && (
                  <img src={coverImagePreview} alt="Cover preview" className="w-32 h-32 object-cover rounded-lg" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Additional Images</label>
              <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 w-fit">
                <FaPlus />
                <span>Add Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesChange}
                  className="hidden"
                />
              </label>
              {additionalImagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {additionalImagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img src={preview} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FaTrash className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Video URL</label>
              <input
                type="url"
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="YouTube or Vimeo video URL (optional)"
              />
            </div>
          </div>

          {/* Step 5: Beneficiaries */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Beneficiaries</h3>
            {formData.beneficiaries.map((beneficiary, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Beneficiary {index + 1}</span>
                  {formData.beneficiaries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBeneficiary(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Name"
                    value={beneficiary.name}
                    onChange={(e) => handleBeneficiaryChange(index, 'name', e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <input
                    type="text"
                    placeholder="Relationship"
                    value={beneficiary.relationship}
                    onChange={(e) => handleBeneficiaryChange(index, 'relationship', e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <input
                    type="text"
                    placeholder="Age"
                    value={beneficiary.age}
                    onChange={(e) => handleBeneficiaryChange(index, 'age', e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addBeneficiary}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <FaPlus />
              <span>Add Beneficiary</span>
            </button>
          </div>

          {/* Step 6: Use of Funds */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Use of Funds</h3>
            <textarea
              name="use_of_funds"
              value={formData.use_of_funds}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Explain how the funds will be used"
            />
          </div>

          {/* Step 7: Milestones */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Milestones</h3>
            {formData.milestones.map((milestone, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Milestone {index + 1}</span>
                  {formData.milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Milestone description"
                    value={milestone.milestone}
                    onChange={(e) => handleMilestoneChange(index, 'milestone', e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <input
                    type="date"
                    placeholder="Expected date"
                    value={milestone.expected_date}
                    onChange={(e) => handleMilestoneChange(index, 'expected_date', e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addMilestone}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <FaPlus />
              <span>Add Milestone</span>
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Creating...' : 'Create Campaign'}
              <FaHeart />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationPostFormModal;
