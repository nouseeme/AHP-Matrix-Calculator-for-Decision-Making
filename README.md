# AHP Matrix Calculator

A browser-based calculator for assigning **priority weights to decision criteria** with the Analytic Hierarchy Process (AHP). Enter at least three criteria, compare each pair on the 1–9 Saaty scale, and review the resulting weights and consistency ratio.

The current app ranks **criteria**, not decision alternatives. It does not score options or recommend a final choice.

## Use the calculator

1. Open [the hosted calculator](https://ahp.noufalriz.me), or serve this repository with a local static web server (for example, `python -m http.server 8000`) and open `http://localhost:8000`.
2. Enter at least three distinct criteria, such as Cost, Quality, and Speed.
3. Move each slider toward the more important criterion. The center means equal importance; the opposite comparison is filled automatically.
4. Select **Calculate** to see criterion weights and the consistency ratio (CR). Use **Adjust** to revise your judgments, or **Download Report** to save a Markdown summary.

The app runs in the browser. It uses React, React DOM, Babel, and the Inter font from external CDNs, so an internet connection is needed when opening it. There is no package installation or build step. A local web server is recommended because browsers can restrict script loading from `file://` URLs.

## Pairwise comparisons

For each pair of criteria, decide which matters more and by how much. The slider uses the 1–9 Saaty scale in either direction:

| Value | Meaning |
| --- | --- |
| 1 | Equal importance |
| 2 | Slight preference |
| 3 | Moderate preference |
| 4 | Between moderate and strong |
| 5 | Strong preference |
| 6 | Between strong and very strong |
| 7 | Very strong preference |
| 8 | Between very strong and extreme |
| 9 | Extreme preference |

For example, if Cost is three times as important as Quality, the matrix stores `Cost / Quality = 3` and automatically stores the reciprocal `Quality / Cost = 1/3`. The diagonal always equals `1` because a criterion is equally important to itself. A slider left at the center counts as **equal importance**; you can calculate without moving every slider.

For `n` criteria, there are `n(n − 1)/2` pairs: 3 criteria require 3 judgments; 10 require 45. The app accepts 3–10 criteria because its random index table covers those matrix sizes.

## Worked example

Suppose you are deciding how much weight to give **Cost**, **Quality**, and **Speed**. You judge Cost twice as important as Quality, Quality twice as important as Speed, and Cost four times as important as Speed. The resulting matrix is:

| | Cost | Quality | Speed |
| --- | ---: | ---: | ---: |
| **Cost** | 1 | 2 | 4 |
| **Quality** | 1/2 | 1 | 2 |
| **Speed** | 1/4 | 1/2 | 1 |

The calculator returns these **criterion weights**:

| Criterion | Weight |
| --- | ---: |
| Cost | 57.14% |
| Quality | 28.57% |
| Speed | 14.29% |

They sum to 100%. Cost has the largest share of importance in *your stated judgments*. This example does not score any purchase, vendor, or other alternative.

The comparisons are perfectly consistent: Cost is `2 ×` Quality and Quality is `2 ×` Speed, matching the direct Cost-to-Speed comparison of `4 ×`. The calculated maximum eigenvalue is `3`, the consistency index is `0`, and the consistency ratio is `0`.

### What an inconsistent comparison looks like

Keep Cost `3 ×` Quality and Quality `3 ×` Speed, but say Cost and Speed are equally important. The judgments no longer agree: the first two imply Cost should be about `9 ×` Speed, while the direct comparison says `1 ×`. For that matrix, this app calculates approximately `λmax = 3.5608`, `CI = 0.2804`, and `CR = 0.5393`. Its CR is well above `0.10`, so the comparisons should be reviewed before relying on the weights.

## How the calculation works

1. **Build a reciprocal matrix.** Each entered pair fills two cells, `a[i][j]` and `a[j][i] = 1 / a[i][j]`.
2. **Estimate weights with the power method.** Start with equal weights. Multiply the matrix by the current weight vector, normalize the result so its entries sum to `1`, and repeat until the change is smaller than `0.00001` or 100 iterations have run. The final vector gives the relative criterion weights.
3. **Estimate the maximum eigenvalue.** Calculate `A × w`, divide each entry by the corresponding weight, then average those ratios to obtain `λmax`.
4. **Calculate consistency.** For `n` criteria, `CI = (λmax − n) / (n − 1)` and `CR = CI / RI`, where `RI` comes from the table below.

| Criteria (`n`) | Random index (`RI`) |
| ---: | ---: |
| 3 | 0.52 |
| 4 | 0.89 |
| 5 | 1.11 |
| 6 | 1.25 |
| 7 | 1.35 |
| 8 | 1.40 |
| 9 | 1.45 |
| 10 | 1.49 |

The RI values above are the values configured in this repository. The app uses the same formulas for each supported matrix size.

## Reading the result

- **Weight** is the relative importance of a criterion. All weights add up to 100%.
- **λmax** is close to `n` when comparisons are consistent. A larger gap raises CI and CR.
- **CI** measures deviation from perfect consistency before adjustment by RI.
- **CR < 0.10:** the app labels the comparison set *Consistent*.
- **0.10 ≤ CR < 0.20:** the app labels it *Review*.
- **CR ≥ 0.20:** the app labels it *Inconsistent*.

The calculator still displays weights at high CR values. Revise comparisons that conflict before treating those weights as a stable summary of your priorities. A low CR means the judgments are internally consistent; it does not show that the criteria are complete, the input judgments are factually correct, or the final decision will be good.

## Project layout

| Path | Purpose |
| --- | --- |
| `index.html` | Static entry point and browser dependencies |
| `App.jsx` | Three-step workflow |
| `components/` | Criteria input, pairwise comparison, and results UI |
| `utils/ahpCalculations.js` | Weight and consistency calculations |
| `utils/constants.js` | Random index values and scale labels |
| `utils/preferences.js` | Calculation and CR thresholds |
| `utils/exportReport.js` | Markdown report download |
| `styles.css` | Visual styles |

## Limitations

- This calculator weighs criteria only. It does not compare alternatives under each criterion, apply hard constraints, or choose a final option.
- The 1–9 scale expresses subjective judgments. Small differences in weights need not be meaningful, especially when judgments are uncertain.
- Adding or removing a criterion changes the comparison problem, so weights from separate runs should not be compared as though their denominators were identical.
- More criteria require many more pairwise judgments and can make consistency harder to maintain.
- The app does not save analyses between visits. Download the Markdown report if you need a record.
- External CDN availability affects whether the page can load.
