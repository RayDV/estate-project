// Import necessary fucntions and components from firebase, redux, and react-router-dom
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

// Define the OAuth component
export default function OAuth() {
  // Use the useDispatch hook to get the dispatch from the Redux store
  const dispatch = useDispatch();
  // Use the useNavigate hook to programmatically navigate
  const navigate = useNavigate();

  // Function to handle Google sign-in click event
  const handleGoogleClick = async () => {
    try {

      // Create a new GoogleAuthProvider instance
      const provider = new GoogleAuthProvider();

      // Get the Firebase Auth instance using the Firebase app instance
      const auth = getAuth(app);

      // Sign in with Google using a popup window
      const result = await signInWithPopup(auth, provider);

      // Send the user information to the server to handle authentication
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      // Parse the JSON response from the server
      const data = await res.json();

      // Dispatch the signInSuccess action with the user data to update the Redux store
      dispatch(signInSuccess(data));
      // Navigate to the home page after successful sign-in
      navigate('/');
    } catch (error) {
      console.log('could not sign in with google', error);
    }
  };
  // Return a button that triggers Google sign-in when clicked
  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
    >
      Continue with google
    </button>
  );
}