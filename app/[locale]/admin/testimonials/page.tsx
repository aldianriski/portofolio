'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Button } from '@/ui/components/ui/button';
import { Input } from '@/ui/components/ui/input';
import { Label } from '@/ui/components/ui/label';
import { Textarea } from '@/ui/components/ui/textarea';
import { Badge } from '@/ui/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, MessageSquare, Star, ArrowUpDown, Save, X } from 'lucide-react';
import { supabase } from '@/infrastructure/supabase/client';
import { ImageUpload } from '@/ui/components/admin/image-upload';
import { SortableList } from '@/ui/components/admin/sortable-list';

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  avatar_url: string;
  rating: number;
  order_index: number;
  locale: string;
  created_at: string;
}

interface TestimonialFormData {
  name: string;
  position: string;
  company: string;
  content: string;
  avatar_url: string;
  rating: number;
  order_index: number;
}

const emptyForm: TestimonialFormData = {
  name: '',
  position: '',
  company: '',
  content: '',
  avatar_url: '',
  rating: 5,
  order_index: 0,
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locale, setLocale] = useState<'en' | 'id'>('en');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TestimonialFormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isReordering, setIsReordering] = useState(false);
  const [reorderedTestimonials, setReorderedTestimonials] = useState<Testimonial[]>([]);

  const loadTestimonials = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('locale', locale)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setIsLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormData({
      name: testimonial.name,
      position: testimonial.position || '',
      company: testimonial.company || '',
      content: testimonial.content,
      avatar_url: testimonial.avatar_url || '',
      rating: testimonial.rating,
      order_index: testimonial.order_index,
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
      const testimonialData = {
        name: formData.name,
        position: formData.position || null,
        company: formData.company || null,
        content: formData.content,
        avatar_url: formData.avatar_url || null,
        rating: formData.rating,
        order_index: formData.order_index,
        locale,
      };

      if (editingId) {
        // Update existing testimonial
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Testimonial updated successfully');
      } else {
        // Create new testimonial
        const { error } = await supabase
          .from('testimonials')
          .insert([testimonialData]);

        if (error) throw error;
        toast.success('Testimonial created successfully');
      }

      setIsFormOpen(false);
      setFormData(emptyForm);
      setEditingId(null);
      loadTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save testimonial');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete testimonial from "${name}"?`)) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Testimonial deleted successfully');
      loadTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  const handleStartReorder = () => {
    setIsReordering(true);
    setReorderedTestimonials([...testimonials]);
  };

  const handleCancelReorder = () => {
    setIsReordering(false);
    setReorderedTestimonials([]);
  };

  const handleReorder = (newItems: Testimonial[]) => {
    setReorderedTestimonials(newItems);
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/testimonials/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: reorderedTestimonials.map((t) => ({
            id: t.id,
            order_index: t.order_index,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save order');
      }

      toast.success('Testimonial order saved successfully');
      setIsReordering(false);
      await loadTestimonials();
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Failed to save order');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter and search testimonials
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = searchQuery === '' ||
      testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  const averageRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Testimonials Management</h1>
          <p className="text-muted-foreground">
            Manage client and colleague testimonials
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
                Add Testimonial
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
            <div className="text-2xl font-bold">{testimonials.length}</div>
            <p className="text-sm text-muted-foreground">Total Testimonials</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold flex items-center gap-2">
              {averageRating}
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{locale.toUpperCase()}</div>
            <p className="text-sm text-muted-foreground">Current Locale</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search testimonials by name, position, company, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Testimonials List */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : isReordering ? (
        <Card>
          <CardHeader>
            <CardTitle>Reorder Testimonials</CardTitle>
            <CardDescription>
              Drag and drop to reorder testimonials. Click &quot;Save Order&quot; when done.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SortableList
              items={reorderedTestimonials}
              onReorder={handleReorder}
              renderItem={(testimonial) => (
                <Card>
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-4">
                      {testimonial.avatar_url ? (
                        <div className="w-16 h-16 relative rounded-full overflow-hidden bg-muted shrink-0">
                          <Image
                            src={testimonial.avatar_url}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xl font-semibold text-primary">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{testimonial.name}</CardTitle>
                        <CardDescription className="truncate">
                          {testimonial.position}
                          {testimonial.company && ` at ${testimonial.company}`}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">#{testimonial.order_index}</Badge>
                    </div>
                  </CardHeader>
                </Card>
              )}
            />
          </CardContent>
        </Card>
      ) : filteredTestimonials.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'No testimonials found' : 'No testimonials yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? 'Try adjusting your search'
                : 'Add your first testimonial to showcase client feedback'}
            </p>
            {searchQuery ? (
              <Button onClick={() => setSearchQuery('')} variant="outline">
                Clear Search
              </Button>
            ) : (
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  {testimonial.avatar_url ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={testimonial.avatar_url}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold text-primary">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-lg truncate">{testimonial.name}</CardTitle>
                      <Badge variant="outline" className="text-xs shrink-0">
                        #{testimonial.order_index}
                      </Badge>
                    </div>
                    <CardDescription className="truncate">
                      {testimonial.position}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </CardDescription>
                    <div className="mt-2">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground italic line-clamp-4">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(testimonial)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(testimonial.id, testimonial.name)}
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
                {editingId ? 'Edit Testimonial' : 'Create Testimonial'}
              </CardTitle>
              <CardDescription>
                Fill in the testimonial details in {locale.toUpperCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Person's Name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="Job Title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Company Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Testimonial Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="What did they say about working with you?"
                    rows={5}
                    required
                  />
                </div>

                <ImageUpload
                  value={formData.avatar_url}
                  onChange={(url) => setFormData({ ...formData, avatar_url: url })}
                  folder="testimonials"
                  label="Avatar Image"
                  aspectRatio="square"
                />

                <div className="space-y-2">
                  <Label htmlFor="rating">
                    Rating ({formData.rating}/5)
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="rating"
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    {renderStars(formData.rating)}
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
                      editingId ? 'Update Testimonial' : 'Create Testimonial'
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
