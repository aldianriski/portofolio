-- Seed Data for Portfolio
-- This file contains dummy data for development and testing

-- Settings (English)
INSERT INTO settings (key, value, locale) VALUES
('hero_name', 'M. ALDIAN RIZKI LAMANI', 'en'),
('hero_title', 'Fullstack Developer & Tech Lead', 'en'),
('hero_tagline', 'Leading teams to ship scalable systems in the AI era.', 'en'),
('hero_description', 'Experienced fullstack developer specializing in building scalable web applications and leading engineering teams to deliver high-quality solutions.', 'en'),
('contact_email', 'aldian@example.com', 'en'),
('contact_phone', '+62 812-3456-7890', 'en'),
('contact_whatsapp', '+6281234567890', 'en'),
('working_status', 'available', 'en'),
('github_url', 'https://github.com/aldianriski', 'en'),
('linkedin_url', 'https://linkedin.com/in/aldianriski', 'en'),
('twitter_url', 'https://twitter.com/aldianriski', 'en');

-- Settings (Bahasa Indonesia)
INSERT INTO settings (key, value, locale) VALUES
('hero_name', 'M. ALDIAN RIZKI LAMANI', 'id'),
('hero_title', 'Fullstack Developer & Tech Lead', 'id'),
('hero_tagline', 'Memimpin tim untuk menghadirkan sistem yang scalable di era AI.', 'id'),
('hero_description', 'Fullstack developer berpengalaman yang berspesialisasi dalam membangun aplikasi web scalable dan memimpin tim engineering untuk menghadirkan solusi berkualitas tinggi.', 'id'),
('contact_email', 'aldian@example.com', 'id'),
('contact_phone', '+62 812-3456-7890', 'id'),
('contact_whatsapp', '+6281234567890', 'id'),
('working_status', 'available', 'id'),
('github_url', 'https://github.com/aldianriski', 'id'),
('linkedin_url', 'https://linkedin.com/in/aldianriski', 'id'),
('twitter_url', 'https://twitter.com/aldianriski', 'id');

-- Projects (English)
INSERT INTO projects (slug, title, description, role, tech_stack, contributions, impact, featured, order_index, locale) VALUES
('paxelmarket-platform', 'PaxelMarket E-commerce Platform', 'A comprehensive e-commerce platform connecting sellers with buyers, featuring real-time inventory management and payment integration.', 'Tech Lead', ARRAY['Next.js', 'React', 'Node.js', 'MongoDB', 'Redis'], 'Led team of 5 engineers, designed scalable microservices architecture, implemented real-time features', 'Increased platform performance by 40%, reduced server costs by 30%, served 100K+ active users', true, 1, 'en'),
('initiative-crm', 'Initiative CRM System', 'Customer Relationship Management system with advanced analytics and automation features.', 'Tech Lead & Fullstack Developer', ARRAY['Vue.js', 'Nuxt.js', 'Golang', 'PostgreSQL', 'Docker'], 'Full system architecture, API design, frontend development, team leadership', 'Improved customer retention by 25%, automated 60% of manual processes', true, 2, 'en'),
('global-dashboard', 'Global Unggul Analytics Dashboard', 'Real-time analytics dashboard for business intelligence and reporting.', 'Frontend Developer', ARRAY['Vue.js', 'Chart.js', 'REST API', 'Vuex'], 'Built interactive visualizations, implemented complex filtering, optimized performance', 'Reduced report generation time from hours to seconds', true, 3, 'en'),
('karya-libra-website', 'Karya Libra Corporate Website', 'Modern corporate website with content management system.', 'Web Developer', ARRAY['HTML', 'CSS', 'JavaScript', 'WordPress', 'PHP'], 'Designed and developed responsive website, integrated CMS', 'Increased web traffic by 150%, improved SEO rankings', false, 4, 'en');

