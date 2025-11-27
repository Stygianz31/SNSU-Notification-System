import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonBadge,
  IonSkeletonText,
  IonRefresher,
  IonRefresherContent,
  IonToast,
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/react';
import { 
  calendarOutline, 
  notificationsOutline, 
  timeOutline,
  personOutline
} from 'ionicons/icons';
import Sidebar from '../components/Sidebar';
import { notificationService } from '../services/api';
import { useHistory } from 'react-router-dom';

interface Notification {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  sender?: {
    username: string;
  };
}

interface GroupedNotifications {
  [key: string]: Notification[];
}

const Calendar: React.FC = () => {
  const history = useHistory();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [groupedNotifications, setGroupedNotifications] = useState<GroupedNotifications>({});
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'today' | 'past'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    groupNotificationsByDate();
  }, [notifications, filter]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationService.getNotifications();
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setToast({ show: true, message: 'Error loading calendar events', color: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  const groupNotificationsByDate = () => {
    const grouped: GroupedNotifications = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    notifications.forEach(notification => {
      const date = new Date(notification.createdAt);
      date.setHours(0, 0, 0, 0);
      
      // Apply filter
      if (filter === 'today' && date.getTime() !== today.getTime()) return;
      if (filter === 'upcoming' && date.getTime() < today.getTime()) return;
      if (filter === 'past' && date.getTime() >= today.getTime()) return;

      const dateKey = date.toISOString().split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(notification);
    });

    setGroupedNotifications(grouped);
  };

  const handleRefresh = async (event: any) => {
    await loadNotifications();
    event.detail.complete();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const notifDate = new Date(date);
    notifDate.setHours(0, 0, 0, 0);
    
    if (notifDate.getTime() === today.getTime()) {
      return 'Today';
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (notifDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (notifDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Exam': 'danger',
      'Assignment': 'warning',
      'Event': 'success',
      'Announcement': 'primary',
      'General': 'medium'
    };
    return colors[category] || 'medium';
  };

  const sortedDates = Object.keys(groupedNotifications).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <>
      <Sidebar />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Calendar</IonTitle>
          </IonToolbar>
          <IonToolbar>
            <IonSegment value={filter} onIonChange={e => setFilter(e.detail.value as any)}>
              <IonSegmentButton value="all">
                <IonLabel>All</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="today">
                <IonLabel>Today</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="upcoming">
                <IonLabel>Upcoming</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="past">
                <IonLabel>Past</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent />
          </IonRefresher>

          <div style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Summary Card */}
            <IonCard>
              <IonCardContent style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <IonIcon icon={calendarOutline} style={{ fontSize: '48px', color: '#667eea' }} />
                <div>
                  <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600' }}>
                    Calendar Events
                  </h2>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#667eea' }}>
                    {notifications.length} Total
                  </p>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Calendar Events */}
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <IonCard key={index}>
                  <IonCardContent>
                    <IonSkeletonText animated style={{ width: '40%', height: '20px' }} />
                    <IonSkeletonText animated style={{ width: '80%', height: '16px', marginTop: '8px' }} />
                  </IonCardContent>
                </IonCard>
              ))
            ) : sortedDates.length === 0 ? (
              <IonCard>
                <IonCardContent style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <IonIcon icon={calendarOutline} style={{ fontSize: '80px', color: '#ccc', marginBottom: '20px' }} />
                  <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 12px 0' }}>No Events Found</h2>
                  <p style={{ color: '#666', fontSize: '15px' }}>
                    {filter !== 'all' ? `No events for ${filter}` : 'No events to display'}
                  </p>
                </IonCardContent>
              </IonCard>
            ) : (
              sortedDates.map(dateKey => (
                <div key={dateKey} style={{ marginBottom: '20px' }}>
                  {/* Date Header */}
                  <div style={{ 
                    padding: '12px 16px', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}>
                    {formatDate(dateKey)}
                  </div>

                  {/* Notifications for this date */}
                  {groupedNotifications[dateKey].map(notification => (
                    <IonCard 
                      key={notification.id}
                      button
                      onClick={() => history.push(`/notification/${notification.id}`)}
                      style={{ marginBottom: '12px' }}
                    >
                      <IonCardContent>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600' }}>
                              {notification.title}
                            </h3>
                            <p style={{ margin: '0', fontSize: '14px', color: '#666', lineHeight: '1.4' }}>
                              {notification.content.length > 100 
                                ? `${notification.content.substring(0, 100)}...` 
                                : notification.content}
                            </p>
                          </div>
                          <IonBadge color={getCategoryColor(notification.category)} style={{ marginLeft: '12px' }}>
                            {notification.category}
                          </IonBadge>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <IonIcon icon={timeOutline} style={{ fontSize: '16px', color: '#667eea' }} />
                            <span style={{ fontSize: '13px', color: '#666' }}>
                              {formatTime(notification.createdAt)}
                            </span>
                          </div>
                          {notification.sender && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <IonIcon icon={personOutline} style={{ fontSize: '16px', color: '#667eea' }} />
                              <span style={{ fontSize: '13px', color: '#666' }}>
                                {notification.sender.username}
                              </span>
                            </div>
                          )}
                        </div>
                      </IonCardContent>
                    </IonCard>
                  ))}
                </div>
              ))
            )}
          </div>

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

export default Calendar;
