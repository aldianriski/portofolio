'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Button } from '@/ui/components/ui/button';
import { Input } from '@/ui/components/ui/input';
import { Label } from '@/ui/components/ui/label';
import { Textarea } from '@/ui/components/ui/textarea';
import { Badge } from '@/ui/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, GraduationCap, Calendar } from 'lucide-react';
import { supabase } from '@/infrastructure/supabase/client';

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  gpa: string;
  start_date: string;
  end_date: string;
  description: string;
  order_index: number;
  locale: string;
  created_at: string;
}

interface EducationFormData {
  institution: string;
  degree: string;
  field_of_study: string;
  gpa: string;
  start_date: string;
  end_date: string;
  description: string;
  order_index: number;
}

const emptyForm: EducationFormData = {
  institution: '',
  degree: '',
  field_of_study: '',
  gpa: '',
  start_date: '',
  end_date: '',
  description: '',
  order_index: 0,
};

export default function EducationPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locale, setLocale] = useState<'en' | 'id'>('en');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EducationFormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadEducations();
  }, [locale]);

  const loadEducations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .eq('locale', locale)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setEducations(data || []);
    } catch (error) {
      console.error('Error loading education:', error);
      toast.error('Failed to load education');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (education: Education) => {
    setEditingId(education.id);
    setFormData({
      institution: education.institution,
      degree: education.degree,
      field_of_study: education.field_of_study || '',
      gpa: education.gpa || '',
      start_date: education.start_date || '',
      end_date: education.end_date || '',
      description: education.description || '',
      order_index: education.order_index,
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
      const educationData = {
        institution: formData.institution,
        degree: formData.degree,
        field_of_study: formData.field_of_study || null,
        gpa: formData.gpa || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        description: formData.description || null,
        order_index: formData.order_index,
        locale,
      };

      if (editingId) {
        // Update existing education
        const { error } = await supabase
          .from('education')
          .update(educationData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Education updated successfully');
      } else {
        // Create new education
        const { error } = await supabase
          .from('education')
          .insert([educationData]);

        if (error) throw error;
        toast.success('Education created successfully');
      }

      setIsFormOpen(false);
      setFormData(emptyForm);
      setEditingId(null);
      loadEducations();
    } catch (error: any) {
      console.error('Error saving education:', error);
      toast.error(error.message || 'Failed to save education');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, degree: string, institution: string) => {
    if (!confirm(`Are you sure you want to delete "${degree} from ${institution}"?`)) return;

    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Education deleted successfully');
      loadEducations();
    } catch (error) {
      console.error('Error deleting education:', error);
      toast.error('Failed to delete education');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Education Management</h1>
          <p className="text-muted-foreground">
            Manage your educational background
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
            Add Education
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{educations.length}</div>
            <p className="text-sm text-muted-foreground">Total Education Entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{locale.toUpperCase()}</div>
            <p className="text-sm text-muted-foreground">Current Locale</p>
          </CardContent>
        </Card>
      </div>

      {/* Education List */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : educations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No education entries yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your educational background
            </p>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {educations.map((education) => (
            <Card key={education.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{education.degree}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        #{education.order_index}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        <span className="font-medium">{education.institution}</span>
                      </div>
                      {education.field_of_study && (
                        <div className="flex items-center gap-1">
                          <span>•</span>
                          <span>{education.field_of_study}</span>
                        </div>
                      )}
                      {(education.start_date || education.end_date) && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(education.start_date) || 'N/A'}
                            {' - '}
                            {formatDate(education.end_date) || 'Present'}
                          </span>
                        </div>
                      )}
                      {education.gpa && (
                        <div className="flex items-center gap-1">
                          <Badge variant="secondary">GPA: {education.gpa}</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(education)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(education.id, education.degree, education.institution)}
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {education.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {education.description}
                  </p>
                </CardContent>
              )}
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
                {editingId ? 'Edit Education' : 'Create Education'}
              </CardTitle>
              <CardDescription>
                Fill in the education details in {locale.toUpperCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution *</Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="University or School Name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree *</Label>
                    <Input
                      id="degree"
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      placeholder="e.g., Bachelor of Science"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="field_of_study">Field of Study</Label>
                    <Input
                      id="field_of_study"
                      value={formData.field_of_study}
                      onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA</Label>
                  <Input
                    id="gpa"
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                    placeholder="e.g., 3.8/4.0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date (or Expected)</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Additional details, honors, activities, etc."
                    rows={4}
                  />
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
                    Lower numbers appear first
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
                      editingId ? 'Update Education' : 'Create Education'
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
