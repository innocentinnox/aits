import EmptyNotifications from "./EmptyNotifications";
import NotificationCard from "./NotificationCard";

function Notifications() {
  return (
    <div>
      <EmptyNotifications />
      <NotificationCard state={true} />
      <NotificationCard state={false} />
      <NotificationCard state={true} />
      <NotificationCard state={false} />
      <NotificationCard state={true} />
      <NotificationCard state={false} />
      <NotificationCard state={true} />
      <NotificationCard state={false} />
      <NotificationCard state={true} />
    </div>
  );
}

export default Notifications;
