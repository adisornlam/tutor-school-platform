#!/usr/bin/env bun

/**
 * Test script to check chat_messages table and query
 */

import mysql from 'mysql2/promise'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function testChatMessages() {
  let connection: mysql.Connection | null = null

  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      database: process.env.DB_NAME || 'tutordb',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      timezone: '+07:00'
    })

    console.log('✅ Database connection successful')

    // Test 1: Check if chat_messages table exists
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'chat_messages'"
    ) as any[]
    
    if (tables.length === 0) {
      console.error('❌ chat_messages table does not exist!')
      return
    }
    console.log('✅ chat_messages table exists')

    // Test 2: Check table structure
    const [columns] = await connection.execute(
      'DESCRIBE chat_messages'
    ) as any[]
    console.log('\n📋 Table structure:')
    console.table(columns)

    // Test 3: Check if room_id = 1 exists
    const [rooms] = await connection.execute(
      'SELECT id FROM chat_rooms WHERE id = ?',
      [1]
    ) as any[]
    
    if (rooms.length === 0) {
      console.log('\n⚠️  Room ID 1 does not exist')
      console.log('Available rooms:')
      const [allRooms] = await connection.execute(
        'SELECT id, course_id, student_id, tutor_id, status FROM chat_rooms LIMIT 10'
      ) as any[]
      console.table(allRooms)
    } else {
      console.log('\n✅ Room ID 1 exists')
    }

    // Test 4: Try the actual query
    console.log('\n🔍 Testing query for room_id = 1:')
    try {
      // MySQL doesn't support placeholders for LIMIT and OFFSET
      const limit = 50
      const offset = 0
      const [messages] = await connection.execute(`
        SELECT cm.*,
               u.first_name as sender_first_name,
               u.last_name as sender_last_name,
               u.avatar_url as sender_avatar_url
        FROM chat_messages cm
        INNER JOIN users u ON cm.sender_id = u.id
        WHERE cm.room_id = ?
        ORDER BY cm.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `, [1]) as any[]

      console.log(`✅ Query successful! Found ${messages.length} messages`)
      if (messages.length > 0) {
        console.log('\n📨 Sample message:')
        console.log(JSON.stringify(messages[0], null, 2))
      }
    } catch (error: any) {
      console.error('❌ Query failed:', error.message)
      console.error('Error code:', error.code)
      console.error('SQL State:', error.sqlState)
      console.error('SQL Message:', error.sqlMessage)
    }

    // Test 5: Check users table (for JOIN)
    const [users] = await connection.execute(
      'SELECT COUNT(*) as count FROM users'
    ) as any[]
    console.log(`\n👥 Total users: ${users[0].count}`)

  } catch (error: any) {
    console.error('❌ Error:', error.message)
    console.error('Error code:', error.code)
    if (error.sqlState) {
      console.error('SQL State:', error.sqlState)
    }
  } finally {
    if (connection) {
      await connection.end()
      console.log('\n✅ Connection closed')
    }
  }
}

testChatMessages().catch(console.error)

