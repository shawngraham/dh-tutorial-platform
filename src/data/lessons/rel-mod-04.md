---
id: rel-mod-04
title: Predicting the Unknown
moduleId: relational-models
prerequisites:
  - rel-mod-03
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Explain how models perform "Link Prediction"
  - Calculate the "Error Score" of a predicted triple
  - Understand why models provide a ranked list of candidates rather than one "correct" answer
keywords:
  - link-prediction
  - scoring-function
  - rank
  - candidates
---

# Predicting the Unknown

## Analogy: The Search Party

Imagine you are looking for a lost traveler. You know their starting point (**The Head**) and the direction they were walking (**The Relation**). 

You follow their tracks and arrive at a clearing in the forest. The traveler isn't standing exactly there, but you see three cabins nearby. 
*   **Cabin A** is 10 meters away.
*   **Cabin B** is 50 meters away.
*   **Cabin C** is 200 meters away.

You would conclude that **Cabin A** is the most likely place to find them. In Knowledge Graphs, this is called **Link Prediction**. We calculate where we *should* land, and then look at which real-world entities are closest to that spot.

## Key Concepts

### 1. The Scoring Function
In the previous lesson, we used the formula `Head + Relation = Tail`. In the real world, the math is rarely perfect. The landing spot usually falls in the empty space *near* the actual target. The distance between your "predicted spot" and the "actual entity" is called the **Score**. 

:::definition
**Scoring Function**: A calculation of how "plausible" a triple is. In many models, the lower the distance (score), the more likely the triple is to be true.
:::

```python
# Predicted landing spot [x, y]
prediction = [10, 10]
# Actual entity location
entity_loc = [12, 10]

# Distance (Score) calculation
score = abs(prediction[0] - entity_loc[0]) + abs(prediction[1] - entity_loc[1])
print(f"Plausibility Score: {score}") # Lower is better!
```

### 2. Candidate Ranking
Because models are probabilistic, they don't give one answer. They look at every entity in the archive and **rank** them from the smallest distance to the largest.

```python
predicted_spot = [5, 10]

# Candidate entities and their coordinates
candidates = {
    "Shakespeare": [5, 11],  # Distance: 1
    "Newton": [10, 15],      # Distance: 10
    "Dickens": [4, 8]        # Distance: 3
}

# The model ranks Shakespeare as the #1 prediction.
```

## Practice

:::try-it
In the sandbox, we have a predicted coordinate of `[10, 10]`. There are two entities: `Archive_A` at `[12, 10]` and `Archive_B` at `[20, 10]`. Calculate the distance for both.

```python
pred = [10, 10]
a = [12, 10]
b = [20, 10]

score_a = abs(pred[0] - a[0]) + abs(pred[1] - a[1])
score_b = abs(pred[0] - b[0]) + abs(pred[1] - b[1])

print(f"A Score: {score_a}, B Score: {score_b}")
```
:::

## Transfer: Beyond the Known

Link prediction is used by historians to fill "gaps" in archives. If a 19th-century letter mentions a "Doctor" but the name is smudged, a Knowledge Graph can look at the context—the location, the date, and the social circle—to predict the missing name.

However, we must be careful: a model will only predict things similar to what it has already seen. If your model only knows about male doctors, it will never predict a woman's name for that smudged text, even if she was there. **Ranking is not just math; it is a reflection of the data's history.**

:::challenge
Calculate prediction errors and identify the most likely candidate from a list.
:::

---challenges---

### Challenge: Scoring a Set of Candidates

- id: rel-mod-04-c1
- language: python
- difficulty: intermediate

#### Starter Code
```python
# The model is trying to answer: "Mary_Shelley authored ???"
# Head + Relation gives us a predicted coordinate.
# We then score every candidate by how far they sit from that prediction.

# Coordinates: [Critical_Acclaim, Popular_Reach]
mary_shelley = [7, 6]
authored     = [2, 4]   # Relation vector from rel-mod-03

# Step 1: Calculate the predicted coordinate using TransE (Head + Relation).
# predicted = mary_shelley + authored, element-wise
predicted = []
# Your code here

print(f"Predicted location: {predicted}")   # Expected: [9, 10]

# Step 2: Score each candidate using Manhattan Distance.
# Score = abs(predicted[0] - candidate[0]) + abs(predicted[1] - candidate[1])
# A lower score means a more plausible match.

candidates = {
    "Frankenstein":       [9, 10],
    "The_Last_Man":       [6,  7],
    "Valperga":           [5,  6],
    "Mathilda":           [8,  9],
}

scores = {}
for title, coords in candidates.items():
    # Calculate the Manhattan Distance between predicted and coords
    # Store the result in scores[title]
    # Your code here
    pass

print("Scores:", scores)
# Expected: {'Frankenstein': 0, 'The_Last_Man': 6, 'Valperga': 8, 'Mathilda': 2}
```

