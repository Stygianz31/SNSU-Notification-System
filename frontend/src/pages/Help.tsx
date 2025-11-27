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
  IonIcon,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react';
import { helpCircleOutline, mailOutline, callOutline, globeOutline } from 'ionicons/icons';
import Sidebar from '../components/Sidebar';

const Help: React.FC = () => {
  return (
    <>
      <Sidebar />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Help & Support</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <IonCard>
              <IonCardContent style={{ textAlign: 'center', padding: '40px 20px 20px' }}>
                <IonIcon icon={helpCircleOutline} style={{ fontSize: '80px', color: '#667eea', marginBottom: '20px' }} />
                <h2 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 12px 0' }}>Need Help?</h2>
                <p style={{ color: '#666', fontSize: '15px', marginBottom: '30px' }}>
                  We're here to help! Contact us through any of the methods below.
                </p>

                <IonList>
                  <IonItem button>
                    <IonIcon icon={mailOutline} slot="start" color="primary" />
                    <IonLabel>
                      <h3>Email Support</h3>
                      <p>support@snsu.edu.ph</p>
                    </IonLabel>
                  </IonItem>
                  
                  <IonItem button>
                    <IonIcon icon={callOutline} slot="start" color="primary" />
                    <IonLabel>
                      <h3>Phone Support</h3>
                      <p>+63 912 345 6789</p>
                    </IonLabel>
                  </IonItem>
                  
                  <IonItem button>
                    <IonIcon icon={globeOutline} slot="start" color="primary" />
                    <IonLabel>
                      <h3>Website</h3>
                      <p>www.snsu.edu.ph</p>
                    </IonLabel>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Help;
