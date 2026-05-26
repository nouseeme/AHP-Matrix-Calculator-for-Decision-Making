// Matrix multiplication helper
function multiplyMatrices(matrixA, matrixB) {
    const n = matrixA.length;
    const result = Array(n).fill(0).map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            for (let k = 0; k < n; k++) {
                result[i][j] += matrixA[i][k] * matrixB[k][j];
            }
        }
    }
    return result;
}

// Normalize a vector (make sum = 1)
function normalizeVector(vector) {
    const sum = vector.reduce((acc, val) => acc + val, 0);
    return vector.map(val => val / sum);
}

// Calculate priority vector using power method (eigenvector)
export function calculateWeights(matrix) {
    const n = matrix.length;
    let vector = Array(n).fill(1 / n); // Start with equal weights
    
    // Power method: iterate until convergence
    for (let iter = 0; iter < window.preferences.MAX_ITERATIONS; iter++) {
        let newVector = Array(n).fill(0);
        
        // Multiply matrix by vector
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                newVector[i] += matrix[i][j] * vector[j];
            }
        }
        
        // Normalize
        newVector = normalizeVector(newVector);
        
        // Check convergence
        const diff = newVector.reduce((sum, val, i) => 
            sum + Math.abs(val - vector[i]), 0
        );
        
        if (diff < window.preferences.CONVERGENCE_THRESHOLD) break;
        vector = newVector;
    }
    
    return vector;
}

// Calculate lambda max (maximum eigenvalue)
function calculateLambdaMax(matrix, weights) {
    const n = matrix.length;
    let weightedSum = Array(n).fill(0);
    
    // Multiply matrix by weight vector
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            weightedSum[i] += matrix[i][j] * weights[j];
        }
    }
    
    // Lambda max = average of (weighted sum / weights)
    let lambdaMax = 0;
    for (let i = 0; i < n; i++) {
        lambdaMax += weightedSum[i] / weights[i];
    }
    
    return lambdaMax / n;
}

// Calculate Consistency Index (CI)
function calculateCI(lambdaMax, n) {
    return (lambdaMax - n) / (n - 1);
}

// Calculate Consistency Ratio (CR)
function calculateCR(ci, n) {
    const { RANDOM_INDEX } = window.constants;
    const ri = RANDOM_INDEX[n];
    return ri ? ci / ri : 0;
}

// Main function: calculate everything
export function calculateAHP(matrix) {
    const n = matrix.length;
    const weights = calculateWeights(matrix);
    const lambdaMax = calculateLambdaMax(matrix, weights);
    const ci = calculateCI(lambdaMax, n);
    const cr = calculateCR(ci, n);
    
    return {
        weights,
        lambdaMax,
        ci,
        cr,
        isConsistent: cr < window.preferences.CR.THRESHOLD_GOOD
    };
}

// Make available globally
window.ahpCalculations = { calculateWeights, calculateAHP };