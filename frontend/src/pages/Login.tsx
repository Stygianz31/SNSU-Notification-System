import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonLoading,
  IonToast,
  IonText,
  IonIcon,
  IonNote
} from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ username: '', password: '' });
  const { login } = useAuth();
  const history = useHistory();

  const validateField = (field: 'username' | 'password', value: string) => {
    const errors = { ...fieldErrors };
    
    if (field === 'username') {
      if (!value) {
        errors.username = 'Username is required';
      } else if (value.length < 3) {
        errors.username = 'Username must be at least 3 characters';
      } else {
        errors.username = '';
      }
    }
    
    if (field === 'password') {
      if (!value) {
        errors.password = 'Password is required';
      } else if (value.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      } else {
        errors.password = '';
      }
    }
    
    setFieldErrors(errors);
    return !errors[field];
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const usernameValid = validateField('username', username);
    const passwordValid = validateField('password', password);

    if (!usernameValid || !passwordValid) {
      setError('Please fix the errors above');
      return;
    }

    setIsLoading(true);
    setError('');
    setFieldErrors({ username: '', password: '' });

    try {
      await login(username, password);
      history.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding login-page">
        <div className="login-container">
          <div className="logo-container">
            <img src="/assets/logos/snsu-logo.png" alt="SNSU Logo" className="school-logo" />
            <h1>SNSU</h1>
            <p className="subtitle">Notification System</p>
          </div>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Login</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleLogin}>
                {/* Username Field */}
                <div className="form-field">
                  <IonLabel className="field-label">Username *</IonLabel>
                  <IonItem 
                    className={`input-item ${fieldErrors.username ? 'error' : ''} ${username ? 'has-value' : ''}`}
                    lines="none"
                  >
                    <IonInput
                      type="text"
                      value={username}
                      onIonInput={(e: any) => setUsername(e.target.value)}
                      onIonBlur={() => validateField('username', username)}
                      placeholder="Enter your username"
                      autocomplete="username"
                      required
                    />
                  </IonItem>
                  {fieldErrors.username && (
                    <IonNote color="danger" className="error-message">
                      {fieldErrors.username}
                    </IonNote>
                  )}
                </div>

                {/* Password Field */}
                <div className="form-field">
                  <IonLabel className="field-label">Password *</IonLabel>
                  <IonItem 
                    className={`input-item ${fieldErrors.password ? 'error' : ''} ${password ? 'has-value' : ''}`}
                    lines="none"
                  >
                    <IonInput
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onIonInput={(e: any) => setPassword(e.target.value)}
                      onIonBlur={() => validateField('password', password)}
                      placeholder="Enter your password"
                      autocomplete="current-password"
                      required
                    />
                    <IonIcon
                      slot="end"
                      icon={showPassword ? eyeOff : eye}
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    />
                  </IonItem>
                  {fieldErrors.password && (
                    <IonNote color="danger" className="error-message">
                      {fieldErrors.password}
                    </IonNote>
                  )}
                </div>

                {/* Global Error Message */}
                {error && (
                  <IonNote color="danger" className="global-error">
                    {error}
                  </IonNote>
                )}

                <IonButton expand="block" type="submit" className="login-button" strong>
                  Login
                </IonButton>

                <IonText className="ion-text-center register-link">
                  <p>
                    Don't have an account?{' '}
                    <a href="/register">Register here</a>
                  </p>
                </IonText>
              </form>
            </IonCardContent>
          </IonCard>
        </div>

        <IonLoading isOpen={isLoading} message="Logging in..." />
      </IonContent>
    </IonPage>
  );
};

export default Login;
