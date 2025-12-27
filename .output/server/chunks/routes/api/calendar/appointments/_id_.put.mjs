import { d as defineEventHandler, b as getRouterParam, r as readBody, c as createError, q as query, e as execute } from '../../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../../_/auth.middleware.mjs';
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
import 'mime-db';
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

const _id__put = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const appointmentId = parseInt(getRouterParam(event, "id") || "0");
  const body = await readBody(event);
  if (!appointmentId) {
    throw createError({
      statusCode: 400,
      message: "Invalid appointment ID"
    });
  }
  try {
    const appointments = await query(
      `SELECT user_id FROM calendar_appointments WHERE id = ?`,
      [appointmentId]
    );
    if (appointments.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Appointment not found"
      });
    }
    const appointmentData = appointments[0];
    if (appointmentData.user_id !== auth.userId) {
      throw createError({
        statusCode: 403,
        message: "You can only edit appointments you created"
      });
    }
    if (body.start_datetime || body.end_datetime) {
      const currentAppointment = await query(
        "SELECT start_datetime, end_datetime FROM calendar_appointments WHERE id = ?",
        [appointmentId]
      );
      const startDate = body.start_datetime ? new Date(body.start_datetime) : new Date(currentAppointment[0].start_datetime);
      const endDate = body.end_datetime ? new Date(body.end_datetime) : new Date(currentAppointment[0].end_datetime);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw createError({
          statusCode: 400,
          message: "Invalid datetime format"
        });
      }
      if (endDate < startDate) {
        throw createError({
          statusCode: 400,
          message: "end_datetime must be after start_datetime"
        });
      }
    }
    const updateFields = [];
    const updateValues = [];
    if (body.title !== void 0) {
      updateFields.push("title = ?");
      updateValues.push(body.title);
    }
    if (body.description !== void 0) {
      updateFields.push("description = ?");
      updateValues.push(body.description || null);
    }
    if (body.start_datetime !== void 0) {
      updateFields.push("start_datetime = ?");
      updateValues.push(body.start_datetime);
    }
    if (body.end_datetime !== void 0) {
      updateFields.push("end_datetime = ?");
      updateValues.push(body.end_datetime);
    }
    if (body.appointment_type !== void 0) {
      updateFields.push("appointment_type = ?");
      updateValues.push(body.appointment_type);
    }
    if (body.location !== void 0) {
      updateFields.push("location = ?");
      updateValues.push(body.location || null);
    }
    if (body.meeting_link !== void 0) {
      updateFields.push("meeting_link = ?");
      updateValues.push(body.meeting_link || null);
    }
    if (body.status !== void 0) {
      updateFields.push("status = ?");
      updateValues.push(body.status);
    }
    if (body.color !== void 0) {
      updateFields.push("color = ?");
      updateValues.push(body.color);
    }
    if (body.reminder_minutes !== void 0) {
      updateFields.push("reminder_minutes = ?");
      updateValues.push(body.reminder_minutes || null);
    }
    if (updateFields.length === 0 && body.participant_user_ids === void 0) {
      throw createError({
        statusCode: 400,
        message: "No fields to update"
      });
    }
    if (updateFields.length > 0) {
      updateValues.push(appointmentId);
      await execute(
        `UPDATE calendar_appointments SET ${updateFields.join(", ")} WHERE id = ?`,
        updateValues
      );
    }
    if (body.participant_user_ids !== void 0) {
      await execute(
        "DELETE FROM calendar_appointment_participants WHERE appointment_id = ?",
        [appointmentId]
      );
      if (body.participant_user_ids.length > 0) {
        for (const userId of body.participant_user_ids) {
          if (userId === auth.userId) continue;
          const userRoles = await query(
            `SELECT r.name 
             FROM user_roles ur
             JOIN roles r ON ur.role_id = r.id
             WHERE ur.user_id = ?`,
            [userId]
          );
          let participantType = "other";
          if (userRoles.length > 0) {
            const roleName = userRoles[0].name;
            if (roleName === "student") participantType = "student";
            else if (roleName === "parent") participantType = "parent";
            else if (roleName === "tutor") participantType = "tutor";
            else if (["system_admin", "owner", "admin", "branch_admin"].includes(roleName)) participantType = "admin";
          }
          await execute(
            "INSERT INTO calendar_appointment_participants (appointment_id, user_id, participant_type) VALUES (?, ?, ?)",
            [appointmentId, userId, participantType]
          );
        }
      }
    }
    const updatedAppointments = await query(
      `SELECT 
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
        u.last_name
      FROM calendar_appointments ca
      INNER JOIN users u ON ca.user_id = u.id
      WHERE ca.id = ?`,
      [appointmentId]
    );
    const updatedAppointment = updatedAppointments[0];
    const participants = await query(
      `SELECT 
        cap.user_id,
        cap.participant_type,
        cap.status as participant_status,
        u.first_name,
        u.last_name,
        u.email
      FROM calendar_appointment_participants cap
      INNER JOIN users u ON cap.user_id = u.id
      WHERE cap.appointment_id = ?`,
      [appointmentId]
    );
    return {
      success: true,
      data: {
        id: updatedAppointment.id,
        user_id: updatedAppointment.user_id,
        title: updatedAppointment.title,
        description: updatedAppointment.description,
        start_datetime: updatedAppointment.start_datetime,
        end_datetime: updatedAppointment.end_datetime,
        appointment_type: updatedAppointment.appointment_type,
        location: updatedAppointment.location,
        meeting_link: updatedAppointment.meeting_link,
        status: updatedAppointment.status,
        color: updatedAppointment.color,
        reminder_minutes: updatedAppointment.reminder_minutes,
        created_at: updatedAppointment.created_at,
        updated_at: updatedAppointment.updated_at,
        created_by: {
          id: updatedAppointment.user_id,
          first_name: updatedAppointment.first_name,
          last_name: updatedAppointment.last_name
        },
        participants: participants.map((p) => ({
          user_id: p.user_id,
          participant_type: p.participant_type,
          status: p.participant_status,
          user: {
            id: p.user_id,
            first_name: p.first_name,
            last_name: p.last_name,
            email: p.email
          }
        }))
      }
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.error("Error updating calendar appointment:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update calendar appointment"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
