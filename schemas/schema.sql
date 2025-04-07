-- Create the testimonials table
DROP TABLE IF EXISTS testimonials;
CREATE TABLE IF NOT EXISTS testimonials (
    id integer PRIMARY KEY AUTOINCREMENT,
    quote text NOT NULL,
    author text NOT NULL,
    role text NOT NULL,
    company text NOT NULL,
    image text NOT NULL,
    post_slug text NOT NULL
);
CREATE INDEX idx_testimonials_post_slug ON testimonials (post_slug);