import { useCompare } from '../../hooks/useCompare';

export default function CompareButton({ propertyId, className = '' }) {
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const inCompare = isInCompare(propertyId);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(propertyId);
    } else {
      addToCompare(propertyId);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`compare-btn ${inCompare ? 'compare-active' : ''} ${className}`}
      title={inCompare ? 'Remove from comparison' : 'Add to comparison'}
      aria-label={inCompare ? 'Remove from comparison' : 'Add to comparison'}
    >
      {inCompare ? '✓ Compare' : '+ Compare'}
    </button>
  );
}
