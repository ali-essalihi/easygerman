-- Up Migration

CREATE TYPE level_enum AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');
CREATE TYPE role_enum AS ENUM ('learner', 'admin');

CREATE TABLE IF NOT EXISTS levels (
  id level_enum PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level_id level_enum NOT NULL REFERENCES levels(id),
  title TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  yt_video_id TEXT NOT NULL UNIQUE,
  rank TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  google_id TEXT NOT NULL UNIQUE,
  role role_enum NOT NULL
);

CREATE TABLE IF NOT EXISTS user_completed_videos (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id INTEGER NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, video_id)
);

-- Down Migration

DROP TABLE IF EXISTS user_completed_videos;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS videos;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS levels;

DROP TYPE IF EXISTS level_enum;
DROP TYPE IF EXISTS role_enum;
