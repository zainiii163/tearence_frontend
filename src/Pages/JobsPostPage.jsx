import React from 'react';
import { useNavigate } from 'react-router-dom';
import JobsModalForm from '../Component/jobs/JobsModalForm';

const JobsPostPage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/jobs');
  };

  const handleSuccess = () => {
    // Navigate back to jobs page after successful submission
    navigate('/jobs');
  };

  return (
    <JobsModalForm
      onClose={handleClose}
      onSuccess={handleSuccess}
    />
  );
};

export default JobsPostPage;
