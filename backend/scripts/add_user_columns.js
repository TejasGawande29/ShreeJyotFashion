require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shreejyot_fashion',
});

(async () => {
  try {
    await client.connect();
    console.log('Connected to DB');

    // Add failed_login_attempts if missing
    await client.query("DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='failed_login_attempts') THEN ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0 NOT NULL; END IF; END $$;");
    console.log('Ensured column failed_login_attempts');

    // Add account_locked_until if missing
    await client.query("DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='account_locked_until') THEN ALTER TABLE users ADD COLUMN account_locked_until TIMESTAMP; END IF; END $$;");
    console.log('Ensured column account_locked_until');

    // Verify
    const res = await client.query("SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name='users' AND column_name IN ('failed_login_attempts','account_locked_until') ORDER BY column_name;");
    console.table(res.rows);

    console.log('Done.');
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
