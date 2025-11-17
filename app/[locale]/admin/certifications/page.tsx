'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Button } from '@/ui/components/ui/button';
import { Input } from '@/ui/components/ui/input';
import { Label } from '@/ui/components/ui/label';
import { Badge } from '@/ui/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, FileText, Calendar, ExternalLink, AlertCircle, ArrowUpDown, Save, X } from 'lucide-react';
import { supabase } from '@/infrastructure/supabase/client';
import { SortableList } from '@/ui/components/admin/sortable-list';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string;
  credential_url: string;
  order_index: number;
  locale: string;
  created_at: string;
}

interface CertificationFormData {
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string;
  credential_id: string;
  credential_url: string;
  order_index: number;
}

const emptyForm: CertificationFormData = {
  name: '',
  issuer: '',
  issue_date: '',
  expiry_date: '',
  credential_id: '',
  credential_url: '',
  order_index: 0,
};

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locale, setLocale] = useState<'en' | 'id'>('en');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CertificationFormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isReordering, setIsReordering] = useState(false);
  const [reorderedCertifications, setReorderedCertifications] = useState<Certification[]>([]);

  const loadCertifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('locale', locale)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setCertifications(data || []);
    } catch (error) {
      console.error('Error loading certifications:', error);
      toast.error('Failed to load certifications');
    } finally {
      setIsLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    loadCertifications();
  }, [loadCertifications]);

  const handleEdit = (certification: Certification) => {
    setEditingId(certification.id);
    setFormData({
      name: certification.name,
      issuer: certification.issuer,
      issue_date: certification.issue_date || '',
      expiry_date: certification.expiry_date || '',
      credential_id: certification.credential_id || '',
      credential_url: certification.credential_url || '',
      order_index: certification.order_index,
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
      const certificationData = {
        name: formData.name,
        issuer: formData.issuer,
        issue_date: formData.issue_date || null,
        expiry_date: formData.expiry_date || null,
        credential_id: formData.credential_id || null,
        credential_url: formData.credential_url || null,
        order_index: formData.order_index,
        locale,
      };

      if (editingId) {
        // Update existing certification
        const { error } = await supabase
          .from('certifications')
          .update(certificationData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Certification updated successfully');
      } else {
        // Create new certification
        const { error } = await supabase
          .from('certifications')
          .insert([certificationData]);

        if (error) throw error;
        toast.success('Certification created successfully');
      }

      setIsFormOpen(false);
      setFormData(emptyForm);
      setEditingId(null);
      loadCertifications();
    } catch (error) {
      console.error('Error saving certification:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save certification');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Certification deleted successfully');
      loadCertifications();
    } catch (error) {
      console.error('Error deleting certification:', error);
      toast.error('Failed to delete certification');
    }
  };

  const handleStartReorder = () => {
    setIsReordering(true);
    setReorderedCertifications([...certifications]);
  };

  const handleCancelReorder = () => {
    setIsReordering(false);
    setReorderedCertifications([]);
  };

  const handleReorder = (newItems: Certification[]) => {
    setReorderedCertifications(newItems);
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/certifications/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: reorderedCertifications.map((c) => ({
            id: c.id,
            order_index: c.order_index,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save order');
      }

      toast.success('Certification order saved successfully');
      setIsReordering(false);
      await loadCertifications();
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Failed to save order');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    const expiry = new Date(expiryDate);
    return expiry > new Date() && expiry < threeMonthsFromNow;
  };

  // Filter certifications based on search query
  const filteredCertifications = certifications.filter(certification => {
    const matchesSearch = searchQuery === '' ||
      certification.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      certification.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (certification.credential_id && certification.credential_id.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const activeCerts = certifications.filter(c => !isExpired(c.expiry_date));
  const expiredCerts = certifications.filter(c => isExpired(c.expiry_date));
  const expiringSoonCerts = certifications.filter(c => isExpiringSoon(c.expiry_date));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Certifications Management</h1>
          <p className="text-muted-foreground">
            Manage your professional certifications and credentials
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
                Add Certification
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{certifications.length}</div>
            <p className="text-sm text-muted-foreground">Total Certifications</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-500">{activeCerts.length}</div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-500">{expiringSoonCerts.length}</div>
            <p className="text-sm text-muted-foreground">Expiring Soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-500">{expiredCerts.length}</div>
            <p className="text-sm text-muted-foreground">Expired</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search certifications by name, issuer, or credential ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Certifications List */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : isReordering ? (
        <Card>
          <CardHeader>
            <CardTitle>Reorder Certifications</CardTitle>
            <CardDescription>
              Drag and drop to reorder certifications. Click &quot;Save Order&quot; when done.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SortableList
              items={reorderedCertifications}
              onReorder={handleReorder}
              renderItem={(certification) => (
                <Card>
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{certification.name}</CardTitle>
                        <CardDescription className="truncate">{certification.issuer}</CardDescription>
                        {certification.issue_date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(certification.issue_date)}
                            {certification.expiry_date && ` - ${formatDate(certification.expiry_date)}`}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">
                        #{certification.order_index}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              )}
            />
          </CardContent>
        </Card>
      ) : filteredCertifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'No certifications found' : 'No certifications yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Add your professional certifications and credentials'}
            </p>
            {searchQuery ? (
              <Button onClick={() => setSearchQuery('')} variant="outline">
                Clear Search
              </Button>
            ) : (
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCertifications.map((certification) => {
            const expired = isExpired(certification.expiry_date);
            const expiringSoon = isExpiringSoon(certification.expiry_date);

            return (
              <Card key={certification.id} className={expired ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-2">{certification.name}</CardTitle>
                      <CardDescription className="truncate">{certification.issuer}</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      #{certification.order_index}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {expired && (
                      <Badge variant="destructive" className="text-xs">
                        Expired
                      </Badge>
                    )}
                    {expiringSoon && !expired && (
                      <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Expiring Soon
                      </Badge>
                    )}
                    {!certification.expiry_date && (
                      <Badge variant="secondary" className="text-xs">
                        No Expiry
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    {certification.issue_date && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Issued: {formatDate(certification.issue_date)}</span>
                      </div>
                    )}
                    {certification.expiry_date && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Expires: {formatDate(certification.expiry_date)}</span>
                      </div>
                    )}
                    {certification.credential_id && (
                      <div className="text-muted-foreground">
                        <span className="text-xs">ID: {certification.credential_id}</span>
                      </div>
                    )}
                  </div>

                  {certification.credential_url && (
                    <a
                      href={certification.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      View Credential
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(certification)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(certification.id, certification.name)}
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingId ? 'Edit Certification' : 'Create Certification'}
              </CardTitle>
              <CardDescription>
                Fill in the certification details in {locale.toUpperCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Certification Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., AWS Certified Solutions Architect"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issuer">Issuer *</Label>
                  <Input
                    id="issuer"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="e.g., Amazon Web Services"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issue_date">Issue Date</Label>
                    <Input
                      id="issue_date"
                      type="date"
                      value={formData.issue_date}
                      onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry_date">Expiry Date (optional)</Label>
                    <Input
                      id="expiry_date"
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credential_id">Credential ID</Label>
                  <Input
                    id="credential_id"
                    value={formData.credential_id}
                    onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                    placeholder="Certification ID or Badge Number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credential_url">Credential URL</Label>
                  <Input
                    id="credential_url"
                    value={formData.credential_url}
                    onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                    placeholder="https://..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Link to verify the credential online
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
                      editingId ? 'Update Certification' : 'Create Certification'
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
