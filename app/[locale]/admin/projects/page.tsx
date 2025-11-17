'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Button } from '@/ui/components/ui/button';
import { Input } from '@/ui/components/ui/input';
import { Label } from '@/ui/components/ui/label';
import { Switch } from '@/ui/components/ui/switch';
import { Badge } from '@/ui/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, Image as ImageIcon, ExternalLink, Github, ArrowUpDown, Save, X, Trash, Eye } from 'lucide-react';
import { Checkbox } from '@/ui/components/ui/checkbox';
import { AlertDialog, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '@/ui/components/ui/alert-dialog';
import { supabase } from '@/infrastructure/supabase/client';
import { ImageUpload } from '@/ui/components/admin/image-upload';
import { SortableList } from '@/ui/components/admin/sortable-list';
import { ExportButton } from '@/ui/components/admin/export-button';
import { RichTextEditor } from '@/ui/components/admin/rich-text-editor';

interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  role: string;
  tech_stack: string[];
  contributions: string;
  impact: string;
  image_url: string;
  project_url: string;
  github_url: string;
  featured: boolean;
  order_index: number;
  locale: string;
  created_at: string;
}

interface ProjectFormData {
  slug: string;
  title: string;
  description: string;
  role: string;
  tech_stack: string;
  contributions: string;
  impact: string;
  image_url: string;
  project_url: string;
  github_url: string;
  featured: boolean;
  order_index: number;
}

