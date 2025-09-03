# Quick Full-Stack CRUD (Express + SQLite)

## What
Tiny notes CRUD app (Create / Read / Update / Delete). Backend + Static frontend served by Express. SQLite used so you don't need to run a DB server.

## Run locally
1. Node 16+ installed.
2. `npm install`
3. `npm start`
4. Open `http://localhost:3000`

Database file `data.sqlite3` will be created in project root. `init.sql` contains the table schema.

## Deploy to AWS (suggested quick way)
- Launch an EC2 Ubuntu instance (t2.micro or t3.micro) with Node 16+ (or install Node there).
- Copy repo to the instance (git clone or scp).
- On the instance:
  - `npm install`
  - open port 3000 in Security Group OR set up nginx reverse proxy to port 80.
  - `npm start` (or use PM2/systemd for production).
- Browse to your public IP or domain.

This app is intentionally minimal — for production consider:
- Using a proper DB (RDS / Aurora)
- HTTPS with Let's Encrypt (nginx)
- Process manager (pm2/systemd)
- Environment config and secrets
