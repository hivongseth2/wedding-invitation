const { Server } = require("socket.io")

// Create Socket.io server with improved configuration
const io = new Server(3001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingTimeout: 15000,
  pingInterval: 5000,
})

// Store client data with better structure
const clients = {} // { clientId: { tabs: { tabId: { socketId, x, y, color } } } }

// Log with timestamp
const log = (message) => {
  const timestamp = new Date().toISOString().split("T")[1].split(".")[0]
  console.log(`[${timestamp}] ${message}`)
}

io.on("connection", (socket) => {
  // Handle client joining
  socket.on("join", ({ clientId, tabId, color }) => {
    if (!clients[clientId]) clients[clientId] = { tabs: {} }
    clients[clientId].tabs[tabId] = {
      socketId: socket.id,
      x: null,
      y: null,
      color: color || "#00ff88",
    }

    log(`Client ${clientId} joined from tab ${tabId}`)

    // Send current state to the new client
    socket.emit("peer-count", Object.keys(clients).length)

    // Send all existing peers to the new client
    for (const [peerId, peer] of Object.entries(clients)) {
      for (const [peerTabId, peerTab] of Object.entries(peer.tabs)) {
        if (peerId !== clientId || peerTabId !== tabId) {
          socket.emit("peer-joined", {
            clientId: peerId,
            tabId: peerTabId,
            color: peerTab.color,
            x: peerTab.x,
            y: peerTab.y,
          })
        }
      }
    }

    // Notify others about the new client
    socket.broadcast.emit("peer-joined", {
      clientId,
      tabId,
      color: clients[clientId].tabs[tabId].color,
    })
  })

  // Handle position updates
  socket.on("position", ({ clientId, tabId, x, y, color }) => {
    if (clients[clientId]?.tabs[tabId]) {
      clients[clientId].tabs[tabId] = {
        ...clients[clientId].tabs[tabId],
        x,
        y,
        color: color || clients[clientId].tabs[tabId].color,
      }

      socket.broadcast.emit("peer-position", {
        clientId,
        tabId,
        x,
        y,
        color: clients[clientId].tabs[tabId].color,
      })
    }
  })

  // Handle interaction events
  socket.on("interaction", ({ clientId, tabId, intensity, type }) => {
    // Broadcast interaction to all other clients
    socket.broadcast.emit("peer-interaction", {
      clientId,
      tabId,
      intensity,
      type,
    })
  })

  // Handle disconnections
  socket.on("disconnect", () => {
    for (const [clientId, client] of Object.entries(clients)) {
      const tabId = Object.keys(client.tabs).find((tid) => client.tabs[tid].socketId === socket.id)
      if (tabId) {
        delete client.tabs[tabId]
        log(`Tab ${tabId} of client ${clientId} disconnected`)

        if (Object.keys(client.tabs).length === 0) {
          delete clients[clientId]
        }

        io.emit("peer-left", { clientId, tabId })
        io.emit("peer-count", Object.keys(clients).length)
        break
      }
    }
  })
})

log(`Love Connection server started on port 3001`)
