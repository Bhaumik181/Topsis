import sys
import pandas as pd
import numpy as np

def topsis(data, weights, impacts):
    df = data.copy()
    matrix = df.iloc[:, 1:].values.astype(float)

    # Normalize
    norm = matrix / np.sqrt((matrix ** 2).sum(axis=0))

    # Weight
    weights = np.array(weights)
    weighted = norm * weights

    # Ideal best / worst
    ideal_best = []
    ideal_worst = []
    for i in range(len(impacts)):
        if impacts[i] == "+":
            ideal_best.append(weighted[:, i].max())
            ideal_worst.append(weighted[:, i].min())
        else:
            ideal_best.append(weighted[:, i].min())
            ideal_worst.append(weighted[:, i].max())

    ideal_best = np.array(ideal_best)
    ideal_worst = np.array(ideal_worst)

    # Distance
    dist_best = np.sqrt(((weighted - ideal_best) ** 2).sum(axis=1))
    dist_worst = np.sqrt(((weighted - ideal_worst) ** 2).sum(axis=1))

    # Score
    score = dist_worst / (dist_best + dist_worst)
    df["Topsis Score"] = score
    df["Rank"] = df["Topsis Score"].rank(ascending=False).astype(int)

    return df.sort_values("Rank")


if __name__ == "__main__":
    input_file = sys.argv[1]
    weights = list(map(float, sys.argv[2].split(",")))
    impacts = sys.argv[3].split(",")
    output_file = sys.argv[4]

    data = pd.read_csv(input_file)
    result = topsis(data, weights, impacts)
    result.to_csv(output_file, index=False)
    print("TOPSIS done")
