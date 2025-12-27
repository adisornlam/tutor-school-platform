const userConnections = /* @__PURE__ */ new Map();
const roomSubscriptions = /* @__PURE__ */ new Map();
async function sendSSE(event, eventName, data) {
  try {
    const message = `event: ${eventName}
data: ${JSON.stringify(data)}

`;
    await event.node.res.write(message);
  } catch (error) {
    console.error("[SSE] Error sending event:", error);
  }
}
function subscribeUser(userId, event) {
  if (!userConnections.has(userId)) {
    userConnections.set(userId, []);
  }
  userConnections.get(userId).push(event);
  console.log(`[SSE] User ${userId} subscribed, total connections: ${userConnections.get(userId).length}`);
}
function unsubscribeUser(userId, event) {
  const connections = userConnections.get(userId);
  if (connections) {
    const index = connections.indexOf(event);
    if (index > -1) {
      connections.splice(index, 1);
      console.log(`[SSE] User ${userId} unsubscribed, remaining connections: ${connections.length}`);
    }
    if (connections.length === 0) {
      userConnections.delete(userId);
    }
  }
}
function subscribeToRoom(roomId, userId) {
  if (!roomSubscriptions.has(roomId)) {
    roomSubscriptions.set(roomId, /* @__PURE__ */ new Set());
  }
  roomSubscriptions.get(roomId).add(userId);
  console.log(`[SSE] User ${userId} subscribed to room ${roomId}`);
}
function unsubscribeFromRoom(roomId, userId) {
  const subscribers = roomSubscriptions.get(roomId);
  if (subscribers) {
    subscribers.delete(userId);
    console.log(`[SSE] User ${userId} unsubscribed from room ${roomId}`);
    if (subscribers.size === 0) {
      roomSubscriptions.delete(roomId);
    }
  }
}

export { subscribeToRoom as a, sendSSE as b, unsubscribeFromRoom as c, userConnections as d, subscribeUser as s, unsubscribeUser as u };
//# sourceMappingURL=sse.mjs.map
