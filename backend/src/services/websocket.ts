import { FastifyInstance } from 'fastify';

export async function setupWebSocket(fastify: FastifyInstance & any) {
  (fastify.io as any)?.on('connection', (socket: any) => {
    console.log(`✅ WebSocket client connected: ${socket.id}`);

    // Subscribe to match updates
    socket.on('subscribe-match', (matchId: any) => {
      socket.join(`match:${matchId}`);
      socket.emit('subscribed', { matchId });
    });

    // Handle goal updates
    socket.on('goal', (data: any) => {
      (fastify.io as any)?.to(`match:${data.matchId}`).emit('goal', data);
    });

    // Handle prediction updates
    socket.on('prediction-update', (data: any) => {
      (fastify.io as any)?.to(`match:${data.matchId}`).emit('prediction-update', data);
    });

    socket.on('disconnect', () => {
      console.log(`❌ WebSocket client disconnected: ${socket.id}`);
    });
  });
}
