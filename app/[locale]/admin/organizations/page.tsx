'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Button } from '@/ui/components/ui/button';
import { Input } from '@/ui/components/ui/input';
import { Label } from '@/ui/components/ui/label';
import { Textarea } from '@/ui/components/ui/textarea';
import { Badge } from '@/ui/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, Users2, Calendar } from 'lucide-react';
import { supabase } from '@/infrastructure/supabase/client';

interface Organization {
  id: string;
  name: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string;
  order_index: number;
  locale: string;
  created_at: string;
}

interface OrganizationFormData {
  name: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string;
  order_index: number;
}

const emptyForm: OrganizationFormData = {
  name: '',
  position: '',
  description: '',
  start_date: '',
  end_date: '',
  order_index: 0,
};

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locale, setLocale] = useState<'en' | 'id'>('en');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<OrganizationFormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadOrganizations();
  }, [locale]);

  const loadOrganizations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('locale', locale)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error loading organizations:', error);
      toast.error('Failed to load organizations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (organization: Organization) => {
    setEditingId(organization.id);
    setFormData({
      name: organization.name,
      position: organization.position,
      description: organization.description || '',
      start_date: organization.start_date || '',
      end_date: organization.end_date || '',
      order_index: organization.order_index,
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
      const organizationData = {
        name: formData.name,
        position: formData.position,
        description: formData.description || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        order_index: formData.order_index,
        locale,
      };

      if (editingId) {
        // Update existing organization
        const { error } = await supabase
          .from('organizations')
          .update(organizationData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Organization updated successfully');
      } else {
        // Create new organization
        const { error } = await supabase
          .from('organizations')
          .insert([organizationData]);

        if (error) throw error;
        toast.success('Organization created successfully');
      }

      setIsFormOpen(false);
      setFormData(emptyForm);
      setEditingId(null);
      loadOrganizations();
    } catch (error: any) {
      console.error('Error saving organization:', error);
      toast.error(error.message || 'Failed to save organization');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Organization deleted successfully');
      loadOrganizations();
    } catch (error) {
      console.error('Error deleting organization:', error);
      toast.error('Failed to delete organization');
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
          <h1 className="text-3xl font-bold mb-2">Organizations Management</h1>
          <p className="text-muted-foreground">
            Manage your organization memberships and involvement
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
            Add Organization
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{organizations.length}</div>
            <p className="text-sm text-muted-foreground">Total Organizations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{locale.toUpperCase()}</div>
            <p className="text-sm text-muted-foreground">Current Locale</p>
          </CardContent>
        </Card>
      </div>

      {/* Organizations List */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : organizations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No organizations yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your organization memberships and involvement
            </p>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Organization
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {organizations.map((organization) => (
            <Card key={organization.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg truncate">{organization.name}</CardTitle>
                      <Badge variant="outline" className="text-xs shrink-0">
                        #{organization.order_index}
                      </Badge>
                    </div>
                    <CardDescription className="truncate">
                      {organization.position}
                    </CardDescription>
                    {(organization.start_date || organization.end_date) && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(organization.start_date)} - {formatDate(organization.end_date)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {organization.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {organization.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(organization)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(organization.id, organization.name)}
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
                {editingId ? 'Edit Organization' : 'Create Organization'}
              </CardTitle>
              <CardDescription>
                Fill in the organization details in {locale.toUpperCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Organization Name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position/Role *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="e.g., Board Member, Volunteer, Committee Chair"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your involvement and contributions"
                    rows={4}
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
                    <Label htmlFor="end_date">End Date (leave empty if current)</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
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
                      editingId ? 'Update Organization' : 'Create Organization'
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
