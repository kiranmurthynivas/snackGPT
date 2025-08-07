import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const CookingSteps = ({ instructions, onStepComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Parse instructions to extract steps
  const parseInstructions = useCallback((instructions) => {
    if (!instructions) return [];
    
    const steps = instructions.split(/\n|\./).filter(step => step.trim());
    return steps.map((step, index) => ({
      id: index,
      text: step.trim(),
      completed: false
    }));
  }, []);

  const steps = useMemo(() => parseInstructions(instructions), [instructions, parseInstructions]);

  const completeStep = useCallback(() => {
    // Mark current step as completed
    setCompletedSteps(prev => {
      const newCompleted = [...prev, currentStep];
      return newCompleted;
    });
    
    if (onStepComplete) {
      onStepComplete(currentStep);
    }
    
    // Check if there are more steps
    if (currentStep < steps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
    }
  }, [currentStep, onStepComplete, steps]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      completeStep();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      // Remove from completed steps if it was completed
      setCompletedSteps(prev => prev.filter(step => step !== currentStep - 1));
    }
  };

  const resetSteps = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const getProgress = () => {
    if (steps.length === 0) return 0;
    const completedCount = completedSteps.length;
    const currentProgress = (completedCount / steps.length) * 100;
    return Math.min(currentProgress, 100);
  };

  // Check if current step is completed
  const isCurrentStepCompleted = completedSteps.includes(currentStep);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-gradient-to-br from-mint-50 to-pink-50 border-2 border-mint-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-mint-600" />
          Cooking Steps
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(getProgress())}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-mint-500 to-pink-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getProgress()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Current Step */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-800">
            {steps[currentStep]?.text || 'No steps available'}
          </h4>
          {isCurrentStepCompleted && (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        {currentStep > 0 && (
          <motion.button
            onClick={previousStep}
            className="btn-secondary flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </motion.button>
        )}
        
        {!isCurrentStepCompleted && steps.length > 0 && (
          <motion.button
            onClick={completeStep}
            className="btn-primary flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Complete Step</span>
          </motion.button>
        )}
        
        {currentStep < steps.length - 1 && (
          <motion.button
            onClick={nextStep}
            className="px-4 py-2 bg-lemon-500 text-white rounded-lg hover:bg-lemon-600 transition-colors flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowRight className="w-4 h-4" />
            <span>Next Step</span>
          </motion.button>
        )}
        
        <motion.button
          onClick={resetSteps}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Steps List */}
      <div className="mt-6">
        <h4 className="font-semibold text-gray-800 mb-3">All Steps</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                index === currentStep
                  ? 'bg-mint-100 border border-mint-300'
                  : completedSteps.includes(index)
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                completedSteps.includes(index)
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                  ? 'bg-mint-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {completedSteps.includes(index) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span className={`flex-1 text-sm ${
                completedSteps.includes(index) ? 'line-through text-gray-500' : 'text-gray-700'
              }`}>
                {step.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CookingSteps;
