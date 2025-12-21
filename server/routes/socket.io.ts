// Socket.IO route handler - fallback if plugin doesn't work
// This is a workaround for Nuxt 4 Socket.IO initialization issues

export default defineEventHandler((event) => {
  // This route is handled by Socket.IO plugin
  // Return 404 to prevent confusion
  setResponseStatus(event, 404)
  return { error: 'Socket.IO endpoint not found' }
})

