# WebSocket Real-Time Updates Guide

## Overview

Predictsports uses Socket.IO for real-time communication, providing live match updates, score changes, and prediction updates as they happen.

## Connection

### Establishing Connection

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  },
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
```

---

## Event Types

### Subscribing to Match Updates

```javascript
// Subscribe to a specific match
socket.emit('match:subscribe', { matchId: 'match_123' });

// Listen for updates
socket.on('match:goal', (data) => {
  console.log('Goal scored!', data);
});

socket.on('match:substitution', (data) => {
  console.log('Substitution made', data);
});

socket.on('match:end', (data) => {
  console.log('Match ended', data);
});
```

### Match Events

**Goal Event**:
```json
{
  "type": "goal",
  "matchId": "match_123",
  "minute": 35,
  "team": "home",
  "player": "Erling Haaland",
  "assistedBy": "Kevin De Bruyne",
  "score": { "home": 1, "away": 0 },
  "timestamp": "2026-02-27T15:35:00Z"
}
```

**Card Event**:
```json
{
  "type": "card",
  "matchId": "match_123",
  "minute": 42,
  "card": "yellow",
  "player": "John Stones",
  "team": "home",
  "timestamp": "2026-02-27T15:42:00Z"
}
```

**Substitution Event**:
```json
{
  "type": "substitution",
  "matchId": "match_123",
  "minute": 60,
  "playerOut": "Julian Alvarez",
  "playerIn": "Sergio Gomez",
  "team": "home",
  "timestamp": "2026-02-27T16:00:00Z"
}
```

**Status Update**:
```json
{
  "type": "status",
  "matchId": "match_123",
  "status": "live",
  "minute": 45,
  "possession": { "home": 62, "away": 38 },
  "shots": { "home": 8, "away": 2 },
  "shotsOnTarget": { "home": 4, "away": 1 },
  "timestamp": "2026-02-27T16:00:00Z"
}
```

### Prediction Updates

```javascript
socket.on('predictions:update', (data) => {
  console.log('Predictions updated', data);
});
```

**Prediction Update Event**:
```json
{
  "type": "predictions_update",
  "matchId": "match_123",
  "predictions": {
    "homeWin": 0.68,
    "draw": 0.19,
    "awayWin": 0.13
  },
  "confidence": 0.87,
  "expectedGoals": {
    "home": 2.3,
    "away": 0.6
  },
  "timestamp": "2026-02-27T16:00:00Z"
}
```

### Sports Feed

```javascript
// Subscribe to live sports feed
socket.emit('feed:subscribe', { type: 'all' });

socket.on('feed:update', (data) => {
  console.log('Feed update:', data);
});
```

---

## Frontend Integration Example

### React Component

```jsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

