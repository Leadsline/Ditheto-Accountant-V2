import app from '../artifacts/api-server/src/app';

// Vercel recognizes an exported Express application as a serverless function.
// The same Express app continues to run as a normal Node process on Replit or
// cPanel through artifacts/api-server/src/index.ts.
export default app;