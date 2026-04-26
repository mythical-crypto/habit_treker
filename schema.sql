-- Habit Tracker Database Schema
-- PostgreSQL 16+
-- For use with Drizzle ORM

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS (managed by Better Auth)
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SESSIONS (managed by Better Auth)
-- ============================================
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    token TEXT NOT NULL UNIQUE,
    ip_address TEXT,
    user_agent TEXT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- HABITS
-- ============================================
CREATE TABLE habits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    frequency TEXT NOT NULL DEFAULT 'daily', -- 'daily', 'weekly', 'custom_days'
    custom_days INTEGER[], -- For custom frequency: [0,1,3] = Sun,Mon,Wed
    color TEXT DEFAULT '#3b82f6',
    icon TEXT, -- Emoji or icon name
    target_count INTEGER DEFAULT 1, -- Target completions per period
    target_per_week INTEGER DEFAULT 7, -- Legacy field, prefer target_count
    is_active BOOLEAN DEFAULT TRUE,
    archived_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COMPLETIONS (Habit Entries)
-- ============================================
CREATE TABLE completions (
    id SERIAL PRIMARY KEY,
    habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    completed BOOLEAN DEFAULT TRUE,
    count INTEGER DEFAULT 1, -- For habits with target_count > 1
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(habit_id, entry_date) -- Prevent duplicate entries per habit per day
);

-- ============================================
-- STREAKS (Historical streak tracking)
-- ============================================
CREATE TABLE streaks (
    id SERIAL PRIMARY KEY,
    habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    length INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (end_date >= start_date)
);

-- ============================================
-- INDEXES
-- ============================================

-- For "get all habits for user" queries
CREATE INDEX idx_habits_user_id ON habits(user_id) WHERE is_active = TRUE;

-- For "get entries for habit" queries (most common)
CREATE INDEX idx_completions_habit_date ON completions(habit_id, entry_date DESC);

-- For "get all entries for user on date" queries
CREATE INDEX idx_completions_user_date ON completions(user_id, entry_date);

-- For streak calculations (covering index)
CREATE INDEX idx_completions_completed ON completions(habit_id, entry_date) 
    WHERE completed = TRUE;

-- For session lookups
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);

-- GIN index for custom_days array queries
CREATE INDEX idx_habits_custom_days ON habits USING GIN(custom_days);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Calculate current streak for a habit
CREATE OR REPLACE FUNCTION get_current_streak(p_habit_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    v_streak INTEGER := 0;
    v_current_date DATE := CURRENT_DATE;
    v_last_date DATE;
BEGIN
    -- Find the most recent completion
    SELECT MAX(entry_date) INTO v_last_date
    FROM completions
    WHERE habit_id = p_habit_id AND completed = TRUE;
    
    -- If no completions, return 0
    IF v_last_date IS NULL THEN
        RETURN 0;
    END IF;
    
    -- If last completion is not today or yesterday, streak is broken
    IF v_last_date < v_current_date - INTERVAL '1 day' THEN
        RETURN 0;
    END IF;
    
    -- Count consecutive days
    WITH RECURSIVE streak_dates AS (
        SELECT v_last_date AS entry_date, 1 AS streak_length
        
        UNION ALL
        
        SELECT sd.entry_date - INTERVAL '1 day', sd.streak_length + 1
        FROM streak_dates sd
        WHERE EXISTS (
            SELECT 1 FROM completions c
            WHERE c.habit_id = p_habit_id
            AND c.entry_date = sd.entry_date - INTERVAL '1 day'
            AND c.completed = TRUE
        )
    )
    SELECT MAX(streak_length) INTO v_streak
    FROM streak_dates;
    
    RETURN COALESCE(v_streak, 0);
END;
$$ LANGUAGE plpgsql;

-- Calculate longest streak for a habit
CREATE OR REPLACE FUNCTION get_longest_streak(p_habit_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    v_longest INTEGER := 0;
BEGIN
    WITH completed_dates AS (
        SELECT DISTINCT entry_date
        FROM completions
        WHERE habit_id = p_habit_id AND completed = TRUE
        ORDER BY entry_date
    ),
    streak_groups AS (
        SELECT 
            entry_date,
            entry_date - (ROW_NUMBER() OVER (ORDER BY entry_date))::INTEGER AS streak_group
        FROM completed_dates
    )
    SELECT COALESCE(MAX(COUNT(*)), 0) INTO v_longest
    FROM streak_groups
    GROUP BY streak_group;
    
    RETURN v_longest;
END;
$$ LANGUAGE plpgsql;

-- Get completion rate for a habit over N days
CREATE OR REPLACE FUNCTION get_completion_rate(
    p_habit_id INTEGER,
    p_days INTEGER DEFAULT 30
)
RETURNS NUMERIC AS $$
DECLARE
    v_completed INTEGER;
    v_total INTEGER;
BEGIN
    SELECT 
        COUNT(*) FILTER (WHERE completed = TRUE),
        COUNT(*)
    INTO v_completed, v_total
    FROM completions
    WHERE habit_id = p_habit_id
    AND entry_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL;
    
    IF v_total = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN ROUND((v_completed::NUMERIC / v_total::NUMERIC) * 100, 2);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habits_updated_at
    BEFORE UPDATE ON habits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS
-- ============================================

-- Daily completion summary
CREATE VIEW daily_summary AS
SELECT 
    c.user_id,
    c.entry_date,
    COUNT(*) FILTER (WHERE c.completed = TRUE) AS completed_count,
    COUNT(*) AS total_habits,
    ROUND(
        100.0 * COUNT(*) FILTER (WHERE c.completed = TRUE) / NULLIF(COUNT(*), 0),
        2
    ) AS completion_rate
FROM completions c
JOIN habits h ON c.habit_id = h.id
WHERE h.is_active = TRUE
GROUP BY c.user_id, c.entry_date;

-- Habit statistics
CREATE VIEW habit_stats AS
SELECT 
    h.id AS habit_id,
    h.user_id,
    h.name,
    COUNT(c.id) FILTER (WHERE c.completed = TRUE) AS total_completions,
    get_current_streak(h.id) AS current_streak,
    get_longest_streak(h.id) AS longest_streak,
    get_completion_rate(h.id, 30) AS completion_rate_30d
FROM habits h
LEFT JOIN completions c ON h.id = c.habit_id
WHERE h.is_active = TRUE
GROUP BY h.id, h.user_id, h.name;
