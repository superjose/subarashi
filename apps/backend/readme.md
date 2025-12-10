# Initialize local database with schema

bun cfman wrangler d1 execute subarashi_db --local --file=./src/db/schema.sql

# Run dev server (uses local database automatically)

bun cfman wrangler dev

# Initialize remote production database with schema (one-time setup)

bun cfman wrangler d1 execute subarashi_db --remote --file=./src/db/schema.sql

# Deploy to production

bun cfman wrangler deploy --env production

# Upload a single file

cd apps/backend
wrangler r2 object put subarashi-subs/GYQ4MW246/G6Q4MK3GR.ass \
 --file=../extension/static/G6Q4MK3GR.ass \
 --local

# Upload with a different series/chapter

wrangler r2 object put subarashi-subs/SERIES_ID/CHAPTER_ID.ass \
 --file=/path/to/your/subtitle.ass \
 --local
