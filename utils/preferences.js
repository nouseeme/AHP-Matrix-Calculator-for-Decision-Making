/**
 * Centralized preferences and configuration for AHP Calculator
 * Update values here to change settings across the entire application
 */

const PREFERENCES = {
  // Consistency Ratio thresholds
  CR: {
    THRESHOLD_GOOD: 0.1,      // CR < 0.1: Excellent/Good
    THRESHOLD_ACCEPTABLE: 0.3 // 0.1 <= CR < 0.15: Acceptable; CR >= 0.15: Poor/Unacceptable
  },

  // Convergence threshold for eigenvalue calculation
  CONVERGENCE_THRESHOLD: 0.00001,
  
  // Maximum iterations for power method
  MAX_ITERATIONS: 100
};

// Make available globally
window.preferences = PREFERENCES;
