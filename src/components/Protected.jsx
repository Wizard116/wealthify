import { useEffect } from "react"
import axios from "axios"

export default function Protected({ Component, isLoggedIn, handleLogin }) {
  useEffect(() => {
    const token = localStorage.getItem("token"); // Move token retrieval inside useEffect
    const fetchData = async () => { // Define an async function
      try {
        if(isLoggedIn) {handleLogin(true); return; } // If already logged in, return
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/verify`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    
        // Assuming server responds with a status indicating whether the token is valid
        if (response.data.valid) {
          handleLogin(true);
          console.log('Token is valid');
        } else {
          console.log('Token is invalid');
        }
      } catch (error) {
        console.error('Error verifying token:', error);
      }
    };

    fetchData(); // Call the async function
    
    // Cleanup function to prevent multiple calls
    return () => {
      // Cleanup logic if needed
    };
  }, [isLoggedIn, handleLogin]); // Depend on isLoggedIn and handleLogin
  
  return (
    <>
      <Component />
    </>
    )
}
