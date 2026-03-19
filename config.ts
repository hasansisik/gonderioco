export const server = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "https://sadece-teklif-server.vercel.app/v1";
export const socketServer = process.env.NEXT_PUBLIC_SERVER_URL || server.replace('/v1', '');



