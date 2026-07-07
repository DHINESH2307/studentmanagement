import { supabase, isSupabaseConfigured } from './supabase';

const BUCKET_NAME = 'student-images';

export const storageService = {
  async uploadImage(file, studentIdOrPrefix = 'avatar') {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
    if (!file) return null;

    // Validate image file type and size (< 5MB)
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload a valid image file (PNG, JPG, WEBP).');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be less than 5MB.');
    }

    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `${studentIdOrPrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return publicUrl;
  },

  async deleteImage(imageUrl) {
    if (!isSupabaseConfigured || !imageUrl) return false;
    
    try {
      // Extract path from Supabase storage URL
      const parts = imageUrl.split(`/${BUCKET_NAME}/`);
      if (parts.length === 2) {
        const filePath = decodeURIComponent(parts[1]);
        const { error } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([filePath]);
        if (error) console.error('Error deleting image from storage:', error);
        return !error;
      }
    } catch (err) {
      console.error('Failed to parse image URL for deletion:', err);
    }
    return false;
  }
};
