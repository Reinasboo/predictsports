import { FastifyInstance } from 'fastify';

export async function setupWebSocket(fastify: FastifyInstance) {
  fastify.io.on('connection', (socket) => {
    console.log(`✅ WebSocket client connected: ${socket.id}`);

    // Subscribe to match updates
    socket.on('subscribe-match', (matchId) => {
      socket.join(`match:${matchId}`);
      socket.emit('subscribed', { matchId });
    });

    // Handle goal updates
    socket.on('goal', (data) => {
      fastify.io.to(`match:${data.matchId}`).emit('goal', data);
    });

    // Handle prediction updates
    socket.on('prediction-update', (data) => {
      fastify.io.to(`match:${data.matchId}`).emit('prediction-update', data);
    });

    socket.on('disconnect', () => {
      console.log(`❌ WebSocket client disconnected: ${socket.id}`);
    });
  });
}
