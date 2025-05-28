import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Login.css'; // Assuming you have a separate CSS file for styles

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, authError } = useContext(AuthContext);
  const navigate = useNavigate();

  // Clear error when inputs change
  useEffect(() => {
    if (errorMessage) setErrorMessage('');
  }, [email, password]);

  // Show auth errors from context
  useEffect(() => {
    if (authError) setErrorMessage(authError);
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    // Simple validation
    if (!email) {
      setErrorMessage('Email is required');
      setIsLoading(false);
      return;
    }
    
    if (!password) {
      setErrorMessage('Password is required');
      setIsLoading(false);
      return;
    }
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        // AuthContext already sets the error
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.response?.data?.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2>Login to Your Account</h2>
        
        {errorMessage && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>
          
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="register-link">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;

// Add these styles to your CSS or use inline styles
const styles = `
  .error-message {
    background-color: rgba(244, 67, 54, 0.1);
    color: #D32F2F;
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
  }

  .error-message i {
    margin-right: 10px;
    font-size: 1.1rem;
  }

  .form-group input:focus {
    border-color: #B85C38;
    box-shadow: 0 0 0 2px rgba(184, 92, 56, 0.2);
  }

  .login-button {
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .login-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;