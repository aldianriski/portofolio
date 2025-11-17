# Personal Portfolio PRD – M. ALDIAN RIZKI LAMANI

## 1. Tagline

**“Leading teams to ship scalable systems in the AI era.”**

---

## 2. Project Overview

* **Name:** Personal Portfolio – M. ALDIAN RIZKI LAMANI
* **Role:** Fullstack Developer & Tech Lead
* **Objective:** Build a mobile-first, bilingual, scalable portfolio website highlighting leadership, system design capability, fullstack engineering, and experience with AI.
* **Tech Stack:** Next.js 15, React, TypeScript (strict), Tailwind CSS, shadcn/ui, Supabase, Framer Motion, Vercel.

---

## 3. Goals & Target Audience

### Primary Goals

1. Showcase key project case studies.
2. Provide clear contact paths (WhatsApp, email, form).
3. Grow professional network.

### Target Audience

* HR/Recruiters
* Engineering Managers / CTOs
* Potential clients
* Community / colleagues

---

## 4. Brand & Content Strategy

### Brand Personality

* Minimalist & straight to the point
* Techy/geeky
* Professional but youthful

### Visual Identity

* **Colors:** Soft Blue (primary), Soft Yellow (secondary), Soft Red (highlight)
* **Typography:** Custom "Aldian Riski" wordmark + clean modern font

### Language

* Bilingual: **Bahasa Indonesia & English**
* Route structure: `/[locale]/*`

---

## 5. Information Architecture

### Main Pages

* Home (`/[locale]`)
* Project Detail: `/[locale]/projects/[slug]`
* Simple legal pages (optional)

### Home Sections

1. Hero
2. Key Expertise
3. Skills (hard & soft)
4. Projects
5. Experience Timeline
6. Education & Organizations
7. Testimonials
8. Certifications
9. Contact

---

## 6. Section Details

### Hero

* Name, title (Fullstack Developer & Tech Lead)
* Tagline
* Short bilingual intro
* CTAs: View Projects, Contact

### Key Expertise

* **Fullstack Developer**

  * Build frontend and backend systems, scalable architecture
* **Tech Lead**

  * Lead teams, design systems, ensure quality & roadmap alignment
* **Experience with AI**

  * Utilize ChatGPT & Claude for code acceleration and architectural exploration

### Skills

#### Hard Skills

* **Frontend & Frameworks:** Nuxt.js, Vue.js, Next.js, React.js, HTML, CSS, TS, JS
* **Backend:** Node.js, Golang, MongoDB, Supabase
* **Tools & Process:** UML, Figma, Git, Agile
* **AI Tools:** ChatGPT, Claude

#### Soft Skills

* Leadership
* Communication
* System thinking
* Problem solving
* Collaboration

### Projects

(Replace dummy content later)

* 3–6 featured projects with: name, role, tech stack, contributions, impact.

### Experience Timeline

* Tech Lead – Initiative (2024–Now)
* Tech Lead – PaxelMarket (2022–2023)
* Frontend Developer – Global Unggul Mandiri (2019–2022)
* Web Developer – Karya Libra Utama (2017–2018)
* IT Support – Lodaya Makmur Perkasa (2015)

### Education & Organizations

* University + GPA
* High School
* OSIS Ketua, HIMATEKINFO Divisi Riset & Teknologi

### Testimonials (Dummy)

* “Aldian balances technical depth and leadership effectively.” – Dummy Manager
* “Strong ownership and long-term thinking.” – Dummy PM

### Certifications

* Junior Web Programmer – SKKNI (2018–2020)

### Contact

* Contact form
* WhatsApp button
* Configurable working status
* Social links

---

## 7. UX, Animations & Components

* Medium animations (Framer Motion)
* Flat vector style
* Playful shapes
* Dark mode
* Timeline component
* Radar skill chart
* Smooth transitions

---

## 8. Technical Architecture

### Folder Structure (DDD + Clean Architecture)

```
src/
  app/
    [locale]/
      page.tsx
      projects/[slug]/page.tsx
      api/contact/route.ts
  domain/
    projects/
    experience/
    skills/
    testimonials/
    settings/
  application/
    projects/usecases/
    experience/usecases/
  infrastructure/
    supabase/
  ui/
    components/
    sections/
    charts/
  config/
  styles/
```

---

## 9. CMS / Supabase Schema (Simplified)

### Tables

* `settings`
* `projects`
* `experience`
* `skills`
* `testimonials`
* `education`
* `certifications`
* `organizations`

All bilingual via `locale` column.

---

## 10. SEO & Performance

### SEO

* Dynamic metadata per locale
* SEO keywords: Fullstack Developer Indonesia, Tech Lead Indonesia, Nuxt Developer, Next.js Developer
* Open Graph images
* Structured data for `Person` and `Project`

### Performance

* Optimize images
* Medium animations only
* Lighthouse target: >90 mobile

---

## 11. Contact Form

* API route handler
* Email sending or Supabase message storage
* Toast UI for success/error

---

## 12. Configurable Content

All editable from Supabase including:

* Hero, intro, tagline
* Skills
* Projects
* Experience
* Certifications
* Testimonials
* Social links
* Working status

---
