const { Pool } = require('pg');

const adminPassword = process.env.ADMIN_PASSWORD || '1234qwert=';
let pool;

const configurePgPool = async () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgres://master:1234qwert=@localhost:5432/tradepump',
    });
    // Add admin user if not exists
    await query(`
      INSERT INTO public.users(user_id, user_name,user_email,user_password,user_is_active,user_role)
      VALUES (1, 'Administrator','admin@tradepump.com',crypt('${adminPassword}', gen_salt('bf', 5)),TRUE,'admin')
      ON CONFLICT DO NOTHING;
    `);
    // Grant admin user all access
    await query(`
      INSERT INTO access.users_groups(user_id, group_id)
      VALUES (1, 1)
      ON CONFLICT DO NOTHING;
    `);
  }
  return pool;
};

const query = (sql, values = []) => {
  configurePgPool();

  return pool.connect()
    .then(conn => {
      const result = conn.query(sql, values);

      conn.release();
      return result;
    })
    .then(result => result.rows);
};

const call = async (functionName, params = []) => {
  const paramIndices = params.map((_, i) => `$${i + 1}`).join(',');
  const sql = `SELECT ${functionName}(${paramIndices});`;
  const data = await query(sql, params);

  if (!Array.isArray(data)) {
    console.error(data);
    throw new Error('Malformed result in database');
  }
  
  return data[0][functionName.split('.').pop()];
};

module.exports = {
  configurePgPool,
  query,
  call,
};
