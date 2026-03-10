import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  X, 
  Upload,
  User,
  Heart,
  Target,
  Lightbulb
} from 'lucide-react';

const ProjectStoryVision = ({ formData, updateFormData, onNext, onPrev }) => {
  const [teamMembers, setTeamMembers] = useState(formData.teamMembers || []);

  const addTeamMember = () => {
    const newMember = {
      id: Date.now(),
      name: '',
      role: '',
      photo: null
    };
    const updatedMembers = [...teamMembers, newMember];
    setTeamMembers(updatedMembers);
    updateFormData({ teamMembers: updatedMembers });
  };

  const updateTeamMember = (id, field, value) => {
    const updatedMembers = teamMembers.map(member =>
      member.id === id ? { ...member, [field]: value } : member
    );
    setTeamMembers(updatedMembers);
    updateFormData({ teamMembers: updatedMembers });
  };

  const removeTeamMember = (id) => {
    const updatedMembers = teamMembers.filter(member => member.id !== id);
    setTeamMembers(updatedMembers);
    updateFormData({ teamMembers: updatedMembers });
  };

  const handlePhotoUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      updateTeamMember(id, 'photo', file);
    }
  };

  const isFormValid = formData.description && formData.problem && formData.vision && formData.whyNow;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Project Story & Vision</h3>
        <p className="text-gray-600">
          Tell your story and share your vision. This is where you connect emotionally with funders and inspire them to support your project.
        </p>
      </div>

      {/* Project Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Heart className="w-4 h-4 inline mr-1" />
          Project Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="Describe your project in detail. What are you creating? What makes it special?"
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          maxLength={2000}
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.description?.length || 0}/2000 characters
        </p>
      </div>

      {/* Problem You're Solving */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Target className="w-4 h-4 inline mr-1" />
          Problem You're Solving <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.problem || ''}
          onChange={(e) => updateFormData({ problem: e.target.value })}
          placeholder="What specific problem or need are you addressing? Why does this problem matter?"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          maxLength={1000}
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.problem?.length || 0}/1000 characters
        </p>
      </div>

      {/* Vision/Mission */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Lightbulb className="w-4 h-4 inline mr-1" />
          Vision / Mission <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.vision || ''}
          onChange={(e) => updateFormData({ vision: e.target.value })}
          placeholder="What is your long-term vision? What impact do you want to create?"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          maxLength={1000}
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.vision?.length || 0}/1000 characters
        </p>
      </div>

      {/* Why This Matters Now */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Why This Matters Now <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.whyNow || ''}
          onChange={(e) => updateFormData({ whyNow: e.target.value })}
          placeholder="Why is this project important right now? What's the urgency or opportunity?"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          maxLength={1000}
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.whyNow?.length || 0}/1000 characters
        </p>
      </div>

      {/* Team Members */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            <User className="w-4 h-4 inline mr-1" />
            Team Members
          </label>
          <button
            onClick={addTeamMember}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </button>
        </div>

        {teamMembers.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No team members added yet</p>
            <p className="text-sm text-gray-500">Add team members to build trust with funders</p>
          </div>
        ) : (
          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <div key={member.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  {/* Photo Upload */}
                  <div className="flex-shrink-0">
                    {member.photo ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(member.photo)}
                          alt={member.name || 'Team member'}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <button
                          onClick={() => updateTeamMember(member.id, 'photo', null)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(member.id, e)}
                      className="hidden"
                      id={`photo-${member.id}`}
                    />
                    <button
                      onClick={() => document.getElementById(`photo-${member.id}`).click()}
                      className="mt-2 w-full text-xs text-blue-600 hover:text-blue-700"
                    >
                      {member.photo ? 'Change' : 'Upload'} Photo
                    </button>
                  </div>

                  {/* Member Details */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        value={member.name || ''}
                        onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                        placeholder="Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={member.role || ''}
                        onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                        placeholder="Role/Title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeTeamMember(member.id)}
                    className="flex-shrink-0 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Storytelling Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Be authentic and passionate about your project</li>
              <li>• Use clear, compelling language that resonates emotionally</li>
              <li>• Show the impact your project will have on real people</li>
              <li>• Include specific details that make your vision tangible</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!isFormValid}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProjectStoryVision;
