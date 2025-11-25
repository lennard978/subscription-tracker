export default function useNotifications() {
  const requestPermission = () => Notification.requestPermission();
  const notify = (title, options) => {
    if (Notification.permission === "granted") {
      new Notification(title, options);
    }
  };
  return { requestPermission, notify };
}