-- Projects (Bahasa Indonesia)
INSERT INTO projects (slug, title, description, role, tech_stack, contributions, impact, featured, order_index, locale) VALUES
('paxelmarket-platform', 'Platform E-commerce PaxelMarket', 'Platform e-commerce komprehensif yang menghubungkan penjual dengan pembeli, dilengkapi manajemen inventori real-time dan integrasi pembayaran.', 'Tech Lead', ARRAY['Next.js', 'React', 'Node.js', 'MongoDB', 'Redis'], 'Memimpin tim 5 engineers, merancang arsitektur microservices yang scalable, mengimplementasikan fitur real-time', 'Meningkatkan performa platform 40%, mengurangi biaya server 30%, melayani 100K+ pengguna aktif', true, 1, 'id'),
('initiative-crm', 'Sistem CRM Initiative', 'Sistem Customer Relationship Management dengan fitur analitik dan otomasi canggih.', 'Tech Lead & Fullstack Developer', ARRAY['Vue.js', 'Nuxt.js', 'Golang', 'PostgreSQL', 'Docker'], 'Arsitektur sistem lengkap, desain API, pengembangan frontend, kepemimpinan tim', 'Meningkatkan retensi pelanggan 25%, mengotomatisasi 60% proses manual', true, 2, 'id'),
('global-dashboard', 'Dashboard Analitik Global Unggul', 'Dashboard analitik real-time untuk business intelligence dan pelaporan.', 'Frontend Developer', ARRAY['Vue.js', 'Chart.js', 'REST API', 'Vuex'], 'Membangun visualisasi interaktif, mengimplementasikan filtering kompleks, optimasi performa', 'Mengurangi waktu pembuatan laporan dari jam menjadi detik', true, 3, 'id'),
('karya-libra-website', 'Website Korporat Karya Libra', 'Website korporat modern dengan sistem manajemen konten.', 'Web Developer', ARRAY['HTML', 'CSS', 'JavaScript', 'WordPress', 'PHP'], 'Merancang dan mengembangkan website responsif, integrasi CMS', 'Meningkatkan traffic web 150%, memperbaiki ranking SEO', false, 4, 'id');

-- Experience (English)
INSERT INTO experience (company, position, description, start_date, end_date, is_current, location, achievements, order_index, locale) VALUES
('Initiative', 'Tech Lead', 'Leading engineering team to build scalable CRM solutions', '2024-01-01', NULL, true, 'Jakarta, Indonesia', ARRAY['Built microservices architecture', 'Reduced technical debt by 40%', 'Implemented CI/CD pipeline'], 1, 'en'),
('PaxelMarket', 'Tech Lead', 'Led team to develop e-commerce platform serving 100K+ users', '2022-01-01', '2023-12-31', false, 'Jakarta, Indonesia', ARRAY['Scaled system to handle 10x traffic', 'Improved deployment frequency by 300%', 'Mentored 5 junior developers'], 2, 'en'),
('Global Unggul Mandiri', 'Frontend Developer', 'Developed complex web applications and dashboards', '2019-01-01', '2021-12-31', false, 'Jakarta, Indonesia', ARRAY['Built 15+ production applications', 'Improved page load time by 60%', 'Introduced Vue.js to the team'], 3, 'en'),
('Karya Libra Utama', 'Web Developer', 'Created responsive websites and web applications', '2017-01-01', '2018-12-31', false, 'Jakarta, Indonesia', ARRAY['Delivered 20+ client projects', 'Maintained 99.9% uptime', 'Implemented SEO best practices'], 4, 'en'),
('Lodaya Makmur Perkasa', 'IT Support', 'Provided technical support and maintained IT infrastructure', '2015-06-01', '2015-12-31', false, 'Jakarta, Indonesia', ARRAY['Resolved 500+ support tickets', 'Maintained network infrastructure', 'Trained 50+ users'], 5, 'en');

-- Experience (Bahasa Indonesia)
INSERT INTO experience (company, position, description, start_date, end_date, is_current, location, achievements, order_index, locale) VALUES
('Initiative', 'Tech Lead', 'Memimpin tim engineering untuk membangun solusi CRM yang scalable', '2024-01-01', NULL, true, 'Jakarta, Indonesia', ARRAY['Membangun arsitektur microservices', 'Mengurangi technical debt 40%', 'Mengimplementasikan CI/CD pipeline'], 1, 'id'),
('PaxelMarket', 'Tech Lead', 'Memimpin tim mengembangkan platform e-commerce yang melayani 100K+ pengguna', '2022-01-01', '2023-12-31', false, 'Jakarta, Indonesia', ARRAY['Menskalakan sistem untuk menangani 10x traffic', 'Meningkatkan frekuensi deployment 300%', 'Membimbing 5 junior developer'], 2, 'id'),
('Global Unggul Mandiri', 'Frontend Developer', 'Mengembangkan aplikasi web dan dashboard yang kompleks', '2019-01-01', '2021-12-31', false, 'Jakarta, Indonesia', ARRAY['Membangun 15+ aplikasi produksi', 'Meningkatkan kecepatan loading halaman 60%', 'Memperkenalkan Vue.js ke tim'], 3, 'id'),
('Karya Libra Utama', 'Web Developer', 'Membuat website dan aplikasi web responsif', '2017-01-01', '2018-12-31', false, 'Jakarta, Indonesia', ARRAY['Menyelesaikan 20+ proyek klien', 'Mempertahankan uptime 99.9%', 'Mengimplementasikan SEO best practices'], 4, 'id'),
('Lodaya Makmur Perkasa', 'IT Support', 'Memberikan dukungan teknis dan memelihara infrastruktur IT', '2015-06-01', '2015-12-31', false, 'Jakarta, Indonesia', ARRAY['Menyelesaikan 500+ tiket support', 'Memelihara infrastruktur jaringan', 'Melatih 50+ pengguna'], 5, 'id');

