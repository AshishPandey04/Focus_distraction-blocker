import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthCheck() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return null;
}

export default AuthCheck; 