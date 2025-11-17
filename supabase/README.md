# Supabase Setup Instructions

This folder contains the database schema and seed data for the portfolio project.

## Setup Steps

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in your project details:
   - **Name**: aldian-portfolio (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your target audience
5. Wait for the project to be created (~2 minutes)

### 2. Get Your Credentials

1. Go to Project Settings > API
2. Copy the following values to your `.env.local` file:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Go to Project Settings > API > Service Role
   - Copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Run the Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire content of `migrations/20240101000000_initial_schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the migration
6. You should see "Success. No rows returned" message

### 4. Load Seed Data (Optional but Recommended)

1. In the SQL Editor, click "New Query" again
2. Copy the entire content of `seed.sql`
3. Paste it into the SQL Editor
4. Click "Run" to load the dummy data
5. You should see confirmation messages

### 5. Verify Setup

1. Go to **Table Editor** in your Supabase dashboard
2. You should see all the tables:
   - settings
   - projects
   - experience
   - skills
   - testimonials
   - education
   - certifications
   - organizations
   - contact_messages
3. Click on any table to verify that data has been loaded (if you ran the seed file)

### 6. Environment Variables

Create a `.env.local` file in the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=your-admin-password
```

## Database Schema

The database includes the following tables:

- **settings**: Configurable site-wide settings (hero text, contact info, social links)
- **projects**: Portfolio projects with bilingual support
- **experience**: Work experience timeline
- **skills**: Technical and soft skills with proficiency levels
- **testimonials**: Client/colleague testimonials
- **education**: Educational background
- **certifications**: Professional certifications
- **organizations**: Organizational involvement
- **contact_messages**: Contact form submissions

All content tables support bilingual content (English and Bahasa Indonesia) via the `locale` column.

## Row Level Security (RLS)

All tables have Row Level Security enabled with:
- **Public read access** for all content tables
- **Insert access** for contact_messages (form submissions)
- **Admin access** via service role key for CRUD operations

## Notes

- Dummy data is provided in both English (`en`) and Bahasa Indonesia (`id`)
- You can edit the data directly in the Supabase Table Editor
- For production, make sure to update all dummy content with real information
- The admin panel (to be built) will use the service role key for write operations
