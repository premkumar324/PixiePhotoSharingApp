import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import authService from "./appwrite/auth"
import { login } from './store/authSlice'
import { logout } from './store/authSlice'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
// App.jsx
import './app.css';

function App() {
  console.log('App component rendered');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('useEffect is running'); // Log to check if the effect is triggered
    
    authService.getcurrentUser()
      .then((userData) => {
        console.log('userData:', userData); // Log the user data to inspect the response
        if (userData) {
          console.log('Dispatching login action');
          dispatch(login({ userData }));
        } else {
          console.log('Dispatching logout action');
          dispatch(logout());
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  
  
  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
        <main>
          TODO: {/*outlet*/}
        </main>
        <Footer />
      </div>
    </div>
  ) : null;
}

export default App;
