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
import 'path';
import 'querystring';
import 'timers';
import 'util';
import 'jwa';
import 'ms';
import 'semver';
import 'lodash.includes';
import 'lodash.isboolean';
import 'lodash.isinteger';
import 'lodash.isnumber';
import 'lodash.isplainobject';
import 'lodash.isstring';
import 'lodash.once';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const _id__put = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const taskId = parseInt(getRouterParam(event, "id") || "0");
  const body = await readBody(event);
  if (!taskId) {
    throw createError({
      statusCode: 400,
      message: "Invalid task ID"
    });
  }
  try {
    const tasks = await query(
      "SELECT user_id FROM calendar_tasks WHERE id = ?",
      [taskId]
    );
    if (tasks.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Task not found"
      });
    }
    const taskData = tasks[0];
    if (taskData.user_id !== auth.userId) {
      throw createError({
        statusCode: 403,
        message: "You can only edit your own tasks"
      });
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
    if (body.due_date !== void 0) {
      updateFields.push("due_date = ?");
      updateValues.push(body.due_date || null);
    }
    if (body.start_date !== void 0) {
      updateFields.push("start_date = ?");
      updateValues.push(body.start_date || null);
    }
    if (body.priority !== void 0) {
      updateFields.push("priority = ?");
      updateValues.push(body.priority);
    }
    if (body.status !== void 0) {
      updateFields.push("status = ?");
      updateValues.push(body.status);
      if (body.status === "completed") {
        updateFields.push("completed_at = NOW()");
      } else if (body.status !== "completed") {
        updateFields.push("completed_at = NULL");
      }
    }
    if (body.color !== void 0) {
      updateFields.push("color = ?");
      updateValues.push(body.color);
    }
    if (body.category !== void 0) {
      updateFields.push("category = ?");
      updateValues.push(body.category || null);
    }
    if (body.is_shared !== void 0) {
      updateFields.push("is_shared = ?");
      updateValues.push(body.is_shared);
    }
    if (body.shared_scope !== void 0) {
      updateFields.push("shared_scope = ?");
      updateValues.push(body.is_shared ? body.shared_scope : "private");
    }
    if (body.shared_branch_id !== void 0) {
      updateFields.push("shared_branch_id = ?");
      updateValues.push(body.shared_branch_id || null);
    }
    if (updateFields.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No fields to update"
      });
    }
    updateValues.push(taskId);
    await execute(
      `UPDATE calendar_tasks SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );
    if (body.shared_with_user_ids !== void 0) {
      await execute(
        "DELETE FROM calendar_task_shared_with WHERE task_id = ?",
        [taskId]
      );
      if (body.shared_with_user_ids.length > 0) {
        for (const userId of body.shared_with_user_ids) {
          await execute(
            "INSERT INTO calendar_task_shared_with (task_id, shared_with_user_id) VALUES (?, ?)",
            [taskId, userId]
          );
        }
      }
    }
    const updatedTasks = await query(
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
    const updatedTask = updatedTasks[0];
    return {
      success: true,
      data: {
        id: updatedTask.id,
        user_id: updatedTask.user_id,
        title: updatedTask.title,
        description: updatedTask.description,
        due_date: updatedTask.due_date,
        start_date: updatedTask.start_date,
        priority: updatedTask.priority,
        status: updatedTask.status,
        color: updatedTask.color,
        category: updatedTask.category,
        is_shared: updatedTask.is_shared,
        shared_scope: updatedTask.shared_scope,
        shared_branch_id: updatedTask.shared_branch_id,
        completed_at: updatedTask.completed_at,
        created_at: updatedTask.created_at,
        updated_at: updatedTask.updated_at,
        created_by: {
          id: updatedTask.user_id,
          first_name: updatedTask.first_name,
          last_name: updatedTask.last_name
        }
      }
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.error("Error updating calendar task:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update calendar task"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