-- Skills - Hard Skills (English)
INSERT INTO skills (name, category, subcategory, proficiency, order_index, locale) VALUES
('Next.js', 'hard', 'frontend', 90, 1, 'en'),
('React.js', 'hard', 'frontend', 90, 2, 'en'),
('Vue.js', 'hard', 'frontend', 85, 3, 'en'),
('Nuxt.js', 'hard', 'frontend', 85, 4, 'en'),
('TypeScript', 'hard', 'frontend', 88, 5, 'en'),
('JavaScript', 'hard', 'frontend', 90, 6, 'en'),
('HTML/CSS', 'hard', 'frontend', 95, 7, 'en'),
('Tailwind CSS', 'hard', 'frontend', 90, 8, 'en'),
('Node.js', 'hard', 'backend', 85, 9, 'en'),
('Golang', 'hard', 'backend', 75, 10, 'en'),
('MongoDB', 'hard', 'backend', 80, 11, 'en'),
('PostgreSQL', 'hard', 'backend', 78, 12, 'en'),
('Supabase', 'hard', 'backend', 85, 13, 'en'),
('Git', 'hard', 'tools', 90, 14, 'en'),
('Docker', 'hard', 'tools', 75, 15, 'en'),
('Figma', 'hard', 'tools', 70, 16, 'en'),
('ChatGPT', 'hard', 'ai', 88, 17, 'en'),
('Claude', 'hard', 'ai', 88, 18, 'en');

-- Skills - Soft Skills (English)
INSERT INTO skills (name, category, subcategory, proficiency, order_index, locale) VALUES
('Leadership', 'soft', NULL, 85, 1, 'en'),
('Communication', 'soft', NULL, 88, 2, 'en'),
('System Thinking', 'soft', NULL, 90, 3, 'en'),
('Problem Solving', 'soft', NULL, 92, 4, 'en'),
('Collaboration', 'soft', NULL, 87, 5, 'en'),
('Agile Methodology', 'soft', NULL, 85, 6, 'en');

-- Skills - Hard Skills (Bahasa Indonesia)
INSERT INTO skills (name, category, subcategory, proficiency, order_index, locale) VALUES
('Next.js', 'hard', 'frontend', 90, 1, 'id'),
('React.js', 'hard', 'frontend', 90, 2, 'id'),
('Vue.js', 'hard', 'frontend', 85, 3, 'id'),
('Nuxt.js', 'hard', 'frontend', 85, 4, 'id'),
('TypeScript', 'hard', 'frontend', 88, 5, 'id'),
('JavaScript', 'hard', 'frontend', 90, 6, 'id'),
('HTML/CSS', 'hard', 'frontend', 95, 7, 'id'),
('Tailwind CSS', 'hard', 'frontend', 90, 8, 'id'),
('Node.js', 'hard', 'backend', 85, 9, 'id'),
('Golang', 'hard', 'backend', 75, 10, 'id'),
('MongoDB', 'hard', 'backend', 80, 11, 'id'),
('PostgreSQL', 'hard', 'backend', 78, 12, 'id'),
('Supabase', 'hard', 'backend', 85, 13, 'id'),
('Git', 'hard', 'tools', 90, 14, 'id'),
('Docker', 'hard', 'tools', 75, 15, 'id'),
('Figma', 'hard', 'tools', 70, 16, 'id'),
('ChatGPT', 'hard', 'ai', 88, 17, 'id'),
('Claude', 'hard', 'ai', 88, 18, 'id');

-- Skills - Soft Skills (Bahasa Indonesia)
INSERT INTO skills (name, category, subcategory, proficiency, order_index, locale) VALUES
('Kepemimpinan', 'soft', NULL, 85, 1, 'id'),
('Komunikasi', 'soft', NULL, 88, 2, 'id'),
('Pemikiran Sistematis', 'soft', NULL, 90, 3, 'id'),
('Pemecahan Masalah', 'soft', NULL, 92, 4, 'id'),
('Kolaborasi', 'soft', NULL, 87, 5, 'id'),
('Metodologi Agile', 'soft', NULL, 85, 6, 'id');

