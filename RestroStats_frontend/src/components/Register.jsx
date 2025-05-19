import { useState } from "react";
import logo from "../assets/LOGO 1.jpg";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    state: "",
    phone: "",
    cuisine_type: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${baseURL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: "", email: "", password: "", confirmPassword: "",
          city: "", state: "", phone: "", cuisine_type: ""
        });
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-6xl grid grid-cols-2 gap-8 p-10">
        <div className="flex flex-col justify-center pr-8">
          <h1 className="text-4xl font-bold text-blue-700 mb-6">
            Register Your Restaurant
          </h1>
          <p className="text-gray-600 text-lg">
            Get started by entering your restaurant details and contact info.
          </p>
          <img
            src={logo}
            alt="Restaurant"
            className="mt-10"
          />
        </div>

        <div>
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
              🎉 Registration successful! You can now log in.
            </div>
          )}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { id: "name", label: "Restaurant Name" },
              { id: "city", label: "City" },
              { id: "state", label: "State" },
              { id: "phone", label: "Phone", type: "tel", pattern: "[0-9]{10}" },
              { id: "cuisine_type", label: "Cuisine Type" },
              { id: "email", label: "Email", type: "email" },
              { id: "password", label: "Password", type: "password" },
              { id: "confirmPassword", label: "Confirm Password", type: "password" },
            ].map(({ id, label, type = "text", pattern }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  id={id}
                  name={id}
                  type={type}
                  pattern={pattern}
                  value={formData[id]}
                  onChange={handleChange}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-md shadow-lg hover:from-blue-600 hover:to-purple-600 transition duration-300"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <div className="text-center mt-4 text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Log in
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
