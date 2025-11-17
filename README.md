# Personal Portfolio - M. Aldian Rizki Lamani

> **"Leading teams to ship scalable systems in the AI era."**

A modern, bilingual portfolio website built with Next.js 15, featuring a complete admin panel for content management. Showcases professional experience, projects, skills, and provides multiple contact options.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?logo=supabase)

## ✨ Features

### 🎨 User Interface
- **Bilingual Support** - English & Bahasa Indonesia
- **Dark Mode** - System preference detection with manual toggle
- **Responsive Design** - Mobile-first approach, works on all devices
- **Smooth Animations** - Framer Motion for elegant transitions
- **Modern UI** - Built with shadcn/ui components

### 📱 Portfolio Sections
- **Hero** - Dynamic introduction with logo and CTA buttons
- **Key Expertise** - Fullstack Developer, Tech Lead, AI Experience
- **Skills** - Tech stack badges + Interactive radar chart for soft skills
- **Projects** - Featured projects with detail pages
- **Experience** - Professional timeline with achievements
- **Education & Organizations** - Academic background and involvement
- **Testimonials** - Client and colleague reviews
- **Certifications** - Professional credentials
- **Contact Form** - Form submissions saved to database

### 🔧 Admin Panel
- **Dashboard** - Statistics and quick actions
- **Content Management** - Edit all portfolio sections
- **Message Inbox** - View contact form submissions
- **Secure Authentication** - Password-protected access
- **Bilingual Content** - Manage both EN and ID versions

### 🚀 Technical Features
- **SEO Optimized** - Meta tags, Open Graph, Twitter Cards, Structured Data
- **Performance** - Optimized images, lazy loading, code splitting
- **Type Safe** - Full TypeScript implementation
- **DDD Architecture** - Clean, maintainable code structure
- **API Routes** - RESTful endpoints for all data

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Internationalization**: next-intl

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Cookie-based sessions
- **API**: Next.js API Routes
- **ORM**: Supabase Client

### DevOps
- **Hosting**: Vercel (Recommended)
- **Version Control**: Git
- **Package Manager**: npm

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/aldianriski/portofolio.git
cd portofolio
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Supabase

