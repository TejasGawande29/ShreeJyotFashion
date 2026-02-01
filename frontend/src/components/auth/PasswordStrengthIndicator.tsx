import React, { useState, useEffect } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

export default function PasswordStrengthIndicator({ 
  password, 
  showRequirements = true 
}: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState<'weak' | 'fair' | 'good' | 'strong'>('weak');
  const [score, setScore] = useState(0);

  const requirements: PasswordRequirement[] = [
    {
      label: 'At least 8 characters',
      test: (pwd) => pwd.length >= 8,
    },
    {
      label: 'Contains uppercase letter',
      test: (pwd) => /[A-Z]/.test(pwd),
    },
    {
      label: 'Contains lowercase letter',
      test: (pwd) => /[a-z]/.test(pwd),
    },
    {
      label: 'Contains number',
      test: (pwd) => /[0-9]/.test(pwd),
    },
    {
      label: 'Contains special character',
      test: (pwd) => /[^A-Za-z0-9]/.test(pwd),
    },
  ];

  useEffect(() => {
    if (!password) {
      setStrength('weak');
      setScore(0);
      return;
    }

    let strengthScore = 0;

    // Check each requirement
    requirements.forEach((req) => {
      if (req.test(password)) {
        strengthScore += 1;
      }
    });

    setScore(strengthScore);

    // Determine strength level
    if (strengthScore <= 2) {
      setStrength('weak');
    } else if (strengthScore === 3) {
      setStrength('fair');
    } else if (strengthScore === 4) {
      setStrength('good');
    } else {
      setStrength('strong');
    }
  }, [password]);

  const getStrengthColor = () => {
    switch (strength) {
      case 'weak':
        return 'bg-red-500';
      case 'fair':
        return 'bg-orange-500';
      case 'good':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case 'weak':
        return 'Weak';
      case 'fair':
        return 'Fair';
      case 'good':
        return 'Good';
      case 'strong':
        return 'Strong';
      default:
        return '';
    }
  };

  const getStrengthTextColor = () => {
    switch (strength) {
      case 'weak':
        return 'text-red-600';
      case 'fair':
        return 'text-orange-600';
      case 'good':
        return 'text-yellow-600';
      case 'strong':
        return 'text-green-600';
      default:
        return 'text-gray-500';
    }
  };

  if (!password) return null;

  return (
    <div className="space-y-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Password strength:</span>
          <span className={`font-medium ${getStrengthTextColor()}`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="flex gap-1 h-1">
          {[1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className={`flex-1 rounded-full transition-colors duration-300 ${
                index <= score ? getStrengthColor() : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="space-y-1 pt-2">
          {requirements.map((req, index) => {
            const isMet = req.test(password);
            return (
              <div
                key={index}
                className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                  isMet ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                  isMet ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {isMet ? (
                    <FiCheck className="w-3 h-3" />
                  ) : (
                    <FiX className="w-3 h-3" />
                  )}
                </div>
                <span>{req.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
