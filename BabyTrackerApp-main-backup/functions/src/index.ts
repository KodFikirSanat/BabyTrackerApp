
import {onSchedule} from "firebase-functions/v2/scheduler";
import {setGlobalOptions} from "firebase-functions/v2";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

admin.initializeApp();
setGlobalOptions({region: "europe-west1"});

const db = admin.firestore();

/**
*Scheduled function that runs every day at 9:00AM to send vaccination reminders
 */
export const sendVaccinationReminders = onSchedule(
  {
    schedule: "every day 09:00",
    timeZone: "Europe/Istanbul",
  },
  async () => {
    logger.info("☁️⏳[Job Start] Running vaccination reminder check...");

    const now = new Date();
    const startOfTomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
    );
    const endOfTomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      23,
      59,
      59,
    );

    const startOfTomorrowTimestamp =
      admin.firestore.Timestamp.fromDate(startOfTomorrow);
    const endOfTomorrowTimestamp =
      admin.firestore.Timestamp.fromDate(endOfTomorrow);

    try {
      // 1. Find health logs for vaccinations scheduled for tomorrow
      const healthLogsSnapshot = await db
        .collectionGroup("healthLogs")
        .where("type", "==", "vaccination")
        .where("eventDate", ">=", startOfTomorrowTimestamp)
        .where("eventDate", "<=", endOfTomorrowTimestamp)
        .get();

      if (healthLogsSnapshot.empty) {
        logger.info("☁️✅[Job End] No upcoming vaccinations found for tomorrow.");
        return;
      }

      logger.info(
        `☁️✅ Found ${healthLogsSnapshot.docs.length} upcoming vaccinations to process.`,
      );

      // 2. Process each vaccination log
      for (const doc of healthLogsSnapshot.docs) {
        const logData = doc.data();
        const babyDocRef = doc.ref.parent.parent;

        if (!babyDocRef) {
          logger.warn("☁️⚠️ Could not find parent baby document for log:", doc.id);
          continue;
        }

        const babySnapshot = await babyDocRef.get();
        if (!babySnapshot.exists) {
          logger.warn("☁️⚠️ Baby document not found for log:", doc.id);
          continue;
        }

        const babyData = babySnapshot.data();
        if (!babyData || !babyData.userId) {
          logger.warn("☁️⚠️ Missing userId on baby document:", babyDocRef.id);
          continue;
        }
        const userId = babyData.userId;

        // 3. Get the user's FCM token
        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) {
          logger.warn("☁️⚠️ User document not found:", userId);
          continue;
        }

        const userData = userDoc.data();
        if (!userData || !userData.fcmToken) {
          logger.warn(`☁️⚠️ User ${userId} does not have an FCM token.`);
          continue;
        }
        const fcmToken = userData.fcmToken;

        // 4. Prepare and send the notification
        const payload = {
          notification: {
            title: "Aşı Hatırlatıcısı",
            body:
              `Yarın ${babyData.name} bebeğinizin ` +
              `${logData.eventName} aşısı var!`,
          },
          token: fcmToken,
        };

        logger.info(
          `☁️➡️ Sending notification to user ${userId} for baby ${babyData.name}`,
        );

        await admin.messaging().send(payload);
      }
    } catch (error) {
      logger.error("☁️❌ Error sending vaccination reminders:", error);
    }
  },
);
