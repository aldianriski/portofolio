import { supabase } from '../client';
import type { Testimonial } from '@/domain/testimonials/types';

export class TestimonialsRepository {
  async getTestimonials(locale: string): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('locale', locale)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }

    return data || [];
  }
}

export const testimonialsRepository = new TestimonialsRepository();
