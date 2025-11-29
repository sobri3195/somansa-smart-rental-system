import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { photosApi } from '../../api/photosApi';
import toast from 'react-hot-toast';
import { TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const PhotoGallery = ({ entityType, entityId, canManage = false }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['photos', entityType, entityId],
    queryFn: () => photosApi.list(entityType, entityId),
    enabled: !!(entityType && entityId)
  });

  const deletePhoto = useMutation({
    mutationFn: (photoId) => photosApi.delete(photoId),
    onSuccess: () => {
      toast.success('Photo deleted successfully');
      queryClient.invalidateQueries(['photos', entityType, entityId]);
    },
    onError: (error) => {
      toast.error(error.error || 'Failed to delete photo');
    }
  });

  const photos = data?.data?.photos || [];

  const handleDelete = (photoId) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      deletePhoto.mutate(photoId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No photos yet. {canManage && 'Upload your first photo!'}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative group aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img
              src={photo.url}
              alt={photo.caption || 'Photo'}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            
            {/* Main Photo Badge */}
            {photo.is_main && (
              <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                <StarSolidIcon className="h-3 w-3" />
                <span>Main</span>
              </div>
            )}
            
            {/* Caption */}
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="text-white text-xs truncate">{photo.caption}</p>
              </div>
            )}
            
            {/* Delete Button */}
            {canManage && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(photo.id);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-4xl max-h-full">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption || 'Photo'}
              className="max-w-full max-h-[90vh] object-contain"
            />
            {selectedPhoto.caption && (
              <p className="text-white text-center mt-4">{selectedPhoto.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGallery;
