import { useMemo } from 'react';

const statusSteps = [
  { key: 'submitted', label: 'Submitted', icon: '📝' },
  { key: 'confirmed', label: 'Confirmed', icon: '✓' },
  { key: 'payment', label: 'Payment', icon: '💳' },
  { key: 'processing', label: 'Processing', icon: '⚙️' },
  { key: 'ready', label: 'Ready', icon: '✨' },
];

export default function BookingTimeline({ status = 'submitted', history = [] }) {
  const currentStepIndex = useMemo(() => {
    const idx = statusSteps.findIndex(step => step.key === status);
    return idx >= 0 ? idx : 0;
  }, [status]);

  return (
    <div className="booking-timeline">
      <h3>📊 Booking Status Timeline</h3>
      
      <div className="timeline">
        {statusSteps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div 
              key={step.key} 
              className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isPending ? 'pending' : ''}`}
            >
              <div className="step-connector">
                {index > 0 && (
                  <div className={`connector-line ${isCompleted ? 'completed' : ''}`}></div>
                )}
              </div>
              
              <div className="step-marker">
                <div className="step-icon">
                  {isCompleted && '✓'}
                  {isCurrent && step.icon}
                  {isPending && '○'}
                </div>
              </div>
              
              <div className="step-content">
                <div className="step-label">{step.label}</div>
                {history[index] && (
                  <div className="step-time">{new Date(history[index]).toLocaleDateString('id-ID')}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="timeline-progress">
        <div 
          className="progress-bar"
          style={{ width: `${((currentStepIndex + 1) / statusSteps.length) * 100}%` }}
        >
          <span className="progress-text">
            {Math.round(((currentStepIndex + 1) / statusSteps.length) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
