const { useState } = React;

function App() {
    const [step, setStep] = useState(1);
    const [criteria, setCriteria] = useState([]);
    const [comparisonMatrix, setComparisonMatrix] = useState([]);
    const [results, setResults] = useState(null);

    const handleCriteriaSubmit = (criteriaList) => {
        setCriteria(criteriaList);
        setStep(2);
    };

    const handleComparisonSubmit = (matrix) => {
        setComparisonMatrix(matrix);
        
        // Calculate AHP results
        const ahpResults = window.ahpCalculations.calculateAHP(matrix);
        setResults(ahpResults);
        setStep(3);
    };

    const handleComparisonBack = () => {
        setStep(1);
    };

    const handleResultsBack = () => {
        setStep(2);
    };

    const handleRestart = () => {
        setStep(1);
        setCriteria([]);
        setComparisonMatrix([]);
        setResults(null);
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
            <div style={{ maxWidth: '680px', margin: '0 auto', paddingLeft: 'var(--md)', paddingRight: 'var(--md)', paddingTop: '64px' }}>
                {/* Header - Left aligned */}
                <div style={{ marginBottom: 'var(--section-gap)' }}>
                    <h1 style={{ margin: 0, marginBottom: '4px' }}>
                        AHP Decision Dashboard
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, lineHeight: 'var(--lh-body)' }}>
                        Analytical Hierarchy Process for Multi-Criteria Decision Making
                    </p>
                </div>

                {/* Main Content */}
                <div>
                    {step === 1 && (
                        <window.CriteriaInput onNext={handleCriteriaSubmit} />
                    )}
                    {step === 2 && (
                        <window.ComparisonMatrix 
                            criteria={criteria} 
                            onNext={handleComparisonSubmit}
                            onBack={handleComparisonBack}
                        />
                    )}
                    {step === 3 && (
                        <window.Results 
                            results={results}
                            criteria={criteria}
                            onRestart={handleRestart}
                            onGoToStep2={handleResultsBack}
                        />
                    )}
                </div>
            </div>

            {/* Fixed Bottom Step Indicator */}
            <div className="step-indicator">
                <div className="step-indicator-content">
                    {[
                        { num: 1, label: "Criteria" },
                        { num: 2, label: "Compare" },
                        { num: 3, label: "Results" }
                    ].map((s, idx) => (
                        <React.Fragment key={s.num}>
                            <div className={`step-indicator-step ${
                                s.num < step ? 'completed' : s.num === step ? 'active' : 'inactive'
                            }`}>
                                <span>{s.num}</span>
                                <span style={{ fontWeight: 'inherit', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                    {s.label}
                                </span>
                            </div>
                            {idx < 2 && (
                                <span className="step-indicator-connector">·</span>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);