#### Expected Output
```
Predicted location: [9, 10]
Scores: {'Frankenstein': 0, 'The_Last_Man': 6, 'Valperga': 8, 'Mathilda': 2}
```

#### Hints

1. For Step 1, add element-wise: `predicted = [mary_shelley[0] + authored[0], mary_shelley[1] + authored[1]]`.
2. For Step 2, the distance formula is `abs(predicted[0] - coords[0]) + abs(predicted[1] - coords[1])`. Assign the result to `scores[title]`.
3. A score of 0 means the prediction landed exactly on the candidate — a perfect match.

#### Solution
```python
mary_shelley = [7, 6]
authored     = [2, 4]

predicted = [mary_shelley[0] + authored[0], mary_shelley[1] + authored[1]]
print(f"Predicted location: {predicted}")

candidates = {
    "Frankenstein":   [9, 10],
    "The_Last_Man":   [6,  7],
    "Valperga":       [5,  6],
    "Mathilda":       [8,  9],
}

scores = {}
for title, coords in candidates.items():
    scores[title] = abs(predicted[0] - coords[0]) + abs(predicted[1] - coords[1])

print("Scores:", scores)
```

### Challenge: Ranking and Confronting Bias

- id: rel-mod-04-c2
- language: python
- difficulty: intermediate

#### Starter Code
```python
# The model is asked: "Who wrote a celebrated work in this archive?"
# It calculates scores for every known entity and returns a ranked list.
# Your job is to produce that ranking — then audit it.

scores = {
    "Frankenstein":              0,
    "The_Last_Man":              6,
    "Valperga":                  8,
    "Mathilda":                  2,
}

# Step 1: Sort the scores dictionary by value (ascending — lowest score first)
# to produce a ranked list of (title, score) pairs.
# Store the result in `ranked`.
ranked = []
# Your code here

print("Ranked predictions:")
for i, (title, score) in enumerate(ranked):
    print(f"  {i+1}. {title} (score: {score})")

# Expected ranking:
# 1. Frankenstein (score: 0)
# 2. Mathilda (score: 2)
# 3. The_Last_Man (score: 6)
# 4. Valperga (score: 8)

# ------------------------------------------------------------------
# Step 2: Now consider a second query on a different archive.
# This archive was built only from published, widely-reviewed works.
# The model is asked: "Who was a Doctor in 19th-century London?"

doctor_scores = {
    "John_Snow":         1,
    "James_Barry":       3,   # Barry was a military surgeon — but recorded
                               # officially as male throughout his career
    "Elizabeth_Blackwell": 18, # First woman on the UK medical register — but
                               # barely represented in this archive
    "Joseph_Lister":     2,
}

# Sort and print the ranking for this query
ranked_doctors = []
# Your code here

print("\nRanked doctor predictions:")
for i, (name, score) in enumerate(ranked_doctors):
    print(f"  {i+1}. {name} (score: {score})")

# Step 3: Reflect.
# Elizabeth Blackwell ranks last despite being historically significant.
# What does this tell you about the relationship between score and truth?
# Complete this sentence:
print("\nA low ranking does not mean: ___")
print("It may instead mean: ___")
```

#### Expected Output
```
Ranked predictions:
  1. Frankenstein (score: 0)
  2. Mathilda (score: 2)
  3. The_Last_Man (score: 6)
  4. Valperga (score: 8)

Ranked doctor predictions:
  1. John_Snow (score: 1)
  2. Joseph_Lister (score: 2)
  3. James_Barry (score: 3)
  4. Elizabeth_Blackwell (score: 18)

A low ranking does not mean: the entity is unimportant or historically absent
It may instead mean: the archive underrepresented that person, so the model has little evidence to place them accurately
```

#### Hints

1. Use `sorted(scores.items(), key=lambda x: x[1])` to sort by score. This returns a list of `(title, score)` tuples in ascending order.
2. The same pattern works for `doctor_scores` — just change the dictionary name.
3. For Step 3, think about *why* Elizabeth Blackwell's score is so high. Is it because she was a bad doctor — or because the archive didn't record her?

#### Solution
```python
scores = {
    "Frankenstein":  0,
    "The_Last_Man":  6,
    "Valperga":      8,
    "Mathilda":      2,
}

ranked = sorted(scores.items(), key=lambda x: x[1])

print("Ranked predictions:")
for i, (title, score) in enumerate(ranked):
    print(f"  {i+1}. {title} (score: {score})")

doctor_scores = {
    "John_Snow":           1,
    "James_Barry":         3,
    "Elizabeth_Blackwell": 18,
    "Joseph_Lister":       2,
}

ranked_doctors = sorted(doctor_scores.items(), key=lambda x: x[1])

print("\nRanked doctor predictions:")
for i, (name, score) in enumerate(ranked_doctors):
    print(f"  {i+1}. {name} (score: {score})")

print("\nA low ranking does not mean: the entity is unimportant or historically absent")
print("It may instead mean: the archive underrepresented that person, so the model has little evidence to place them accurately")
```