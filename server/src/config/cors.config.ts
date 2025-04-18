import cors from "cors";

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
  maxAge: 86400,
};

// const corsOptions = {
//   origin: "http://localhost:5173",
//   credentials: true, // Allow cookies / authorization headers
// };

export default cors(corsOptions);
// In the code snippet above, we created a middleware function that handles CORS configuration. We exported the function so that it can be used in the application setup.
