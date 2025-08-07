require('dotenv').config()
const { Client } = require('pg')

async function runSeed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    await client.connect()

    async function createAdmin() {
      const q = `
        INSERT INTO users(google_id, role) VALUES ($1, 'admin')
        ON CONFLICT DO NOTHING
      `
      await client.query(q, [process.env.ADMIN_GOOGLE_ID])
    }

    async function createLevels() {
      const q = `
        INSERT INTO levels(id) VALUES ('A1'), ('A2'), ('B1'), ('B2'), ('C1'), ('C2')
        ON CONFLICT DO NOTHING
      `
      await client.query(q)
    }

    await createLevels()
    await createAdmin()

    console.log('Seed script executed successfully.')
  } catch (error) {
    console.error('Error running seed script:', error)
  } finally {
    await client.end()
  }
}

runSeed()
