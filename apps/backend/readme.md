# Initialize local database with schema

bun cfman wrangler d1 execute subarashi_db --local --file=./src/db/schema.sql

# Run dev server (uses local database automatically)

bun cfman wrangler dev

# Initialize remote production database with schema (one-time setup)

bun cfman wrangler d1 execute subarashi_db --remote --file=./src/db/schema.sql

# Deploy to production

bun cfman wrangler deploy --env production
