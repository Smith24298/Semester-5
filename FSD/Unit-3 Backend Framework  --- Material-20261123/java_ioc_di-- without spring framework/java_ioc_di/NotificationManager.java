
public class NotificationManager {
   
    private final NotificationService service;

    
    // Constructor injection: the dependency is supplied from outside.
    public NotificationManager(NotificationService service) {
        this.service = service;
    }

    public void notifyUser(String message) {
        service.sendNotification(message);
    }

    
}
