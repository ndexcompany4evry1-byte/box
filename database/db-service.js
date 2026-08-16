// db-service.js
// This file uses the Supabase client and provides helper functions
// to normalize data and insert it into your Supabase database.

import supabase from './supabase-client.js';

/**
 * Normalize raw input object to a clean record.
 * Adjust the field mappings to match your Supabase table schema.
 */
function normalizeRecord(raw) {
  return {
    name: raw.name ?? raw.fullName ?? null,
    email: raw.email ?? null,
    phone: raw.phone ?? raw.mobile ?? null,
    message: raw.message ?? raw.note ?? null,
    created_at: new Date().toISOString(),
    ...raw.extraFields,
  };
}

/**
 * Insert a record into the specified Supabase table.
 * @param {string} table - The table name in Supabase.
 * @param {Object} rawData - Raw data object to send.
 */
export async function publishToDatabase(table, rawData) {
  const record = normalizeRecord(rawData);

  const { data, error } = await supabase.from(table).insert([record]);

  if (error) {
    console.error('Supabase insert error:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Example helper for a specific table.
 * Change 'contacts' to your actual table name.
 */
export async function saveContact(rawData) {
  return publishToDatabase('contacts', rawData);
}

export async function ensureUserProfile(rawUser) {
  if (!rawUser || !rawUser.uid) {
    return { success: false, error: new Error('Missing required user uid') };
  }

  const { data: existing, error: fetchError } = await supabase.from('users').select('*').eq('uid', rawUser.uid).maybeSingle();
  if (fetchError) {
    console.error('Supabase fetch user error:', fetchError);
    return { success: false, error: fetchError };
  }

  if (existing) {
    return { success: true, data: existing };
  }

  const record = {
    uid: rawUser.uid,
    email: rawUser.email ?? null,
    displayName: rawUser.displayName ?? null,
    photoURL: rawUser.photoURL ?? null,
    phone: rawUser.phone ?? null,
    provider: rawUser.provider ?? null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('users').insert([record]);
  if (error) {
    console.error('Supabase insert user error:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

export async function recordLoginEvent(rawUser, details = {}) {
  if (!rawUser || !rawUser.uid) {
    return { success: false, error: new Error('Missing required user uid') };
  }

  const userInfo = {
    uid: rawUser.uid,
    email: rawUser.email ?? null,
    ip: details.ip ?? null,
    user_agent: details.userAgent ?? null,
    provider: details.provider ?? null,
    login_at: new Date().toISOString(),
  };

  const { data: updateData, error: updateError } = await supabase.from('users').upsert([
    {
      uid: rawUser.uid,
      last_login_at: userInfo.login_at,
      last_login_ip: userInfo.ip,
      last_user_agent: userInfo.user_agent,
      provider: userInfo.provider,
      email: rawUser.email ?? null,
      displayName: rawUser.displayName ?? null,
      photoURL: rawUser.photoURL ?? null,
      updated_at: new Date().toISOString(),
    }
  ], { onConflict: 'uid' });

  if (updateError) {
    console.error('Supabase update login info error:', updateError);
  }

  const { data, error } = await supabase.from('user_logins').insert([userInfo]);
  if (error) {
    console.error('Supabase insert login event error:', error);
    return { success: false, error };
  }

  return { success: true, data, updateData };
}

export async function fetchUserProjects(uid) {
  if (!uid) {
    return { success: false, data: [], error: new Error('Missing uid') };
  }

  const { data, error } = await supabase.from('user_projects').select('*').eq('uid', uid).order('created_at', { ascending: false });
  if (error) {
    console.error('Supabase fetch user projects error:', error);
    return { success: false, data: [], error };
  }

  return { success: true, data };
}

export async function saveUserProjects(uid, projectItems) {
  if (!uid) {
    return { success: false, error: new Error('Missing uid') };
  }

  const records = (Array.isArray(projectItems) ? projectItems : []).map((project) => {
    const projectId = project.id ? String(project.id) : String(Date.now());
    return {
      uid,
      project_id: projectId,
      name: project.name ?? null,
      type: project.type ?? null,
      desc: project.desc ?? null,
      status: project.status ?? 'جديد',
      created_at: project.createdAt ? new Date(project.createdAt).toISOString() : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      raw_data: JSON.stringify(project),
    };
  });

  const { data, error } = await supabase.from('user_projects').upsert(records, { onConflict: 'project_id' });
  if (error) {
    console.error('Supabase save user projects error:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

export async function upsertUserProfile(rawUser) {
  if (!rawUser || !rawUser.uid) {
    return { success: false, error: new Error('Missing required user uid') };
  }

  const record = {
    uid: rawUser.uid,
    email: rawUser.email ?? null,
    displayName: rawUser.displayName ?? null,
    photoURL: rawUser.photoURL ?? null,
    phone: rawUser.phone ?? null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('users').upsert(record, { onConflict: 'uid' });
  if (error) {
    console.error('Supabase upsert user error:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

export async function fetchUserProfile(uid) {
  if (!uid) {
    return { success: false, data: null, error: new Error('Missing uid') };
  }

  const { data, error } = await supabase.from('users').select('*').eq('uid', uid).maybeSingle();
  if (error) {
    console.error('Supabase fetch user profile error:', error);
    return { success: false, data: null, error };
  }

  return { success: true, data };
}

// Example usage:
// import { saveContact } from './database/db-service.js';
// await saveContact({ name: 'Ali', email: 'ali@example.com', phone: '+966...', message: 'Hello' });
