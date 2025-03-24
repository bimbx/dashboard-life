import { gzip, gunzip } from "zlib"
import { promisify } from "util"

const gzipPromise = promisify(gzip)
const gunzipPromise = promisify(gunzip)

// Compress a string
export async function compress(data: string): Promise<string> {
  const buffer = await gzipPromise(Buffer.from(data))
  return buffer.toString("base64")
}

// Decompress a string
export async function decompress(data: string): Promise<string> {
  const buffer = await gunzipPromise(Buffer.from(data, "base64"))
  return buffer.toString()
}

