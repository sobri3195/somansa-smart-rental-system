import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { photosApi } from '../../api/photosApi';
import toast from 'react-hot-toast';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

const PhotoUploader = ({ entityType, entityId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [isMain, setIsMain] = useState(false);
  const queryClient = useQueryClient();

  const uploadPhoto = useMutation({
    mutationFn: (formData) => photosApi.upload(entityType, entityId, formData),
    onSuccess: () => {
      toast.success('Photo uploaded successfully!');
      queryClient.invalidateQueries(['photos', entityType, entityId]);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.error || 'Failed to upload photo');
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }
      
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a photo');
      return;
    }
    
    const formData = new FormData();
    formData.append('photo', selectedFile);
    formData.append('entity_type', entityType);
    formData.append('entity_id', entityId);
    formData.append('caption', caption);
    formData.append('is_main', isMain ? '1' : '0');
    
    uploadPhoto.mutate(formData);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setCaption('');
    setIsMain(false);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Photo</h3>
      
      <form onSubmit={handleSubmit}>
        {/* File Input */}
        <div className="mb-4">
          <label className="block w-full">
            <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
              preview ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
            }`}>
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded"
                  />
                  <button
                    type="button"
                    onClick={resetForm}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div>
                  <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG or WebP (max 5MB)
                  </p>
                </div>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Caption */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Caption (Optional)
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Add a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        {/* Main Photo Checkbox */}
        <div className="mb-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              checked={isMain}
              onChange={(e) => setIsMain(e.target.checked)}
            />
            <span className="text-sm text-gray-700">Set as main photo</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedFile || uploadPhoto.isLoading}
          className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50"
        >
          {uploadPhoto.isLoading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </form>
    </div>
  );
};

export default PhotoUploader;
