import { BellRing } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';

export function NotificationButton() {
  const [message, setMessage] = useState('');
  const incrementNotificationCount = useAppStore((state) => state.incrementNotificationCount);

  const sendNotification = async () => {
    if (!('Notification' in window)) {
      setMessage('Notifications are not supported in this browser.');
      return;
    }

    const permission =
      Notification.permission === 'granted'
        ? 'granted'
        : await Notification.requestPermission();

    if (permission !== 'granted') {
      setMessage('Notification permission was not granted.');
      return;
    }

    const registration = await navigator.serviceWorker?.ready;
    const title = 'High-risk patient review';
    const body = 'Noah Williams needs a cardiology follow-up today.';

    if (registration) {
      await registration.showNotification(title, {
        body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: 'careops-high-risk',
        data: { url: '/patients' },
      });
    } else {
      new Notification(title, { body });
    }

    incrementNotificationCount();
    setMessage('Notification sent.');
  };

  return (
    <div className="notification-action">
      <button className="primary-button" type="button" onClick={sendNotification}>
        <BellRing size={17} />
        Send care alert
      </button>
      {message ? <span>{message}</span> : null}
    </div>
  );
}