const emptyForm: ProjectFormData = {
  slug: '',
  title: '',
  description: '',
  role: '',
  tech_stack: '',
  contributions: '',
  impact: '',
  image_url: '',
  project_url: '',
  github_url: '',
  featured: false,
  order_index: 0,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locale, setLocale] = useState<'en' | 'id'>('en');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'regular'>('all');
  const [isReordering, setIsReordering] = useState(false);
  const [reorderedProjects, setReorderedProjects] = useState<Project[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('locale', locale)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      slug: project.slug,
      title: project.title,
      description: project.description,
      role: project.role,
      tech_stack: project.tech_stack.join(', '),
      contributions: project.contributions,
      impact: project.impact,
      image_url: project.image_url,
      project_url: project.project_url,
      github_url: project.github_url,
      featured: project.featured,
      order_index: project.order_index,
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
      // Convert tech_stack from comma-separated string to array
      const tech_stack = formData.tech_stack
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0);

      const projectData = {
        ...formData,
        tech_stack,
        locale,
      };

      if (editingId) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Project updated successfully');
      } else {
        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;
        toast.success('Project created successfully');
      }

      setIsFormOpen(false);
      setFormData(emptyForm);
      setEditingId(null);
      loadProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Project deleted successfully');
      loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredProjects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProjects.map(p => p.id));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    setIsSaving(true);
    try {
      const deletePromises = selectedIds.map(id =>
        supabase.from('projects').delete().eq('id', id)
      );

      const results = await Promise.all(deletePromises);
      const errors = results.filter(r => r.error);

      if (errors.length > 0) {
        throw new Error(`Failed to delete ${errors.length} items`);
      }

      toast.success(`Deleted ${selectedIds.length} projects successfully`);
      setSelectedIds([]);
      setShowBulkDeleteConfirm(false);
      await loadProjects();
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Failed to delete some projects');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    // Create a preview project from current form data
    const preview: Project = {
      id: 'preview',
      slug: formData.slug || 'preview-slug',
      title: formData.title || 'Untitled Project',
      description: formData.description || 'No description',
      role: formData.role || 'Role',
      tech_stack: formData.tech_stack.split(',').map(t => t.trim()).filter(t => t),
      contributions: formData.contributions || 'No contributions listed',
      impact: formData.impact || 'No impact listed',
      image_url: formData.image_url || '',
      project_url: formData.project_url || '',
      github_url: formData.github_url || '',
      featured: formData.featured,
      order_index: formData.order_index,
      locale,
      created_at: new Date().toISOString(),
    };
    setPreviewProject(preview);
  };

  const handleStartReorder = () => {
    setIsReordering(true);
    setReorderedProjects([...projects]);
  };

  const handleCancelReorder = () => {
    setIsReordering(false);
    setReorderedProjects([]);
  };

  const handleReorder = (newItems: Project[]) => {
    setReorderedProjects(newItems);
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/projects/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: reorderedProjects.map((p) => ({
            id: p.id,
            order_index: p.order_index,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save order');
      }

      toast.success('Project order saved successfully');
      setIsReordering(false);
      await loadProjects();
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Failed to save order');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter and search projects
  const filteredProjects = projects.filter(project => {
    // Search filter
    const matchesSearch = searchQuery === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tech_stack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));

    // Featured filter
    const matchesFeatured = filterFeatured === 'all' ||
      (filterFeatured === 'featured' && project.featured) ||
      (filterFeatured === 'regular' && !project.featured);

    return matchesSearch && matchesFeatured;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects Management</h1>
          <p className="text-muted-foreground">
            Create and manage your portfolio projects
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
          {/* Bulk Actions */}
          {selectedIds.length > 0 && !isReordering && (
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <span className="text-sm font-medium">{selectedIds.length} selected</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowBulkDeleteConfirm(true)}
                className="gap-2"
              >
                <Trash className="w-4 h-4" />
                Delete Selected
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIds([])}
              >
                Clear
              </Button>
            </div>
          )}
          {!isReordering ? (
            <>
              <Button onClick={handleStartReorder} variant="outline" className="gap-2">
                <ArrowUpDown className="w-4 h-4" />
                Reorder
              </Button>
              <ExportButton
                data={projects}
                filename={`projects-${locale}-${new Date().toISOString().split('T')[0]}`}
              />
              <Button onClick={handleCreate} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Project
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-sm text-muted-foreground">Total Projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {projects.filter(p => p.featured).length}
            </div>
            <p className="text-sm text-muted-foreground">Featured Projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{locale.toUpperCase()}</div>
            <p className="text-sm text-muted-foreground">Current Locale</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search projects by title, description, role, or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        {/* Select All Checkbox */}
        {!isReordering && filteredProjects.length > 0 && (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedIds.length === filteredProjects.length && filteredProjects.length > 0}
              onCheckedChange={handleSelectAll}
              id="select-all"
            />
            <Label htmlFor="select-all" className="text-sm cursor-pointer">
              Select All ({filteredProjects.length})
            </Label>
          </div>
        )}
        <div className="flex gap-2">
          <Button
            variant={filterFeatured === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterFeatured('all')}
            size="sm"
          >
            All ({projects.length})
          </Button>
          <Button
            variant={filterFeatured === 'featured' ? 'default' : 'outline'}
            onClick={() => setFilterFeatured('featured')}
            size="sm"
          >
            Featured ({projects.filter(p => p.featured).length})
          </Button>
          <Button
            variant={filterFeatured === 'regular' ? 'default' : 'outline'}
            onClick={() => setFilterFeatured('regular')}
            size="sm"
          >
            Regular ({projects.filter(p => !p.featured).length})
          </Button>
        </div>
      </div>

      {/* Projects List */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : isReordering ? (
        <Card>
          <CardHeader>
            <CardTitle>Reorder Projects</CardTitle>
            <CardDescription>
              Drag and drop to reorder projects. Click &quot;Save Order&quot; when done.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SortableList
              items={reorderedProjects}
              onReorder={handleReorder}
              renderItem={(project) => (
                <Card>
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-4">
                      {project.image_url && (
                        <div className="w-16 h-16 relative rounded overflow-hidden bg-muted shrink-0">
                          <Image
                            src={project.image_url}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{project.title}</CardTitle>
                        <CardDescription className="truncate">{project.role}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {project.featured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                        <Badge variant="outline">#{project.order_index}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )}
            />
          </CardContent>
        </Card>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery || filterFeatured !== 'all' ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterFeatured !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first project to showcase your work'}
            </p>
            {searchQuery || filterFeatured !== 'all' ? (
              <Button onClick={() => { setSearchQuery(''); setFilterFeatured('all'); }} variant="outline">
                Clear Filters
              </Button>
            ) : (
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden relative">
              {!isReordering && (
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={selectedIds.includes(project.id)}
                    onCheckedChange={() => handleSelectOne(project.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              {project.image_url && (
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {project.featured && (
                    <Badge className="absolute top-2 right-2 z-10">Featured</Badge>
                  )}
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{project.title}</CardTitle>
                    <CardDescription className="truncate">{project.role}</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">
                    #{project.order_index}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>

                {project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.tech_stack.slice(0, 3).map((tech, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.tech_stack.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.tech_stack.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(project)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(project.id, project.title)}
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
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingId ? 'Edit Project' : 'Create Project'}
              </CardTitle>
              <CardDescription>
                Fill in the project details in {locale.toUpperCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="project-slug"
                      required
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
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Project Title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Lead Developer, Full Stack Developer"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <RichTextEditor
                    content={formData.description}
                    onChange={(html) => setFormData({ ...formData, description: html })}
                    placeholder="Project description with rich formatting..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tech_stack">Tech Stack (comma-separated) *</Label>
                  <Input
                    id="tech_stack"
                    value={formData.tech_stack}
                    onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                    placeholder="React, TypeScript, Node.js, PostgreSQL"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contributions">Contributions</Label>
                  <RichTextEditor
                    content={formData.contributions}
                    onChange={(html) => setFormData({ ...formData, contributions: html })}
                    placeholder="What did you contribute to this project?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="impact">Impact</Label>
                  <RichTextEditor
                    content={formData.impact}
                    onChange={(html) => setFormData({ ...formData, impact: html })}
                    placeholder="What impact did this project have?"
                  />
                </div>

                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  folder="projects"
                  label="Project Image"
                  aspectRatio="video"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project_url">Project URL</Label>
                    <Input
                      id="project_url"
                      value={formData.project_url}
                      onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                      placeholder="https://project.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github_url">GitHub URL</Label>
                    <Input
                      id="github_url"
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      placeholder="https://github.com/user/repo"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Featured Project</Label>
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
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handlePreview}
                    className="gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                  <Button type="submit" disabled={isSaving} className="flex-1">
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      editingId ? 'Update Project' : 'Create Project'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Preview Dialog */}
      {previewProject && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Project Preview</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewProject(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Preview Content */}
              {previewProject.image_url && (
                <div className="aspect-video bg-muted relative overflow-hidden rounded-lg mb-6">
                  <Image
                    src={previewProject.image_url}
                    alt={previewProject.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                  />
                  {previewProject.featured && (
                    <Badge className="absolute top-4 right-4">Featured</Badge>
                  )}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{previewProject.title}</h1>
                  <p className="text-lg text-muted-foreground">{previewProject.role}</p>
                </div>

                {previewProject.tech_stack.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {previewProject.tech_stack.map((tech, i) => (
                        <Badge key={i} variant="secondary">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold mb-2">Description</h3>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: previewProject.description }}
                  />
                </div>

                {previewProject.contributions && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Contributions</h3>
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: previewProject.contributions }}
                    />
                  </div>
                )}

                {previewProject.impact && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Impact</h3>
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: previewProject.impact }}
                    />
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  {previewProject.project_url && (
                    <Button asChild>
                      <a href={previewProject.project_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Project
                      </a>
                    </Button>
                  )}
                  {previewProject.github_url && (
                    <Button variant="outline" asChild>
                      <a href={previewProject.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
            <CardContent className="border-t p-4 bg-muted">
              <Button onClick={() => setPreviewProject(null)} className="w-full">
                Close Preview
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={showBulkDeleteConfirm} onOpenChange={setShowBulkDeleteConfirm}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {selectedIds.length} Projects?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the selected projects.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowBulkDeleteConfirm(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleBulkDelete}
            disabled={isSaving}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isSaving ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    </div>
  );
}
