# Predictsports - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐   │
│  │  Web Browser     │  │  Mobile Browser  │  │  PWA App    │   │
│  │  (Next.js)       │  │  (Responsive)    │  │ (Offline)   │   │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬──────┘   │
│           │                     │                    │           │
│           │ HTTP/WebSocket      │ HTTP/WebSocket    │ HTTP/WS   │
│           └─────────────────────┴────────────────────┘           │
│                                 │                                 │
└─────────────────────────────────┼─────────────────────────────────┘
                                  │
                                  │ HTTPS / WSS
                                  │
┌─────────────────────────────────▼─────────────────────────────────┐
│                       API GATEWAY LAYER                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │              Fastify API Server (Node.js)                  │   │
│  │                                                             │   │
│  │  Port: 3000                                                │   │
│  │  Features:                                                 │   │
│  │  - Rate Limiting (100 req/15min)                          │   │
│  │  - CORS & Helmet Security                                 │   │
│  │  - JWT Authentication                                      │   │
│  │  - WebSocket Support (Socket.IO)                          │   │
│  │                                                             │   │
│  ├─ Fixtures Router ─────────────────────────────────────┐   │   │
│  │  GET /api/fixtures                                   │   │   │
│  │  GET /api/fixtures/date/:date                       │   │   │