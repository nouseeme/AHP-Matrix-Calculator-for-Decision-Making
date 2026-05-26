// Random Index table for consistency calculation
export const RANDOM_INDEX = {
    3: 0.52,
    4: 0.89,
    5: 1.11,
    6: 1.25,
    7: 1.35,
    8: 1.40,
    9: 1.45,
    10: 1.49
};

// AHP 1-9 scale with qualitative descriptions
export const SCALE_LABELS = {
    1: "Equal Importance",
    2: "Weak or Slight",
    3: "Moderate Importance",
    4: "Moderate Plus",
    5: "Strong Importance",
    6: "Strong Plus",
    7: "Very Strong Importance",
    8: "Very, Very Strong",
    9: "Extreme Importance"
};

// Make available globally for browser imports
window.constants = { RANDOM_INDEX, SCALE_LABELS };