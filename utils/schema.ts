import { 
  pgTable, 
  serial, 
  text, 
  varchar, 
  timestamp 
} from 'drizzle-orm/pg-core';

export const mockInterview = pgTable('mock_interview', {
  id: serial('id').primaryKey(),
  jsonMockResp: text('json_mock_resp').notNull(),
  jobTitle: varchar('job_title', { length: 255 }).notNull(),
  jobRole: varchar('job_role', { length: 255 }).notNull(),
  yearsOfExperience: varchar('years_of_experience', { length: 50 }).notNull(),
  reasonForInterview: text('reason_for_interview').notNull(),
  createdBy: varchar('created_by', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  mockId: varchar('mock_id', { length: 255 }).notNull(),
});