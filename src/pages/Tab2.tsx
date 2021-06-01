import {
  IonButton,
  IonCol,
  IonContent,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonAlert
} from '@ionic/react';
import './Tab2.css';
import { Plugins } from '@capacitor/core';
import { useState } from 'react';

const {BarcodeScanner} = Plugins;

const Tab2: React.FC = () => {
  const [present] = useIonAlert();
  const [res, setResult] = useState('');
  const [scanActive, setScanActive] = useState(false);

  const startScanner = async () => {
    const allowed = await checkPermission();
    if (allowed) {
      setScanActive(true);
      BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan();
      console.log(result);
      if (result.hasContent) {
        setResult(result.content);
        setScanActive(false);
      }
    }
  }

  const checkPermission = async () => {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({force: true});
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        present({
          cssClass: 'my-css',
          header: 'No permission',
          message: 'Please, allow camera access in your settings',
          buttons: [
            {text: 'No', role: 'cancel'},
            {
              text: 'Open Settings', handler: () => {
                BarcodeScanner.openAppSettings();
                resolve(false);
              }
            },
          ]
        })
      } else {
        resolve(false);
      }
    });
  }

  const stopScanner = () => {
    BarcodeScanner.stopScan();
    setScanActive(false);
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className={scanActive ? 'content--transparent' : ''}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonButton onClick={startScanner} hidden={scanActive}>Scan</IonButton>
        <p className="ion-text-center">{res ? res : ''}</p>

        <IonRow hidden={!scanActive}>
          <IonCol className="ion-no-padding">
            <IonButton className="scanner-button" onClick={stopScanner}>Stop</IonButton>
          </IonCol>
        </IonRow>

        <div className="scan-box" hidden={!scanActive}>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
