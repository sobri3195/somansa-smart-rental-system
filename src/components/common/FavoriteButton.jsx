import { useFavorites } from '../../hooks/useFavorites';

export default function FavoriteButton({ propertyId, className = '' }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(propertyId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(propertyId);
      }}
      className={`favorite-btn ${favorite ? 'favorite-active' : ''} ${className}`}
      title={favorite ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {favorite ? '❤️' : '🤍'}
    </button>
  );
}
