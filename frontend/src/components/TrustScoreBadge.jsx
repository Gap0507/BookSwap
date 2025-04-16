import { useState } from 'react';
import { Tooltip } from './tooltip';

const TrustScoreBadge = ({ score, size = 'md', showTooltip = true, detailed = false, components = null }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  
  // Handle undefined or null score
  const displayScore = score || 0;
  
  // Determine color based on score
  const getColor = (score) => {
    if (!score) return 'bg-gray-500';
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  };
  
  const tooltipContent = () => {
    if (!detailed) {
      return (
        <div className="p-2 max-w-xs">
          <p className="font-medium mb-1">Trust Score: {displayScore}</p>
          <p className="text-xs text-gray-200">
            Based on ratings, completed transactions, and reliability.
          </p>
        </div>
      );
    }
    
    return (
      <div className="p-3 max-w-xs">
        <p className="font-medium mb-2">Trust Score: {displayScore}</p>
        
        {components && (
          <div className="space-y-2 text-sm">
            <div>
              <p className="flex justify-between">
                <span>Average Rating:</span>
                <span className="font-medium">{components.ratingScore} pts (50%)</span>
              </p>
              <div className="w-full bg-gray-700 h-1.5 rounded-full mt-1">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full" 
                  style={{ width: `${(components.ratingScore / 50) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <p className="flex justify-between">
                <span>Completed Transactions:</span>
                <span className="font-medium">{components.transactionScore} pts (30%)</span>
              </p>
              <div className="w-full bg-gray-700 h-1.5 rounded-full mt-1">
                <div 
                  className="bg-green-500 h-1.5 rounded-full" 
                  style={{ width: `${(components.transactionScore / 30) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <p className="flex justify-between">
                <span>Cancellation Penalty:</span>
                <span className="font-medium">-{components.cancellationPenalty} pts (20%)</span>
              </p>
              <div className="w-full bg-gray-700 h-1.5 rounded-full mt-1">
                <div 
                  className="bg-red-500 h-1.5 rounded-full" 
                  style={{ width: `${(components.cancellationPenalty / 20) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-3 text-xs text-gray-300">
          <p>How to improve your score:</p>
          <ul className="list-disc pl-4 mt-1 space-y-1">
            <li>Complete more transactions successfully</li>
            <li>Maintain high ratings from other users</li>
            <li>Avoid cancelling or rejecting requests</li>
          </ul>
        </div>
      </div>
    );
  };
  
  const badge = (
    <div 
      className={`${sizeClasses[size]} ${getColor(displayScore)} rounded-full flex items-center justify-center text-white font-bold`}
      onMouseEnter={() => setTooltipOpen(true)}
      onMouseLeave={() => setTooltipOpen(false)}
    >
      {displayScore}
    </div>
  );
  
  if (!showTooltip) {
    return badge;
  }
  
  return (
    <Tooltip content={tooltipContent()} open={tooltipOpen}>
      {badge}
    </Tooltip>
  );
};

export default TrustScoreBadge;