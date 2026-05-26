function Results({ results, criteria, onRestart, onGoToStep2 }) {
    if (!results) return null;

    const { weights, ci, cr, lambdaMax } = results;
    const { THRESHOLD_GOOD, THRESHOLD_ACCEPTABLE } = window.preferences.CR;
    
    // Determine consistency state (3 states)
    let consistencyState = '';
    let stateColor = '';
    let stateMessage = '';
    if (cr < THRESHOLD_GOOD) {
        consistencyState = 'Consistent';
        stateColor = 'var(--success)';
        stateMessage = `Excellent consistency - CR < ${THRESHOLD_GOOD}`;
    } else if (cr < THRESHOLD_ACCEPTABLE) {
        consistencyState = 'Acceptable';
        stateColor = 'var(--warning)';
        stateMessage = `Acceptable consistency - ${THRESHOLD_GOOD} ≤ CR < ${THRESHOLD_ACCEPTABLE}`;
    } else {
        consistencyState = 'Inconsistent';
        stateColor = 'var(--error)';
        stateMessage = `Poor consistency - CR ≥ ${THRESHOLD_ACCEPTABLE}`;
    }
    
    // Create ranking with criteria names
    const ranking = criteria
        .map((name, idx) => ({ name, weight: weights[idx] }))
        .sort((a, b) => b.weight - a.weight);

    const handleDownload = () => {
        window.downloadReport(criteria, results);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
            {/* Section Header */}
            <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-disabled)', marginBottom: '24px', display: 'block' }}>Step 3: Results</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                    <h2 style={{ margin: 0 }}>Your Rankings</h2>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: stateColor }}>
                        · {consistencyState}
                    </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9375rem', lineHeight: 'var(--lh-body)' }}>
                    Final priority weights based on your comparisons.
                </p>
            </div>

            {/* Consistency Note */}
            {cr >= THRESHOLD_GOOD && (
                <div style={{
                    borderLeft: `4px solid ${stateColor}`,
                    paddingLeft: '12px',
                    marginBottom: 'var(--md)'
                }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {consistencyState === 'Inconsistent' ? '⚠️ Inconsistency detected' : '⚠️ Minor inconsistency'}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        Consistency Ratio: {cr.toFixed(4)} - {stateMessage}
                    </div>
                </div>
            )}

            {/* Priority Weights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {ranking.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Rank */}
                        <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-disabled)', minWidth: '20px' }}>
                            {String(idx + 1).padStart(2, '0')}
                        </span>
                        
                        {/* Name */}
                        <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary)', flex: 1 }}>
                            {item.name}
                        </span>
                        
                        {/* Bar */}
                        <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                height: '2px',
                                backgroundColor: 'var(--border)',
                                flex: 1,
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    height: '100%',
                                    backgroundColor: 'var(--text-primary)',
                                    width: `${item.weight * 100}%`,
                                    transition: 'width 300ms ease-out'
                                }} />
                            </div>
                        </div>
                        
                        {/* Percentage */}
                        <span style={{
                            fontSize: '1.125rem',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            minWidth: '50px',
                            textAlign: 'right'
                        }}>
                            {(item.weight * 100).toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>

            {/* Metrics Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '32px',
                marginTop: 'var(--md)'
            }}>
                {/* Lambda Max */}
                <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-disabled)', marginBottom: '4px' }}>
                        Principal Eigenvalue
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                        {lambdaMax.toFixed(3)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-disabled)' }}>
                        λ<sub>max</sub><br /> 
                        Eigenvalue of pairwise matrix
                    </div>
                </div>

                {/* Consistency Index */}
                <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-disabled)', marginBottom: '4px' }}>
                        Consistency Index
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                        {ci.toFixed(4)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-disabled)' }}>
                        CI = (λ<sub>max</sub> - n) / (n - 1)<br />
                        Normalized deviation from perfect consistency.
                    </div>
                </div>

                {/* Consistency Ratio */}
                <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-disabled)', marginBottom: '4px' }}>
                        Consistency Ratio
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                        {cr.toFixed(4)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-disabled)' }}>
                        CR = CI / RI <br />
                        Compares CI against a random matrix's CI
                    </div>
                </div>

                {/* Matrix Size */}
                <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-disabled)', marginBottom: '4px' }}>
                        Number of Criteria
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                        {criteria.length}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-disabled)' }}>
                        n = {criteria.length}<br />
                        Total number of decision criteria
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 'var(--md)', justifyContent: 'space-between', paddingTop: 'var(--md)' }}>
                <div style={{ display: 'flex', gap: 'var(--md)' }}>
                    <button onClick={onGoToStep2} className="btn-secondary">
                        ← Adjust
                    </button>
                    <button onClick={handleDownload} className="btn-secondary">
                        ↓ Download Report
                    </button>
                </div>
                <button onClick={onRestart} className="btn-primary">
                    New Analysis
                </button>
            </div>
        </div>
    );
}

window.Results = Results;
