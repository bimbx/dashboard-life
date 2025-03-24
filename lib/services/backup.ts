import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"
import { logError } from "./logging"

const execAsync = promisify(exec)

/**
 * Create a database backup
 * @returns Path to the backup file
 */
export async function createDatabaseBackup(): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const backupDir = process.env.BACKUP_DIR || "./backups"
  const backupPath = path.join(backupDir, `backup-${timestamp}.sql`)

  // Ensure backup directory exists
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  // Get database connection details from environment
  const dbUrl = new URL(process.env.DATABASE_URL!)
  const host = dbUrl.hostname
  const port = dbUrl.port
  const database = dbUrl.pathname.substring(1)
  const username = dbUrl.username

  // Create backup using pg_dump
  const command = `PGPASSWORD="${dbUrl.password}" pg_dump -h ${host} -p ${port} -U ${username} -d ${database} -F p > ${backupPath}`

  try {
    await execAsync(command)
    console.log(`Database backup created at ${backupPath}`)

    // Upload to cloud storage if configured
    if (process.env.BACKUP_STORAGE_ENABLED === "true") {
      // await uploadToCloudStorage(backupPath);
      console.log("Backup would be uploaded to cloud storage if configured")
    }

    return backupPath
  } catch (error) {
    console.error("Database backup failed:", error)
    await logError(error instanceof Error ? error : new Error(String(error)), { service: "backup" })
    throw error
  }
}

/**
 * Restore a database from backup
 * @param backupPath Path to the backup file
 */
export async function restoreFromBackup(backupPath: string): Promise<void> {
  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup file not found: ${backupPath}`)
  }

  // Get database connection details from environment
  const dbUrl = new URL(process.env.DATABASE_URL!)
  const host = dbUrl.hostname
  const port = dbUrl.port
  const database = dbUrl.pathname.substring(1)
  const username = dbUrl.username

  // Restore from backup using psql
  const command = `PGPASSWORD="${dbUrl.password}" psql -h ${host} -p ${port} -U ${username} -d ${database} -f ${backupPath}`

  try {
    await execAsync(command)
    console.log(`Database restored from ${backupPath}`)
  } catch (error) {
    console.error("Database restore failed:", error)
    await logError(error instanceof Error ? error : new Error(String(error)), { service: "backup" })
    throw error
  }
}

