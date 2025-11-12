
-- Drop existing QTI-related objects
DROP TRIGGER IF EXISTS update_qti_questions_updated_at ON qti_questions;
DROP INDEX IF EXISTS idx_qti_questions_metadata;
DROP TABLE IF EXISTS qti_questions;
DROP TYPE IF EXISTS qti_version;

-- Create JSON Questions table
CREATE TABLE json_questions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  metadata jsonb NOT NULL,
  question jsonb NOT NULL,
  statistics jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Indexes
CREATE INDEX idx_json_questions_metadata ON json_questions USING gin (metadata);

-- Update timestamps triggers
CREATE TRIGGER update_json_questions_updated_at
  BEFORE UPDATE ON json_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
