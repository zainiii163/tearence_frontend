import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import jobsAPI from '../../api/jobsAPI';
import JobsModalForm from '../jobs/JobsModalForm';
import { extractJobsList, getJobLogoUrl } from '../../utils/jobsHelpers';
import { formatCityCountry } from '../../utils/apiResponseHelpers';
import { ListingStatusFilterBar, ListingStatusCell, filterListingsByLifecycle } from './ListingStatusControls';

const JobsManagement = ({ onJobsChange, openCreateOnMount = false }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(openCreateOnMount);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    company_logo: '',
    category_id: '',
    country: '',
    city: '',
    work_type: '',
    salary_range: '',
    currency: '',
    description: '',
    responsibilities: '',
    requirements: '',
    skills_needed: '',
  });

  const [logoUploading, setLogoUploading] = useState(false);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobsAPI.getMyJobs();
      const jobList = extractJobsList(response);
      setJobs(jobList);
      if (onJobsChange) onJobsChange(jobList);
    } catch (err) {
      setError('Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (openCreateOnMount) {
      setShowCreateModal(true);
    }
  }, [openCreateOnMount]);

  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title || '',
      company_name: job.company_name || '',
      company_logo: job.company_logo || job.logo_url || '',
      category_id: job.category_id || job.job_category_id || '',
      country: job.country || '',
      city: job.city || '',
      work_type: job.work_type || '',
      salary_range: job.salary_range || '',
      currency: job.currency || '',
      description: job.description || '',
      responsibilities: job.responsibilities || '',
      requirements: job.requirements || '',
      skills_needed: job.skills_needed || '',
    });
    setShowEditModal(true);
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await jobsAPI.deleteJob(jobId);
      await loadJobs();
    } catch (err) {
      setError('Failed to delete job');
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    setError(null);
    try {
      const result = await jobsAPI.uploadFile(file, 'company_logo');
      const fileUrl = result?.data?.file_url;
      if (fileUrl) {
        setFormData((prev) => ({ ...prev, company_logo: fileUrl }));
      } else {
        setError('Failed to upload logo');
      }
    } catch (err) {
      setError('Failed to upload logo');
    } finally {
      setLogoUploading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await jobsAPI.updateJob(editingJob.id, formData);
      setShowEditModal(false);
      setEditingJob(null);
      await loadJobs();
    } catch (err) {
      setError('Failed to update job');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleJobCreated = async () => {
    setShowCreateModal(false);
    await loadJobs();
  };

  const filteredJobs = useMemo(
    () => filterListingsByLifecycle(jobs, filterStatus),
    [jobs, filterStatus]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Posted Jobs</h2>
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Post Job
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <ListingStatusFilterBar
        value={filterStatus}
        onChange={setFilterStatus}
        items={jobs}
        id="jobs-status-filter"
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Logo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                    {jobs.length === 0
                      ? 'No jobs posted yet. Click &quot;Post Job&quot; to create your first listing — it will appear on the public Jobs page.'
                      : 'No jobs match this status filter.'}
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => {
                  const logoUrl = getJobLogoUrl(job.company_logo || job.logo_url || job.logo);
                  return (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="h-12 w-12 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={job.company_name || job.title || 'Company'}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement.classList.add('text-gray-400', 'text-xs', 'font-semibold');
                              e.currentTarget.parentElement.textContent = (job.company_name || 'Co').slice(0, 2).toUpperCase();
                            }}
                          />
                        ) : (
                          <span className="text-xs font-semibold text-gray-400">
                            {(job.company_name || job.title || '—').slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.company_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCityCountry(job.city, job.country) || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {job.work_type || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ListingStatusCell item={job} upsellType="jobs" onPaid={loadJobs} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.views || job.views_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.created_at || job.posted_at
                        ? new Date(job.created_at || job.posted_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="text-gray-600 hover:text-gray-900"
                          title="View on Jobs page"
                        >
                          <FaEye className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleEdit(job)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit job"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete job"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <JobsModalForm
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleJobCreated}
        />
      )}

      {showEditModal && editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">Edit Job</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
                <div className="flex items-center gap-4">
                  {(formData.company_logo) && (
                    <img
                      src={getJobLogoUrl(formData.company_logo)}
                      alt={formData.company_name || 'Company'}
                      className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={logoUploading}
                    className="text-sm text-gray-600"
                  />
                  {logoUploading && <span className="text-sm text-blue-600">Uploading...</span>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Type</label>
                <select
                  name="work_type"
                  value={formData.work_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select work type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsManagement;
