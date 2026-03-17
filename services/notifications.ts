import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Set up the notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const notificationService = {
    /**
     * Request permissions for notifications and setup Android channel
     */
    async requestPermissions() {
        if (!Device.isDevice) {
            console.warn('Must use physical device for Notifications');
            // On simulator, we'll pretend it's granted so the UI doesn't completely block
            // but we won't actually be able to schedule correctly in many cases.
            return true; 
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus === 'granted' && Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('reminders', {
                name: 'Plant Reminders',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#10b981',
            });
        }

        return finalStatus === 'granted';
    },

    /**
     * Cancel all scheduled notifications
     */
    async cancelAll() {
        await Notifications.cancelAllScheduledNotificationsAsync();
    },

    /**
     * Schedule basic reminders
     */
    async scheduleReminders() {
        // Cancel existing ones first to avoid duplicates
        await this.cancelAll();

        try {
            // 1. Daily Scanning Reminder (e.g., at 9:00 AM)
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "LeafRx Reminder 🌿",
                    body: "Time to check on your plants! Perform a scan today to ensure they're healthy.",
                    data: { url: '/(tabs)/scan' },
                },
                trigger: {
                    channelId: 'reminders',
                    hour: 9,
                    minute: 0,
                    repeats: true,
                } as any,
            });

            // 2. Evening Care Reminder (e.g., at 5:00 PM)
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Plant Care Time 💧",
                    body: "Don't forget to water your plants if they look thirsty!",
                },
                trigger: {
                    channelId: 'reminders',
                    hour: 17,
                    minute: 0,
                    repeats: true,
                } as any,
            });

            console.log("Reminders scheduled successfully");
        } catch (error) {
            console.error("Failed to schedule notifications:", error);
            throw error;
        }
    },

    /**
     * Test notification (immediate)
     */
    async sendTestNotification() {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "LeafRx Test 🍀",
                body: "Your notifications are working correctly!",
            },
            trigger: {
                channelId: 'reminders',
                seconds: 2, // Brief delay to ensure it's treated as a scheduled notification
            } as any,
        });
    }
};