export function LiveMatchComponent({ matchId, token }) {
  const [match, setMatch] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to server
    const newSocket = io('http://localhost:3000', {
      auth: { token },
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('Connected');
      newSocket.emit('match:subscribe', { matchId });
    });

    // Handle incoming events
    newSocket.on('match:goal', (data) => {
      setMatch(prev => ({
        ...prev,
        score: data.score,
        events: [...(prev?.events || []), data]
      }));
    });

    newSocket.on('match:status', (data) => {
      setMatch(prev => ({
        ...prev,
        status: data.status,
        minute: data.minute,
        stats: data.stats
      }));
    });

    newSocket.on('predictions:update', (data) => {
      setMatch(prev => ({
        ...prev,
        predictions: data.predictions,
        confidence: data.confidence
      }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [matchId, token]);

  return (
    <div className="live-match">
      {match && (
        <>
          <h2>{match.homeTeam.name} vs {match.awayTeam.name}</h2>
          <div className="score">
            {match.score.home} - {match.score.away}
          </div>
          <div className="minute">{match.minute}'</div>
          <div className="predictions">
            <p>Home Win: {(match.predictions?.homeWin * 100).toFixed(1)}%</p>
            <p>Draw: {(match.predictions?.draw * 100).toFixed(1)}%</p>
            <p>Away Win: {(match.predictions?.awayWin * 100).toFixed(1)}%</p>
          </div>
        </>
      )}
    </div>
  );
}
```

---

## Error Handling

```javascript
socket.on('error', (error) => {
  console.error('Socket error:', error);
});

socket.on('exception', (data) => {
  console.error('Exception:', data.message);
  // Handle error gracefully
});
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Unauthorized` | Invalid token | Refresh authentication token |
| `Match not found` | Invalid match ID | Verify match ID |
| `Rate limited` | Too many subscriptions | Reduce subscription frequency |
| `Connection timeout` | Network issue | Reconnect automatically |

---

## Best Practices

### 1. Subscribe Only to Needed Matches
```javascript
// Good: Subscribe to current match only
socket.emit('match:subscribe', { matchId });

// Bad: Subscribe to all matches
socket.emit('match:subscribe', { matchId: '*' });
```

### 2. Handle Reconnection
```javascript
socket.on('disconnect', () => {
  console.log('Disconnected, attempting reconnect...');
});

socket.on('reconnect', () => {
  console.log('Reconnected!');
  // Re-subscribe to matches
  socket.emit('match:subscribe', { matchId });
});
```

### 3. Cleanup on Component Unmount
```javascript
useEffect(() => {
  // ... setup code ...
  
  return () => {
    socket.emit('match:unsubscribe', { matchId });
    socket.disconnect();
  };
}, []);
```

### 4. Debounce UI Updates
```javascript
const debouncedUpdate = debounce((data) => {
  setMatch(data);
}, 100);

socket.on('predictions:update', debouncedUpdate);
```

---

## Performance Optimization

### Message Compression
WebSocket messages are automatically compressed for large payloads.

### Connection Pooling
Multiple components can subscribe to same match with single connection:

```javascript
// Shared socket instance
const useSharedSocket = () => {
  // Reuse single global socket
};
```

### Selective Broadcasting
Server only sends updates to subscribed clients:

```javascript
// Server-side (reference)
// Only broadcast to clients subscribed to match_123
io.to(`match:match_123`).emit('match:goal', data);
```

---

## Troubleshooting

### Connection Issues

**Problem**: Can't connect to WebSocket
```
Solution:
1. Verify server is running
2. Check firewall/network
3. Verify auth token is valid
4. Check console for specific error
```

**Problem**: Missing updates after reconnect
```
Solution:
1. Re-subscribe after reconnecting
2. Fetch latest state from REST API
3. Check server logs for errors
```

### Performance Issues

**Problem**: Too many updates causing UI lag
```
Solution:
1. Implement debouncing
2. Batch updates on client
3. Unsubscribe from unneeded matches
4. Use virtual scrolling for lists
```

---

## Testing

### Mock WebSocket for Testing

```javascript
import { io as ioClient } from 'socket.io-client';
import { Server } from 'socket.io';

// Mock socket for testing
const mockSocket = {
  on: jest.fn(),
  emit: jest.fn(),
  disconnect: jest.fn()
};

jest.mock('socket.io-client', () => ({
  io: () => mockSocket
}));
```

### Example Test

```javascript
test('handles match goal event', () => {
  const { getByText } = render(<LiveMatchComponent 
    matchId="match_123" 
    token="test-token" 
  />);

  // Simulate goal event
  const goalCallback = mockSocket.on.mock.calls.find(
    call => call[0] === 'match:goal'
  )[1];
  goalCallback({ score: { home: 1, away: 0 } });

  expect(getByText('1 - 0')).toBeInTheDocument();
});
```

---

## API Reference Summary

| Event | Direction | Purpose |
|-------|-----------|---------|
| `match:subscribe` | Client → Server | Subscribe to match updates |
| `match:unsubscribe` | Client → Server | Unsubscribe from match |
| `match:goal` | Server → Client | Goal scored |
| `match:status` | Server → Client | Match status update |
| `match:end` | Server → Client | Match finished |
| `predictions:update` | Server → Client | New predictions available |
| `feed:update` | Server → Client | Sports news feed |

---

**Last Updated**: February 27, 2026
**API Version**: v1.0
**Maintained by**: Predictsports Backend Team
