import { z } from "zod"
import { AppError } from "./error-handler"

// Common validation schemas
export const taskSchema = z.object({
  text: z.string().min(1, "Task text is required").max(500, "Task text is too long"),
  category: z.enum(["todo", "done", "forgotten", "overdue"]).optional().default("todo"),
  priority: z.enum(["high", "medium", "low"]).optional(),
  completed: z.boolean().optional().default(false),
})

export const habitSchema = z.object({
  name: z.string().min(1, "Habit name is required").max(100, "Habit name is too long"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format")
    .optional()
    .default("#6c5ce7"),
  timeOfDay: z.enum(["morning", "afternoon", "evening", "any"]).optional().default("any"),
  streak: z.number().int().min(0).optional().default(0),
  completed: z.boolean().optional().default(false),
})

export const moodSchema = z.object({
  mood: z.string().min(1, "Mood is required"),
  note: z.string().max(500, "Note is too long").optional(),
})

export const goalSchema = z.object({
  name: z.string().min(1, "Goal name is required").max(200, "Goal name is too long"),
  dueDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  isPublic: z.boolean().optional().default(false),
  completed: z.boolean().optional().default(false),
})

export const pomodoroSchema = z.object({
  duration: z.number().int().min(1, "Duration must be at least 1 minute"),
  notes: z.string().max(500, "Notes are too long").optional(),
  completed: z.boolean().optional().default(false),
})

// Validate request body against a schema
export async function validateBody<T extends z.ZodType>(request: Request, schema: T): Promise<z.infer<T>> {
  let body

  // Parse JSON safely
  try {
    body = await request.json()
  } catch (e) {
    throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON")
  }

  // Validate against schema
  try {
    return schema.parse(body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError("Validation error: " + error.errors.map((e) => e.message).join(", "), 400, "VALIDATION_ERROR")
    }
    throw error
  }
}

