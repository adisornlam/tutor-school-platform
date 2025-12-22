#!/usr/bin/env bun

/**
 * Script to check recent chat messages and room subscriptions
 */

import mysql from 'mysql2/promise'
import * as dotenv from 'dotenv'

dotenv.config()

async function checkChatMessages() {
  let connection: mysql.Connection | null = null

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      database: process.env.DB_NAME || 'tutordb',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      timezone: '+07:00'
    })

    console.log('✅ Database connection successful\n')

    // Check recent messages
    console.log('📨 Recent messages (last 10):')
    const [messages] = await connection.execute(`
      SELECT cm.id, cm.room_id, cm.sender_id, cm.content, cm.created_at,
             u.first_name, u.last_name
      FROM chat_messages cm
      INNER JOIN users u ON cm.sender_id = u.id
      ORDER BY cm.created_at DESC
      LIMIT 10
    `) as any[]
    
    console.table(messages.map(m => ({
      id: m.id,
      room_id: m.room_id,
      sender: `${m.first_name} ${m.last_name} (${m.sender_id})`,
      content: m.content?.substring(0, 30) || '',
      created_at: m.created_at
    })))

    // Check room 1 details
    console.log('\n🏠 Room 1 details:')
    const [rooms] = await connection.execute(`
      SELECT cr.id, cr.course_id, cr.student_id, cr.tutor_id, cr.status,
             s.first_name as student_name, s.last_name as student_last,
             t.first_name as tutor_name, t.last_name as tutor_last
      FROM chat_rooms cr
      INNER JOIN users s ON cr.student_id = s.id
      INNER JOIN users t ON cr.tutor_id = t.id
      WHERE cr.id = 1
    `) as any[]
    
    if (rooms.length > 0) {
      const room = rooms[0]
      console.table([{
        room_id: room.id,
        course_id: room.course_id,
        student: `${room.student_name} ${room.student_last} (${room.student_id})`,
        tutor: `${room.tutor_name} ${room.tutor_last} (${room.tutor_id})`,
        status: room.status
      }])
    }

    // Check messages in room 1
    console.log('\n💬 Messages in room 1:')
    const [roomMessages] = await connection.execute(`
      SELECT cm.id, cm.sender_id, cm.content, cm.created_at,
             u.first_name, u.last_name
      FROM chat_messages cm
      INNER JOIN users u ON cm.sender_id = u.id
      WHERE cm.room_id = 1
      ORDER BY cm.created_at DESC
      LIMIT 20
    `) as any[]
    
    console.table(roomMessages.map(m => ({
      id: m.id,
      sender: `${m.first_name} ${m.last_name} (${m.sender_id})`,
      content: m.content?.substring(0, 50) || '',
      created_at: m.created_at
    })))

    // Find users with names containing "tutor" or "Tutor"
    console.log('\n👤 Users (tutors):')
    const [tutors] = await connection.execute(`
      SELECT u.id, u.first_name, u.last_name, u.email
      FROM users u
      INNER JOIN user_roles ur ON u.id = ur.user_id
      INNER JOIN roles r ON ur.role_id = r.id
      WHERE r.name = 'tutor'
      ORDER BY u.id
    `) as any[]
    
    console.table(tutors.map(t => ({
      id: t.id,
      name: `${t.first_name} ${t.last_name}`,
      email: t.email
    })))

  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

checkChatMessages().catch(console.error)

