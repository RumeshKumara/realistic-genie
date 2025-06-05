import { 
  pgTable, 
  text, 
  timestamp, 
  uuid 
} from 'drizzle-orm/pg-core';

export const MockInterview = pgTable('mock_interviews', {
  id: uuid('id').primaryKey(),
  jobTitle: text('job_title').notNull(),
  jobRole: text('job_role').notNull(),
  yearsOfExperience: text('years_of_experience').notNull(),
  reasonForInterview: text('reason_for_interview').notNull(),
  questions: text('questions').notNull(),
  createdBy: text('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Add a type export for TypeScript support
export type MockInterview = typeof MockInterview.$inferSelect;
export type NewMockInterview = typeof MockInterview.$inferInsert;