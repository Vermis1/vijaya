'use client';

import { useState, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  bucket?: string;
  folder?: string;
  maxSizeMB?: number;
}

export default function ImageUploader({
  onUploadComplete,
  currentImage,
  bucket = 'article-images',
  folder = 'covers',
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Formato de archivo no válido. Usa JPG, PNG, WebP o GIF.',
      };
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `El archivo es muy grande. Tamaño máximo: ${maxSizeMB}MB`,
      };
    }

    return { valid: true };
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Error comprimiendo imagen'));
              }
            },
            'image/jpeg',
            0.85 // Quality
          );
        };
        img.onerror = () => reject(new Error('Error cargando imagen'));
      };
      reader.onerror = () => reject(new Error('Error leyendo archivo'));
    });
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error || 'Archivo inválido');
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Compress image
      setProgress(20);
      const compressedFile = await compressImage(file);
      setProgress(40);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      setProgress(60);
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setProgress(80);

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path);

      setProgress(100);

      // Call callback with URL
      onUploadComplete(publicUrl);

      // Reset after short delay
      setTimeout(() => {
        setProgress(0);
      }, 1000);
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message || 'Error subiendo imagen. Intenta nuevamente.');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Label>Imagen de portada</Label>

      {/* Upload Area */}
      {!preview && (
        <div
          className={`
            relative border-2 border-dashed rounded-vijaya p-8 text-center transition-all
            ${dragActive ? 'border-vijaya-olive bg-vijaya-beige/50' : 'border-gray-300'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-vijaya-olive hover:bg-vijaya-beige/20'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto">
                <svg className="animate-spin text-vijaya-olive" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-sm text-gray-600">Subiendo imagen...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-vijaya-olive h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">{progress}%</p>
            </div>
          ) : (
            <div className="space-y-3">
              <svg
                className="w-12 h-12 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-700 font-medium">
                  Arrastra una imagen o haz clic para seleccionar
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, WebP o GIF (máx. {maxSizeMB}MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-vijaya"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-vijaya flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              Cambiar
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={removeImage}
              disabled={uploading}
            >
              Eliminar
            </Button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-vijaya bg-red-50 border border-red-200 text-red-700 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-gray-500">
        Las imágenes se comprimen automáticamente y se redimensionan a máximo 1920x1080px
      </p>
    </div>
  );
}