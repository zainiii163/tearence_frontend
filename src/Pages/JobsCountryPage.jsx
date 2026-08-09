import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBriefcase, FaArrowLeft } from 'react-icons/fa';
import JobsBrowsePage from '../Component/jobs/JobsBrowsePage';
import { findCountryBySlug } from '../data/propertyContinents';

const JobsCountryPage = ({ mode = 'home' }) => {
  const { countrySlug } = useParams();
  const match = findCountryBySlug(countrySlug);
  const homePath =
    mode === 'vacancies' ? '/jobs/vacancies' : mode === 'seekers' ? '/jobs/seekers' : '/jobs';

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaBriefcase className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Country Not Found</h1>
          <Link
            to={homePath}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl"
          >
            <FaArrowLeft className="mr-2" />
            Back to Jobs
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <JobsBrowsePage
      mode={mode}
      initialCountrySlug={countrySlug}
      initialContinentId={match.continent.id}
      key={`${mode}-${countrySlug}`}
    />
  );
};

export default JobsCountryPage;
