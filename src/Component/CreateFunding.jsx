import React, { useState } from 'react';
import { createCampaign } from '../slice/FundingSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

function CreateFunding() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    thumbnail: '',
    description: '',
    target: '',
    location: '',
    target_date: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createCampaign({ formData })).unwrap()
      setFormData({
        title: '',
        thumbnail: '',
        description: '',
        target: '',
        location: '',
        target_date: '',
      });
      navigate('/quick-funding')
    } catch (error) {
      toast.error(error.message)
    }
   
  };

  return (
    <div className="bg-pink-100 min-h-screen py-8 bg-cover" style={{ backgroundImage: `url(/img/create-fund-bg.jpg)`}}>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl text-pink-900 mb-4">Create Business Funding Request</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-600">Business Name/Project Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-pink-400"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="thumbnail" className="block text-gray-600">Thumbnail URL:</label>
            <input
              type="text"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-pink-400"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-600">Business Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-pink-400"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="target" className="block text-gray-600">Investment Amount Required:</label>
            <input
              type="number"
              id="target"
              name="target"
              value={formData.target}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-pink-400"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-600">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-pink-400"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="target_date" className="block text-gray-600">Funding Deadline:</label>
            <input
              type="date"
              id="target_date"
              name="target_date"
              value={formData.target_date}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-pink-400"
            />
          </div>
          <button
            type="submit"
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 focus:outline-none focus:bg-pink-600"
          >
            Submit Funding Request
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateFunding;
