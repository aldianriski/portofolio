'use client';

import { useState } from 'react';
import { Button } from '@/ui/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { generateResumePDF } from '@/lib/generate-resume';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics';

interface DownloadResumeButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function DownloadResumeButton({
  className,
  variant = 'outline',
  size = 'default'
}: DownloadResumeButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      // Fetch all required data
      const [experienceRes, educationRes, skillsRes, certificationsRes, settingsRes] = await Promise.all([
        fetch('/api/experience'),
        fetch('/api/education'),
        fetch('/api/skills'),
        fetch('/api/certifications'),
        fetch('/api/settings/hero'),
      ]);

      const [experience, education, skills, certifications, settings] = await Promise.all([
        experienceRes.json(),
        educationRes.json(),
        skillsRes.json(),
        certificationsRes.json(),
        settingsRes.json(),
      ]);

      // Prepare resume data
      const resumeData = {
        name: settings.name || 'M. Aldian Rizki Lamani',
        title: settings.title || 'Fullstack Developer & Tech Lead',
        email: settings.email || 'contact@aldianriski.com',
        phone: settings.phone || '+62 xxx xxxx xxxx',
        location: settings.location || 'Indonesia',
        summary: settings.tagline || 'Leading teams to ship scalable systems in the AI era.',
        experience: experience.map((exp: any) => ({
          company: exp.company,
          position: exp.position,
          start_date: exp.start_date,
          end_date: exp.end_date,
          description: exp.description || '',
          achievements: exp.achievements || [],
        })),
        education: education.map((edu: any) => ({
          institution: edu.institution,
          degree: edu.degree,
          field_of_study: edu.field_of_study || '',
          gpa: edu.gpa || '',
          start_date: edu.start_date,
          end_date: edu.end_date,
        })),
        skills: skills.map((skill: any) => ({
          name: skill.name,
          category: skill.category,
        })),
        certifications: certifications.map((cert: any) => ({
          name: cert.name,
          issuer: cert.issuer,
          issue_date: cert.issue_date,
          expiry_date: cert.expiry_date,
        })),
      };

      // Generate PDF
      await generateResumePDF(resumeData);

      // Track download
      analytics.resumeDownload();
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      console.error('Error generating resume:', error);
      toast.error('Failed to generate resume. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isGenerating}
      variant={variant}
      size={size}
      className={className}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Download Resume
        </>
      )}
    </Button>
  );
}
