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
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonRefresher,
  IonRefresherContent
} from '@ionic/react';
import {
  peopleOutline,
  notificationsOutline,
  chatbubblesOutline,
  personOutline,
  schoolOutline,
  briefcaseOutline,
  trendingUpOutline,
  timeOutline
} from 'ionicons/icons';
import { userService, notificationService, messageService } from '../services/api';
import Sidebar from '../components/Sidebar';

const Analytics: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalNotifications: 0,
    totalMessages: 0,
    activeNotifications: 0,
    recentActivity: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [usersRes, notificationsRes, messagesRes] = await Promise.all([
        userService.getUsers(),
        notificationService.getNotifications(),
        messageService.getMessages()
      ]);

      const users = [
        ...(usersRes.data.admins || []),
        ...(usersRes.data.teachers || []),
        ...(usersRes.data.students || [])
      ];

      const admins = usersRes.data.admins || [];
      const teachers = usersRes.data.teachers || [];
      const students = usersRes.data.students || [];
      const notifications = notificationsRes.data || [];
      const messages = messagesRes.data || [];

      const activeNotifs = notifications.filter((n: any) => n.isActive).length;
      const recentMessages = messages.filter((m: any) => {
        const msgDate = new Date(m.createdAt);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return msgDate > dayAgo;
      }).length;

      setStats({
        totalUsers: users.length,
        totalAdmins: admins.length,
        totalTeachers: teachers.length,
        totalStudents: students.length,
        totalNotifications: notifications.length,
        totalMessages: messages.length,
        activeNotifications: activeNotifs,
        recentActivity: recentMessages
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: any) => {
    await loadAnalytics();
    event.detail.complete();
  };

  const StatCard = ({ title, value, icon, color, subtitle }: any) => (
    <IonCol size="12" sizeMd="6" sizeLg="3">
      <IonCard style={{ margin: '8px', height: '100%' }}>
        <IonCardContent>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{title}</p>
              <h2 style={{ margin: '8px 0', fontSize: '32px', fontWeight: 'bold', color: color }}>
                {loading ? '...' : value}
              </h2>
              {subtitle && (
                <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>{subtitle}</p>
              )}
            </div>
            <IonIcon icon={icon} style={{ fontSize: '48px', color: color, opacity: 0.2 }} />
          </div>
        </IonCardContent>
      </IonCard>
    </IonCol>
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
            <IonTitle>Analytics Dashboard</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>

          <div style={{ padding: '16px', maxWidth: '1400px', margin: '0 auto' }}>
            {/* User Statistics */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>User Statistics</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <StatCard
                      title="Total Users"
                      value={stats.totalUsers}
                      icon={peopleOutline}
                      color="#667eea"
                      subtitle="All registered users"
                    />
                    <StatCard
                      title="Students"
                      value={stats.totalStudents}
                      icon={schoolOutline}
                      color="#4CAF50"
                      subtitle="Active students"
                    />
                    <StatCard
                      title="Teachers"
                      value={stats.totalTeachers}
                      icon={briefcaseOutline}
                      color="#FF9800"
                      subtitle="Faculty members"
                    />
                    <StatCard
                      title="Admins"
                      value={stats.totalAdmins}
                      icon={personOutline}
                      color="#F44336"
                      subtitle="System administrators"
                    />
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>

            {/* Activity Statistics */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Activity Statistics</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <StatCard
                      title="Total Notifications"
                      value={stats.totalNotifications}
                      icon={notificationsOutline}
                      color="#9C27B0"
                      subtitle="All time"
                    />
                    <StatCard
                      title="Active Notifications"
                      value={stats.activeNotifications}
                      icon={trendingUpOutline}
                      color="#00BCD4"
                      subtitle="Currently active"
                    />
                    <StatCard
                      title="Total Messages"
                      value={stats.totalMessages}
                      icon={chatbubblesOutline}
                      color="#E91E63"
                      subtitle="All conversations"
                    />
                    <StatCard
                      title="Recent Activity"
                      value={stats.recentActivity}
                      icon={timeOutline}
                      color="#FFC107"
                      subtitle="Last 24 hours"
                    />
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>

            {/* Quick Insights */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Quick Insights</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
                    <span>User Distribution</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <IonBadge color="success">{stats.totalStudents} Students</IonBadge>
                      <IonBadge color="warning">{stats.totalTeachers} Teachers</IonBadge>
                      <IonBadge color="danger">{stats.totalAdmins} Admins</IonBadge>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
                    <span>Notification Status</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <IonBadge color="primary">{stats.activeNotifications} Active</IonBadge>
                      <IonBadge color="medium">{stats.totalNotifications - stats.activeNotifications} Inactive</IonBadge>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
                    <span>Message Activity</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <IonBadge color="tertiary">{stats.recentActivity} Messages (24h)</IonBadge>
                      <IonBadge color="medium">{stats.totalMessages} Total</IonBadge>
                    </div>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Analytics;
