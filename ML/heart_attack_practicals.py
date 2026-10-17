"""Machine Learning practicals using the heart attack analysis dataset.

Run from the project root with: python prac5/heart_attack_practicals.py
"""

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import accuracy_score, mean_squared_error, silhouette_score
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.naive_bayes import BernoulliNB, GaussianNB, MultinomialNB
from sklearn.neural_network import MLPClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.svm import SVC, SVR
from sklearn.tree import DecisionTreeClassifier


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "heart attack analysis.csv"


def load_data():
    data = pd.read_csv(DATA_PATH)
    features = data.drop(columns="output")
    target = data["output"]
    return data, features, target


def naive_bayes_models(features, target):
    """Compare Gaussian, Multinomial, and Bernoulli Naive Bayes."""
    x_train, x_test, y_train, y_test = train_test_split(
        features, target, test_size=0.2, random_state=42, stratify=target
    )
    models = {
        "GaussianNB": Pipeline([("scale", StandardScaler()), ("model", GaussianNB())]),
        "MultinomialNB": Pipeline(
            [("scale", MinMaxScaler()), ("model", MultinomialNB())]
        ),
        "BernoulliNB": Pipeline(
            [("scale", MinMaxScaler()), ("model", BernoulliNB(binarize=0.5))]
        ),
    }
    print("\nNaive Bayes classification")
    for name, model in models.items():
        model.fit(x_train, y_train)
        print(f"{name}: {accuracy_score(y_test, model.predict(x_test)):.3f}")


def decision_tree_comparison(features, target):
    """Compare tree criteria and the requested regularisation parameters."""
    x_train, x_test, y_train, y_test = train_test_split(
        features, target, test_size=0.2, random_state=42, stratify=target
    )
    settings = [
        {"criterion": "gini", "min_samples_split": 2, "min_samples_leaf": 1, "max_depth": 3},
        {"criterion": "entropy", "min_samples_split": 5, "min_samples_leaf": 2, "max_depth": 5},
        {"criterion": "log_loss", "min_samples_split": 10, "min_samples_leaf": 4, "max_depth": None},
    ]
    print("\nDecision-tree parameter comparison")
    for setting in settings:
        model = DecisionTreeClassifier(random_state=42, **setting)
        model.fit(x_train, y_train)
        score = accuracy_score(y_test, model.predict(x_test))
        print(f"{setting} -> accuracy: {score:.3f}")


def svm_grid_search(features, target):
    """Tune an SVC and an SVR using the same clinical dataset."""
    x_train, x_test, y_train, y_test = train_test_split(
        features, target, test_size=0.2, random_state=42, stratify=target
    )
    classifier = GridSearchCV(
        Pipeline([("scale", StandardScaler()), ("model", SVC())]),
        {"model__C": [0.1, 1, 10], "model__gamma": ["scale", 0.1], "model__kernel": ["rbf", "linear"]},
        cv=5,
        scoring="accuracy",
    )
    classifier.fit(x_train, y_train)
    print("\nSVM classification")
    print("Best parameters:", classifier.best_params_)
    print("Test accuracy:", f"{classifier.score(x_test, y_test):.3f}")

    # Regression predicts cholesterol from the remaining clinical measurements.
    regression_features = features.drop(columns="chol")
    x_train, x_test, y_train, y_test = train_test_split(
        regression_features, features["chol"], test_size=0.2, random_state=42
    )
    regressor = GridSearchCV(
        Pipeline([("scale", StandardScaler()), ("model", SVR())]),
        {"model__C": [0.1, 1, 10], "model__epsilon": [0.1, 1, 5], "model__kernel": ["rbf", "linear"]},
        cv=5,
        scoring="neg_mean_squared_error",
    )
    regressor.fit(x_train, y_train)
    predictions = regressor.predict(x_test)
    print("\nSVM regression (cholesterol target)")
    print("Best parameters:", regressor.best_params_)
    print("Test RMSE:", f"{mean_squared_error(y_test, predictions) ** 0.5:.2f}")
    return classifier.best_estimator_


