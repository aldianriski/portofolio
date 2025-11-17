'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Button } from '@/ui/components/ui/button';
import { Input } from '@/ui/components/ui/input';
import { Label } from '@/ui/components/ui/label';
import { Badge } from '@/ui/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, Award, Code, Users, ArrowUpDown, Save, X } from 'lucide-react';
import { supabase } from '@/infrastructure/supabase/client';
import { SortableList } from '@/ui/components/admin/sortable-list';

interface Skill {
  id: string;
  name: string;
  category: 'hard' | 'soft';
  subcategory: string;
  proficiency: number;
  icon: string;
  order_index: number;
  locale: string;
  created_at: string;
}

interface SkillFormData {
  name: string;
  category: 'hard' | 'soft';
  subcategory: string;
  proficiency: number;
  icon: string;
  order_index: number;
}

const emptyForm: SkillFormData = {
  name: '',
  category: 'hard',
  subcategory: '',
  proficiency: 80,
  icon: '',
  order_index: 0,
};

const hardSkillSubcategories = [
  'frontend',
  'backend',
  'mobile',
  'devops',
  'database',
  'tools',
  'cloud',
  'ai-ml',
  'other',
];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locale, setLocale] = useState<'en' | 'id'>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'hard' | 'soft'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SkillFormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [reorderedSkills, setReorderedSkills] = useState<Skill[]>([]);

  useEffect(() => {
    loadSkills();
  }, [locale]);

  const loadSkills = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('locale', locale)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error loading skills:', error);
      toast.error('Failed to load skills');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setFormData({
      name: skill.name,
      category: skill.category,
      subcategory: skill.subcategory,
      proficiency: skill.proficiency,
      icon: skill.icon,
      order_index: skill.order_index,
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
      const skillData = {
        ...formData,
        locale,
      };

      if (editingId) {
        // Update existing skill
        const { error } = await supabase
          .from('skills')
          .update(skillData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Skill updated successfully');
      } else {
        // Create new skill
        const { error } = await supabase
          .from('skills')
          .insert([skillData]);

        if (error) throw error;
        toast.success('Skill created successfully');
      }

      setIsFormOpen(false);
      setFormData(emptyForm);
      setEditingId(null);
      loadSkills();
    } catch (error: any) {
      console.error('Error saving skill:', error);
      toast.error(error.message || 'Failed to save skill');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Skill deleted successfully');
      loadSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Failed to delete skill');
    }
  };

  const handleStartReorder = () => {
    setIsReordering(true);
    setReorderedSkills([...skills]);
  };

  const handleCancelReorder = () => {
    setIsReordering(false);
    setReorderedSkills([]);
  };

  const handleReorder = (newItems: Skill[]) => {
    setReorderedSkills(newItems);
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/skills/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: reorderedSkills.map((s) => ({
            id: s.id,
            order_index: s.order_index,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save order');
      }

      toast.success('Skills order saved successfully');
      setIsReordering(false);
      await loadSkills();
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Failed to save order');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = searchQuery === '' ||
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.subcategory.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' ||
      skill.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const hardSkills = skills.filter(s => s.category === 'hard');
  const softSkills = skills.filter(s => s.category === 'soft');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Skills Management</h1>
          <p className="text-muted-foreground">
            Manage your technical and soft skills
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Locale Switcher */}
          <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
            <Button
              variant={locale === 'en' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLocale('en')}
              disabled={isReordering}
            >
              EN
            </Button>
            <Button
              variant={locale === 'id' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLocale('id')}
              disabled={isReordering}
            >
              ID
            </Button>
          </div>
          {!isReordering ? (
            <>
              <Button onClick={handleStartReorder} variant="outline" className="gap-2">
                <ArrowUpDown className="w-4 h-4" />
                Reorder
              </Button>
              <Button onClick={handleCreate} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Skill
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleCancelReorder} variant="outline" className="gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button onClick={handleSaveOrder} disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Order
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search skills by name or subcategory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={categoryFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setCategoryFilter('all')}
            size="sm"
          >
            All ({skills.length})
          </Button>
          <Button
            variant={categoryFilter === 'hard' ? 'default' : 'outline'}
            onClick={() => setCategoryFilter('hard')}
            size="sm"
          >
            Hard Skills ({skills.filter(s => s.category === 'hard').length})
          </Button>
          <Button
            variant={categoryFilter === 'soft' ? 'default' : 'outline'}
            onClick={() => setCategoryFilter('soft')}
            size="sm"
          >
            Soft Skills ({skills.filter(s => s.category === 'soft').length})
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{skills.length}</div>
            <p className="text-sm text-muted-foreground">Total Skills</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{hardSkills.length}</div>
            <p className="text-sm text-muted-foreground">Hard Skills</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-secondary">{softSkills.length}</div>
            <p className="text-sm text-muted-foreground">Soft Skills</p>
          </CardContent>
        </Card>
      </div>

      {/* Skills List */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : isReordering ? (
        <Card>
          <CardHeader>
            <CardTitle>Reorder Skills</CardTitle>
            <CardDescription>
              Drag and drop to reorder skills. Click "Save Order" when done.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SortableList
              items={reorderedSkills}
              onReorder={handleReorder}
              renderItem={(skill) => (
                <Card>
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{skill.name}</CardTitle>
                        <CardDescription className="truncate">{skill.category} - {skill.subcategory}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline">Proficiency: {skill.proficiency}%</Badge>
                        <Badge variant="outline">#{skill.order_index}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )}
            />
          </CardContent>
        </Card>
      ) : filteredSkills.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery || categoryFilter !== 'all' ? 'No skills found' : 'No skills yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first skill'}
            </p>
            {searchQuery || categoryFilter !== 'all' ? (
              <Button onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }} variant="outline">
                Clear Filters
              </Button>
            ) : (
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <Card key={skill.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {skill.icon && (
                        <span className="text-2xl">{skill.icon}</span>
                      )}
                      <CardTitle className="text-lg truncate">{skill.name}</CardTitle>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={skill.category === 'hard' ? 'default' : 'secondary'}>
                        {skill.category === 'hard' ? 'Hard Skill' : 'Soft Skill'}
                      </Badge>
                      {skill.subcategory && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {skill.subcategory}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        #{skill.order_index}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Proficiency Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Proficiency</span>
                    <span className="font-semibold">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(skill)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(skill.id, skill.name)}
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingId ? 'Edit Skill' : 'Create Skill'}
              </CardTitle>
              <CardDescription>
                Fill in the skill details in {locale.toUpperCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Skill Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., React, Leadership, Python"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({
                      ...formData,
                      category: e.target.value as 'hard' | 'soft',
                      subcategory: e.target.value === 'soft' ? '' : formData.subcategory
                    })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    required
                  >
                    <option value="hard">Hard Skill (Technical)</option>
                    <option value="soft">Soft Skill (Personal)</option>
                  </select>
                </div>

                {formData.category === 'hard' && (
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <select
                      id="subcategory"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="">Select subcategory</option>
                      {hardSkillSubcategories.map(sub => (
                        <option key={sub} value={sub} className="capitalize">
                          {sub.replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="proficiency">
                    Proficiency Level ({formData.proficiency}%)
                  </Label>
                  <Input
                    id="proficiency"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.proficiency}
                    onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Beginner</span>
                    <span>Intermediate</span>
                    <span>Expert</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (emoji or text)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="⚛️ or 🐍 or any emoji"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use an emoji or icon name
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
                      editingId ? 'Update Skill' : 'Create Skill'
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
