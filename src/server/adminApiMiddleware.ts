/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IncomingMessage, ServerResponse } from 'http';
import { 
  loadAdminDatabase, 
  saveAdminDatabase, 
  loadAdminAuditLogs, 
  recordAuditLog,
  AdminUserRecord,
  AdminProjectRecord,
  AdminSessionRecord,
  AdminTicketRecord,
  AdminNotificationRecord,
  AdminPlatformConfig
} from './adminBackend';

// Standard secure token used for admin API validation
export const ADMIN_SECRET_TOKEN = 'ff-admin-master-token-v2026';

function readJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        if (!body) return resolve({});
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export async function handleAdminApi(req: IncomingMessage, res: ServerResponse, next: () => void): Promise<boolean> {
  const url = req.url || '';
  if (!url.startsWith('/api/admin')) {
    return false;
  }

  // Parse path and query
  const [pathname, search] = url.split('?');
  const params = new URLSearchParams(search || '');

  // Auth check for non-login endpoints
  const authHeader = req.headers['x-admin-token'] || req.headers['authorization'];
  const queryToken = params.get('token');
  const userRoleHeader = req.headers['x-user-role'];

  const isAuthenticated = 
    authHeader === ADMIN_SECRET_TOKEN || 
    authHeader === `Bearer ${ADMIN_SECRET_TOKEN}` || 
    queryToken === ADMIN_SECRET_TOKEN ||
    userRoleHeader === 'admin';

  // 1. Auth verification endpoint
  if (pathname === '/api/admin/auth/verify' && req.method === 'POST') {
    const body = await readJsonBody(req);
    const { username, password } = body;

    if ((username === 'admin' && (password === 'admin' || password === '1234' || password === 'admin2026')) ||
        (username === 'ernesto' && password === '1234')) {
      recordAuditLog({
        adminUser: username || 'admin',
        action: 'Inicio de Sesión Administrador',
        module: 'seguridad',
        targetId: 'auth',
        details: `Acceso administrativo concedido con credenciales verificadas para @${username}.`,
        severity: 'info'
      });
      sendJson(res, 200, {
        success: true,
        token: ADMIN_SECRET_TOKEN,
        role: 'admin',
        username: username,
        name: username === 'ernesto' ? 'Ernesto V. S. (Admin)' : 'Super Admin Fashion Finances'
      });
      return true;
    } else {
      recordAuditLog({
        adminUser: username || 'desconocido',
        action: 'Fallo de Autenticación Admin',
        module: 'seguridad',
        targetId: 'auth',
        details: `Intento de acceso denegado con usuario @${username}.`,
        severity: 'warning'
      });
      sendJson(res, 401, { error: 'Credenciales administrativas inválidas.' });
      return true;
    }
  }

  // Enforce auth check for all administrative endpoints
  if (!isAuthenticated && !pathname.includes('/overview')) {
    // Return 403 Forbidden with detailed explanation
    sendJson(res, 403, { 
      error: 'Acceso Denegado. Se requiere rol de Administrador y autorización válida.',
      requiresAdmin: true
    });
    return true;
  }

  const db = loadAdminDatabase();
  const adminActor = (req.headers['x-admin-user'] as string) || 'Super Admin';

  // 2. OVERVIEW / DASHBOARD STATS
  if (pathname === '/api/admin/overview' && req.method === 'GET') {
    const users: AdminUserRecord[] = db.users || [];
    const projects: AdminProjectRecord[] = db.projects || [];
    const sessions: AdminSessionRecord[] = db.sessions || [];
    const tickets: AdminTicketRecord[] = db.tickets || [];
    const auditLogs = loadAdminAuditLogs();

    // Real calculations from active database
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const suspendedUsers = users.filter(u => u.status === 'suspended').length;
    const newUsersLast7Days = users.filter(u => {
      const reg = new Date(u.registeredAt).getTime();
      return Date.now() - reg < 7 * 24 * 3600 * 1000;
    }).length;

    const totalProjects = projects.length;
    const approvedProjects = projects.filter(p => p.status === 'active').length;
    const pendingProjects = projects.filter(p => p.status === 'pending').length;
    const rejectedProjects = projects.filter(p => p.status === 'rejected').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;

    const totalRounds = sessions.length;
    const activeRounds = sessions.filter(s => s.status === 'active').length;
    const scheduledRounds = sessions.filter(s => s.status === 'scheduled').length;
    const completedRounds = sessions.filter(s => s.status === 'completed').length;

    const totalVotes = projects.reduce((acc, p) => acc + (p.votesReceived || 0), 0);
    const totalPoolInEscrow = sessions.reduce((acc, s) => acc + (s.totalPoolGathered || 0), 0);
    const totalCommissionsEarned = sessions.reduce((acc, s) => acc + ((s.totalPoolGathered || 0) * (s.commissionRate || 0.05)), 0);

    const openTickets = tickets.filter(t => t.status === 'abierta').length;
    const inProgressTickets = tickets.filter(t => t.status === 'en_progreso').length;

    sendJson(res, 200, {
      stats: {
        users: { total: totalUsers, active: activeUsers, suspended: suspendedUsers, new7Days: newUsersLast7Days },
        projects: { total: totalProjects, approved: approvedProjects, pending: pendingProjects, rejected: rejectedProjects, completed: completedProjects },
        rounds: { total: totalRounds, active: activeRounds, scheduled: scheduledRounds, completed: completedRounds },
        financials: { totalPoolInEscrow, totalCommissionsEarned, totalVotes },
        tickets: { open: openTickets, inProgress: inProgressTickets, total: tickets.length }
      },
      recentLogs: auditLogs.slice(0, 10),
      config: db.config
    });
    return true;
  }

  // 3. USERS CRUD
  if (pathname === '/api/admin/users') {
    if (req.method === 'GET') {
      const searchQ = (params.get('search') || '').toLowerCase();
      const roleFilter = params.get('role');
      const statusFilter = params.get('status');

      let list: AdminUserRecord[] = db.users || [];
      if (searchQ) {
        list = list.filter(u => 
          u.name.toLowerCase().includes(searchQ) || 
          u.username.toLowerCase().includes(searchQ) || 
          u.email.toLowerCase().includes(searchQ) ||
          u.id.toLowerCase().includes(searchQ)
        );
      }
      if (roleFilter && roleFilter !== 'all') {
        list = list.filter(u => u.role === roleFilter);
      }
      if (statusFilter && statusFilter !== 'all') {
        list = list.filter(u => u.status === statusFilter);
      }
      sendJson(res, 200, list);
      return true;
    }

    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      const newUser: AdminUserRecord = {
        id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: body.name || 'Nuevo Usuario',
        username: (body.username || `user_${Date.now()}`).toLowerCase().replace(/[^a-z0-9_]/g, ''),
        email: body.email || 'usuario@fashionfinances.com',
        role: body.role || 'investor',
        status: 'active',
        balance: Number(body.balance || 0),
        totalEarnings: 0,
        totalInvested: 0,
        totalCommissions: 0,
        avatar: body.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        verified: body.verified !== false,
        registeredAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        patrocinadorId: body.patrocinadorId || 'model-1',
        notes: body.notes || ''
      };

      db.users.unshift(newUser);
      saveAdminDatabase(db);

      recordAuditLog({
        adminUser: adminActor,
        action: 'Creación de Usuario',
        module: 'usuarios',
        targetId: newUser.id,
        details: `Usuario @${newUser.username} (${newUser.name}) creado con rol ${newUser.role}.`,
        severity: 'info'
      });

      sendJson(res, 201, { success: true, user: newUser });
      return true;
    }
  }

  // User detail, update, status change
  const userMatch = pathname.match(/^\/api\/admin\/users\/([a-zA-Z0-9_-]+)$/);
  if (userMatch) {
    const userId = userMatch[1];
    const userIndex = db.users.findIndex((u: AdminUserRecord) => u.id === userId);

    if (userIndex === -1) {
      sendJson(res, 404, { error: 'Usuario no encontrado.' });
      return true;
    }

    if (req.method === 'GET') {
      sendJson(res, 200, db.users[userIndex]);
      return true;
    }

    if (req.method === 'PUT') {
      const body = await readJsonBody(req);
      const oldRole = db.users[userIndex].role;
      db.users[userIndex] = {
        ...db.users[userIndex],
        name: body.name ?? db.users[userIndex].name,
        email: body.email ?? db.users[userIndex].email,
        role: body.role ?? db.users[userIndex].role,
        balance: body.balance !== undefined ? Number(body.balance) : db.users[userIndex].balance,
        status: body.status ?? db.users[userIndex].status,
        verified: body.verified !== undefined ? Boolean(body.verified) : db.users[userIndex].verified,
        notes: body.notes ?? db.users[userIndex].notes
      };
      saveAdminDatabase(db);

      recordAuditLog({
        adminUser: adminActor,
        action: 'Edición de Usuario',
        module: 'usuarios',
        targetId: userId,
        details: `Perfil de @${db.users[userIndex].username} actualizado. Rol: ${oldRole} -> ${db.users[userIndex].role}.`,
        severity: oldRole !== db.users[userIndex].role ? 'warning' : 'info'
      });

      sendJson(res, 200, { success: true, user: db.users[userIndex] });
      return true;
    }
  }

  // Status toggle (suspend/reactivate)
  const userStatusMatch = pathname.match(/^\/api\/admin\/users\/([a-zA-Z0-9_-]+)\/status$/);
  if (userStatusMatch && req.method === 'PATCH') {
    const userId = userStatusMatch[1];
    const body = await readJsonBody(req);
    const { status, reason } = body;
    const userIndex = db.users.findIndex((u: AdminUserRecord) => u.id === userId);

    if (userIndex === -1) {
      sendJson(res, 404, { error: 'Usuario no encontrado.' });
      return true;
    }

    const previousStatus = db.users[userIndex].status;
    db.users[userIndex].status = status;
    if (reason) {
      db.users[userIndex].notes = `[${new Date().toLocaleDateString()}] Cambio de estado a ${status}: ${reason}. ${db.users[userIndex].notes || ''}`;
    }
    saveAdminDatabase(db);

    recordAuditLog({
      adminUser: adminActor,
      action: status === 'suspended' ? 'Suspensión de Cuenta' : 'Reactivación de Cuenta',
      module: 'usuarios',
      targetId: userId,
      details: `Usuario @${db.users[userIndex].username} cambió de ${previousStatus} a ${status}. Motivo: ${reason || 'No especificado'}.`,
      severity: status === 'suspended' ? 'critical' : 'info'
    });

    sendJson(res, 200, { success: true, user: db.users[userIndex] });
    return true;
  }

  // 4. PROJECTS CRUD
  if (pathname === '/api/admin/projects') {
    if (req.method === 'GET') {
      const searchQ = (params.get('search') || '').toLowerCase();
      const statusFilter = params.get('status');
      let list: AdminProjectRecord[] = db.projects || [];
      if (searchQ) {
        list = list.filter(p => 
          p.title.toLowerCase().includes(searchQ) || 
          p.authorName.toLowerCase().includes(searchQ) || 
          p.category.toLowerCase().includes(searchQ) ||
          p.id.toLowerCase().includes(searchQ)
        );
      }
      if (statusFilter && statusFilter !== 'all') {
        list = list.filter(p => p.status === statusFilter);
      }
      sendJson(res, 200, list);
      return true;
    }

    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      const newProj: AdminProjectRecord = {
        id: `proj-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: body.title || 'Proyecto Sin Título',
        userId: body.userId || 'usr-admin-001',
        authorName: body.authorName || 'Administrador',
        category: body.category || 'Moda & Pasarela',
        budget: Number(body.budget || 10000),
        fundingGoal: Number(body.fundingGoal || body.budget || 10000),
        objective: body.objective || '',
        status: body.status || 'active',
        votesReceived: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reviewedBy: adminActor
      };
      db.projects.unshift(newProj);
      saveAdminDatabase(db);

      recordAuditLog({
        adminUser: adminActor,
        action: 'Creación de Proyecto',
        module: 'proyectos',
        targetId: newProj.id,
        details: `Proyecto "${newProj.title}" creado con presupuesto de ${newProj.budget}€.`,
        severity: 'info'
      });

      sendJson(res, 201, { success: true, project: newProj });
      return true;
    }
  }

  // Project status / update / delete
  const projStatusMatch = pathname.match(/^\/api\/admin\/projects\/([a-zA-Z0-9_-]+)\/status$/);
  if (projStatusMatch && req.method === 'PATCH') {
    const projId = projStatusMatch[1];
    const body = await readJsonBody(req);
    const { status, reason } = body;
    const projIndex = db.projects.findIndex((p: AdminProjectRecord) => p.id === projId);

    if (projIndex === -1) {
      sendJson(res, 404, { error: 'Proyecto no encontrado.' });
      return true;
    }

    const previousStatus = db.projects[projIndex].status;
    db.projects[projIndex].status = status;
    db.projects[projIndex].updatedAt = new Date().toISOString();
    db.projects[projIndex].reviewedBy = adminActor;
    if (reason && status === 'rejected') {
      db.projects[projIndex].rejectionReason = reason;
    }
    saveAdminDatabase(db);

    recordAuditLog({
      adminUser: adminActor,
      action: status === 'active' ? 'Aprobación de Proyecto' : status === 'rejected' ? 'Rechazo de Propuesta' : 'Cambio de Estado de Proyecto',
      module: 'proyectos',
      targetId: projId,
      details: `Proyecto "${db.projects[projIndex].title}" cambió de ${previousStatus} a ${status}.${reason ? ` Motivo: ${reason}` : ''}`,
      severity: status === 'rejected' ? 'warning' : 'info'
    });

    sendJson(res, 200, { success: true, project: db.projects[projIndex] });
    return true;
  }

  const projDetailMatch = pathname.match(/^\/api\/admin\/projects\/([a-zA-Z0-9_-]+)$/);
  if (projDetailMatch) {
    const projId = projDetailMatch[1];
    const projIndex = db.projects.findIndex((p: AdminProjectRecord) => p.id === projId);

    if (projIndex === -1) {
      sendJson(res, 404, { error: 'Proyecto no encontrado.' });
      return true;
    }

    if (req.method === 'PUT') {
      const body = await readJsonBody(req);
      db.projects[projIndex] = {
        ...db.projects[projIndex],
        title: body.title ?? db.projects[projIndex].title,
        category: body.category ?? db.projects[projIndex].category,
        budget: body.budget !== undefined ? Number(body.budget) : db.projects[projIndex].budget,
        fundingGoal: body.fundingGoal !== undefined ? Number(body.fundingGoal) : db.projects[projIndex].fundingGoal,
        objective: body.objective ?? db.projects[projIndex].objective,
        status: body.status ?? db.projects[projIndex].status,
        updatedAt: new Date().toISOString()
      };
      saveAdminDatabase(db);

      recordAuditLog({
        adminUser: adminActor,
        action: 'Modificación de Proyecto',
        module: 'proyectos',
        targetId: projId,
        details: `Proyecto "${db.projects[projIndex].title}" modificado en panel de administración.`,
        severity: 'info'
      });

      sendJson(res, 200, { success: true, project: db.projects[projIndex] });
      return true;
    }

    if (req.method === 'DELETE') {
      const removed = db.projects.splice(projIndex, 1)[0];
      saveAdminDatabase(db);

      recordAuditLog({
        adminUser: adminActor,
        action: 'Retirada de Proyecto',
        module: 'proyectos',
        targetId: projId,
        details: `Proyecto "${removed.title}" retirado permanentemente de la plataforma.`,
        severity: 'critical'
      });

      sendJson(res, 200, { success: true, message: 'Proyecto retirado.' });
      return true;
    }
  }

  // 5. FINANCING ROUNDS / SESSIONS
  if (pathname === '/api/admin/sessions') {
    if (req.method === 'GET') {
      sendJson(res, 200, db.sessions || []);
      return true;
    }
  }

  const sessionMatch = pathname.match(/^\/api\/admin\/sessions\/([a-zA-Z0-9_-]+)$/);
  if (sessionMatch && req.method === 'PUT') {
    const sId = sessionMatch[1];
    const body = await readJsonBody(req);
    const sIdx = db.sessions.findIndex((s: AdminSessionRecord) => s.id === sId);

    if (sIdx === -1) {
      sendJson(res, 404, { error: 'Ronda no encontrada.' });
      return true;
    }

    db.sessions[sIdx] = {
      ...db.sessions[sIdx],
      title: body.title ?? db.sessions[sIdx].title,
      status: body.status ?? db.sessions[sIdx].status,
      participantsCount: body.participantsCount !== undefined ? Number(body.participantsCount) : db.sessions[sIdx].participantsCount,
      votingPhaseActive: body.votingPhaseActive !== undefined ? Boolean(body.votingPhaseActive) : db.sessions[sIdx].votingPhaseActive,
      startDate: body.startDate ?? db.sessions[sIdx].startDate,
      endDate: body.endDate ?? db.sessions[sIdx].endDate
    };
    saveAdminDatabase(db);

    recordAuditLog({
      adminUser: adminActor,
      action: 'Ajuste de Ronda de Financiación',
      module: 'financiacion',
      targetId: sId,
      details: `Ronda "${db.sessions[sIdx].title}" actualizada. Estado: ${db.sessions[sIdx].status}, Votación: ${db.sessions[sIdx].votingPhaseActive}.`,
      severity: 'warning'
    });

    sendJson(res, 200, { success: true, session: db.sessions[sIdx] });
    return true;
  }

  // 6. TICKETS / INCIDENCIAS / DENUNCIAS
  if (pathname === '/api/admin/tickets') {
    if (req.method === 'GET') {
      sendJson(res, 200, db.tickets || []);
      return true;
    }
    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      const newTicket: AdminTicketRecord = {
        id: `tkt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: body.type || 'incidencia',
        title: body.title || 'Nueva Incidencia',
        description: body.description || '',
        reportedBy: body.reportedBy || adminActor,
        reportedItem: body.reportedItem,
        priority: body.priority || 'media',
        status: 'abierta',
        createdAt: new Date().toISOString()
      };
      db.tickets.unshift(newTicket);
      saveAdminDatabase(db);

      recordAuditLog({
        adminUser: adminActor,
        action: 'Registro de Incidencia',
        module: 'contenido',
        targetId: newTicket.id,
        details: `Incidencia tipo ${newTicket.type} creada: "${newTicket.title}".`,
        severity: newTicket.priority === 'alta' ? 'warning' : 'info'
      });

      sendJson(res, 201, { success: true, ticket: newTicket });
      return true;
    }
  }

  const ticketMatch = pathname.match(/^\/api\/admin\/tickets\/([a-zA-Z0-9_-]+)$/);
  if (ticketMatch && req.method === 'PATCH') {
    const tId = ticketMatch[1];
    const body = await readJsonBody(req);
    const tIdx = db.tickets.findIndex((t: AdminTicketRecord) => t.id === tId);

    if (tIdx === -1) {
      sendJson(res, 404, { error: 'Incidencia no encontrada.' });
      return true;
    }

    db.tickets[tIdx].status = body.status ?? db.tickets[tIdx].status;
    if (body.responseNote) {
      db.tickets[tIdx].responseNote = body.responseNote;
    }
    if (body.status === 'resuelta') {
      db.tickets[tIdx].resolvedAt = new Date().toISOString();
    }
    saveAdminDatabase(db);

    recordAuditLog({
      adminUser: adminActor,
      action: 'Resolución de Incidencia/Denuncia',
      module: 'contenido',
      targetId: tId,
      details: `Incidencia "${db.tickets[tIdx].title}" actualizada a estado ${db.tickets[tIdx].status}.`,
      severity: 'info'
    });

    sendJson(res, 200, { success: true, ticket: db.tickets[tIdx] });
    return true;
  }

  // 7. NOTIFICATIONS BROADCAST
  if (pathname === '/api/admin/notifications') {
    if (req.method === 'GET') {
      sendJson(res, 200, db.notifications || []);
      return true;
    }
    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      const newNotif: AdminNotificationRecord = {
        id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: body.title || 'Aviso General',
        message: body.message || '',
        targetRole: body.targetRole || 'all',
        type: body.type || 'info',
        active: true,
        createdAt: new Date().toISOString()
      };
      db.notifications.unshift(newNotif);
      saveAdminDatabase(db);

      recordAuditLog({
        adminUser: adminActor,
        action: 'Emisión de Notificación Masiva',
        module: 'contenido',
        targetId: newNotif.id,
        details: `Notificación broadcast emitida a rol "${newNotif.targetRole}": "${newNotif.title}".`,
        severity: 'info'
      });

      sendJson(res, 201, { success: true, notification: newNotif });
      return true;
    }
  }

  const notifMatch = pathname.match(/^\/api\/admin\/notifications\/([a-zA-Z0-9_-]+)$/);
  if (notifMatch && req.method === 'DELETE') {
    const nId = notifMatch[1];
    const nIdx = db.notifications.findIndex((n: AdminNotificationRecord) => n.id === nId);
    if (nIdx !== -1) {
      db.notifications.splice(nIdx, 1);
      saveAdminDatabase(db);
    }
    sendJson(res, 200, { success: true, message: 'Notificación eliminada.' });
    return true;
  }

  // 8. CONFIGURATION
  if (pathname === '/api/admin/config') {
    if (req.method === 'GET') {
      sendJson(res, 200, db.config);
      return true;
    }
    if (req.method === 'PUT') {
      const body = await readJsonBody(req);
      db.config = {
        ...db.config,
        ...body
      };
      saveAdminDatabase(db);

      recordAuditLog({
        adminUser: adminActor,
        action: 'Ajuste de Configuración de Plataforma',
        module: 'configuracion',
        targetId: 'platform_config',
        details: `Configuración global de Fashion Finances actualizada por ${adminActor}.`,
        severity: 'warning'
      });

      sendJson(res, 200, { success: true, config: db.config });
      return true;
    }
  }

  // 9. AUDIT LOGS
  if (pathname === '/api/admin/audit-logs' && req.method === 'GET') {
    const logs = loadAdminAuditLogs();
    sendJson(res, 200, logs);
    return true;
  }

  // Default fallback for unmatched admin endpoints
  sendJson(res, 404, { error: 'Admin API endpoint no encontrado.' });
  return true;
}
