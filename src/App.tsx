import { useEffect } from 'react';
import { useAppContext } from './contexts/AppContext';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const { isAuthenticated, isLoading, setIsLoading } = useAppContext();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [setIsLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Dashboard /> : <Login />;
}

export default App;