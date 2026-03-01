CREATE TYPE hero_power AS ENUM ('flight', 'strength', 'telepathy', 'speed', 'invisibility');
CREATE TYPE hero_status AS ENUM ('available', 'busy', 'retired');
CREATE TYPE incident_level AS ENUM ('low', 'medium', 'critical');
CREATE TYPE incident_status AS ENUM ('open', 'assigned', 'resolved');

CREATE TABLE heroes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    power hero_power NOT NULL,
    status hero_status DEFAULT 'available'
);

CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    location TEXT NOT NULL,
    level incident_level NOT NULL,
    status incident_status DEFAULT 'open',
    hero_id INTEGER UNIQUE REFERENCES heroes(id) ON DELETE SET NULL
);