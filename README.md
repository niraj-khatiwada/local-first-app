# Local First App using PowerSync

**Run dev servers:**

```
pnpm docker:dev:up
```

Our server as well as PowerSync server will start.

## Pre-requisite:

After the docker containers are up, make sure to run these commands to allow PowerSync server to access our Postgres database.

#### 1. Create a PowerSync database user:

```
CREATE ROLE powersync_role WITH REPLICATION LOGIN PASSWORD 'myhighlyrandompassword';

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO powersync_role;

```

#### 2. Create “powersync” publication:

```
CREATE PUBLICATION powersync FOR ALL TABLES;
```
