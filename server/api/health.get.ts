export default defineEventHandler(async (event) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    timezone: 'Asia/Bangkok'
  }
})

