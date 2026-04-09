import { CheckoutState } from '../types/checkout';

interface CheckoutProgressProps {
    checkoutState: CheckoutState;
    onStepClick: (stepId: 'shipping' | 'payment' | 'confirmation') => void;
}

export const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ checkoutState, onStepClick }) => {
    const { steps } = checkoutState;

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        {/* Step Circle */}
                        <button
                            onClick={() => onStepClick(step.id)}
                            disabled={!step.isCompleted && !step.isActive}
                            className={`
                                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                                ${step.isCompleted 
                                    ? 'bg-green-600 text-white hover:bg-green-700' 
                                    : step.isActive 
                                        ? 'bg-indigo-600 text-white' 
                                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                }
                                ${step.isCompleted || step.isActive ? 'cursor-pointer' : 'cursor-not-allowed'}
                            `}
                        >
                            {step.isCompleted ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                index + 1
                            )}
                        </button>

                        {/* Step Info */}
                        <div className="ml-3 hidden sm:block">
                            <div className={`text-sm font-medium ${
                                step.isActive ? 'text-white' : step.isCompleted ? 'text-green-400' : 'text-gray-400'
                            }`}>
                                {step.title}
                            </div>
                            <div className={`text-xs ${
                                step.isActive ? 'text-gray-300' : step.isCompleted ? 'text-green-300' : 'text-gray-500'
                            }`}>
                                {step.description}
                            </div>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className={`w-full h-0.5 mx-4 ${
                                step.isCompleted ? 'bg-green-600' : 'bg-gray-700'
                            }`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Mobile Step Names */}
            <div className="flex justify-between mt-2 sm:hidden">
                {steps.map((step) => (
                    <div key={step.id} className={`text-xs text-center ${
                        step.isActive ? 'text-white' : step.isCompleted ? 'text-green-400' : 'text-gray-400'
                    }`}>
                        {step.title}
                    </div>
                ))}
            </div>
        </div>
    );
};
