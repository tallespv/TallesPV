import React, { useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  selectedImage: File | null;
  onImageSelect: (file: File | null) => void;
  labels: {
    title: string;
    dragDrop: string;
    formats: string;
    change: string;
  };
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ selectedImage, onImageSelect, labels }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full space-y-2">
      <label className="block text-sm font-medium text-slate-300">
        {labels.title}
      </label>
      
      <div
        className={`relative group border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out cursor-pointer h-64 flex flex-col items-center justify-center overflow-hidden
          ${selectedImage 
            ? 'border-indigo-500/50 bg-slate-800' 
            : 'border-slate-600 hover:border-indigo-400 hover:bg-slate-800/50 bg-slate-900/50'
          }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        {previewUrl ? (
          <>
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="h-full w-full object-contain" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <p className="text-white font-medium flex items-center gap-2">
                 <Upload size={18} /> {labels.change}
               </p>
            </div>
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors z-10"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="text-center p-6 space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-indigo-400">
              <ImageIcon size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium text-slate-200">
                {labels.dragDrop}
              </p>
              <p className="text-xs text-slate-400">
                {labels.formats}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};