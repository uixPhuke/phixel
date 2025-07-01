const admin = require("firebase-admin");
require("dotenv").config();

// Validate and parse the service account
let serviceAccount;
try {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable not set");
  }
  
  // Handle both raw JSON and base64-encoded versions
  serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT.startsWith('{')
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf-8'));
} catch (error) {
  console.error("Failed to parse Firebase service account:", error);
  process.exit(1); // Exit if we can't initialize Firebase
}

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com` // Recommended
  });
  console.log("Firebase Admin initialized successfully");
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
  process.exit(1);
}

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // More robust header checking
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false,
      message: "Authorization header missing or invalid" 
    });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Add additional security checks
    if (!decodedToken.uid) {
      throw new Error("Token missing required UID");
    }
    
    // Attach user to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      emailVerified: decodedToken.email_verified || false,
      // Add other claims you need
    };
    
    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    
    // More specific error messages
    const message = error.code === 'auth/id-token-expired'
      ? "Token expired"
      : "Invalid authentication token";
      
    return res.status(401).json({ 
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = verifyFirebaseToken;