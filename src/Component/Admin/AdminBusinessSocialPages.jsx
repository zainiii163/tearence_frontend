import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaExternalLinkAlt, FaBuilding, FaSearch } from 'react-icons/fa';
import { communitiesAPI } from '../../api/communities';
import { socialHrefForCommunity } from '../../utils/businessSocial';

/**
 * Super admin: list all business-linked Social Hub pages.
 */
const AdminBusinessSocialPages = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const load = async (q = search) => {
    setLoading(true);
    setError('');
    try {
      const res = await communitiesAPI.getBusinessPages({
        search: q || undefined,
        per_page: 50,
      });
      const payload = res?.data?.data || res?.data || res || [];
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : [];
      setRows(list);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Could not load business social pages');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load('');
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FaUsers className="h-5 w-5 text-violet-700" />
              Business Social Hub pages
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Every business profile can have a linked Social Hub page (Creator Feed). Open the group
              or jump to the public business page.
            </p>
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              load(search);
            }}
          >
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search business or page…"
                className="pl-9 pr-3 py-2 border rounded-lg text-sm w-56"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-violet-700 text-white text-sm font-semibold hover:bg-violet-800"
            >
              Search
            </button>
          </form>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm p-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="h-32 rounded-lg bg-gray-100 animate-pulse" />
        ) : rows.length === 0 ? (
          <p className="text-sm text-gray-500">No business Social Hub pages found yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="py-2 pr-4 font-semibold">Business</th>
                  <th className="py-2 pr-4 font-semibold">Social page</th>
                  <th className="py-2 pr-4 font-semibold">Followers</th>
                  <th className="py-2 pr-4 font-semibold">Members</th>
                  <th className="py-2 font-semibold">Open</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const biz = row.business || {};
                  const bizHref = biz.href || `/business/${biz.slug || biz.id || row.business_id}`;
                  const socialHref = socialHrefForCommunity(row);
                  return (
                    <tr key={row.community_id || row.id || row.slug} className="border-b border-gray-100">
                      <td className="py-3 pr-4">
                        <div className="font-semibold text-gray-900">
                          {biz.business_name || 'Business'}
                        </div>
                        <div className="text-xs text-gray-500">ID {biz.id || row.business_id}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="font-medium text-gray-800">{row.name}</div>
                        <div className="text-xs text-gray-500">{row.slug}</div>
                      </td>
                      <td className="py-3 pr-4">{row.followers_count ?? '—'}</td>
                      <td className="py-3 pr-4">{row.members_count ?? '—'}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            to={socialHref}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-violet-100 text-violet-800 text-xs font-bold hover:bg-violet-200"
                          >
                            Social <FaExternalLinkAlt className="h-2.5 w-2.5" />
                          </Link>
                          <Link
                            to={bizHref}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200"
                          >
                            <FaBuilding className="h-2.5 w-2.5" /> Business
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBusinessSocialPages;
