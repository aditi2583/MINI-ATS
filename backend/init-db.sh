#!/bin/bash

# Create PostgreSQL user and database
echo "Setting up PostgreSQL for Mini ATS..."

# Try to connect and setup as postgres user
sudo -u postgres psql -c "CREATE USER $(whoami) WITH CREATEDB LOGIN;"
sudo -u postgres psql -c "ALTER USER $(whoami) WITH PASSWORD 'password';"
sudo -u postgres createdb -O $(whoami) mini_ats_db

echo "Database setup complete!"
echo "User: $(whoami)"
echo "Database: mini_ats_db"