export const server = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3040/v1";
export const socketServer = process.env.NEXT_PUBLIC_SERVER_URL || server.replace('/v1', '');
