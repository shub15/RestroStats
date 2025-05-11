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
      setMessage('Failed to update account info.');
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col ${darkTheme ? 'bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-tr from-indigo-50 via-white to-purple-50'}`}>
      
      {/* Top Nav Bar */}
      {/* <header className={`flex items-center justify-between px-10 py-4 border-b ${darkTheme ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center gap-4">
          <img src="/logo192.png" alt="Logo" className="h-10 w-10 rounded-full shadow-md" />
          <h1 className={`text-2xl font-bold ${darkTheme ? 'text-white' : 'text-gray-900'}`}>Restrostat Dashboard</h1>
        </div>
        <div className={`text-sm font-semibold px-4 py-2 rounded-lg shadow-md ${darkTheme ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
          {formData.name || 'Restaurant Name'}
        </div>
      </header> */}

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Placeholder */}
        {/* <aside className={`w-72 flex-shrink-0 p-6 border-r ${darkTheme ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
          <div className="mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center text-white text-4xl font-extrabold select-none">
              {formData.name ? formData.name.charAt(0).toUpperCase() : 'R'}
            </div>
            <h2 className={`mt-4 text-xl font-semibold ${darkTheme ? 'text-white' : 'text-gray-900'}`}>{formData.name || 'Restaurant Name'}</h2>
            <p className={`text-sm mt-1 ${darkTheme ? 'text-gray-400' : 'text-gray-600'}`}>{formData.email || 'email@example.com'}</p>
          </div>
          <nav className="space-y-4">
            {['Dashboard', 'Orders', 'Menu', 'Reports', 'Settings'].map(item => (
              <a
                key={item}
                href="#"
                className={`block px-4 py-2 rounded-lg font-medium transition-colors ${
                  darkTheme
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {item}
              </a>
            ))}
          </nav>
        </aside> */}

        {/* Account Info Form */}
        <section className={`
          flex-1 overflow-auto p-10
          ${darkTheme ? 'bg-gray-800' : 'bg-white'}
          flex flex-col
        `}>
          <div className="flex justify-between items-center mb-12">
            <h2 className={`text-4xl font-extrabold tracking-tight ${darkTheme ? 'text-white' : 'text-gray-900'}`}>
              Account Profile
            </h2>
            <div className="flex items-center gap-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-6 py-3 shadow-lg transition"
                >
                  <span className="material-symbols-outlined">edit</span>
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-6 py-3 shadow-lg transition"
                  >
                    <span className="material-symbols-outlined">check_circle</span>
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setMessage('');
                    }}
                    className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg px-6 py-3 shadow-lg transition"
                  >
                    <span className="material-symbols-outlined">close</span>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Feedback Message */}
          {message && (
            <div className={`
              mb-8 px-6 py-4 rounded-lg flex items-center gap-3 shadow transition-all duration-200
              ${message.includes('successfully')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
              }
            `}>
              <span className="material-symbols-outlined text-xl">
                {message.includes('successfully') ? 'check_circle' : 'error'}
              </span>
              <span>{message}</span>
            </div>
          )}

          {/* Form Fields */}
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 flex-grow overflow-auto">
            {[
              { label: 'Restaurant Name', name: 'name', type: 'text', icon: 'storefront' },
              { label: 'Email Address', name: 'email', type: 'email', icon: 'mail' },
              { label: 'Phone Number', name: 'phone', type: 'tel', icon: 'call' },
              { label: 'Cuisine Type', name: 'cusine_type', type: 'text', icon: 'restaurant' },
              { label: 'City', name: 'city', type: 'text', icon: 'location_city' },
              { label: 'State', name: 'state', type: 'text', icon: 'map' },
            ].map(field => (
              <div key={field.name} className="space-y-2">
                <label className={`block text-sm font-semibold tracking-wide ${darkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="material-symbols-outlined align-middle mr-1 text-base opacity-70">{field.icon}</span>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`
                    w-full px-4 py-3 rounded-lg border text-base shadow-sm transition-all duration-200
                    ${isEditing
                      ? darkTheme
                        ? 'bg-gray-700 text-white border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'
                        : 'bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                      : darkTheme
                        ? 'bg-gray-800 text-gray-400 border-gray-700 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    }
                    ${isEditing ? 'hover:shadow-lg' : ''}
                  `}
                  autoComplete="off"
                />
              </div>
            ))}
          </form>

          {/* Footer */}
          <footer className={`mt-10 text-center text-xs select-none ${darkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
            © {new Date().getFullYear()} Restrostat. All rights reserved.
          </footer>
        </section>
      </main>

      {/* Google Material Symbols */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
    </div>
  );
}
