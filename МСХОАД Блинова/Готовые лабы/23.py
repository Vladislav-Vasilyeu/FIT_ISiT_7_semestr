import numpy as np
from sklearn.naive_bayes import BernoulliNB, MultinomialNB, GaussianNB


# 1. BernoulliNB — бинарные признаки
X = np.array([
    [0, 1, 0, 1],
    [1, 0, 1, 1],
    [0, 0, 0, 1],
    [1, 0, 1, 0]
])
y = np.array([0, 1, 0, 1])

counts = {}
for label in np.unique(y):
    counts[label] = X[y == label].sum(axis=0)

print("Частоты признаков:")
print(counts)

clf = BernoulliNB()
clf.fit(X, y)
print("BernoulliNB predict X[2:3]:")
print(clf.predict(X[2:3]))


# 2. MultinomialNB — счётные/дискретные признаки
rng = np.random.RandomState(1)
X = rng.randint(5, size=(6, 100))
y = np.array([1, 2, 3, 4, 5, 6])

clf = MultinomialNB()
clf.fit(X, y)
print("MultinomialNB predict X[2:3]:")
print(clf.predict(X[2:3]))


# 3. GaussianNB — непрерывные признаки
X = np.array([
    [-1, -1],
    [-2, -1],
    [-3, -2],
    [1, 1],
    [2, 1],
    [3, 2]
])
Y = np.array([1, 1, 1, 2, 2, 2])

clf = GaussianNB()
clf.fit(X, Y)
print("GaussianNB predict [[-0.8, -1]]:")
print(clf.predict([[-0.8, -1]]))

# partial_fit — дообучение по частям
clf_pf = GaussianNB()
clf_pf.partial_fit(X, Y, np.unique(Y))
print("GaussianNB partial_fit predict [[-0.8, -1]]:")
print(clf_pf.predict([[-0.8, -1]]))