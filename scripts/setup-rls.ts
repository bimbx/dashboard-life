import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"

const execAsync = promisify(exec)

async function setupRLS() {
  try {
    console.log("Setting up Row-Level Security...")

    // Get the path to the SQL file
    const sqlFilePath = path.join(process.cwd(), "drizzle", "setup-rls.sql")

    // Check if the file exists
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`SQL file not found: ${sqlFilePath}`)
    }

    // Get database connection details from environment
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      throw new Error("DATABASE_URL environment variable is not set")
    }

    const url = new URL(dbUrl)
    const host = url.hostname
    const port = url.port
    const database = url.pathname.substring(1)
    const username = url.username

    // Execute the SQL file
    const command = `PGPASSWORD="${url.password}" psql -h ${host} -p ${port} -U ${username} -d ${database} -f ${sqlFilePath}`

    const { stdout, stderr } = await execAsync(command)

    if (stderr && !stderr.includes("NOTICE")) {
      console.error("Error output:", stderr)
      throw new Error("Error executing SQL file")
    }

    console.log("Row-Level Security setup completed successfully")
    console.log(stdout)

    return true
  } catch (error) {
    console.error("Failed to set up Row-Level Security:", error)
    return false
  }
}

// Run the script if executed directly
if (require.main === module) {
  setupRLS()
    .then((success) => {
      process.exit(success ? 0 : 1)
    })
    .catch((error) => {
      console.error("Unhandled error:", error)
      process.exit(1)
    })
}

export default setupRLS

