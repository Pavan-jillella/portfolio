-- Add start_time and end_time columns to part_time_hours table
-- These store the clock-in/clock-out times (HH:MM format) when using time-based logging

ALTER TABLE part_time_hours ADD COLUMN IF NOT EXISTS start_time text not null default '';
ALTER TABLE part_time_hours ADD COLUMN IF NOT EXISTS end_time text not null default '';
