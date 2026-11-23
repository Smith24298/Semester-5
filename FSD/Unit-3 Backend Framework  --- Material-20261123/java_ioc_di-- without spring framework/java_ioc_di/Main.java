public class Main {
    public static void main(String[] args) {

        // Main controls object creation and injects each dependency.
        NotificationManager emailManager =
                new NotificationManager(new EmailNotificationService());
        emailManager.notifyUser("Your order has been confirmed.");

        NotificationManager smsManager =
                new NotificationManager(new SMSNotificationService());
        smsManager.notifyUser("Your OTP is 123456.");

        NotificationManager whatsappManager =
                new NotificationManager(new WhatsAppNotificationService());
        whatsappManager.notifyUser("Your package is out for delivery.");
    }
}
