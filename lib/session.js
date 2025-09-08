export const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: "strava_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
