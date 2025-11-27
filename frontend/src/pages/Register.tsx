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
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonNote
} from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import './Register.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '+639',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: '',
    course: '',
    yearLevel: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const history = useHistory();

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateField = (field: string, value: string) => {
    const errors = { ...fieldErrors };
    
    switch (field) {
      case 'username':
        if (!value) errors.username = 'Username is required';
        else if (value.length < 3) errors.username = 'Username must be at least 3 characters';
        else delete errors.username;
        break;
      case 'email':
        if (!value) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) errors.email = 'Email is invalid';
        else delete errors.email;
        break;
      case 'phone':
        if (!value) errors.phone = 'Phone is required';
        else if (!/^\+639\d{9}$/.test(value)) errors.phone = 'Format: +639XXXXXXXXX';
        else delete errors.phone;
        break;
      case 'password':
        if (!value) errors.password = 'Password is required';
        else if (value.length < 6) errors.password = 'Must be at least 6 characters';
        else delete errors.password;
        break;
      case 'confirmPassword':
        if (!value) errors.confirmPassword = 'Please confirm password';
        else if (value !== formData.password) errors.confirmPassword = 'Passwords do not match';
        else delete errors.confirmPassword;
        break;
      case 'department':
        if (formData.role === 'teacher' && !value) errors.department = 'Department is required';
        else delete errors.department;
        break;
      case 'course':
        if (formData.role === 'student' && !value) errors.course = 'Course is required';
        else delete errors.course;
        break;
      case 'yearLevel':
        if (formData.role === 'student' && !value) errors.yearLevel = 'Year level is required';
        else delete errors.yearLevel;
        break;
    }
    
    setFieldErrors(errors);
    return !errors[field];
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const fieldsToValidate = ['username', 'email', 'phone', 'password', 'confirmPassword'];
    if (formData.role === 'teacher') fieldsToValidate.push('department');
    if (formData.role === 'student') fieldsToValidate.push('course', 'yearLevel');
    
    let hasErrors = false;
    fieldsToValidate.forEach(field => {
      const value = formData[field as keyof typeof formData];
      const stringValue = value !== undefined && value !== null ? String(value) : '';
      if (!validateField(field, stringValue)) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setError('Please fix all errors before submitting');
      return;
    }

    setIsLoading(true);
    setError('');
    setFieldErrors({});

    try {
      const registerData: any = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role
      };

      if (formData.role === 'teacher') {
        registerData.department = formData.department.trim();
      } else if (formData.role === 'student') {
        registerData.course = formData.course.trim();
        registerData.yearLevel = parseInt(formData.yearLevel) || 1;
      }

      // Call API directly instead of using useAuth().register() to prevent auto-login
      const response = await authService.register(registerData);
      
      // Don't store token - user must manually log in
      // Just show success and redirect to login
      const ion = (window as any).Ionic;
      if (ion && ion.presentingElement) {
        const toast = document.createElement('ion-toast');
        toast.message = 'Account created successfully! Please log in with your credentials.';
        toast.duration = 4000;
        toast.position = 'top';
        toast.color = 'success';
        document.body.appendChild(toast);
        (toast as any).present();
      }
      
      // Redirect to login page (not dashboard)
      setTimeout(() => {
        history.push('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding register-page">
        <div className="register-container">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Create Account</IonCardTitle>
              <p className="subtitle">Join SNSU Notification System</p>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleRegister}>
                {/* Username Field */}
                <div className="form-field">
                  <IonLabel className="field-label">Username *</IonLabel>
                  <IonItem 
                    className={`input-item ${fieldErrors.username ? 'error' : ''} ${formData.username ? 'has-value' : ''}`}
                    lines="none"
                  >
                    <IonInput
                      type="text"
                      value={formData.username}
                      onIonInput={(e: any) => handleChange('username', e.target.value)}
                      onIonBlur={() => validateField('username', formData.username)}
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

                {/* Email Field */}
                <div className="form-field">
                  <IonLabel className="field-label">Email Address *</IonLabel>
                  <IonItem 
                    className={`input-item ${fieldErrors.email ? 'error' : ''} ${formData.email ? 'has-value' : ''}`}
                    lines="none"
                  >
                    <IonInput
                      type="email"
                      value={formData.email}
                      onIonInput={(e: any) => handleChange('email', e.target.value)}
                      onIonBlur={() => validateField('email', formData.email)}
                      placeholder="your.email@example.com"
                      inputmode="email"
                      autocomplete="email"
                      required
                    />
                  </IonItem>
                  {fieldErrors.email && (
                    <IonNote color="danger" className="error-message">
                      {fieldErrors.email}
                    </IonNote>
                  )}
                </div>

                {/* Phone Field */}
                <div className="form-field">
                  <IonLabel className="field-label">Phone Number *</IonLabel>
                  <IonItem 
                    className={`input-item ${fieldErrors.phone ? 'error' : ''} ${formData.phone ? 'has-value' : ''}`}
                    lines="none"
                  >
                    <IonInput
                      type="tel"
                      value={formData.phone}
                      onIonInput={(e: any) => handleChange('phone', e.target.value)}
                      onIonBlur={() => validateField('phone', formData.phone)}
                      placeholder="+639XXXXXXXXX"
                      inputmode="tel"
                      autocomplete="tel"
                      required
                    />
                  </IonItem>
                  {fieldErrors.phone ? (
                    <IonNote color="danger" className="error-message">
                      {fieldErrors.phone}
                    </IonNote>
                  ) : (
                    <IonNote className="helper-text">
                      Philippine mobile format: +639XXXXXXXXX
                    </IonNote>
                  )}
                </div>

                {/* Role Field */}
                <div className="form-field">
                  <IonLabel className="field-label">I am a *</IonLabel>
                  <IonItem 
                    className={`input-item select-item ${formData.role ? 'has-value' : ''}`}
                    lines="none"
                  >
                    <IonSelect
                      value={formData.role}
                      onIonChange={(e) => handleChange('role', e.detail.value)}
                      interface="action-sheet"
                      interfaceOptions={{
                        header: 'Select your role',
                        cssClass: 'role-select'
                      }}
                    >
                      <IonSelectOption value="student">Student</IonSelectOption>
                      <IonSelectOption value="teacher">Teacher</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </div>

                {/* Teacher-specific Fields */}
                {formData.role === 'teacher' && (
                  <div className="form-field" style={{animation: 'slideIn 0.3s ease-out'}}>
                    <IonLabel className="field-label">Department *</IonLabel>
                    <IonItem 
                      className={`input-item ${fieldErrors.department ? 'error' : ''} ${formData.department ? 'has-value' : ''}`}
                      lines="none"
                    >
                      <IonInput
                        type="text"
                        value={formData.department}
                        onIonInput={(e: any) => handleChange('department', e.target.value)}
                        onIonBlur={() => validateField('department', formData.department)}
                        placeholder="e.g., Computer Science"
                        required
                      />
                    </IonItem>
                    {fieldErrors.department && (
                      <IonNote color="danger" className="error-message">
                        {fieldErrors.department}
                      </IonNote>
                    )}
                  </div>
                )}

                {/* Student-specific Fields */}
                {formData.role === 'student' && (
                  <>
                    <div className="form-field" style={{animation: 'slideIn 0.3s ease-out'}}>
                      <IonLabel className="field-label">Course *</IonLabel>
                      <IonItem 
                        className={`input-item ${fieldErrors.course ? 'error' : ''} ${formData.course ? 'has-value' : ''}`}
                        lines="none"
                      >
                        <IonInput
                          type="text"
                          value={formData.course}
                          onIonInput={(e: any) => handleChange('course', e.target.value)}
                          onIonBlur={() => validateField('course', formData.course)}
                          placeholder="e.g., BS Computer Science"
                          required
                        />
                      </IonItem>
                      {fieldErrors.course ? (
                        <IonNote color="danger" className="error-message">
                          {fieldErrors.course}
                        </IonNote>
                      ) : (
                        <IonNote className="helper-text">
                          Your course or program of study
                        </IonNote>
                      )}
                    </div>

                    <div className="form-field" style={{animation: 'slideIn 0.3s ease-out 0.1s both'}}>
                      <IonLabel className="field-label">Year Level *</IonLabel>
                      <IonItem 
                        className={`input-item select-item ${fieldErrors.yearLevel ? 'error' : ''} ${formData.yearLevel ? 'has-value' : ''}`}
                        lines="none"
                      >
                        <IonSelect
                          value={formData.yearLevel}
                          onIonChange={(e) => handleChange('yearLevel', e.detail.value)}
                          interface="action-sheet"
                          interfaceOptions={{
                            header: 'Select year level',
                            cssClass: 'year-select'
                          }}
                        >
                          <IonSelectOption value="1">1st Year</IonSelectOption>
                          <IonSelectOption value="2">2nd Year</IonSelectOption>
                          <IonSelectOption value="3">3rd Year</IonSelectOption>
                          <IonSelectOption value="4">4th Year</IonSelectOption>
                        </IonSelect>
                      </IonItem>
                      {fieldErrors.yearLevel && (
                        <IonNote color="danger" className="error-message">
                          {fieldErrors.yearLevel}
                        </IonNote>
                      )}
                    </div>
                  </>
                )}

                {/* Password Field */}
                <div className="form-field">
                  <IonLabel className="field-label">Password *</IonLabel>
                  <IonItem 
                    className={`input-item ${fieldErrors.password ? 'error' : ''} ${formData.password ? 'has-value' : ''}`}
                    lines="none"
                  >
                    <IonInput
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onIonInput={(e: any) => handleChange('password', e.target.value)}
                      onIonBlur={() => validateField('password', formData.password)}
                      placeholder="Create a secure password"
                      autocomplete="new-password"
                      required
                    />
                    <IonIcon
                      slot="end"
                      icon={showPassword ? eyeOff : eye}
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    />
                  </IonItem>
                  {fieldErrors.password ? (
                    <IonNote color="danger" className="error-message">
                      {fieldErrors.password}
                    </IonNote>
                  ) : (
                    <IonNote className="helper-text">
                      At least 6 characters (letters, numbers, symbols)
                    </IonNote>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="form-field">
                  <IonLabel className="field-label">Confirm Password *</IonLabel>
                  <IonItem 
                    className={`input-item ${fieldErrors.confirmPassword ? 'error' : ''} ${formData.confirmPassword ? 'has-value' : ''}`}
                    lines="none"
                  >
                    <IonInput
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onIonInput={(e: any) => handleChange('confirmPassword', e.target.value)}
                      onIonBlur={() => validateField('confirmPassword', formData.confirmPassword)}
                      placeholder="Re-enter your password"
                      autocomplete="new-password"
                      required
                    />
                    <IonIcon
                      slot="end"
                      icon={showConfirmPassword ? eyeOff : eye}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="password-toggle"
                    />
                  </IonItem>
                  {fieldErrors.confirmPassword && (
                    <IonNote color="danger" className="error-message">
                      {fieldErrors.confirmPassword}
                    </IonNote>
                  )}
                </div>

                {/* Global Error Message */}
                {error && (
                  <IonNote color="danger" className="global-error">
                    {error}
                  </IonNote>
                )}

                <IonButton expand="block" type="submit" className="register-button" strong>
                  Create Account
                </IonButton>

                <IonText className="ion-text-center login-link">
                  <p>
                    Already have an account?{' '}
                    <a href="/login">Login here</a>
                  </p>
                </IonText>
              </form>
            </IonCardContent>
          </IonCard>
        </div>

        <IonLoading isOpen={isLoading} message="Creating account..." />
      </IonContent>
    </IonPage>
  );
};

export default Register;
