import { d as defineEventHandler, r as readBody, c as createError, e as execute, q as query } from '../../../nitro/nitro.mjs';
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
import 'path';
import 'querystring';
import 'timers';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const tasks_post = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const body = await readBody(event);
  if (!body.title) {
    throw createError({
      statusCode: 400,
      message: "Title is required"
    });
  }
  const priority = body.priority || "medium";
  const status = body.status || "not_started";
  const color = body.color || "#10B981";
  const isShared = body.is_shared || false;
  const sharedScope = isShared ? body.shared_scope || "public" : "private";
  try {
    const result = await execute(
      `INSERT INTO calendar_tasks (
        user_id, title, description, due_date, start_date,
        priority, status, color, category,
        is_shared, shared_scope, shared_branch_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        auth.userId,
        body.title,
        body.description || null,
        body.due_date || null,
        body.start_date || null,
        priority,
        status,
        color,
        body.category || null,
        isShared,
        sharedScope,
        body.shared_branch_id || null
      ]
    );
    const taskId = result.insertId;
    if (isShared && body.shared_with_user_ids && body.shared_with_user_ids.length > 0) {
      for (const userId of body.shared_with_user_ids) {
        await execute(
          "INSERT INTO calendar_task_shared_with (task_id, shared_with_user_id) VALUES (?, ?)",
          [taskId, userId]
        );
      }
    }
    const tasks = await query(
      `SELECT 
        ct.id,
        ct.user_id,
        ct.title,
        ct.description,
        ct.due_date,
        ct.start_date,
        ct.priority,
        ct.status,
        ct.color,
        ct.category,
        ct.is_shared,
        ct.shared_scope,
        ct.shared_branch_id,
        ct.completed_at,
        ct.created_at,
        ct.updated_at,
        u.first_name,
        u.last_name
      FROM calendar_tasks ct
      INNER JOIN users u ON ct.user_id = u.id
      WHERE ct.id = ?`,
      [taskId]
    );
    if (tasks.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Task not found after creation"
      });
    }
    const createdTask = tasks[0];
    return {
      success: true,
      data: {
        id: createdTask.id,
        user_id: createdTask.user_id,
        title: createdTask.title,
        description: createdTask.description,
        due_date: createdTask.due_date,
        start_date: createdTask.start_date,
        priority: createdTask.priority,
        status: createdTask.status,
        color: createdTask.color,
        category: createdTask.category,
        is_shared: createdTask.is_shared,
        shared_scope: createdTask.shared_scope,
        shared_branch_id: createdTask.shared_branch_id,
        completed_at: createdTask.completed_at,
        created_at: createdTask.created_at,
        updated_at: createdTask.updated_at,
        created_by: {
          id: createdTask.user_id,
          first_name: createdTask.first_name,
          last_name: createdTask.last_name
        }
      }
    };
  } catch (error) {
    console.error("Error creating calendar task:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: "Failed to create calendar task"
    });
  }
});

export { tasks_post as default };
//# sourceMappingURL=tasks.post.mjs.map
