import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPaperPlane, FaEdit, FaTrash, FaCopy, FaEye, FaTimes, FaCheck, FaClock, FaUsers, FaChartLine } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ReferralEmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      // Mock data - in real app, this would come from API
      const mockTemplates = [
        {
          id: 1,
          name: 'Welcome Referral',
          subject: 'Join me on WWA Platform and get 20% discount!',
          body: `Hi [Friend's Name],

I wanted to personally invite you to join WWA Platform - it's an amazing marketplace where you can post adverts and reach thousands of potential customers.

As a special welcome gift, I'm sharing my referral code with you:
🎁 **Referral Code:** [REFERRAL_CODE]
💰 **Discount:** 20% OFF your first advert
🚀 **Benefits:** Premium features and priority support

Simply use my referral code when you sign up, and you'll automatically get 20% discount on your first advert. It's that easy!

Here's your personal invitation link:
[REFERRAL_LINK]

Looking forward to seeing you on the platform!

Best regards,
[Your Name]`,
          category: 'welcome',
          isDefault: true,
          usageCount: 0,
          createdAt: '2024-01-15',
          status: 'active'
        }
      ];

      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleEdit = (template) => {
    setEditingTemplate({ ...template });
    setShowEditor(true);
  };

  const handleSave = async () => {
    try {
      // Mock API call - in real app, this would save to backend
      console.log('Saving template:', editingTemplate);
      
      setTemplates(prev => 
        prev.map(t => t.id === editingTemplate.id ? editingTemplate : t)
      );
      
      toast.success('Template saved successfully!');
      setShowEditor(false);
      setEditingTemplate(null);
    } catch (error) {
      toast.error('Failed to save template');
    }
  };

  const handleDelete = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    
    try {
      // Mock API call - in real app, this would delete from backend
      console.log('Deleting template:', templateId);
      
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      toast.success('Template deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete template');
    }
  };

  const handleCopy = (template) => {
    navigator.clipboard.writeText(template.body);
    toast.success('Template copied to clipboard!');
  };

  const handleSendTest = async (template) => {
    try {
      // Mock email sending - in real app, this would send test email
      console.log('Sending test email with template:', template);
      toast.success('Test email sent successfully!');
    } catch (error) {
      toast.error('Failed to send test email');
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      welcome: '🎉',
      business: '🤝',
      promotion: '📢',
      followup: '📧'
    };
    return icons[category] || '📧';
  };

  const getCategoryColor = (category) => {
    const colors = {
      welcome: 'bg-green-100 text-green-800',
      business: 'bg-blue-100 text-blue-800',
      promotion: 'bg-orange-100 text-orange-800',
      followup: 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Email Templates</h2>
        <p className="text-gray-600">Create and manage email templates for your referral campaigns</p>
      </div>

      {/* Create New Template Button */}
      <button
        onClick={() => {
          setEditingTemplate({
            id: Date.now(),
            name: '',
            subject: '',
            body: '',
            category: 'welcome',
            isDefault: false,
            usageCount: 0,
            createdAt: new Date().toISOString(),
            status: 'draft'
          });
          setShowEditor(true);
        }}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <FaEnvelope />
        Create New Template
      </button>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg ${getCategoryColor(template.category)}`}>
                  {getCategoryIcon(template.category)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.subject}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePreview(template)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Preview"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleEdit(template)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleCopy(template)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                  title="Copy"
                >
                  <FaCopy />
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleSendTest(template)}
                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaPaperPlane />
                Send Test
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Template Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Subject:</div>
                  <div className="font-medium text-gray-900">{selectedTemplate.subject}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2">Body:</div>
                  <div className="bg-white rounded p-4 border border-gray-200">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedTemplate.body}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedTemplate.body);
                    toast.success('Template copied to clipboard!');
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Copy Template
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingTemplate.id ? 'Edit Template' : 'Create Template'}
                </h3>
                <button
                  onClick={() => {
                    setShowEditor(false);
                    setEditingTemplate(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter template name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={editingTemplate.subject}
                    onChange={(e) => setEditingTemplate(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Body
                  </label>
                  <textarea
                    value={editingTemplate.body}
                    onChange={(e) => setEditingTemplate(prev => ({ ...prev, body: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={10}
                    placeholder="Enter email body..."
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditor(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralEmailTemplates;
