import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  DollarSign, 
  Users, 
  Target,
  Loader2,
  AlertCircle,
  X,
  CheckCircle,
  Clock
} from 'lucide-react';
import fundingAPI from '../../api/fundingAPI';
import FundingPostFormModal from '../funding/FundingPostFormModal';
import { extractListItems } from '../../utils/apiResponseHelpers';
import { ListingStatusFilterBar, ListingStatusCell, filterListingsByLifecycle } from './ListingStatusControls';

const FundingManagement = ({ openCreateOnMount = false, onCreateOpened }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (openCreateOnMount) {
      setEditData(null);
      setShowModal(true);
      onCreateOpened?.();
    }
  }, [openCreateOnMount]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await fundingAPI.getMyProjects();
      setProjects(extractListItems(response));
    } catch (err) {
      setError('Failed to load your funding projects');
      console.error('Error loading funding projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    setEditData(null);
    setShowModal(true);
  };

  const handleEditProject = (project) => {
    setEditData(project);
    setShowModal(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

    try {
      await fundingAPI.deleteProject(projectId);
      await loadProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project. Please try again.');
    }
  };

  const handleProjectSubmit = async (projectData) => {
    await loadProjects();
    setShowModal(false);
  };

  const filteredProjects = useMemo(
    () => filterListingsByLifecycle(projects, filterStatus),
    [projects, filterStatus]
  );

  const getProgressPercentage = (project) => {
    if (!project.funding_goal || project.funding_goal === 0) return 0;
    return ((project.amount_raised || 0) / project.funding_goal) * 100;
  };

  const getDaysRemaining = (project) => {
    if (!project.funding_ends_at) return null;
    const endDate = new Date(project.funding_ends_at);
    const now = new Date();
    const diff = endDate - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Funding Projects</h2>
          <p className="text-gray-600 mt-1">Manage your crowdfunding campaigns</p>
        </div>
        <button
          onClick={handleCreateProject}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Raised</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(projects.reduce((sum, p) => sum + (p.amount_raised || 0), 0) / 1000).toFixed(1)}k
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Backers</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.reduce((sum, p) => sum + (p.backer_count || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.amount_raised >= p.funding_goal).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <ListingStatusFilterBar
        value={filterStatus}
        onChange={setFilterStatus}
        items={projects}
        id="funding-status-filter"
      />

      <div className="bg-white rounded-lg border border-gray-200">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {projects.length === 0 ? (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No funding projects yet</h3>
                <p className="text-gray-600 mb-4">Start your first crowdfunding campaign today</p>
                <button
                  onClick={handleCreateProject}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Project
                </button>
              </>
            ) : (
              <p className="text-gray-600">No projects match this status filter.</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Funding Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Backers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Left
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {project.cover_image ? (
                          <img
                            src={project.cover_image}
                            alt={project.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <Target className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">{project.title}</h4>
                          {project.tagline && (
                            <p className="text-sm text-gray-600 line-clamp-1">{project.tagline}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">{project.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ListingStatusCell item={project} upsellType="funding" onPaid={loadProjects} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="min-w-[200px]">
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {project.currency || '$'}{(project.amount_raised || 0).toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            of {project.currency || '$'}{project.funding_goal?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              getProgressPercentage(project) >= 100 ? 'bg-green-500' :
                              getProgressPercentage(project) >= 75 ? 'bg-blue-500' :
                              getProgressPercentage(project) >= 50 ? 'bg-yellow-500' :
                              'bg-gray-400'
                            }`}
                            style={{ width: `${Math.min(getProgressPercentage(project), 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {getProgressPercentage(project).toFixed(1)}% funded
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{project.backer_count || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getDaysRemaining(project) !== null ? (
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">
                            {getDaysRemaining(project) > 0 ? `${getDaysRemaining(project)} days` : 'Ended'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No deadline</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.open(`/funding/project/${project.id}`, '_blank')}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <FundingPostFormModal
          onClose={() => setShowModal(false)}
          onSubmit={handleProjectSubmit}
          editData={editData}
        />
      )}
    </div>
  );
};

export default FundingManagement;
