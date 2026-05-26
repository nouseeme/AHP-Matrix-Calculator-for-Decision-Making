# AHP Matrix Calculator

A web application implementing the **Analytical Hierarchy Process (AHP)** for multi-criteria decision making. This tool converts your pairwise comparisons into priority weights using rigorous mathematical calculations, then validates your judgments for logical consistency.

**What it does**: You rate alternatives against criteria using a 1-9 scale. The app calculates priority weights and checks consistency automatically.

---

## Table of Contents

1. [Input Data Format](#input-data-format)
2. [Step-by-Step Calculations](#step-by-step-calculations)
3. [Metrics Explained](#metrics-explained)
4. [Caveats](#caveats)
5. [Quick Start](#quick-start)

---

## Input Data Format

### Step 1: Criteria Definition

You enter decision criteria (e.g., Cost, Quality, Speed). For each criterion, the app builds a comparison matrix of alternatives.

**Example**: 3 alternatives, 1 criterion
- Alternatives: Dell, Apple, Lenovo  
- Criterion: Cost

### Step 2: Pairwise Comparison Matrix

For each criterion, you rate alternatives **pairwise** using the **1-9 Saaty Scale**:

| Scale | Meaning |
|-------|---------|
| 1 | Equal |
| 3 | Moderate |
| 5 | Strong |
| 7 | Very Strong |
| 9 | Extreme |
| 2,4,6,8 | Intermediate |

**Input Matrix (Cost Criterion)**:

| | Dell | Apple | Lenovo |
|---|------|-------|--------|
| **Dell** | 1 | 3 | 2 |
| **Apple** | 1/3 | 1 | 1/5 |
| **Lenovo** | 1/2 | 5 | 1 |

**Meaning**:
- Dell is **3× better** than Apple on cost (Dell is cheaper)
- Lenovo is **5× better** than Apple on cost
- Dell is **2× better** than Lenovo on cost

**Key property**: Reciprocals auto-fill. If Dell > Apple is 3, then Apple > Dell is 1/3.

---

## Step-by-Step Calculations

The app performs these calculations for each criterion matrix:

### 1️⃣ Column Sum Normalization

Divide each element by its column sum to convert ratios into relative proportions.

**Step A: Calculate column sums**
```
Col 1 (Dell): 1 + 1/3 + 1/2 = 1.833
Col 2 (Apple): 3 + 1 + 5 = 9.0
Col 3 (Lenovo): 2 + 1/5 + 1 = 3.2
```

**Step B: Normalize by dividing each cell by column sum**
```
Normalized matrix:
       Dell    Apple   Lenovo
Dell:  0.546   0.333   0.625
Apple: 0.182   0.111   0.063
Lenovo:0.273   0.556   0.313
```

**What this means**: Each column now sums to 1.0, showing relative strength within each comparison.

### 2️⃣ Row Average (Priority Vector)

Average each row to extract initial priority weights.

```
Dell weight:   (0.546 + 0.333 + 0.625) / 3 = 0.501 → 50.1%
Apple weight:  (0.182 + 0.111 + 0.063) / 3 = 0.119 → 11.9%
Lenovo weight: (0.273 + 0.556 + 0.313) / 3 = 0.381 → 38.1%
```

**These are your initial priority weights** (but they need refinement via power method).

### 3️⃣ Power Method (Iterative Refinement)

The app refines weights iteratively until they converge to the true eigenvector. This captures the underlying patterns in your comparisons.

**Algorithm**:
```
1. Start with normalized weights: w₀ = [0.501, 0.119, 0.381]
2. Multiply original matrix A by weights: A × w
3. Normalize the result
4. Repeat steps 2-3 until weights stabilize (difference < 10⁻⁶)
```

**Iteration 1**:
```
A × w₀ = 
[1      3      2    ]   [0.501]     [1.499]
[1/3    1      1/5  ] × [0.119]  =  [0.472]
[1/2    5      1    ]   [0.381]     [2.405]

Normalize: [1.499, 0.472, 2.405] / sum(4.376) = [0.343, 0.108, 0.550]
```

**Iteration 2**: Apply the same process with new weights...

**Continue until**: Σ|w_new - w_old| < 0.000001

**Result** (typically converges in 20-40 iterations):
```
Final weights: [0.509, 0.110, 0.381]
```

These converged weights represent the true priority vector your judgments encode.

### 4️⃣ Calculate λmax (Maximum Eigenvalue)

Once converged, calculate the eigenvalue to measure judgment consistency.

**Formula**:
```
λmax = Average of [(A × w_final) / w_final]
```

**Calculation**:
```
A × w_final = [1.500, 0.469, 2.385]  (multiply original matrix by final weights)

(A × w) / w = [1.500/0.509, 0.469/0.110, 2.385/0.381]
            = [2.945, 4.264, 6.259]

λmax = (2.945 + 4.264 + 6.259) / 3 = 4.489
```

**Interpretation**:
- For n=3 alternatives, λmax should be close to 3.0
- λmax = 4.489 indicates deviation from perfect consistency
- Higher λmax → more inconsistent judgments

### 5️⃣ Calculate Consistency Index (CI)

Measures how far your λmax is from the perfect value (n).

**Formula**:
```
CI = (λmax - n) / (n - 1)
```

**Calculation**:
```
CI = (4.489 - 3) / (3 - 1) = 1.489 / 2 = 0.745
```

**Interpretation**:
- CI = 0: Perfect consistency
- CI = 0.1: Good consistency
- CI > 0.3: Very inconsistent (judgments need revision)

### 6️⃣ Calculate Consistency Ratio (CR)

Compares your CI against a random baseline (Random Index table).

**Random Index (RI) Reference Table**:
```
n  | RI
---|-----
3  | 0.52
4  | 0.89
5  | 1.11
6  | 1.25
7  | 1.35
8  | 1.40
9  | 1.45
10 | 1.49
```

**Formula**:
```
CR = CI / RI
```

**Calculation** (for n=3):
```
CR = 0.745 / 0.52 = 1.433 (143.3%)
```

**Interpretation** (CRITICAL METRIC):
- **CR < 0.10 (10%)**: ✓ Consistent — Accept results
- **0.10 ≤ CR < 0.20**: ⚠️ Marginal — Consider revising
- **CR ≥ 0.20**: ✗ Inconsistent — Must revise comparisons

In this example, CR = 1.43 is very high (contradictory judgments), so you should reconsider your pairwise comparisons.

### 7️⃣ Synthesize Final Weights (Multi-Criteria)

If you have multiple criteria, the app combines criterion weights with alternative weights within each criterion.

**Example with 2 criteria** (Cost: 50.1%, Apple for Performance: 65%):

```
Final Weight(Apple) = w(Cost) × (Apple's cost score) + w(Performance) × (Apple's performance score)
```

This produces the final ranking across all criteria.

---

## Metrics Explained

### Priority Weights

**What it shows**: Percentage importance of each alternative under a criterion.

**Range**: 0-100% (always sums to 100%)

**Interpretation**:
- 0.509 = 50.9% (highest priority)
- 0.110 = 11.0% (lowest priority)
- Larger gap = stronger preference

**Decision rule**:
- Gap > 15%: Clear winner
- Gap 5-15%: Competitive
- Gap < 5%: Nearly tied

### Lambda Max (λmax)

**What it is**: The maximum eigenvalue of your comparison matrix.

**Good value**: Close to n (number of alternatives)
- If n=3, λmax should be ≈ 3.0
- If n=5, λmax should be ≈ 5.0

**High λmax** indicates inconsistent judgments (reflected in CI calculation).

### Consistency Index (CI)

**Formula**: `CI = (λmax - n) / (n - 1)`

**Interpretation**:
- CI = 0.00: Perfect consistency
- CI < 0.1: Good
- CI > 0.3: Poor (revise judgments)

### Consistency Ratio (CR) — Most Important

**Formula**: `CR = CI / RI` (where RI is from table above)

**Decision threshold**:
- **CR < 0.10**: Accept results ✓
- **CR ≥ 0.10**: Revise judgments ✗

**Why CR matters**: It normalizes your consistency against random comparisons. CR < 0.10 means your judgments are more consistent than 90% of random matrices, so they're reliable.

**Example**: If CR = 0.08, your judgments are trustworthy. If CR = 0.15, you made circular comparisons (A>B, B>C, C>A) — fix them.

---

## Caveats

### 1. High CR Invalidates Results
If CR ≥ 0.10, your judgments are contradictory. Don't ignore this — you must revise pairwise comparisons until CR < 0.10. High CR means you said things like "A > B", "B > C", "C > A" logically.

### 2. Rank Reversal Paradox
Adding a new alternative can change the ranking of existing ones.
- **Before**: Apple (40%) > Dell (35%) > Lenovo (25%)
- **After adding XPS**: Apple (35%) > XPS (33%) > Dell (20%) > Lenovo (12%)

Dell dropped from 2nd to 3rd just by adding a competitor. This is mathematically correct but unintuitive. **Workaround**: Run analysis on a fixed set of alternatives.

### 3. Scale Limitations (1-9)
Distinguishing between 7 and 9 is subjective. Most meaningful distinctions are within 1-5. If you're using mostly 8s and 9s, you're probably overconfident.

### 4. Complexity Explodes with More Items
Pairwise comparisons needed: n(n-1)/2
- 5 items: 10 comparisons
- 7 items: 21 comparisons
- 9 items: 36 comparisons

Beyond 7-9 items, consistency problems spike. **Solution**: Cluster similar items first, compare clusters, then compare within clusters.

### 5. Cannot Handle Hard Constraints
AHP doesn't filter by constraints (budget, time, etc.). The top-ranked option might be infeasible. **Solution**: Filter alternatives by constraints first, then apply AHP to remaining options.

### 6. Aggregating Multiple Experts
Never average final weights from different experts — average their matrices first, then calculate weights.

**Wrong**: (Expert1 weights + Expert2 weights) / 2  
**Right**: (Expert1 matrix + Expert2 matrix) / 2 → calculate weights once

---

## Quick Start

### Installation
1. Open [ahp.noufalriz.me](https://ahp.noufalriz.me) in a modern browser
2. No installation or build required

### Usage

**Step 1: Enter Criteria**
- Input criteria names (e.g., "Cost", "Quality", "Speed")
- Click "Next"

**Step 2: Make Pairwise Comparisons**
- For each criterion, rate alternatives on 1-9 scale
- Read the scale labels for guidance
- Reciprocal values auto-fill
- **Check CR before proceeding**:
  - Green (CR < 0.10): Good
  - Orange (CR 0.10-0.20): Review
  - Red (CR > 0.20): Must revise

**Step 3: View Results**
- Priority weights (bar chart)
- Consistency metrics (CR, CI, λmax)
- Final ranking

### When to Use AHP

✓ **Good for**: Multi-criteria decisions with expert judgment, transparent decision-making, decisions needing validation
✗ **Not for**: Purely quantitative optimization, one-off choices, situations with clear dominance

---

## Example Walkthrough

**Goal**: Choose between 3 laptops  
**Criteria**: Cost, Performance, Battery

**Cost Comparison Matrix**:
```
       Dell    Apple   Lenovo
Dell:   1       3       2
Apple:  1/3     1       1/5
Lenovo: 1/2     5       1
```

**Calculations** (as performed by this app):

1. **Normalize**: Divide by column sums
2. **Power method**: Iterate A × w until convergence
3. **Result**: Dell 50.9%, Apple 11.0%, Lenovo 38.1%
4. **Check**: λmax = 3.15 → CI = 0.075 → CR = 0.144
5. **Verdict**: CR > 0.10, so revise Cost comparisons

After revision (say, change Apple to 1/2 instead of 1/5):
6. **New result**: CR = 0.06 ✓ Accept

---

## Code Structure

- `index.html` — Entry point
- `App.jsx` — Main app state (3-step workflow)
- `components/CriteriaInput.jsx` — Step 1: Define criteria
- `components/ComparisonMatrix_final.jsx` — Step 2: Pairwise comparisons
- `components/Results_final.jsx` — Step 3: Display results
- `utils/ahpCalculations.js` — Core algorithm (power method, CI/CR)
- `utils/constants.js` — Random Index table, scale labels
- `styles.css` — Design system
