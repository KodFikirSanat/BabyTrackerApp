
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
        const tokens: string[] = Array.isArray(userData?.tokens)
          ? (userData!.tokens as string[])
          : (userData?.fcmToken ? [userData.fcmToken as string] : []);
        if (!tokens.length) {
          logger.warn(`☁️⚠️ User ${userId} does not have any FCM tokens.`);
          continue;
        }

        // 4. Prepare and send the notification to all known tokens
        const payload = {
          notification: {
            title: "Aşı Hatırlatıcısı",
            body:
              `Yarın ${babyData.name} bebeğinizin ` +
              `${logData.eventName} aşısı var!`,
          },
        };

        logger.info(
          `☁️➡️ Sending notification to user ${userId} for baby ${babyData.name} (tokens: ${tokens.length})`,
        );

        const response = await admin.messaging().sendEachForMulticast({
          tokens,
          ...payload,
        });
        const invalidTokens: string[] = [];
        response.responses.forEach((r, idx) => {
          if (!r.success) invalidTokens.push(tokens[idx]);
        });
        if (invalidTokens.length) {
          logger.warn(
            `☁️⚠️ Removing ${invalidTokens.length} invalid FCM tokens for user ${userId}.`,
          );
          await db.collection('users').doc(userId).update({
            tokens: admin.firestore.FieldValue.arrayRemove(...invalidTokens),
          });
        }
      }
    } catch (error) {
      logger.error("☁️❌ Error sending vaccination reminders:", error);
    }
  },
);
