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
import { documentTextOutline } from 'ionicons/icons';
import Sidebar from '../components/Sidebar';

const Reports: React.FC = () => {
  return (
    <>
      <Sidebar />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Reports</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <IonCard>
              <IonCardContent style={{ textAlign: 'center', padding: '60px 20px' }}>
                <IonIcon icon={documentTextOutline} style={{ fontSize: '80px', color: '#667eea', marginBottom: '20px' }} />
                <h2 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 12px 0' }}>Reports</h2>
                <p style={{ color: '#666', fontSize: '15px', maxWidth: '400px', margin: '0 auto' }}>
                  Generate and view system reports. Export data, create summaries, and analyze trends.
                </p>
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Reports;
