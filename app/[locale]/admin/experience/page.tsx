'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Button } from '@/ui/components/ui/button';
import { Input } from '@/ui/components/ui/input';
import { Label } from '@/ui/components/ui/label';
import { Textarea } from '@/ui/components/ui/textarea';
import { Switch } from '@/ui/components/ui/switch';
import { Badge } from '@/ui/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, Briefcase, MapPin, Calendar } from 'lucide-react';
import { supabase } from '@/infrastructure/supabase/client';

interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  location: string;
  achievements: string[];
  order_index: number;
  locale: string;
  created_at: string;
}

interface ExperienceFormData {
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  location: string;
  achievements: string;
  order_index: number;
}

const emptyForm: ExperienceFormData = {
  company: '',
  position: '',
  description: '',
  start_date: '',
  end_date: '',
  is_current: false,
  location: '',
  achievements: '',
  order_index: 0,
};

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locale, setLocale] = useState<'en' | 'id'>('en');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExperienceFormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadExperiences();
  }, [locale]);

  const loadExperiences = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .eq('locale', locale)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error('Error loading experiences:', error);
      toast.error('Failed to load experiences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditingId(experience.id);
    setFormData({
      company: experience.company,
      position: experience.position,
      description: experience.description,
      start_date: experience.start_date,
      end_date: experience.end_date || '',
      is_current: experience.is_current,
      location: experience.location,
      achievements: experience.achievements.join('\n'),
      order_index: experience.order_index,
    });
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Convert achievements from newline-separated string to array
      const achievements = formData.achievements
        .split('\n')
        .map(achievement => achievement.trim())
        .filter(achievement => achievement.length > 0);

      const experienceData = {
        company: formData.company,
        position: formData.position,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.is_current ? null : formData.end_date || null,
        is_current: formData.is_current,
        location: formData.location,
        achievements,
        order_index: formData.order_index,
        locale,
      };

      if (editingId) {
        // Update existing experience
        const { error } = await supabase
          .from('experience')
          .update(experienceData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Experience updated successfully');
      } else {
        // Create new experience
        const { error } = await supabase
          .from('experience')
          .insert([experienceData]);

        if (error) throw error;
        toast.success('Experience created successfully');
      }

      setIsFormOpen(false);
      setFormData(emptyForm);
      setEditingId(null);
      loadExperiences();
    } catch (error: any) {
      console.error('Error saving experience:', error);
      toast.error(error.message || 'Failed to save experience');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, position: string, company: string) => {
    if (!confirm(`Are you sure you want to delete "${position} at ${company}"?`)) return;

    try {
      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Experience deleted successfully');
      loadExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error('Failed to delete experience');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Experience Management</h1>
          <p className="text-muted-foreground">
            Manage your work experience timeline
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Locale Switcher */}
          <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
            <Button
              variant={locale === 'en' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLocale('en')}
            >
              EN
            </Button>
            <Button
              variant={locale === 'id' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLocale('id')}
            >
              ID
            </Button>
          </div>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Experience
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{experiences.length}</div>
            <p className="text-sm text-muted-foreground">Total Experiences</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {experiences.filter(e => e.is_current).length}
            </div>
            <p className="text-sm text-muted-foreground">Current Positions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{locale.toUpperCase()}</div>
            <p className="text-sm text-muted-foreground">Current Locale</p>
          </CardContent>
        </Card>
      </div>

      {/* Experience List */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : experiences.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No experience entries yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first work experience to build your timeline
            </p>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {experiences.map((experience) => (
            <Card key={experience.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{experience.position}</CardTitle>
                      {experience.is_current && (
                        <Badge className="bg-green-500">Current</Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        #{experience.order_index}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span className="font-medium">{experience.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{experience.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(experience.start_date)} - {formatDate(experience.end_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(experience)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(experience.id, experience.position, experience.company)}
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {experience.description}
                </p>
                {experience.achievements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Key Achievements:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {experience.achievements.map((achievement, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingId ? 'Edit Experience' : 'Create Experience'}
              </CardTitle>
              <CardDescription>
                Fill in the experience details in {locale.toUpperCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Company Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="Job Title"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Country or Remote"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Job description and responsibilities"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date {formData.is_current && '(Current)'}</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      disabled={formData.is_current}
                      required={!formData.is_current}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_current"
                    checked={formData.is_current}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_current: checked, end_date: checked ? '' : formData.end_date })}
                  />
                  <Label htmlFor="is_current">This is my current position</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="achievements">Key Achievements (one per line)</Label>
                  <Textarea
                    id="achievements"
                    value={formData.achievements}
                    onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                    placeholder="Achievement 1&#10;Achievement 2&#10;Achievement 3"
                    rows={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter each achievement on a new line
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order_index">Order Index *</Label>
                  <Input
                    id="order_index"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Lower numbers appear first in the timeline
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsFormOpen(false);
                      setFormData(emptyForm);
                      setEditingId(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving} className="flex-1">
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      editingId ? 'Update Experience' : 'Create Experience'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
