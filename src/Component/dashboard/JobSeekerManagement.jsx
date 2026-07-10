import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaUser, FaEdit } from 'react-icons/fa';
import jobsAPI from '../../api/jobsAPI';
import JobsModalForm from '../jobs/JobsModalForm';
import { getStorageAssetUrl } from '../../utils/jobsHelpers';
import { formatCityCountry } from '../../utils/apiResponseHelpers';

const JobSeekerManagement = ({ openCreateOnMount = false, onCreateOpened }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobsAPI.getMySeekerProfile();
      if (response?.success && response?.data) {
        setProfile(response.data);
      } else if (response?.data) {
        setProfile(response.data);
      } else {
        setProfile(null);
      }
    } catch (err) {
      setError('Failed to load profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (openCreateOnMount && !loading && !profile) {
      setShowModal(true);
      onCreateOpened?.();
    }
  }, [openCreateOnMount, loading, profile]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your job seeker profile?')) return;

    try {
      await jobsAPI.deleteSeekerProfile(profile.id);
      setProfile(null);
    } catch (err) {
      setError('Failed to delete profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const profilePhotoUrl = profile ? getStorageAssetUrl(profile.profile_photo) : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Job Seeker Profile Management</h2>
        {profile ? (
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => { setIsEditing(true); setShowModal(true); }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FaEdit className="mr-2" />
              Edit Profile
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <FaTrash className="mr-2" />
              Delete
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { setIsEditing(false); setShowModal(true); }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaPlus className="mr-2" />
            Create Profile
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {profile ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <FaUser className="text-white text-2xl" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{profile.title || profile.desired_role}</h3>
              {profile.desired_role && profile.title && (
                <p className="text-gray-600">{profile.desired_role}</p>
              )}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{formatCityCountry(profile.city, profile.country)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium">
                    {profile.experience_level || 'N/A'}
                    {profile.years_of_experience != null ? ` (${profile.years_of_experience} years)` : ''}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Education</p>
                  <p className="font-medium">{profile.education_level || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Work Preference</p>
                  <p className="font-medium">{profile.preferred_work_type || 'Any'}</p>
                </div>
              </div>
              {profile.key_skills && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Skills</p>
                  <p className="font-medium">{profile.key_skills}</p>
                </div>
              )}
              {profile.bio && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Bio</p>
                  <p className="text-gray-700">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          <FaUser className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          No job seeker profile found. Create your profile to appear on the Jobs page.
        </div>
      )}

      {showModal && (
        <JobsModalForm
          defaultPostType="jobseeker"
          lockPostType
          editSeekerId={isEditing ? profile?.id : null}
          initialSeekerData={isEditing ? profile : null}
          onClose={() => { setShowModal(false); setIsEditing(false); }}
          onSuccess={() => {
            setShowModal(false);
            setIsEditing(false);
            loadProfile();
          }}
        />
      )}
    </div>
  );
};

export default JobSeekerManagement;
