import React from 'react';
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
  IonIcon
} from '@ionic/react';
import { bookOutline } from 'ionicons/icons';
import Sidebar from '../components/Sidebar';

const MyCourses: React.FC = () => {
  return (
    <>
      <Sidebar />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>My Courses</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <IonCard>
              <IonCardContent style={{ textAlign: 'center', padding: '60px 20px' }}>
                <IonIcon icon={bookOutline} style={{ fontSize: '80px', color: '#667eea', marginBottom: '20px' }} />
                <h2 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 12px 0' }}>My Courses</h2>
                <p style={{ color: '#666', fontSize: '15px', maxWidth: '400px', margin: '0 auto' }}>
                  View your enrolled courses, assignments, grades, and course materials.
                </p>
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default MyCourses;
