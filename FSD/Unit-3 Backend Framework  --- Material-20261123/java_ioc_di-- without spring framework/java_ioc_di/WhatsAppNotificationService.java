public class WhatsAppNotificationService implements NotificationService {
    @Override
    public void sendNotification(String message) {
        System.out.println("WhatsApp Notification: " + message);
    }
}
