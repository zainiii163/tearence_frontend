import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  GraduationCap,
  MapPin,
  Eye,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Loader2,
} from 'lucide-react';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import jobService from '../services/JobServices';
import { getStorageAssetUrl } from '../utils/jobsHelpers';

const JobSeekerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seeker, setSeeker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await jobService.getSeeker(id);
        const data = res?.data || res;
        if (!cancelled) {
          if (data?.id || data?.desired_role || data?.title) setSeeker(data);
          else setError('Profile not found');
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load profile');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <UnifiedNavbar showBackButton backHref="/jobs/seekers" />
        <div className="flex justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !seeker) {
    return (
      <div className="min-h-screen bg-slate-50">
        <UnifiedNavbar showBackButton backHref="/jobs/seekers" />
        <div className="page-container py-16 text-center">
          <p className="mb-4 text-red-600">{error || 'Profile not found'}</p>
          <button
            type="button"
            onClick={() => navigate('/jobs/seekers')}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white"
          >
            Back to job seekers
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const photo = getStorageAssetUrl(seeker.profile_photo);
  const skills = seeker.key_skills
    ? String(seeker.key_skills)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <UnifiedNavbar showBackButton backHref="/jobs/seekers" />
      <div className="page-container py-8">
        <Link
          to="/jobs/seekers"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Job seekers
        </Link>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-24 w-24 overflow-hidden rounded-full bg-white/20">
                {photo ? (
                  <img src={photo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white">
                    {(seeker.desired_role || seeker.title || 'J').charAt(0)}
                  </div>
                )}
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {seeker.desired_role || seeker.title || 'Job seeker'}
                </h1>
                {(seeker.city || seeker.country) && (
                  <p className="mt-2 flex items-center gap-2 text-blue-100">
                    <MapPin className="h-4 w-4" />
                    {[seeker.city, seeker.country].filter(Boolean).join(', ')}
                  </p>
                )}
                {seeker.views_count != null && (
                  <p className="mt-1 flex items-center gap-2 text-sm text-blue-100">
                    <Eye className="h-4 w-4" />
                    {seeker.views_count} views
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_280px]">
            <div className="space-y-6">
              {seeker.bio && (
                <section>
                  <h2 className="mb-2 text-lg font-semibold text-gray-900">About</h2>
                  <p className="whitespace-pre-wrap text-gray-700">{seeker.bio}</p>
                </section>
              )}
              {skills.length > 0 && (
                <section>
                  <h2 className="mb-2 text-lg font-semibold text-gray-900">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-3 text-sm">
              {(seeker.experience_level || seeker.years_of_experience != null) && (
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="mb-1 flex items-center gap-2 font-semibold text-gray-900">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                    Experience
                  </p>
                  <p className="text-gray-700 capitalize">
                    {seeker.experience_level || '—'}
                    {seeker.years_of_experience != null
                      ? ` · ${seeker.years_of_experience} yrs`
                      : ''}
                  </p>
                </div>
              )}
              {seeker.education_level && (
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="mb-1 flex items-center gap-2 font-semibold text-gray-900">
                    <GraduationCap className="h-4 w-4 text-blue-600" />
                    Education
                  </p>
                  <p className="capitalize text-gray-700">
                    {String(seeker.education_level).replace(/_/g, ' ')}
                  </p>
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-2">
                {seeker.email && (
                  <a
                    href={`mailto:${seeker.email}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
                  >
                    <Mail className="h-4 w-4" /> Email
                  </a>
                )}
                {seeker.phone && (
                  <a
                    href={`tel:${seeker.phone}`}
                    className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-semibold"
                  >
                    <Phone className="h-4 w-4" /> Call
                  </a>
                )}
                {seeker.linkedin_url && (
                  <a href={seeker.linkedin_url} target="_blank" rel="noreferrer" className="p-2">
                    <Linkedin className="h-5 w-5 text-blue-700" />
                  </a>
                )}
                {seeker.github_url && (
                  <a href={seeker.github_url} target="_blank" rel="noreferrer" className="p-2">
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {seeker.portfolio_url && (
                  <a href={seeker.portfolio_url} target="_blank" rel="noreferrer" className="p-2">
                    <Globe className="h-5 w-5 text-teal-700" />
                  </a>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobSeekerDetailPage;
