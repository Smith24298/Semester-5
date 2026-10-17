# Machine Learning Practicals

`heart_attack_practicals.py` implements the requested practicals.

Run it from the project root:

```bash
python prac5/heart_attack_practicals.py
```

The script automatically loads `heart attack analysis.csv` from the project root.

## Practical mapping

- `naive_bayes_models`: Gaussian, Multinomial, and Bernoulli Naive Bayes for `output`.
- `decision_tree_comparison`: compares `criterion`, `min_samples_split`, `min_samples_leaf`, and `max_depth`.
- `svm_grid_search`: SVC classification and SVR regression; regression predicts `chol`.
- `plot_svm_hyperplane`: 3D linear SVM hyperplane plot.
- `logic_gate`: AND with one perceptron and XOR with two perceptron layers from scratch.
- `backpropagation_and_kmeans`: sklearn backpropagation neural network and K-means on the patient features.

The XOR section notes why a single perceptron cannot solve XOR and uses a two-layer perceptron network to produce the correct truth table.
