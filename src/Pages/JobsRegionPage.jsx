import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGlobe, FaArrowLeft } from 'react-icons/fa';
import JobsBrowsePage from '../Component/jobs/JobsBrowsePage';
import { getContinentById } from '../data/propertyContinents';

const JobsRegionPage = ({ mode = 'home' }) => {
  const { continentId } = useParams();
  const continent = getContinentById(continentId);
  const homePath =
    mode === 'vacancies' ? '/jobs/vacancies' : mode === 'seekers' ? '/jobs/seekers' : '/jobs';

  if (!continent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaGlobe className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Region Not Found</h1>
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
      initialContinentId={continent.id}
      key={`${mode}-${continent.id}`}
    />
  );
};

export default JobsRegionPage;
