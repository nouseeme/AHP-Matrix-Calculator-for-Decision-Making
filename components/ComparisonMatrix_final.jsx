const { useState, useEffect } = React;

function ComparisonMatrix({ criteria, onNext, onBack }) {
    const n = criteria.length;
    const [matrix, setMatrix] = useState([]);

    const SAATY_SCALE = [
        1/9, 1/8, 1/7, 1/6, 1/5, 1/4, 1/3, 1/2,
        1,
        2, 3, 4, 5, 6, 7, 8, 9
    ];

    // Helper function to get intensity label based on slider position distance from center
    const getIntensityLabel = (value, criterionA, criterionB) => {
        if (value === 1) {
            return 'Both carry equal influence.';
        }
        
        // Get position from value to calculate symmetric distance
        let position = getPositionFromValue(value);
        const centerPos = 8; // Center is position 8 (value = 1)
        const distanceFromCenter = Math.abs(position - centerPos);
        
        // Determine which criterion based on left (< center) or right (> center)
        const criterion = position < centerPos ? criterionA : criterionB;
        
        // Map distance to intensity (symmetric on both sides)
        let intensity = '';
        if (distanceFromCenter === 0) {
            return 'Both carry equal influence.';
        } else if (distanceFromCenter >= 1 && distanceFromCenter < 3) {
            intensity = 'is slightly more important.';
        } else if (distanceFromCenter >= 3 && distanceFromCenter < 5) {
            intensity = 'is moderately more important.';
        } else if (distanceFromCenter >= 5 && distanceFromCenter < 7) {
            intensity = 'is significantly more important.';
        } else if (distanceFromCenter >= 7) {
            intensity = 'is strongly preferred.';
        }
        
        return `${criterion} ${intensity}`;
    };

    useEffect(() => {
        const initialMatrix = Array(n).fill(0).map((_, i) =>
            Array(n).fill(0).map((_, j) => i === j ? 1 : 0)
        );
        setMatrix(initialMatrix);
    }, [n]);

    // Generate all unique pairs (upper triangle only)
    const pairs = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            pairs.push([i, j]);
        }
    }

    // Count completed comparisons (non-default values)
    const completedCount = pairs.filter(([i, j]) => matrix[i]?.[j] && matrix[i][j] !== 1).length;
    const totalPairs = pairs.length;

    // Map slider position to Saaty value and update matrix
    const handleSliderChange = (i, j, position) => {
        const pos = parseInt(position);
        const value = SAATY_SCALE[pos];
        
        const updated = matrix.map(row => [...row]);
        updated[i][j] = value;
        updated[j][i] = 1 / value;
        setMatrix(updated);
    };

    // Get slider position from Saaty value
    const getPositionFromValue = (value) => {
        if (!value || value === 0) return 8;
        
        let closestPos = 8;
        let closestDiff = Math.abs(SAATY_SCALE[8] - value);
        
        for (let i = 0; i < SAATY_SCALE.length; i++) {
            const diff = Math.abs(SAATY_SCALE[i] - value);
            if (diff < closestDiff) {
                closestDiff = diff;
                closestPos = i;
            }
        }
        return closestPos;
    };

    // Group pairs by first criterion
    const groupedPairs = {};
    for (let i = 0; i < n; i++) {
        groupedPairs[i] = [];
        for (let j = i + 1; j < n; j++) {
            groupedPairs[i].push([i, j]);
        }
    }

    const handleCalculate = () => {
        const allFilled = pairs.every(([i, j]) => {
            const val = matrix[i][j];
            return val && val !== 0;
        });

        onNext(matrix);
    };

    if (matrix.length === 0) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)', paddingBottom: 'var(--xl)' }}>
            {/* Section Header */}
            <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-disabled)', marginBottom: '24px', display: 'block' }}>Step 2: Compare</span>
                <h2 style={{ margin: 0, marginBottom: '4px' }}>Compare Criteria</h2>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9375rem', lineHeight: 'var(--lh-body)' }}>
                    Move each slider toward whichever criterion matters more to your decision.
                </p>
            </div>

            {/* Progress */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                    {completedCount} of {totalPairs} compared
                </span>
                <span style={{ fontSize: '0.9375rem', fontFamily: 'var(--font-mono)', color: 'var(--text-disabled)' }}>
                    {completedCount}/{totalPairs}
                </span>
            </div>

            {/* Comparison Units */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {Object.keys(groupedPairs).map((groupIdx) => {
                    const idx = parseInt(groupIdx);
                    const pairsInGroup = groupedPairs[idx];
                    
                    if (pairsInGroup.length === 0) return null;

                    return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {pairsInGroup.map(([i, j]) => {
                                const value = matrix[i]?.[j] || 1;
                                const position = getPositionFromValue(value);
                                const isCompleted = value && value !== 1;

                                return (    
                                    <div
                                        key={`${i}-${j}`}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px'
                                        }}
                                    >
                                        {/* Criterion Pair */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9375rem' }}>
                                            <span style={{ fontWeight: value < 1 ? 600 : 400, color: value === 1 ? 'var(--text-secondary)' : 'var(--text-primary)', flex: 1, textAlign: 'right' }}>
                                                {criteria[j]}
                                            </span>
                                            <span style={{ color: 'var(--text-disabled)', fontWeight: 400, whiteSpace: 'nowrap' }}>·</span>
                                            <span style={{ color: 'var(--text-disabled)', fontWeight: 400, whiteSpace: 'nowrap' }}>vs</span>
                                            <span style={{ color: 'var(--text-disabled)', fontWeight: 400, whiteSpace: 'nowrap' }}>·</span>
                                            <span style={{ fontWeight: value > 1 ? 600 : 400, color: value === 1 ? 'var(--text-secondary)' : 'var(--text-primary)', flex: 1 }}>
                                                {criteria[i]}
                                            </span>
                                        </div>

                                        {/* Slider */}
                                        <input
                                            type="range"
                                            min="0"
                                            max="16"
                                            step="1"
                                            value={position}
                                            onChange={(e) => handleSliderChange(i, j, e.target.value)}
                                            style={{
                                                width: '100%',
                                                cursor: 'pointer'
                                            }}
                                        />

                                        {/* Center Tick */}
                                        <div style={{ position: 'relative', height: 0 }}>
                                            <div style={{
                                                position: 'absolute',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: '1px',
                                                height: '6px',
                                                backgroundColor: 'var(--border)',
                                                top: '-3.75px'
                                            }} />
                                        </div>

                                        {/* Labels */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-disabled)' }}>
                                            <span>← {criteria[j]} more</span>
                                                <span>Equal weight</span>
                                            <span>{criteria[i]} more →</span>
                                        </div>

                                        {/* Value Readout with Context */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem'}}>
                                                {getIntensityLabel(value, criteria[j], criteria[i])}
                                            </span>
                                            <span style={{ color: 'var(--text-secondary)'}}>
                                                {value.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 'var(--md)', justifyContent: 'space-between', paddingTop: 'var(--md)' }}>
                <button onClick={onBack} className="btn-secondary">
                    ← Back
                </button>
                <button
                    onClick={handleCalculate}
                    className="btn-primary"
                >
                    Calculate →
                </button>
            </div>
        </div>
    );
}

window.ComparisonMatrix = ComparisonMatrix;
