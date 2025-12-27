import { d as defineEventHandler, a as getQuery, q as query, c as createError } from '../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../_/auth.middleware.mjs';
import 'node:http';
import 'node:https';
import 'node:crypto';
import 'stream';
import 'events';
import 'http';
import 'crypto';
import 'buffer';
import 'zlib';
import 'https';
import 'net';
import 'tls';
import 'url';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'fs';
import 'accepts';
import 'path';
import 'querystring';
import 'base64id';
import 'timers';
import 'cookie';
import 'ws';
import 'cors';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const appointments_get = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const queryParams = getQuery(event);
  const startDate = queryParams.start_date;
  const endDate = queryParams.end_date;
  const status = queryParams.status;
  const appointmentType = queryParams.appointment_type;
  try {
    let sql = `
      SELECT DISTINCT
        ca.id,
        ca.user_id,
        ca.title,
        ca.description,
        ca.start_datetime,
        ca.end_datetime,
        ca.appointment_type,
        ca.location,
        ca.meeting_link,
        ca.status,
        ca.color,
        ca.reminder_minutes,
        ca.created_at,
        ca.updated_at,
        u.first_name,
        u.last_name,
        CASE WHEN ca.user_id = ? THEN TRUE ELSE FALSE END as is_mine
      FROM calendar_appointments ca
      INNER JOIN users u ON ca.user_id = u.id
      WHERE (
        ca.user_id = ?
        OR EXISTS (
          SELECT 1 FROM calendar_appointment_participants cap
          WHERE cap.appointment_id = ca.id AND cap.user_id = ?
        )
      )
    `;
    const params = [auth.userId, auth.userId, auth.userId];
    const filterConditions = [];
    if (startDate) {
      filterConditions.push(`DATE(ca.start_datetime) >= ?`);
      params.push(startDate);
    }
    if (endDate) {
      filterConditions.push(`DATE(ca.start_datetime) <= ?`);
      params.push(endDate);
    }
    if (status) {
      filterConditions.push(`ca.status = ?`);
      params.push(status);
    }
    if (appointmentType) {
      filterConditions.push(`ca.appointment_type = ?`);
      params.push(appointmentType);
    }
    if (filterConditions.length > 0) {
      sql += ` AND ${filterConditions.join(" AND ")}`;
    }
    sql += ` ORDER BY ca.start_datetime ASC`;
    const appointments = await query(sql, params);
    const appointmentIds = appointments.map((a) => a.id);
    let participants = [];
    if (appointmentIds.length > 0) {
      participants = await query(
        `SELECT 
          cap.appointment_id,
          cap.user_id,
          cap.participant_type,
          cap.status as participant_status,
          u.first_name,
          u.last_name,
          u.email
        FROM calendar_appointment_participants cap
        INNER JOIN users u ON cap.user_id = u.id
        WHERE cap.appointment_id IN (${appointmentIds.map(() => "?").join(",")})`,
        appointmentIds
      );
    }
    const participantsByAppointment = /* @__PURE__ */ new Map();
    participants.forEach((p) => {
      if (!participantsByAppointment.has(p.appointment_id)) {
        participantsByAppointment.set(p.appointment_id, []);
      }
      participantsByAppointment.get(p.appointment_id).push({
        user_id: p.user_id,
        participant_type: p.participant_type,
        status: p.participant_status,
        user: {
          id: p.user_id,
          first_name: p.first_name,
          last_name: p.last_name,
          email: p.email
        }
      });
    });
    return {
      success: true,
      data: appointments.map((a) => ({
        id: a.id,
        user_id: a.user_id,
        title: a.title,
        description: a.description,
        start_datetime: a.start_datetime,
        end_datetime: a.end_datetime,
        appointment_type: a.appointment_type,
        location: a.location,
        meeting_link: a.meeting_link,
        status: a.status,
        color: a.color,
        reminder_minutes: a.reminder_minutes,
        created_at: a.created_at,
        updated_at: a.updated_at,
        is_mine: a.is_mine === 1 || a.is_mine === true,
        created_by: {
          id: a.user_id,
          first_name: a.first_name,
          last_name: a.last_name
        },
        participants: participantsByAppointment.get(a.id) || []
      }))
    };
  } catch (error) {
    console.error("Error fetching calendar appointments:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch calendar appointments"
    });
  }
});

export { appointments_get as default };
//# sourceMappingURL=appointments.get.mjs.map
