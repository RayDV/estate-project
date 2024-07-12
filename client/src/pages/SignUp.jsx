import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

// This component handles the sign-up process for new users
export default function SignUp() {
  // State to keep track of the form data entered by the user
  const [formData, setFormData] = useState({});
  // State to keep track of the form data entered by the user
  const [error, setError] = useState(null);
  // State to indicate whether a sign-up request is in progress
  const [loading, setLoading] = useState(false);
  // Hook to navigate programmatically after a successful sign-up
  const navigate = useNavigate();

  // Function to handle changes in the input fields
  const handleChange = (e) => {
    // Update the form data state with the new value from the input field
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      setLoading(true); // Set loading state to true while the request is in progress
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send the form data as JSON
      });
      const data = await res.json(); // Parse the JSON response
      if (data.success === false) {
        setLoading(false); // Set loading state to false
        setError(data.message); // Set error state with the error message
        return;
      }
      setLoading(false); // Set loading state to false
      setError(null); // Clear any previous errors
      navigate("/sign-in"); // Navigate to the sign-in page
    } catch (error) {
      setLoading(false); // Set loading state to false
      setError(error.message); // Set error state with the caught error message
    }
  };
  console.log(formData); // Log the form data for debugging

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1
        className="text-3xl text-center font-semibold
      my-7"
      >
        Sign up
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3
        rounded-lg uppercase hov:opacity-95 
        desiabled:opacity-80"
        >
          {loading ? "Loading..." : "sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
