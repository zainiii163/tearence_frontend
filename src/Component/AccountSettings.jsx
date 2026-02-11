/* eslint-disable no-restricted-globals */
import React, { useState } from "react";
import { FaBell, FaEnvelope } from "react-icons/fa";

const AccountSettings = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newEmail: '',
    notifications: {
      likedAdverts: false,
      watchedAdverts: false,
      sharedAdverts: false,
      newAdverts: false,
      similarLocalAdverts: false,
    }
  });

  const [errors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation and submit logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Account Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account preferences and notification settings.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Settings */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaEnvelope className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium text-foreground">Email Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-sm font-medium text-foreground">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Enter current password"
              />
              {errors.currentPassword && (
                <p className="text-sm text-destructive">{errors.currentPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="newEmail" className="text-sm font-medium text-foreground">
                New Email Address
              </label>
              <input
                type="email"
                id="newEmail"
                name="newEmail"
                value={formData.newEmail}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Enter new email address"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaBell className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium text-foreground">Notification Settings</h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Choose which notifications you'd like to receive.</p>
            
            <div className="space-y-3">
              {[
                { key: 'likedAdverts', label: 'Liked Adverts', description: 'Get notified when someone likes your ads' },
                { key: 'watchedAdverts', label: 'Watched Adverts', description: 'Get notified about ads you\'re watching' },
                { key: 'sharedAdverts', label: 'Shared Adverts', description: 'Get notified when your ads are shared' },
                { key: 'newAdverts', label: 'New Adverts', description: 'Get notified about new ads in your categories' },
                { key: 'similarLocalAdverts', label: 'Similar Local Adverts', description: 'Get notified about similar ads in your area' },
              ].map((notification) => (
                <div key={notification.key} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                  <input
                    type="checkbox"
                    id={notification.key}
                    name={notification.key}
                    checked={formData.notifications[notification.key]}
                    onChange={handleNotificationChange}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <label htmlFor={notification.key} className="text-sm font-medium text-foreground cursor-pointer">
                      {notification.label}
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-sm font-medium transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;
