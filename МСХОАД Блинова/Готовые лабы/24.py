# ==========================================
# 1. Импорт библиотек и начальные данные
# ==========================================
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor, plot_tree
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

# Создаем тестовый массив
X = np.array([[0, 1, 0, 1], [1, 0, 1, 1], [0, 0, 0, 1], [1, 0, 1, 0]])
y = np.array([0, 1, 0, 1])

counts = {}
for label in np.unique(y):
    # Приводим к int, чтобы вывод был красивым
    counts[int(label)] = X[y == label].sum(axis=0) 

print("Частоты признаков:\n{}".format(counts))

# ==========================================
# 2. Классификация (Breast Cancer)
# ==========================================
cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, stratify=cancer.target, random_state=42
)

# --- Дерево без ограничений (для проверки переобучения) ---
tree_full = DecisionTreeClassifier(random_state=0)
tree_full.fit(X_train, y_train)
print("\nПравильность на обучающем наборе (без ограничений): {:.3f}".format(tree_full.score(X_train, y_train)))
print("Правильность на тестовом наборе (без ограничений): {:.3f}".format(tree_full.score(X_test, y_test)))

# --- Дерево с ограничением глубины (для красивого графика) ---
tree = DecisionTreeClassifier(max_depth=4, random_state=0)
tree.fit(X_train, y_train)
print("\nПравильность на обучающем наборе (глубина 4): {:.3f}".format(tree.score(X_train, y_train)))
print("Правильность на тестовом наборе (глубина 4): {:.3f}".format(tree.score(X_test, y_test)))

# ==========================================
# 3. Визуализация дерева (Вариант 1: plot_tree)
# ==========================================
print("\nСтроим график дерева решений...")
plt.figure(figsize=(20, 10)) # Задаем большой размер, чтобы текст был читаемым
plot_tree(
    tree, 
    feature_names=cancer.feature_names, 
    class_names=["malignant", "benign"], 
    filled=True,    # Раскрашивает узлы в цвета классов
    rounded=True,   # Скругляет углы
    fontsize=10
)
plt.title("Дерево решений для набора Breast Cancer (глубина 4)")
plt.show()

# ==========================================
# 4. Важность признаков (Feature Importance)
# ==========================================
# Используем полное дерево, чтобы увидеть важность всех признаков
print("\nВажности признаков:\n{}".format(tree_full.feature_importances_))

def plot_feature_cancer(model):
    n_features = cancer.data.shape[1]
    plt.figure(figsize=(10, 8))
    plt.barh(range(n_features), model.feature_importances_, align='center')
    plt.yticks(np.arange(n_features), cancer.feature_names)
    plt.xlabel("Важность признака")
    plt.ylabel("Признак")
    plt.title("Важность признаков (Breast Cancer)")
    plt.tight_layout()
    plt.show()

plot_feature_cancer(tree_full)

# ==========================================
# 5. Регрессия (RAM Price)
# ==========================================
print("\nПереходим к регрессии...")

# Пытаемся загрузить файл, если его нет - генерируем синтетические данные
try:
    ram_prices = pd.read_csv("ram_price.csv") 
except FileNotFoundError:
    print("[ВНИМАНИЕ] Файл ram_price.csv не найден. Генерируем тестовые данные для графика...")
    dates = np.arange(1950, 2020)
    # Имитация падения цены с течением времени
    prices = 10**(8 - 0.15*(dates-1950) + np.random.normal(0, 0.1, len(dates)))
    ram_prices = pd.DataFrame({'date': dates, 'price': prices})

# Исходный график
plt.figure(figsize=(10, 6))
plt.semilogy(ram_prices.date, ram_prices.price)
plt.xlabel("Год")
plt.ylabel("Цена $/Мбайт")
plt.title("Историческое развитие цен на RAM (лог. шкала)")
plt.show()

# Разделение данных (до 2000 и после)
data_train = ram_prices[ram_prices.date < 2000]
data_test = ram_prices[ram_prices.date >= 2000]

# Логарифмирование и подготовка признаков
y_train = np.log(data_train.price)
X_train = data_train.date.values[:, np.newaxis] 

# Обучение моделей
tree_reg = DecisionTreeRegressor().fit(X_train, y_train)
linear_reg = LinearRegression().fit(X_train, y_train)

# Предсказание на всех данных
X_all = ram_prices.date.values[:, np.newaxis]

pred_tree = tree_reg.predict(X_all)
pred_lr = linear_reg.predict(X_all)

# Возврат из логарифмической шкалы
price_tree = np.exp(pred_tree)
price_lr = np.exp(pred_lr)

# Построение итогового графика прогнозов
plt.figure(figsize=(10, 6))
plt.semilogy(data_train.date, data_train.price, label="Обучающие данные", color='black')
plt.semilogy(data_test.date, data_test.price, label="Тестовые данные", color='gray', linestyle=':')
plt.semilogy(ram_prices.date, price_tree, label="Прогнозы дерева решений", color='red')
plt.semilogy(ram_prices.date, price_lr, label="Прогнозы линейной регрессии", color='blue')
plt.xlabel("Год")
plt.ylabel("Цена $/Мбайт")
plt.title("Сравнение прогнозов дерева и линейной регрессии")
plt.legend()
plt.show()

print("\nЛабораторная работа завершена успешно!")