1. **Create a Supabase Project**
   - Go to [https://supabase.com](https://supabase.com)
   - Create a new project
   - Wait for setup to complete (~2 minutes)

2. **Run Database Migration**
   - Open Supabase SQL Editor
   - Copy contents of `supabase/migrations/20240101000000_initial_schema.sql`
   - Execute in SQL Editor

3. **Load Seed Data (Optional)**
   - Copy contents of `supabase/seed.sql`
   - Execute in SQL Editor
   - This loads dummy data for testing

### Step 4: Configure Environment Variables

Create `.env.local` file in project root:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin Authentication
ADMIN_PASSWORD=your-secure-password
```

**Get Supabase Credentials:**
- Project URL & Anon Key: Project Settings → API
- Service Role Key: Project Settings → API → Service Role

### Step 5: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en) in your browser.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Add environment variables from `.env.local`
   - Click "Deploy"

3. **Configure Custom Domain** (Optional)
   - Vercel Dashboard → Your Project → Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions
   - Update `NEXT_PUBLIC_SITE_URL` in environment variables

### Build for Production
```bash
npm run build
npm start
```

## 📂 Project Structure

```
portofolio/
├── app/                        # Next.js App Router
│   ├── [locale]/              # Locale-based routing
│   │   ├── admin/            # Admin panel pages
│   │   ├── projects/[slug]/  # Project detail pages
│   │   ├── layout.tsx        # Locale layout with metadata
│   │   ├── page.tsx          # Homepage
│   │   └── not-found.tsx     # 404 page
│   ├── api/                   # API routes
│   │   ├── admin/            # Admin authentication
│   │   ├── contact/          # Contact form
│   │   ├── projects/         # Projects data
│   │   ├── experience/       # Experience data
│   │   └── settings/         # Settings data
│   ├── robots.ts             # SEO robots.txt
│   ├── sitemap.ts            # SEO sitemap.xml
│   └── layout.tsx            # Root layout
├── config/                    # Configuration files
│   ├── i18n.ts              # Internationalization config
│   └── seo.ts               # SEO configuration
├── domain/                    # Domain entities & types
│   ├── projects/
│   ├── experience/
│   ├── skills/
│   └── ...
├── infrastructure/            # External services
│   └── supabase/            # Supabase client & repositories
├── ui/                        # UI components
│   ├── components/          # Reusable components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── layout/         # Layout components
│   │   ├── admin/          # Admin components
│   │   └── seo/            # SEO components
│   └── sections/            # Page sections
├── lib/                       # Utility functions
├── styles/                    # Global styles
├── supabase/                  # Database files
│   ├── migrations/          # SQL migrations
│   ├── seed.sql            # Seed data
│   └── README.md           # Setup instructions
├── public/                    # Static assets
└── i18n/                      # Translation files
```

## 🎯 Usage

### Admin Panel

1. **Access Admin Panel**
   - Navigate to `/en/admin` or `/id/admin`
   - Enter password (from `ADMIN_PASSWORD` env variable)

2. **Manage Content**
   - Dashboard shows statistics for all content
   - Click on any section to manage
   - Changes are saved to Supabase

3. **View Messages**
   - Navigate to Messages section
   - View contact form submissions
   - Mark messages as read

### Content Management

**Option 1: Supabase Dashboard** (Current)
- Go to your Supabase project
- Click "Table Editor"
- Edit content directly in tables

**Option 2: Admin Panel** (Basic)
- Login to admin panel
- View statistics and messages
- Full CRUD forms coming soon

### Adding Content

#### Add a New Project
```sql
INSERT INTO projects (
  slug, title, description, role, tech_stack,
  contributions, impact, featured, locale
) VALUES (
  'my-project',
  'My Awesome Project',
  'Description here...',
  'Tech Lead',
  ARRAY['Next.js', 'TypeScript', 'Tailwind'],
  'My contributions...',
  'The impact...',
  true,
  'en'
);
```

#### Add New Experience
```sql
INSERT INTO experience (
  company, position, description,
  start_date, end_date, is_current,
  location, achievements, locale
) VALUES (
  'Company Name',
  'Position Title',
  'Job description...',
  '2024-01-01',
  NULL,
  true,
  'Location',
  ARRAY['Achievement 1', 'Achievement 2'],
  'en'
);
```

## 🌍 Internationalization

### Supported Languages
- **English** (`/en`)
- **Bahasa Indonesia** (`/id`)

### Add a New Language

1. **Update i18n Config**
   ```typescript
   // config/i18n.ts
   export const locales = ['en', 'id', 'fr'] as const; // Add 'fr'
   export const localeNames = {
     en: 'English',
     id: 'Bahasa Indonesia',
     fr: 'Français', // Add French
   };
   ```

2. **Create Translation File**
   ```bash
   cp i18n/messages/en.json i18n/messages/fr.json
   # Edit fr.json with French translations
   ```

3. **Add Locale to Database**
   - Add content for new locale in all tables

## 🔒 Security

- ✅ Environment variables for sensitive data
- ✅ HTTP-only cookies for authentication
- ✅ Supabase Row Level Security (RLS)
- ✅ Input validation with Zod
- ✅ CSRF protection (Next.js built-in)
- ✅ SQL injection prevention (Supabase parameterized queries)

## 📊 Database Schema

### Tables
- `settings` - Site configuration (hero text, contact info, social links)
- `projects` - Portfolio projects
- `experience` - Work history
- `skills` - Technical and soft skills
- `testimonials` - Reviews and testimonials
- `education` - Educational background
- `certifications` - Professional certifications
- `organizations` - Organizational involvement
- `contact_messages` - Form submissions

All tables support bilingual content via `locale` column.

See `supabase/migrations/` for complete schema.

## 🎨 Customization

### Brand Colors

Edit `tailwind.config.ts`:
```typescript
colors: {
  brand: {
    blue: "#7CB9E8",    // Your primary color
    yellow: "#FFF9A6",  // Your secondary color
    red: "#FF9999",     // Your accent color
  },
}
```

### Fonts

Edit `app/[locale]/layout.tsx`:
```typescript
import { YourFont } from "next/font/google";

const yourFont = YourFont({ subsets: ["latin"] });
```

### Logo

Replace files in `/public/images/logo/` with your own logo files.

## 📈 Performance

- **Lighthouse Score Target**: >90
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with Next.js
- **Font Optimization**: next/font
- **Bundle Analysis**: Run `npm run build` to see bundle size

## 🐛 Troubleshooting

### Build Errors

**TypeScript Errors**
```bash
npm run type-check
```

**Linting Errors**
```bash
npm run lint
```

### Database Connection Issues

1. Check Supabase URL and keys in `.env.local`
2. Verify Supabase project is active
3. Check Row Level Security policies

### Dark Mode Not Working

1. Clear browser cache
2. Check ThemeProvider is wrapping app
3. Verify theme toggle button is visible

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

## 🤝 Contributing

This is a personal portfolio project. Feel free to fork and customize for your own use!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**M. Aldian Rizki Lamani**
- Website: [aldianriski.com](https://aldianriski.com)
- GitHub: [@aldianriski](https://github.com/aldianriski)
- LinkedIn: [aldianriski](https://linkedin.com/in/aldianriski)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful components
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Vercel](https://vercel.com/) - Deployment platform
- [Framer Motion](https://www.framer.com/motion/) - Animation library

---

**Built with ❤️ using Next.js & Supabase**
