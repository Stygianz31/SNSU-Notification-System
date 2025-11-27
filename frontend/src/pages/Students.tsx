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
  IonAvatar,
  IonSkeletonText,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonToast
} from '@ionic/react';
import { peopleOutline, mailOutline, callOutline, schoolOutline, personCircleOutline } from 'ionicons/icons';
import Sidebar from '../components/Sidebar';
import { userService } from '../services/api';

interface Student {
  id: number;
  username: string;
  email: string;
  phone: string;
  profilePicture?: string;
  course?: string;
  yearLevel?: number;
  onlineStatus: boolean;
}

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchText]);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getUsers();
      setStudents(response.data.students || []);
    } catch (error) {
      setToast({ show: true, message: 'Error loading students', color: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchText) {
      filtered = filtered.filter(student =>
        student.username.toLowerCase().includes(searchText.toLowerCase()) ||
        student.email.toLowerCase().includes(searchText.toLowerCase()) ||
        student.course?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  };

  const handleRefresh = async (event: any) => {
    await loadStudents();
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
            <IonTitle>Students</IonTitle>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar
              value={searchText}
              onIonInput={(e: any) => setSearchText(e.target.value)}
              placeholder="Search students..."
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
                <IonIcon icon={peopleOutline} style={{ fontSize: '48px', color: '#667eea' }} />
                <div>
                  <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600' }}>
                    Total Students
                  </h2>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#667eea' }}>
                    {filteredStudents.length}
                  </p>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Students List */}
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <IonCard key={index}>
                  <IonCardContent>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <IonSkeletonText animated style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                      <div style={{ flex: 1 }}>
                        <IonSkeletonText animated style={{ width: '40%', height: '20px' }} />
                        <IonSkeletonText animated style={{ width: '60%', height: '16px', marginTop: '8px' }} />
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))
            ) : filteredStudents.length === 0 ? (
              <IonCard>
                <IonCardContent style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <IonIcon icon={peopleOutline} style={{ fontSize: '80px', color: '#ccc', marginBottom: '20px' }} />
                  <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 12px 0' }}>No Students Found</h2>
                  <p style={{ color: '#666', fontSize: '15px' }}>
                    {searchText ? 'Try adjusting your search' : 'No students are registered yet'}
                  </p>
                </IonCardContent>
              </IonCard>
            ) : (
              filteredStudents.map((student) => (
                <IonCard key={student.id}>
                  <IonCardContent>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      {/* Avatar */}
                      <IonAvatar style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                        {student.profilePicture ? (
                          <img 
                            src={student.profilePicture.startsWith('http') 
                              ? student.profilePicture 
                              : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${student.profilePicture}`
                            } 
                            alt={student.username}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <IonIcon icon={personCircleOutline} style={{ fontSize: '60px', color: '#667eea' }} />
                        )}
                      </IonAvatar>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{student.username}</h3>
                          {student.onlineStatus && (
                            <IonBadge color="success" style={{ fontSize: '10px' }}>Online</IonBadge>
                          )}
                        </div>

                        {student.course && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                            <IonIcon icon={schoolOutline} style={{ fontSize: '16px', color: '#666' }} />
                            <span style={{ fontSize: '14px', color: '#666' }}>
                              {student.course} {student.yearLevel && `- Year ${student.yearLevel}`}
                            </span>
                          </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <IonIcon icon={mailOutline} style={{ fontSize: '16px', color: '#666' }} />
                          <span style={{ fontSize: '14px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {student.email}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <IonIcon icon={callOutline} style={{ fontSize: '16px', color: '#666' }} />
                          <span style={{ fontSize: '14px', color: '#666' }}>{student.phone}</span>
                        </div>
                      </div>
                    </div>
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

export default Students;
