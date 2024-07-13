// Import necessary hooks and componets from react-redux and react-router-dom
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

// Define the PrivateRoute component
export default function PrivateRoute() {
  // Use the useSelector hook to access the currentUser from the Redux sotre
  const { currentUser } = useSelector((state) => state.user);

  // Check if currentUser is present
  // If currentUser exists, render the Outlet component to display the child routes
  // If the currentUser does not exist, navigate to the sign-in page
  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;
}
