import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Send, Upload, FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import jobsAPI from '../../api/jobsAPI';
import jobService from '../../services/JobServices';

/**
 * Proper job application modal: contact details, cover letter, optional CV upload.
 */
const JobApplyModal = ({
  open,
  onClose,
  job,
  user = {},
  seekerProfile = null,
  onSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [cvPath, setCvPath] = useState('');
  const [cvName, setCvName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;

    const name =
      user?.name ||
      user?.full_name ||
      `${user?.first_name || ''} ${user?.last_name || ''}`.trim() ||
      seekerProfile?.full_name ||
      seekerProfile?.name ||
      '';
    const mail =
      user?.email ||
      user?.user_email ||
      seekerProfile?.email ||
      seekerProfile?.contact_email ||
      '';
    const tel =
      user?.phone ||
      user?.phone_number ||
      seekerProfile?.phone ||
      seekerProfile?.contact_phone ||
      '';

    setFullName(name);
    setEmail(mail);
    setPhone(tel);
    setCoverLetter(
      `Dear Hiring Manager,\n\nI am writing to apply for the ${job?.title || 'open'} position at ${job?.company_name || job?.company || 'your company'}. I believe my background is a strong fit and I would welcome the opportunity to contribute.\n\nThank you for your consideration.`
    );
    setPortfolioLink(seekerProfile?.portfolio_link || seekerProfile?.website_url || '');
    setCvPath(seekerProfile?.cv_file || '');
    setCvName(
      seekerProfile?.cv_file
        ? String(seekerProfile.cv_file).split('/').pop()
        : ''
    );
    setError('');
  }, [open, user, seekerProfile, job?.title, job?.company_name, job?.company]);

  if (!open) return null;

  const handleCvUpload = async (file) => {
    if (!file) return;
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowed.includes(file.type) && !/\.(pdf|doc|docx)$/i.test(file.name)) {
      setError('Please upload a PDF or Word document (DOC/DOCX).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('CV must be 5MB or smaller.');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const res = await jobsAPI.uploadFile(file, 'cv_file');
      const path = res?.data?.file_path || res?.data?.file_url || res?.file_path || '';
      if (!path) throw new Error('Upload failed');
      setCvPath(path);
      setCvName(file.name);
      toast.success('CV uploaded');
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to upload CV');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (coverLetter.trim().length < 20) {
      setError('Please write a short cover letter (at least 20 characters).');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const payload = {
        full_name: fullName.trim() || undefined,
        contact_email: email.trim(),
        contact_phone: phone.trim() || undefined,
        cover_letter: coverLetter.trim(),
        portfolio_link: portfolioLink.trim() || undefined,
        cv_file: cvPath || undefined,
      };

      const jobKey = job?.id || job?.slug;
      const response = await jobService.applyForJob(jobKey, payload);
      if (response?.success) {
        toast.success(response.message || 'Application submitted');
        onSuccess?.(response);
        onClose?.();
      } else {
        setError(
          response?.error?.message ||
            response?.message ||
            'Could not submit application'
        );
      }
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to submit application';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={() => !submitting && onClose?.()}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Apply for this job</h3>
            <p className="text-sm text-gray-500 line-clamp-1">
              {job?.title}
              {job?.company_name || job?.company
                ? ` · ${job.company_name || job.company}`
                : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={() => !submitting && onClose?.()}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {!seekerProfile && (
            <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-sm text-blue-800">
              Tip: create a{' '}
              <Link to="/jobs/post?mode=seeker" className="underline font-medium">
                job seeker profile
              </Link>{' '}
              to reuse your CV on future applications.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover letter <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              minLength={20}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio / LinkedIn (optional)
            </label>
            <input
              type="url"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CV / Resume
            </label>
            <label className="flex items-center gap-3 px-3 py-3 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/40">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
              </span>
              <span className="flex-1 text-sm text-gray-600">
                {cvName ? (
                  <span className="inline-flex items-center gap-1.5 text-gray-800">
                    <FileText className="w-4 h-4 text-blue-600" />
                    {cvName}
                  </span>
                ) : (
                  'Upload PDF or Word (max 5MB)'
                )}
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                disabled={uploading || submitting}
                onChange={(e) => handleCvUpload(e.target.files?.[0])}
              />
            </label>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || uploading}
            className="w-full py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit application
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobApplyModal;
