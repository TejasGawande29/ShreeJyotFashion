import React from 'react';
import { FiCheck, FiTruck, FiCreditCard, FiShoppingBag } from 'react-icons/fi';

interface CheckoutStepsProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: 'Shipping', icon: FiTruck },
  { number: 2, title: 'Payment', icon: FiCreditCard },
  { number: 3, title: 'Review', icon: FiShoppingBag },
];

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="w-full">
      {/* Desktop Stepper */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const Icon = step.icon;

            return (
              <React.Fragment key={step.number}>
                {/* Step */}
                <div className="flex flex-col items-center">
                  <div
                    className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                      isCompleted
                        ? 'bg-primary-600 border-primary-600'
                        : isCurrent
                        ? 'bg-white border-primary-600 ring-4 ring-primary-100'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {isCompleted ? (
                      <FiCheck className="w-6 h-6 text-white" />
                    ) : (
                      <Icon
                        className={`w-6 h-6 ${
                          isCurrent ? 'text-primary-600' : 'text-gray-400'
                        }`}
                      />
                    )}
                  </div>
                  <div className="mt-3">
                    <p
                      className={`text-sm font-medium ${
                        isCurrent || isCompleted
                          ? 'text-gray-900'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 text-center mt-0.5">
                      Step {step.number}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 -mt-12">
                    <div
                      className={`h-full transition-all ${
                        currentStep > step.number
                          ? 'bg-primary-600'
                          : 'bg-gray-300'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Mobile Stepper */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const Icon = step.icon;

            return (
              <React.Fragment key={step.number}>
                {/* Step */}
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      isCompleted
                        ? 'bg-primary-600 border-primary-600'
                        : isCurrent
                        ? 'bg-white border-primary-600 ring-2 ring-primary-100'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {isCompleted ? (
                      <FiCheck className="w-5 h-5 text-white" />
                    ) : (
                      <Icon
                        className={`w-5 h-5 ${
                          isCurrent ? 'text-primary-600' : 'text-gray-400'
                        }`}
                      />
                    )}
                  </div>
                  <div className="mt-2">
                    <p
                      className={`text-xs font-medium ${
                        isCurrent || isCompleted
                          ? 'text-gray-900'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 -mt-8">
                    <div
                      className={`h-full transition-all ${
                        currentStep > step.number
                          ? 'bg-primary-600'
                          : 'bg-gray-300'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Description */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {currentStep === 1 && 'Enter your shipping information'}
          {currentStep === 2 && 'Choose your payment method'}
          {currentStep === 3 && 'Review and place your order'}
        </p>
      </div>
    </div>
  );
}

export default CheckoutSteps;
