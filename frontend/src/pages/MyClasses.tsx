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
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonToast,
  IonChip,
  IonLabel
} from '@ionic/react';
import { 
  schoolOutline, 
  timeOutline, 
  locationOutline, 
  personOutline,
  calendarOutline,
  bookOutline
} from 'ionicons/icons';
import Sidebar from '../components/Sidebar';
import { classService } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Class {
  id: number;
  className: string;
  subject: string;
  description?: string;
  schedule: string;
  room?: string;
  semester: string;
  academicYear: string;
  isActive: boolean;
  teacher?: {
    id: number;
    username: string;
    email: string;
    department?: string;
  };
}

const MyClasses: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    filterClasses();
  }, [classes, searchText]);

  const loadClasses = async () => {
    try {
      setIsLoading(true);
      const response = await classService.getClasses();
      setClasses(response.data || []);
    } catch (error) {
      console.error('Error loading classes:', error);
      setToast({ show: true, message: 'Error loading classes', color: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  const filterClasses = () => {
    let filtered = classes;

    if (searchText) {
      filtered = filtered.filter(cls =>
        cls.className.toLowerCase().includes(searchText.toLowerCase()) ||
        cls.subject.toLowerCase().includes(searchText.toLowerCase()) ||
        cls.teacher?.username.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredClasses(filtered);
  };

  const handleRefresh = async (event: any) => {
    await loadClasses();
    event.detail.complete();
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
            <IonTitle>My Classes</IonTitle>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar
              value={searchText}
              onIonInput={(e: any) => setSearchText(e.target.value)}
              placeholder="Search classes..."
              animated
            />
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
                <IonIcon icon={schoolOutline} style={{ fontSize: '48px', color: '#667eea' }} />
                <div>
                  <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600' }}>
                    {user?.role === 'teacher' ? 'My Classes' : 'Total Classes'}
                  </h2>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#667eea' }}>
                    {filteredClasses.length}
                  </p>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Classes List */}
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <IonCard key={index}>
                  <IonCardContent>
                    <IonSkeletonText animated style={{ width: '60%', height: '20px' }} />
                    <IonSkeletonText animated style={{ width: '80%', height: '16px', marginTop: '8px' }} />
                    <IonSkeletonText animated style={{ width: '40%', height: '16px', marginTop: '8px' }} />
                  </IonCardContent>
                </IonCard>
              ))
            ) : filteredClasses.length === 0 ? (
              <IonCard>
                <IonCardContent style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <IonIcon icon={schoolOutline} style={{ fontSize: '80px', color: '#ccc', marginBottom: '20px' }} />
                  <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 12px 0' }}>No Classes Found</h2>
                  <p style={{ color: '#666', fontSize: '15px' }}>
                    {searchText ? 'Try adjusting your search' : user?.role === 'teacher' ? 'You have no classes assigned yet' : 'No classes have been created yet'}
                  </p>
                </IonCardContent>
              </IonCard>
            ) : (
              filteredClasses.map((cls) => (
                <IonCard key={cls.id}>
                  <IonCardContent>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '600', color: '#333' }}>
                          {cls.className}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <IonIcon icon={bookOutline} style={{ fontSize: '16px', color: '#667eea' }} />
                          <span style={{ fontSize: '16px', fontWeight: '500', color: '#667eea' }}>
                            {cls.subject}
                          </span>
                        </div>
                      </div>
                      {cls.isActive ? (
                        <IonBadge color="success">Active</IonBadge>
                      ) : (
                        <IonBadge color="medium">Inactive</IonBadge>
                      )}
                    </div>

                    {cls.description && (
                      <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666' }}>
                        {cls.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                      <IonChip outline color="primary">
                        <IonIcon icon={timeOutline} />
                        <IonLabel>{cls.schedule}</IonLabel>
                      </IonChip>
                      {cls.room && (
                        <IonChip outline color="secondary">
                          <IonIcon icon={locationOutline} />
                          <IonLabel>Room {cls.room}</IonLabel>
                        </IonChip>
                      )}
                      <IonChip outline color="tertiary">
                        <IonIcon icon={calendarOutline} />
                        <IonLabel>{cls.semester}</IonLabel>
                      </IonChip>
                      <IonChip outline color="medium">
                        <IonLabel>{cls.academicYear}</IonLabel>
                      </IonChip>
                    </div>

                    {cls.teacher && user?.role !== 'teacher' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '8px', borderTop: '1px solid #eee' }}>
                        <IonIcon icon={personOutline} style={{ fontSize: '16px', color: '#666' }} />
                        <span style={{ fontSize: '14px', color: '#666' }}>
                          <strong>Teacher:</strong> {cls.teacher.username}
                          {cls.teacher.department && ` (${cls.teacher.department})`}
                        </span>
                      </div>
                    )}
                  </IonCardContent>
                </IonCard>
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

export default MyClasses;
