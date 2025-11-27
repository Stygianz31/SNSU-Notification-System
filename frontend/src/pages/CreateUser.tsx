import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonToast,
  IonLoading,
  IonIcon,
  IonNote
} from '@ionic/react';
import { saveOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { userService } from '../services/api';
import Sidebar from '../components/Sidebar';

const CreateUser: React.FC = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'student',
    department: '',
    course: '',
    yearLevel: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: any = {};
    
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!/^\+639\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be in format: +639XXXXXXXXX';
    }
    
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.role === 'teacher' && !formData.department.trim()) {
      newErrors.department = 'Department is required for teachers';
    }
    
    if (formData.role === 'student') {
      if (!formData.course.trim()) newErrors.course = 'Course is required for students';
      if (!formData.yearLevel || formData.yearLevel < 1 || formData.yearLevel > 5) {
        newErrors.yearLevel = 'Year level must be between 1 and 5';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setToast({ show: true, message: 'Please fix all errors', color: 'danger' });
      return;
    }

    setIsLoading(true);

    try {
      const dataToSend: any = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      };

      if (formData.role === 'teacher') {
        dataToSend.department = formData.department;
      } else if (formData.role === 'student') {
        dataToSend.course = formData.course;
        dataToSend.yearLevel = formData.yearLevel;
      }

      await userService.createUser(dataToSend);
      setToast({ show: true, message: 'User created successfully!', color: 'success' });
      setTimeout(() => history.push('/manage-users'), 1500);
    } catch (error: any) {
      setToast({
        show: true,
        message: error.response?.data?.error || 'Error creating user',
        color: 'danger'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Sidebar />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/manage-users" />
            </IonButtons>
            <IonTitle>Create User</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
            <IonCard>
              <IonCardContent>
                <form onSubmit={handleSubmit}>
                  {/* Username */}
                  <IonItem className={errors.username ? 'ion-invalid' : ''}>
                    <IonLabel position="stacked">Username *</IonLabel>
                    <IonInput
                      value={formData.username}
                      onIonInput={(e: any) => handleChange('username', e.target.value)}
                      placeholder="Enter username"
                      required
                    />
                  </IonItem>
                  {errors.username && (
                    <IonNote color="danger" style={{ display: 'block', padding: '4px 16px' }}>
                      {errors.username}
                    </IonNote>
                  )}

                  {/* Email */}
                  <IonItem className={errors.email ? 'ion-invalid' : ''}>
                    <IonLabel position="stacked">Email *</IonLabel>
                    <IonInput
                      type="email"
                      value={formData.email}
                      onIonInput={(e: any) => handleChange('email', e.target.value)}
                      placeholder="user@snsu.edu.ph"
                      required
                    />
                  </IonItem>
                  {errors.email && (
                    <IonNote color="danger" style={{ display: 'block', padding: '4px 16px' }}>
                      {errors.email}
                    </IonNote>
                  )}

                  {/* Phone */}
                  <IonItem className={errors.phone ? 'ion-invalid' : ''}>
                    <IonLabel position="stacked">Phone *</IonLabel>
                    <IonInput
                      type="tel"
                      value={formData.phone}
                      onIonInput={(e: any) => handleChange('phone', e.target.value)}
                      placeholder="+639123456789"
                      required
                    />
                  </IonItem>
                  {errors.phone && (
                    <IonNote color="danger" style={{ display: 'block', padding: '4px 16px' }}>
                      {errors.phone}
                    </IonNote>
                  )}

                  {/* Password */}
                  <IonItem className={errors.password ? 'ion-invalid' : ''}>
                    <IonLabel position="stacked">Password *</IonLabel>
                    <IonInput
                      type="password"
                      value={formData.password}
                      onIonInput={(e: any) => handleChange('password', e.target.value)}
                      placeholder="Enter password"
                      required
                    />
                  </IonItem>
                  {errors.password && (
                    <IonNote color="danger" style={{ display: 'block', padding: '4px 16px' }}>
                      {errors.password}
                    </IonNote>
                  )}

                  {/* Role */}
                  <IonItem>
                    <IonLabel position="stacked">Role *</IonLabel>
                    <IonSelect
                      value={formData.role}
                      onIonChange={(e) => handleChange('role', e.detail.value)}
                      interface="action-sheet"
                    >
                      <IonSelectOption value="admin">Admin</IonSelectOption>
                      <IonSelectOption value="teacher">Teacher</IonSelectOption>
                      <IonSelectOption value="student">Student</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  {/* Department (for teachers) */}
                  {formData.role === 'teacher' && (
                    <>
                      <IonItem className={errors.department ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">Department *</IonLabel>
                        <IonInput
                          value={formData.department}
                          onIonInput={(e: any) => handleChange('department', e.target.value)}
                          placeholder="e.g., Computer Science"
                          required
                        />
                      </IonItem>
                      {errors.department && (
                        <IonNote color="danger" style={{ display: 'block', padding: '4px 16px' }}>
                          {errors.department}
                        </IonNote>
                      )}
                    </>
                  )}

                  {/* Course and Year Level (for students) */}
                  {formData.role === 'student' && (
                    <>
                      <IonItem className={errors.course ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">Course *</IonLabel>
                        <IonInput
                          value={formData.course}
                          onIonInput={(e: any) => handleChange('course', e.target.value)}
                          placeholder="e.g., BS in Computer Science"
                          required
                        />
                      </IonItem>
                      {errors.course && (
                        <IonNote color="danger" style={{ display: 'block', padding: '4px 16px' }}>
                          {errors.course}
                        </IonNote>
                      )}

                      <IonItem className={errors.yearLevel ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">Year Level *</IonLabel>
                        <IonSelect
                          value={formData.yearLevel}
                          onIonChange={(e) => handleChange('yearLevel', e.detail.value)}
                          interface="action-sheet"
                        >
                          <IonSelectOption value={1}>1st Year</IonSelectOption>
                          <IonSelectOption value={2}>2nd Year</IonSelectOption>
                          <IonSelectOption value={3}>3rd Year</IonSelectOption>
                          <IonSelectOption value={4}>4th Year</IonSelectOption>
                          <IonSelectOption value={5}>5th Year</IonSelectOption>
                        </IonSelect>
                      </IonItem>
                      {errors.yearLevel && (
                        <IonNote color="danger" style={{ display: 'block', padding: '4px 16px' }}>
                          {errors.yearLevel}
                        </IonNote>
                      )}
                    </>
                  )}

                  {/* Submit Button */}
                  <IonButton
                    expand="block"
                    type="submit"
                    style={{ marginTop: '20px' }}
                    disabled={isLoading}
                  >
                    <IonIcon slot="start" icon={saveOutline} />
                    Create User
                  </IonButton>

                  <IonButton
                    expand="block"
                    fill="clear"
                    onClick={() => history.push('/manage-users')}
                    disabled={isLoading}
                  >
                    Cancel
                  </IonButton>
                </form>
              </IonCardContent>
            </IonCard>
          </div>

          <IonLoading isOpen={isLoading} message="Creating user..." />
          <IonToast
            isOpen={toast.show}
            message={toast.message}
            duration={3000}
            color={toast.color}
            onDidDismiss={() => setToast({ ...toast, show: false })}
          />
        </IonContent>
      </IonPage>
    </>
  );
};

export default CreateUser;
