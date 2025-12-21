// WebSocket handler for Socket.IO
// This is a fallback route if plugin approach doesn't work

export default defineEventHandler((event) => {
  // This is handled by Socket.IO plugin
  // Return 404 to prevent confusion
  setResponseStatus(event, 404)
  return { error: 'WebSocket endpoint not found' }
})