-- Testimonials (English)
INSERT INTO testimonials (name, position, company, content, rating, order_index, locale) VALUES
('Sarah Johnson', 'Engineering Manager', 'TechCorp', 'Aldian balances technical depth and leadership effectively. His ability to guide the team while maintaining code quality is exceptional.', 5, 1, 'en'),
('Michael Chen', 'Product Manager', 'PaxelMarket', 'Strong ownership and long-term thinking. Aldian always considers the bigger picture and delivers solutions that scale.', 5, 2, 'en'),
('Jessica Williams', 'CTO', 'StartupXYZ', 'One of the best tech leads I have worked with. Great communicator, excellent technical skills, and a true team player.', 5, 3, 'en');

-- Testimonials (Bahasa Indonesia)
INSERT INTO testimonials (name, position, company, content, rating, order_index, locale) VALUES
('Sarah Johnson', 'Engineering Manager', 'TechCorp', 'Aldian menyeimbangkan kedalaman teknis dan kepemimpinan dengan efektif. Kemampuannya membimbing tim sambil menjaga kualitas kode sangat luar biasa.', 5, 1, 'id'),
('Michael Chen', 'Product Manager', 'PaxelMarket', 'Ownership yang kuat dan pemikiran jangka panjang. Aldian selalu mempertimbangkan gambaran besar dan menghadirkan solusi yang scalable.', 5, 2, 'id'),
('Jessica Williams', 'CTO', 'StartupXYZ', 'Salah satu tech lead terbaik yang pernah saya ajak bekerja. Komunikator hebat, keahlian teknis yang excellent, dan team player sejati.', 5, 3, 'id');

-- Education (English)
INSERT INTO education (institution, degree, field_of_study, gpa, start_date, end_date, description, order_index, locale) VALUES
('University of Technology Indonesia', 'Bachelor of Computer Science', 'Informatics Engineering', '3.75', '2013-09-01', '2017-06-30', 'Focused on software engineering, data structures, and algorithms', 1, 'en'),
('SMA Negeri 1 Jakarta', 'High School Diploma', 'Science', '89.5', '2010-07-01', '2013-06-30', 'Mathematics and Natural Sciences track', 2, 'en');

-- Education (Bahasa Indonesia)
INSERT INTO education (institution, degree, field_of_study, gpa, start_date, end_date, description, order_index, locale) VALUES
('Universitas Teknologi Indonesia', 'Sarjana Ilmu Komputer', 'Teknik Informatika', '3.75', '2013-09-01', '2017-06-30', 'Fokus pada software engineering, struktur data, dan algoritma', 1, 'id'),
('SMA Negeri 1 Jakarta', 'Ijazah SMA', 'IPA', '89.5', '2010-07-01', '2013-06-30', 'Jurusan Matematika dan Ilmu Pengetahuan Alam', 2, 'id');

-- Organizations (English)
INSERT INTO organizations (name, position, description, start_date, end_date, order_index, locale) VALUES
('HIMATEKINFO', 'Research & Technology Division', 'Led research initiatives and technology workshops for computer science students', '2015-01-01', '2016-12-31', 1, 'en'),
('OSIS', 'Student Council President', 'Organized school events and represented student body in school decisions', '2012-07-01', '2013-06-30', 2, 'en');

-- Organizations (Bahasa Indonesia)
INSERT INTO organizations (name, position, description, start_date, end_date, order_index, locale) VALUES
('HIMATEKINFO', 'Divisi Riset & Teknologi', 'Memimpin inisiatif riset dan workshop teknologi untuk mahasiswa ilmu komputer', '2015-01-01', '2016-12-31', 1, 'id'),
('OSIS', 'Ketua OSIS', 'Mengorganisir acara sekolah dan mewakili siswa dalam keputusan sekolah', '2012-07-01', '2013-06-30', 2, 'id');

-- Certifications (English)
INSERT INTO certifications (name, issuer, issue_date, expiry_date, credential_id, order_index, locale) VALUES
('Junior Web Programmer', 'SKKNI (Indonesian Professional Certification Authority)', '2018-06-01', '2020-06-01', 'SKKNI-2018-JWP-001', 1, 'en');

-- Certifications (Bahasa Indonesia)
INSERT INTO certifications (name, issuer, issue_date, expiry_date, credential_id, order_index, locale) VALUES
('Junior Web Programmer', 'SKKNI (Standar Kompetensi Kerja Nasional Indonesia)', '2018-06-01', '2020-06-01', 'SKKNI-2018-JWP-001', 1, 'id');
