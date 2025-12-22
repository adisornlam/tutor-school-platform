import type { H3Event } from 'h3'

// Store active SSE connections
// Map<userId, H3Event[]>
const userConnections = new Map<number, H3Event[]>()

// Map<roomId, Set<userId>>
const roomSubscriptions = new Map<number, Set<number>>()

// Export for use in API routes
export { userConnections, roomSubscriptions }

/**
 * Send SSE event to client
 */
export async function sendSSE(event: H3Event, eventName: string, data: any) {
  try {
    const message = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`
    await event.node.res.write(message)
  } catch (error) {
    console.error('[SSE] Error sending event:', error)
  }
}

/**
 * Subscribe user to SSE connection
 */
export function subscribeUser(userId: number, event: H3Event) {
  if (!userConnections.has(userId)) {
    userConnections.set(userId, [])
  }
  userConnections.get(userId)!.push(event)
  console.log(`[SSE] User ${userId} subscribed, total connections: ${userConnections.get(userId)!.length}`)
}

/**
 * Unsubscribe user from SSE connection
 */
export function unsubscribeUser(userId: number, event: H3Event) {
  const connections = userConnections.get(userId)
  if (connections) {
    const index = connections.indexOf(event)
    if (index > -1) {
      connections.splice(index, 1)
      console.log(`[SSE] User ${userId} unsubscribed, remaining connections: ${connections.length}`)
    }
    if (connections.length === 0) {
      userConnections.delete(userId)
    }
  }
}

/**
 * Subscribe user to room events
 */
export function subscribeToRoom(roomId: number, userId: number) {
  if (!roomSubscriptions.has(roomId)) {
    roomSubscriptions.set(roomId, new Set())
  }
  roomSubscriptions.get(roomId)!.add(userId)
  console.log(`[SSE] User ${userId} subscribed to room ${roomId}`)
}

/**
 * Unsubscribe user from room events
 */
export function unsubscribeFromRoom(roomId: number, userId: number) {
  const subscribers = roomSubscriptions.get(roomId)
  if (subscribers) {
    subscribers.delete(userId)
    console.log(`[SSE] User ${userId} unsubscribed from room ${roomId}`)
    if (subscribers.size === 0) {
      roomSubscriptions.delete(roomId)
    }
  }
}

/**
 * Emit event to specific user
 */
export async function emitToUser(userId: number, eventName: string, data: any) {
  const connections = userConnections.get(userId)
  if (!connections || connections.length === 0) {
    console.log(`[SSE] ⚠️  No active connections for user ${userId}, event: ${eventName}`)
    return
  }
  
  console.log(`[SSE] 📨 Sending ${eventName} to user ${userId}, connections: ${connections.length}`)
  
  for (const connection of connections) {
    try {
      // Check if connection is still alive
      if (connection.node.res.closed || connection.node.res.destroyed) {
        console.log(`[SSE] ⚠️  Connection for user ${userId} is closed, removing`)
        const index = connections.indexOf(connection)
        if (index > -1) {
          connections.splice(index, 1)
        }
        continue
      }
      
      await sendSSE(connection, eventName, data)
      console.log(`[SSE] ✅ Sent ${eventName} to user ${userId}`)
    } catch (error) {
      console.error(`[SSE] ❌ Error emitting to user ${userId}:`, error)
      // Remove dead connection
      const index = connections.indexOf(connection)
      if (index > -1) {
        connections.splice(index, 1)
      }
    }
  }
  
  // Clean up if no connections left
  if (connections.length === 0) {
    userConnections.delete(userId)
  }
}

/**
 * Emit event to all users in a room
 * @param excludeUserId - User ID to exclude from receiving the event (typically the sender)
 */
export async function emitToRoom(
  roomId: number, 
  eventName: string, 
  data: any,
  excludeUserId?: number
) {
  const subscribers = roomSubscriptions.get(roomId)
  if (!subscribers || subscribers.size === 0) {
    console.log(`[SSE] ⚠️  No subscribers for room ${roomId}, event: ${eventName}`)
    console.log(`[SSE] Current room subscriptions:`, Array.from(roomSubscriptions.entries()).map(([rId, users]) => ({ roomId: rId, userIds: Array.from(users) })))
    console.log(`[SSE] Active user connections:`, Array.from(userConnections.keys()))
    return
  }

  console.log(`[SSE] 📤 Emitting ${eventName} to room ${roomId}, subscribers:`, Array.from(subscribers), `exclude: ${excludeUserId}`)
  
  let sentCount = 0
  let skippedCount = 0
  for (const userId of subscribers) {
    // Skip sender - they already have the message from REST API response
    if (excludeUserId && userId === excludeUserId) {
      console.log(`[SSE] ⏭️  Skipping sender ${userId}`)
      skippedCount++
      continue
    }
    
    const hasConnection = userConnections.has(userId)
    if (!hasConnection) {
      console.log(`[SSE] ⚠️  User ${userId} subscribed but no active connection`)
      continue
    }
    
    await emitToUser(userId, eventName, data)
    sentCount++
  }
  
  console.log(`[SSE] ✅ Sent ${eventName} to ${sentCount} user(s) in room ${roomId} (skipped: ${skippedCount})`)
  
  if (sentCount === 0 && subscribers.size > skippedCount) {
    console.log(`[SSE] ⚠️  WARNING: No messages sent but ${subscribers.size - skippedCount} subscribers exist!`)
  }
}

/**
 * Get active connections count
 */
export function getActiveConnectionsCount(): number {
  let total = 0
  for (const connections of userConnections.values()) {
    total += connections.length
  }
  return total
}

/**
 * Cleanup dead connections
 */
export function cleanupConnections() {
  for (const [userId, connections] of userConnections.entries()) {
    const aliveConnections = connections.filter(conn => {
      try {
        return !conn.node.res.closed
      } catch {
        return false
      }
    })
    
    if (aliveConnections.length !== connections.length) {
      userConnections.set(userId, aliveConnections)
      if (aliveConnections.length === 0) {
        userConnections.delete(userId)
      }
    }
  }
}

