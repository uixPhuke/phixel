const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : null;

if (!serviceAccount) {
  throw new Error("Firebase service account credentials are not set.");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = verifyFirebaseToken;
