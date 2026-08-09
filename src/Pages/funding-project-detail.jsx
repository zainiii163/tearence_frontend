import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Share2,
  Users,
  Target,
  Calendar,
  DollarSign,
  MapPin,
  Award,
  AlertCircle,
  FileText,
  Shield,
  Globe,
  Mail,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useProject, useProjectRewards } from '../hooks/useFundingData';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import FundingPledgeForm from '../Component/funding/FundingPledgeForm';
import { resolveStorageUrl } from '../utils/dashboardEditMappers';

const money = (n, currency = 'USD') => {
  const symbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
  return `${symbol}${Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const fundingModelLabel = (model) => {
  const m = (model || '').toLowerCase();
  if (m.includes('donation')) return 'Donation';
  if (m.includes('reward')) return 'Reward-based';
  if (m.includes('equity') || m.includes('share') || m.includes('partnership')) return 'Equity / partnership';
  if (m.includes('loan')) return 'Loan';
  if (m.includes('hybrid')) return 'Hybrid';
  return model ? model.replace(/_/g, ' ') : 'Funding';
};

const creatorName = (project) => {
  const c = project?.customer || project?.user || {};
  if (c.name) return c.name;
  const full = [c.first_name, c.last_name].filter(Boolean).join(' ').trim();
  return full || 'Project creator';
};

const getUseOfFundsEntries = (useOfFunds) => {
  if (!useOfFunds) return [];
  if (Array.isArray(useOfFunds)) {
    return useOfFunds.map((item) => {
      if (typeof item === 'string') return { label: item, value: null };
      return {
        label: item.label || item.name || item.category || 'Item',
        value: item.percent ?? item.percentage ?? item.amount ?? null,
      };
    });
  }
  if (typeof useOfFunds === 'object') {
    return Object.entries(useOfFunds).map(([label, value]) => ({ label, value }));
  }
  return [];
};

const FundingProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const { project, loading, error, refetch } = useProject(id);
  const { rewards, loading: rewardsLoading } = useProjectRewards(id);

  const [activeTab, setActiveTab] = useState('overview');
  const [showPledge, setShowPledge] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const view = useMemo(() => {
    if (!project) return null;
    const currency = project.currency || 'USD';
    const raised = Number(project.current_funded ?? project.current_funding ?? project.amount_raised ?? 0);
    const goal = Number(project.funding_goal || 0);
    const progress = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
    const deadline = project.funding_deadline || project.end_date;
    const daysLeft = deadline
      ? Math.max(0, Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)))
      : null;
    const location =
      [project.region || project.city, project.country].filter(Boolean).join(', ') || 'Global';
    const cover =
      resolveStorageUrl(project.cover_image) || project.cover_image || '/img/NoImage.png';
    const backers = Number(project.backers_count ?? project.backer_count ?? 0);
    const accepting =
      project.is_active !== false &&
      (project.status === 'active' || !project.status) &&
      (daysLeft === null || daysLeft > 0);

    return {
      currency,
      raised,
      goal,
      progress,
      deadline,
      daysLeft,
      location,
      cover,
      backers,
      accepting,
      model: fundingModelLabel(project.funding_model),
      min: Number(project.minimum_contribution || 1),
      creator: creatorName(project),
      creatorEmail: (project.customer || project.user)?.email,
      funds: getUseOfFundsEntries(project.use_of_funds),
      team: Array.isArray(project.team_members) ? project.team_members : [],
      story: project.description,
      problem: project.problem_solved,
      vision: project.vision_mission || project.vision,
      whyNow: project.why_matters_now || project.why_now,
      video: project.pitch_video_url,
      website: project.website,
    };
  }, [project]);

  const projectRewards = useMemo(() => {
    if (Array.isArray(rewards) && rewards.length) return rewards;
    return Array.isArray(project?.rewards) ? project.rewards : [];
  }, [rewards, project]);

  const openBack = (reward = null) => {
    const ok = requireAuth(
      `/funding/project/${id}`,
      'Sign in to back this funding project.'
    );
    if (!ok) return;
    setSelectedReward(reward);
    setShowPledge(true);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: project?.title,
          text: project?.tagline || project?.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied');
      }
    } catch {
      /* user cancelled */
    }
  };

  const handleSave = () => {
    setIsSaved((s) => !s);
    toast.success(isSaved ? 'Removed from saved' : 'Saved for later');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading project…</p>
        </div>
      </div>
    );
  }

  if (error || !project || !view) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Project not found</h3>
          <p className="text-gray-600 mb-4">
            {typeof error === 'string' ? error : 'This project does not exist or was removed.'}
          </p>
          <Link
            to="/funding"
            className="inline-flex px-4 py-2 bg-[#02a95c] text-white rounded-lg hover:bg-emerald-700"
          >
            Browse funding
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'story', label: 'Story' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'how', label: 'How funding works' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="page-container py-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className={`p-2 rounded-lg ${
                isSaved ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="Save project"
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
              aria-label="Share project"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative rounded-2xl overflow-hidden bg-gray-200 aspect-[16/9]">
              <img
                src={view.cover}
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/img/NoImage.png';
                }}
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 capitalize">
                  {project.status || 'active'}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                  {view.model}
                </span>
                {project.is_verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
                    <Shield className="w-3 h-3" /> Verified
                  </span>
                )}
                {project.is_sponsored && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                    Sponsored
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{project.title}</h1>
              {project.tagline && (
                <p className="mt-2 text-lg text-gray-600">{project.tagline}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  <span className="capitalize">{(project.category || '').replace(/_/g, ' ')}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {view.location}
                </span>
                <span className="inline-flex items-center gap-1.5 capitalize">
                  <Users className="w-4 h-4" />
                  {project.project_type || 'Project'}
                </span>
              </div>
            </div>

            <div className="border-b border-gray-200">
              <div className="flex gap-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 whitespace-nowrap border-b-2 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'border-emerald-600 text-emerald-700'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{view.story}</p>
                </section>

                {view.problem && (
                  <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Problem being solved</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{view.problem}</p>
                  </section>
                )}

                {view.vision && (
                  <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Vision & mission</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{view.vision}</p>
                  </section>
                )}

                {view.funds.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Use of funds</h2>
                    <ul className="space-y-3">
                      {view.funds.map((item) => (
                        <li key={item.label} className="flex items-center justify-between gap-4">
                          <span className="text-gray-700">{item.label}</span>
                          <div className="flex items-center gap-3 min-w-[40%]">
                            {item.value != null && Number(item.value) <= 100 ? (
                              <>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#02a95c] rounded-full"
                                    style={{ width: `${Math.min(Number(item.value), 100)}%` }}
                                  />
                                </div>
                                <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                                  {item.value}%
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-semibold text-gray-900">
                                {item.value != null ? String(item.value) : '—'}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {view.team.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Team</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {view.team.map((member, idx) => (
                        <div key={`${member.name}-${idx}`} className="border border-gray-200 rounded-xl p-4">
                          <p className="font-semibold text-gray-900">{member.name}</p>
                          <p className="text-sm text-emerald-700">{member.role}</p>
                          {member.experience && (
                            <p className="text-sm text-gray-600 mt-2">{member.experience}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {view.video && (
                  <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Pitch video</h2>
                    <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                      <iframe
                        src={view.video}
                        title="Pitch video"
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  </section>
                )}
              </div>
            )}

            {activeTab === 'story' && (
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{view.story}</p>
                {view.whyNow && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Why it matters now</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{view.whyNow}</p>
                  </div>
                )}
                {view.vision && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Vision</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{view.vision}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'rewards' && (
              <div>
                {rewardsLoading ? (
                  <p className="text-gray-600">Loading rewards…</p>
                ) : projectRewards.length === 0 ? (
                  <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
                    <Award className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="font-medium text-gray-900">No rewards listed</p>
                    <p className="text-sm text-gray-600 mt-1">
                      You can still back this project with a custom amount.
                    </p>
                    {view.accepting && (
                      <button
                        type="button"
                        onClick={() => openBack(null)}
                        className="mt-4 px-4 py-2 bg-[#02a95c] text-white rounded-lg"
                      >
                        Back without reward
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {projectRewards.map((reward) => {
                      const left =
                        reward.limit == null
                          ? null
                          : Math.max(0, Number(reward.limit) - Number(reward.claimed_count || 0));
                      const soldOut = left === 0;
                      return (
                        <div
                          key={reward.id}
                          className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col"
                        >
                          <div className="flex justify-between gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{reward.title}</h3>
                            <span className="text-lg font-bold text-emerald-700 whitespace-nowrap">
                              {money(reward.minimum_contribution, view.currency)}+
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 flex-1">{reward.description}</p>
                          {reward.estimated_delivery_date && (
                            <p className="text-xs text-gray-500 mt-3 inline-flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              Est. delivery{' '}
                              {new Date(reward.estimated_delivery_date).toLocaleDateString()}
                            </p>
                          )}
                          {left != null && (
                            <p className="text-xs text-gray-500 mt-1">{left} remaining</p>
                          )}
                          <button
                            type="button"
                            disabled={!view.accepting || soldOut}
                            onClick={() => openBack(reward)}
                            className="mt-4 w-full py-2.5 bg-[#02a95c] text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {soldOut ? 'Sold out' : 'Select reward'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'how' && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900">How funding works on this campaign</h2>
                <ol className="space-y-4">
                  {[
                    {
                      title: 'Choose an amount (and optional reward)',
                      body: `Minimum contribution is ${money(view.min, view.currency)}. This campaign uses a ${view.model.toLowerCase()} model.`,
                    },
                    {
                      title: 'Sign in and reserve your pledge',
                      body: 'We create a pending pledge tied to your account so the reward stock and amount are held briefly.',
                    },
                    {
                      title: 'Pay securely with PayPal',
                      body: 'Payment goes through PayPal. The campaign total is not updated until payment succeeds.',
                    },
                    {
                      title: 'Funds are confirmed on the project',
                      body: 'After confirmation, your pledge counts toward the goal and backer total. Creators see completed pledges only.',
                    },
                  ].map((step, i) => (
                    <li key={step.title} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900">{step.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                {view.deadline && (
                  <p className="text-sm text-gray-600 inline-flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Deadline: {new Date(view.deadline).toLocaleDateString()}
                    {view.daysLeft != null ? ` · ${view.daysLeft} days left` : ''}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sticky funding panel */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <p className="text-3xl font-bold text-gray-900">
                  {money(view.raised, view.currency)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  pledged of {money(view.goal, view.currency)} goal
                </p>
                <div className="mt-4 w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#02a95c] rounded-full transition-all"
                    style={{ width: `${view.progress}%` }}
                  />
                </div>
                <div className="mt-3 flex justify-between text-sm text-gray-600">
                  <span>{view.progress.toFixed(0)}% funded</span>
                  <span>{view.daysLeft != null ? `${view.daysLeft} days left` : 'Ongoing'}</span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-lg font-bold text-gray-900">{view.backers}</p>
                    <p className="text-xs text-gray-500">Backers</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-lg font-bold text-gray-900">{money(view.min, view.currency)}</p>
                    <p className="text-xs text-gray-500">Minimum</p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!view.accepting}
                  onClick={() => openBack(null)}
                  className="mt-5 w-full py-3 bg-[#02a95c] text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50"
                >
                  {view.accepting ? 'Back this project' : 'Funding closed'}
                </button>
                {!isAuthenticated && view.accepting && (
                  <p className="mt-2 text-xs text-center text-gray-500">
                    You’ll be asked to sign in before pledging.
                  </p>
                )}
                <p className="mt-3 text-xs text-center text-gray-500 inline-flex items-center justify-center gap-1 w-full">
                  <Shield className="w-3.5 h-3.5" />
                  Secure PayPal checkout
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Creator</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    {view.creator.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{view.creator}</p>
                    <p className="text-xs text-gray-500">Campaign creator</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  {view.creatorEmail && (
                    <li className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${view.creatorEmail}`} className="hover:text-emerald-700 truncate">
                        {view.creatorEmail}
                      </a>
                    </li>
                  )}
                  {view.website && (
                    <li className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <a
                        href={view.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-700 inline-flex items-center gap-1 truncate"
                      >
                        Website <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  )}
                  {project.is_verified && (
                    <li className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      Verified creator
                    </li>
                  )}
                  {!view.creatorEmail && !view.website && (
                    <li className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Contact via pledge message
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 text-sm text-gray-600 space-y-2">
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Funding snapshot
                </p>
                <p>Model: {view.model}</p>
                <p>Views: {project.views_count ?? project.view_count ?? 0}</p>
                {Array.isArray(project.pledges) && project.pledges.length > 0 && (
                  <p>{project.pledges.length} recent public backers shown</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {showPledge && (
        <FundingPledgeForm
          project={{
            ...project,
            current_funded: view.raised,
            backers_count: view.backers,
            days_remaining: view.daysLeft,
            daysLeft: view.daysLeft,
          }}
          rewards={projectRewards}
          initialReward={selectedReward}
          onClose={() => {
            setShowPledge(false);
            setSelectedReward(null);
          }}
          onSuccess={() => {
            setShowPledge(false);
            setSelectedReward(null);
            refetch?.();
          }}
        />
      )}
    </div>
  );
};

export default FundingProjectDetail;
