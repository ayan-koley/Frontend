-- Create enum types
create type question_difficulty as enum ('Easy', 'Medium', 'Hard');
create type quiz_type as enum ('full', 'subject', 'topic');
create type quiz_status as enum ('active', 'completed', 'abandoned');
create type qti_version as enum ('2.1', '3.0');
create type question_type as enum ('mcq', 'numeric', 'essay', 'match', 'order');

-- QTI Questions table
create table qti_questions (
  id uuid primary key default uuid_generate_v4(),
  metadata jsonb not null,
  qti jsonb not null,
  statistics jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Quiz configurations table
create table quiz_configurations (
  id uuid primary key default uuid_generate_v4(),
  type quiz_type not null,
  metadata jsonb not null,
  settings jsonb not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Quiz sessions table
create table quiz_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  configuration_id uuid references quiz_configurations not null,
  questions jsonb not null,
  status quiz_status not null default 'active',
  start_time timestamp with time zone default now(),
  end_time timestamp with time zone,
  final_score numeric,
  analytics jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes
create index idx_qti_questions_metadata on qti_questions using gin (metadata);
create index idx_quiz_sessions_user_id on quiz_sessions(user_id);
create index idx_quiz_sessions_status on quiz_sessions(status);

-- Update timestamps function
create function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Update timestamps triggers
create trigger update_qti_questions_updated_at
  before update on qti_questions
  for each row
  execute function update_updated_at_column();

create trigger update_quiz_configurations_updated_at
  before update on quiz_configurations
  for each row
  execute function update_updated_at_column();

create trigger update_quiz_sessions_updated_at
  before update on quiz_sessions
  for each row
  execute function update_updated_at_column();