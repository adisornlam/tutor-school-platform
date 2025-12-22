import type { H3Event } from 'h3'

// Store active SSE connections
// Map<userId, H3Event[]>
const userConnections = new Map<number, H3Event[]>()

// Map<roomId, Set<userId>>
const roomSubscriptions = new Map<number, Set<number>>()

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
  if (connections) {
    for (const connection of connections) {
      try {
        await sendSSE(connection, eventName, data)
      } catch (error) {
        console.error(`[SSE] Error emitting to user ${userId}:`, error)
        // Remove dead connection
        const index = connections.indexOf(connection)
        if (index > -1) {
          connections.splice(index, 1)
        }
      }
    }
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
  if (!subscribers) return

  for (const userId of subscribers) {
    // Skip sender - they already have the message from REST API response
    if (excludeUserId && userId === excludeUserId) {
      continue
    }
    await emitToUser(userId, eventName, data)
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

