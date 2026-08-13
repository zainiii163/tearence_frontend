import React from 'react';
import { ExternalLink, Shield } from 'lucide-react';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';
import { FILAMENT_TEAMS_URL } from '../utils/filamentAdmin';

/**
 * Lightweight CTA — team/role management lives in Filament (no duplicate React UI).
 */
const AdminTeamsRolesCta = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          <div className="mx-auto mb-6 w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Teams &amp; Roles
          </h1>
          <p className="text-slate-600 mb-8">
            Department teams (HR, Accounts, Legal, Marketing, Sales, and more) and
            sub-roles are managed in the Admin Portal. Super Admin assigns who joins
            each team.
          </p>
          <a
            href={FILAMENT_TEAMS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors"
          >
            Manage Teams &amp; Roles in Admin Portal
            <ExternalLink className="w-4 h-4" />
          </a>
          <p className="mt-4 text-xs text-slate-400 break-all">{FILAMENT_TEAMS_URL}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminTeamsRolesCta;
export { FILAMENT_TEAMS_URL };
