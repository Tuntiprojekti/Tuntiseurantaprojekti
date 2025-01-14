const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.listUsers = functions.https.onRequest(async (req, res) => {
  try {
    const maxResults = 100; // Adjust the limit as needed
    const listUsersResult = await admin.auth().listUsers(maxResults);
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName || "No Name Available",
    }));

    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});
