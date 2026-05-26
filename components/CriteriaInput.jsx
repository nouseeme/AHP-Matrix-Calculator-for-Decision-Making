const { useState } = React;

function CriteriaInput({ onNext }) {
    const [criteria, setCriteria] = useState(['', '', '']);
    const [error, setError] = useState('');

    const handleInputChange = (index, value) => {
        const updated = [...criteria];
        updated[index] = value.trim();
        setCriteria(updated);
        setError('');
    };

    const handleAddCriteria = () => {
        setCriteria([...criteria, '']);
        setError('');
    };

    const handleRemoveCriteria = (index) => {
        if (criteria.length > 1) {
            setCriteria(criteria.filter((_, i) => i !== index));
            setError('');
        }
    };

    const handleNext = () => {
        const filledCriteria = criteria.filter(c => c.length > 0);

        if (filledCriteria.length < 3) {
            setError('Minimum 3 criteria required');
            return;
        }

        const uniqueCriteria = new Set(filledCriteria.map(c => c.toLowerCase()));
        if (uniqueCriteria.size !== filledCriteria.length) {
            setError('Duplicate criteria names detected');
            return;
        }

        onNext(filledCriteria);
    };

    const filledCount = criteria.filter(c => c.length > 0).length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
            <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-disabled)', marginBottom: '24px', display: 'block' }}>Step 1: Define Criteria</span>
                <h2 style={{ margin: 0, marginBottom: '4px' }}>Criteria</h2>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9375rem', lineHeight: 'var(--lh-body)' }}>Add the factors your decision depends on. Minimum 3 criteria required.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md)' }}>
                {criteria.map((value, index) => (
                    <div key={index} style={{ display: 'flex', gap: 'var(--md)', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            placeholder={`Criteria ${index + 1}`}
                            style={{
                                flex: 1,
                                padding: '7px 12px',
                                border: '1px solid transparent',
                                borderRadius: '6px',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '0.9375rem',
                                backgroundColor: 'var(--surface)',
                                color: 'var(--text-primary)',
                                transition: 'border-color 120ms ease-out, box-shadow 120ms ease-out',
                                letterSpacing: '-0.01em'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--accent)';
                                e.target.style.boxShadow = '0 0 0 2px rgba(100, 66, 66, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'transparent';
                                e.target.style.backgroundColor = 'var(--surface)';
                                e.target.style.boxShadow = 'none';
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') handleNext();
                            }}
                        />
                        <button
                            onClick={() => handleRemoveCriteria(index)}
                            disabled={criteria.length <= 1}
                            style={{
                                padding: '8px 18px',
                                borderRadius: '6px',
                                fontWeight: '500',
                                fontSize: '0.875rem',
                                fontFamily: 'var(--font-sans)',
                                transition: 'all 120ms ease-out',
                                backgroundColor: criteria.length <= 1 ? 'transparent' : 'var(--error-muted)',
                                color: criteria.length <= 1 ? 'var(--text-disabled)' : 'var(--text-secondary)',
                                cursor: criteria.length <= 1 ? 'not-allowed' : 'pointer',
                                border: 'none',
                                letterSpacing: '-0.01em',
                                opacity: criteria.length <= 1 ? 0.5 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (criteria.length > 1) {
                                    e.target.style.backgroundColor = 'var(--error)';
                                    e.target.style.color = 'var(--surface)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (criteria.length > 1) {
                                    e.target.style.backgroundColor = 'var(--error-muted)';
                                    e.target.style.color = 'var(--text-secondary)';
                                }
                            }}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            {error && (
                <div style={{
                    borderLeft: '1.5px solid var(--error)',
                    paddingLeft: '12px',
                    color: 'var(--text-primary)',
                    fontWeight: '500',
                    fontSize: '0.8125rem',
                    letterSpacing: '-0.01em'
                }}>
                    <div style={{ color: 'var(--error)', fontWeight: '600', marginBottom: '4px' }}>Error</div>
                    <div style={{ color: 'var(--text-secondary)' }}>{error}</div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--md)', paddingTop: 'var(--md)', justifyContent: 'space-between' }}>
                <button
                    onClick={handleAddCriteria}
                    className="btn-secondary"
                    style={{
                        padding: '8px 18px',
                    }}
                >
                    + Add
                </button>
                <button
                    onClick={handleNext}
                    disabled={filledCount < 3}
                    className="btn-primary"
                    style={{
                        padding: '8px 18px',
                    }}
                >
                    {filledCount < 3 ? `Next (${filledCount}/3+)` : 'Next'}
                </button>
            </div>
        </div>
    );
}

window.CriteriaInput = CriteriaInput;