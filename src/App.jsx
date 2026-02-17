import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState, createContext } from 'react';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import SummaryApi from '../common/index';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SiteSettingsProvider } from './context/SiteSettingsContext';

// Create Context
export const Context = createContext();

function App() {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [cartProductCount, setCartProductCount] = useState(0);

  // Fetch user details from backend
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data);
        dispatch(setUserDetails(data.data));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };
  

  // Fetch cart count from backend (if logged in)
  const fetchUserAddToCount = async () => {
    try {
      const response = await fetch(SummaryApi.countToProdcut.url, {
        method: SummaryApi.countToProdcut.method,
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        console.log(" Cart count from backend:", data);
        setCartProductCount(data?.data?.count || 0);
      } else {
        setCartProductCount(0);
      }
    } catch (error) {
      console.error(" Failed to fetch cart count:", error);
    }
  };

  //  Increase cart count locally when “Add to Cart” is clicked
  const increaseCartCount = (amount = 1) => {
    setCartProductCount((prev) => prev + amount);
  };

  //  Refresh cart count from localStorage (fallback for guests)
  const refreshCartCount = () => {
    const localCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const count = localCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartProductCount(count);
  };

  //  Run on app load
  useEffect(() => {
    fetchUserDetails();
    fetchUserAddToCount();
    refreshCartCount();
  }, []);

  //  Context values shared globally
  const contextValue = {
    user,
    setUser,
    fetchUserDetails,
    fetchUserAddToCount,
    cartProductCount,
    setCartProductCount,
    increaseCartCount,
    refreshCartCount,
  };

  return (
    <GoogleOAuthProvider clientId="928805232883-red1udn5fb1qaubie4ub81gjsq2lueem.apps.googleusercontent.com">
      <SiteSettingsProvider>
        <Context.Provider value={contextValue}>
          <ToastContainer position="top-center" />
          <Header />
          <main className="min-h-[calc(100vh-120px)] pt-16">
            <Outlet />
          </main>
          <Footer />
        </Context.Provider>
      </SiteSettingsProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
