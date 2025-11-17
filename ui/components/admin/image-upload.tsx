'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/ui/components/ui/button';
import { Input } from '@/ui/components/ui/input';
import { Label } from '@/ui/components/ui/label';
import { Card, CardContent } from '@/ui/components/ui/card';
import { Upload, X, Loader2, ImageIcon, Link as LinkIcon } from 'lucide-react';
import { uploadImageClient, formatFileSize, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/lib/supabase-storage';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: 'projects' | 'testimonials' | 'certifications' | 'misc';
  label?: string;
  aspectRatio?: 'square' | 'video' | 'portrait';
}

export function ImageUpload({
  value,
  onChange,
  folder = 'misc',
  label = 'Image',
  aspectRatio = 'video',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Only images (JPG, PNG, WebP, GIF) are allowed.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`);
      return;
    }

    setIsUploading(true);

    try {
      const { url } = await uploadImageClient(file, folder);
      onChange(url);
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    try {
      new URL(urlInput); // Validate URL
      onChange(urlInput);
      setUrlInput('');
      setShowUrlInput(false);
      toast.success('Image URL added!');
    } catch {
      toast.error('Invalid URL format');
    }
  };

  const handleRemove = () => {
    onChange('');
    setUrlInput('');
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {value ? (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className={`relative ${aspectRatioClasses[aspectRatio]} bg-muted`}>
              <Image
                src={value}
                alt={label}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleRemove}
                type="button"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {/* Upload Button */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowUrlInput(!showUrlInput)}
            >
              <LinkIcon className="w-4 h-4" />
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_FILE_TYPES.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* URL Input */}
          {showUrlInput && (
            <div className="flex gap-2">
              <Input
                placeholder="Or paste image URL"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
              />
              <Button type="button" onClick={handleUrlSubmit} size="sm">
                Add
              </Button>
            </div>
          )}

          {/* Preview placeholder */}
          <Card className="border-dashed">
            <CardContent className={`${aspectRatioClasses[aspectRatio]} flex items-center justify-center bg-muted/30`}>
              <div className="text-center text-muted-foreground">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No image uploaded</p>
                <p className="text-xs mt-1">Max {formatFileSize(MAX_FILE_SIZE)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