def plot_svm_hyperplane(features, target):
    """Plot a linear SVC hyperplane using age, maximum heart rate, and cholesterol."""
    columns = ["age", "thalachh", "chol"]
    x = StandardScaler().fit_transform(features[columns])
    model = SVC(kernel="linear", C=1).fit(x, target)
    figure = plt.figure(figsize=(9, 7))
    axis = figure.add_subplot(111, projection="3d")
    axis.scatter(x[:, 0], x[:, 1], x[:, 2], c=target, cmap="coolwarm", alpha=0.75)
    grid_x, grid_y = np.meshgrid(
        np.linspace(x[:, 0].min(), x[:, 0].max(), 20),
        np.linspace(x[:, 1].min(), x[:, 1].max(), 20),
    )
    weights = model.coef_[0]
    grid_z = (-model.intercept_[0] - weights[0] * grid_x - weights[1] * grid_y) / weights[2]
    axis.plot_surface(grid_x, grid_y, grid_z, alpha=0.25, color="green")
    axis.set(xlabel="age (scaled)", ylabel="thalachh (scaled)", zlabel="chol (scaled)")
    axis.set_title("Linear SVM separating hyperplane")
    plt.tight_layout()
    plt.show()


def logic_gate(gate):
    """Train AND with one perceptron and XOR with two trained perceptron layers."""
    x = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
    def train_perceptron(inputs, labels):
        weights = np.zeros(inputs.shape[1])
        bias = 0.0
        for _ in range(50):
            errors = 0
            for row, expected in zip(inputs, labels):
                prediction = float(np.dot(row, weights) + bias >= 0)
                update = expected - prediction
                weights += update * row
                bias += update
                errors += int(update != 0)
            if errors == 0:
                break
        return weights, bias

    if gate == "AND":
        weights, bias = train_perceptron(x, np.array([0, 0, 0, 1], dtype=float))
        predictions = ((x @ weights + bias) >= 0).astype(int)
    else:
        # OR and AND form a linearly separable hidden representation of XOR.
        or_weights, or_bias = train_perceptron(x, np.array([0, 1, 1, 1], dtype=float))
        and_weights, and_bias = train_perceptron(x, np.array([0, 0, 0, 1], dtype=float))
        hidden = np.column_stack(
            [
                ((x @ or_weights + or_bias) >= 0).astype(float),
                ((x @ and_weights + and_bias) >= 0).astype(float),
            ]
        )
        output_weights, output_bias = train_perceptron(hidden, np.array([0, 1, 1, 0], dtype=float))
        predictions = ((hidden @ output_weights + output_bias) >= 0).astype(int)
        print("\nXOR uses two perceptron layers because one perceptron is not linearly separable.")
    print(f"{gate} perceptron predictions: {predictions.tolist()}")


def backpropagation_and_kmeans(features, target):
    """Use sklearn for a backpropagation neural network and K-means clustering."""
    x_train, x_test, y_train, y_test = train_test_split(
        features, target, test_size=0.2, random_state=42, stratify=target
    )
    network = Pipeline(
        [("scale", StandardScaler()), ("model", MLPClassifier(hidden_layer_sizes=(16, 8), max_iter=2000, random_state=42))]
    )
    network.fit(x_train, y_train)
    print("\nBackpropagation neural network accuracy:", f"{network.score(x_test, y_test):.3f}")

    scaled = StandardScaler().fit_transform(features)
    clusters = KMeans(n_clusters=2, n_init=20, random_state=42).fit_predict(scaled)
    print("K-means silhouette score:", f"{silhouette_score(scaled, clusters):.3f}")
    print("Cluster sizes:", np.bincount(clusters).tolist())


def main():
    data, features, target = load_data()
    print(f"Loaded {len(data)} patient records from {DATA_PATH.name}")
    naive_bayes_models(features, target)
    decision_tree_comparison(features, target)
    svm_grid_search(features, target)
    plot_svm_hyperplane(features, target)
    logic_gate("AND")
    logic_gate("XOR")
    backpropagation_and_kmeans(features, target)


if __name__ == "__main__":
    main()