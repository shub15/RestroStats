import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from './ThemeProvider.jsx';

export default function AccountInfo() {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    city: '',
    state: '',
    cusine_type: '',
    phone: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const { darkTheme } = useTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('restaurantToken');
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:5000/restaurant/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(res.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage('Failed to fetch account info.');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('restaurantToken');
    if (!token) return;

    try {
      await axios.put('http://localhost:5000/restaurant/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Account info updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update account info.');
    }
  };

  return (
    <div className={`min-h-screen flex ${darkTheme ? 'bg-gray-900' : 'bg-gray-100'}`}>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className={`max-w-4xl mx-auto ${darkTheme ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-2xl font-bold ${darkTheme ? 'text-white' : 'text-gray-800'}`}>
              Restaurant Account Information
            </h2>
            <div className={`px-3 py-1 rounded-full text-sm ${darkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
              {formData.name || 'Restaurant Name'}
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { label: 'Restaurant Name', name: 'name', type: 'text' },
              { label: 'Email Address', name: 'email', type: 'email' },
              { label: 'Phone Number', name: 'phone', type: 'tel' },
              { label: 'Cuisine Type', name: 'cusine_type', type: 'text' },
              { label: 'City', name: 'city', type: 'text' },
              { label: 'State', name: 'state', type: 'text' },
            ].map(field => (
              <div key={field.name} className="space-y-2">
                <label className={`block text-sm font-medium ${darkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-lg border text-sm transition-all duration-200 ${
                    isEditing
                      ? darkTheme
                        ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30'
                        : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30'
                      : darkTheme
                      ? 'bg-gray-700 text-gray-400 border-gray-600'
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-8 space-x-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Edit Profile</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>Save Changes</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setMessage('');
                  }}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>Cancel</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}