import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "../storage";
import bcrypt from "bcryptjs";

// Serialize user to session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Local Strategy (email/password)
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        
        // User not found
        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }
        
        // User registered via Google
        if (!user.password) {
          return done(null, false, { 
            message: "This account uses Google authentication" 
          });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password" });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await storage.getUserByGoogleId(profile.id);
          
          if (user) {
            return done(null, user);
          }
          
          // Check if email already exists
          const email = profile.emails?.[0].value;
          if (email) {
            user = await storage.getUserByEmail(email);
            
            if (user) {
              // Link Google ID to existing account
              const updatedUser = await storage.updateUser(user.id, {
                googleId: profile.id,
                profilePicture: profile.photos?.[0].value
              });
              
              return done(null, updatedUser);
            }
          }
          
          // Create a new user
          const newUser = await storage.createUser({
            name: profile.displayName,
            email: email || `${profile.id}@google.com`,
            googleId: profile.id,
            profilePicture: profile.photos?.[0]?.value,
            role: "user"
          });
          
          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}
