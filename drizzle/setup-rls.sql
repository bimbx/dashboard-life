-- Enable Row Level Security on tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE pomodoros ENABLE ROW LEVEL SECURITY;

-- Create a function to get the current user ID
CREATE OR REPLACE FUNCTION current_user_id() RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.current_user_id', TRUE);
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create policies for each table
-- Tasks table policies
CREATE POLICY tasks_user_select ON tasks
  FOR SELECT USING (user_id = current_user_id());
  
CREATE POLICY tasks_user_insert ON tasks
  FOR INSERT WITH CHECK (user_id = current_user_id());
  
CREATE POLICY tasks_user_update ON tasks
  FOR UPDATE USING (user_id = current_user_id());
  
CREATE POLICY tasks_user_delete ON tasks
  FOR DELETE USING (user_id = current_user_id());

-- Habits table policies
CREATE POLICY habits_user_select ON habits
  FOR SELECT USING (user_id = current_user_id());
  
CREATE POLICY habits_user_insert ON habits
  FOR INSERT WITH CHECK (user_id = current_user_id());
  
CREATE POLICY habits_user_update ON habits
  FOR UPDATE USING (user_id = current_user_id());
  
CREATE POLICY habits_user_delete ON habits
  FOR DELETE USING (user_id = current_user_id());

-- Moods table policies
CREATE POLICY moods_user_select ON moods
  FOR SELECT USING (user_id = current_user_id());
  
CREATE POLICY moods_user_insert ON moods
  FOR INSERT WITH CHECK (user_id = current_user_id());
  
CREATE POLICY moods_user_update ON moods
  FOR UPDATE USING (user_id = current_user_id());
  
CREATE POLICY moods_user_delete ON moods
  FOR DELETE USING (user_id = current_user_id());

-- Goals table policies
CREATE POLICY goals_user_select ON goals
  FOR SELECT USING (user_id = current_user_id());
  
CREATE POLICY goals_user_insert ON goals
  FOR INSERT WITH CHECK (user_id = current_user_id());
  
CREATE POLICY goals_user_update ON goals
  FOR UPDATE USING (user_id = current_user_id());
  
CREATE POLICY goals_user_delete ON goals
  FOR DELETE USING (user_id = current_user_id());

-- Pomodoros table policies
CREATE POLICY pomodoros_user_select ON pomodoros
  FOR SELECT USING (user_id = current_user_id());
  
CREATE POLICY pomodoros_user_insert ON pomodoros
  FOR INSERT WITH CHECK (user_id = current_user_id());
  
CREATE POLICY pomodoros_user_update ON pomodoros
  FOR UPDATE USING (user_id = current_user_id());
  
CREATE POLICY pomodoros_user_delete ON pomodoros
  FOR DELETE USING (user_id = current_user_id());

-- Create a function to set the current user ID in the session
CREATE OR REPLACE FUNCTION set_current_user_id(user_id TEXT) RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.current_user_id', user_id, FALSE);
END;
$$ LANGUAGE plpgsql;

