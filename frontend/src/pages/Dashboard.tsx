import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonFab,
  IonFabButton,
  IonToast,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  IonMenuButton
} from '@ionic/react';
import {
  addOutline,
  peopleOutline,
  notificationsOutline,
  refreshOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService, userService } from '../services/api';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

interface Notification {
  id: number;
  title: string;
  content: string;
  type: string;
  imagePath?: string;
  thumbnailPath?: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const history = useHistory();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<any>({ teachers: [], students: [], admins: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [notifResponse, userResponse] = await Promise.all([
        notificationService.getNotifications(),
        userService.getUsers()
      ]);

      setNotifications(notifResponse.data);
      setUsers(userResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
      setToast({ show: true, message: 'Error loading data', color: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async (event: any) => {
    await loadData();
    event.detail.complete();
  };

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  const getNotificationIcon = (type: string) => {
    const icons: any = {
      info: '📢',
      event: '📅',
      emergency: '🚨',
      success: '✅',
      warning: '⚠️'
    };
    return icons[type] || '📢';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Sidebar />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>
              <div className="header-brand">
                <img src="/assets/logos/snsu-logo-white.png" alt="SNSU" className="header-logo" />
                <span className="header-text">Dashboard</span>
              </div>
            </IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={loadData}>
                <IonIcon icon={refreshOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="dashboard-container">
          {/* User Info */}
          <IonCard>
            <IonCardContent>
              <div className="user-info">
                <div className="user-avatar">
                  {user?.profilePicture ? (
                    <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${user.profilePicture}`} alt="Profile" />
                  ) : (
                    <div className="avatar-placeholder">{user?.username[0].toUpperCase()}</div>
                  )}
                </div>
                <div>
                  <h2>{user?.username}</h2>
                  <p><IonBadge color="primary">{user?.role}</IonBadge></p>
                  {user?.role === 'teacher' && user?.department && <p>{user.department}</p>}
                  {user?.role === 'student' && user?.course && <p>{user.course} - Year {user.yearLevel}</p>}
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Stats */}
          <IonGrid>
            <IonRow>
              <IonCol size="4">
                <IonCard className="stat-card" button onClick={() => history.push(user?.role === 'admin' ? '/manage-users' : '/messages')}>
                  <IonCardContent className="ion-text-center">
                    <IonIcon icon={peopleOutline} size="large" color="primary" />
                    <h3>{users.teachers.length}</h3>
                    <p>Teachers</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="4">
                <IonCard className="stat-card" button onClick={() => history.push(user?.role === 'admin' ? '/manage-users' : user?.role === 'teacher' ? '/students' : '/messages')}>
                  <IonCardContent className="ion-text-center">
                    <IonIcon icon={peopleOutline} size="large" color="success" />
                    <h3>{users.students.length}</h3>
                    <p>Students</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="4">
                <IonCard className="stat-card" button onClick={() => history.push('/notifications')}>
                  <IonCardContent className="ion-text-center">
                    <IonIcon icon={notificationsOutline} size="large" color="warning" />
                    <h3>{notifications.length}</h3>
                    <p>Notifications</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* Notifications */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Recent Notifications</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {isLoading ? (
                <>
                  <IonSkeletonText animated style={{ height: '100px' }} />
                  <IonSkeletonText animated style={{ height: '100px' }} />
                </>
              ) : notifications.length === 0 ? (
                <p className="ion-text-center">No notifications yet</p>
              ) : (
                <div className="notifications-list">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`notification-item notification-${notif.type}`}
                      onClick={() => history.push(`/notification/${notif.id}`)}
                    >
                      <div className="notification-icon">{getNotificationIcon(notif.type)}</div>
                      <div className="notification-content">
                        <h3>{notif.title}</h3>
                        <p>{notif.content.substring(0, 100)}...</p>
                        <small>{formatDate(notif.timestamp)}</small>
                      </div>
                      {notif.thumbnailPath && (
                        <img
                          src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/${notif.thumbnailPath}`}
                          alt={notif.title}
                          className="notification-thumbnail"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </IonCardContent>
          </IonCard>
        </div>

        {user?.role === 'admin' && (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => history.push('/create-notification')}>
              <IonIcon icon={addOutline} />
            </IonFabButton>
          </IonFab>
        )}

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

export default Dashboard;
