Java IoC and DI — individual class files (core Java only)

Files:
- NotificationService.java: interface
- EmailNotificationService.java: email implementation
- SMSNotificationService.java: SMS implementation
- WhatsAppNotificationService.java: WhatsApp implementation
- NotificationManager.java: dependent class; receives NotificationService by constructor injection
- Main.java: creates objects and injects the chosen implementations

How to run:
1. Keep all .java files in the same folder.
2. Open a terminal in that folder.
3. Compile all files:
   javac *.java
4. Run:
   java Main

No Spring or Spring Boot is required.
