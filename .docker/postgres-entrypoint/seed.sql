-- Zero managed tables
CREATE DATABASE zero_cvr;

CREATE DATABASE zero_cdb;

-- Default publication without any table. Add publication manually via migration. Only add tables that need to be synced to the client.
CREATE PUBLICATION zero_publication;