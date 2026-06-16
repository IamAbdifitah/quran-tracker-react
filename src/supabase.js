// Local mock Supabase client backed by `localStorage`.
// This replaces remote Supabase usage so the app can run without a database.

function ensureTable(name) {
  if (!localStorage.getItem(name)) localStorage.setItem(name, JSON.stringify([]));
}

function readTable(name) {
  ensureTable(name);
  try {
    return JSON.parse(localStorage.getItem(name));
  } catch (e) {
    return [];
  }
}

function writeTable(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}

const auth = {
  async signInWithPassword({ email }) {
    ensureTable('users');
    const users = readTable('users');
    let user = users.find(u => u.email === email);
    if (!user) {
      user = { id: `local-${Date.now()}`, email, role: 'user' };
      users.push(user);
      writeTable('users', users);
    }
    localStorage.setItem('currentUser', JSON.stringify({ id: user.id, email: user.email }));
    return { data: { user }, error: null };
  },

  async signUp({ email }) {
    ensureTable('users');
    const users = readTable('users');
    let existing = users.find(u => u.email === email);
    if (existing) {
      return { data: null, error: { message: 'User already exists' } };
    }
    const user = { id: `local-${Date.now()}`, email, role: 'user' };
    users.push(user);
    writeTable('users', users);
    localStorage.setItem('currentUser', JSON.stringify({ id: user.id, email: user.email }));
    return { data: { user }, error: null };
  },

  async getUser() {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return { data: null, error: null };
    try {
      const parsed = JSON.parse(raw);
      return { data: { user: parsed }, error: null };
    } catch (e) {
      return { data: null, error: e };
    }
  },

  async signOut() {
    localStorage.removeItem('currentUser');
    return { error: null };
  }
};

function from(table) {
  const state = { table, _select: null, _filters: [] };

  const chain = {
    select(cols) {
      state._select = cols;
      return chain;
    },
    eq(field, val) {
      state._filters.push({ field, val });
      return chain;
    },
    async single() {
      const rows = readTable(state.table);
      const found = rows.find(r => state._filters.every(f => r[f.field] === f.val));
      return { data: found || null, error: null };
    },
    async insert(obj) {
      const rows = readTable(state.table);
      rows.push(obj);
      writeTable(state.table, rows);
      return { data: obj, error: null };
    },
    then(resolve) {
      try {
        const rows = readTable(state.table);
        let results = rows;
        if (state._filters.length) {
          results = rows.filter(r => state._filters.every(f => r[f.field] === f.val));
        }
        resolve({ data: results, error: null });
      } catch (e) {
        resolve({ data: null, error: e });
      }
    }
  };

  return chain;
}

export const supabase = { auth, from };
