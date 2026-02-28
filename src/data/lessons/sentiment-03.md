---
id: sentiment-03
title: Plotting Emotional Arcs
moduleId: sentiment-analysis
prerequisites:
  - sentiment-02
  - data-visualization-02
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Segment long-form text into narrative chunks for longitudinal analysis
  - Explain the relationship between "noise" and "signal" in sentiment data
  - Apply rolling averages (moving windows) using the Pandas library
  - Interpret narrative "shapes" such as the Tragedy or the Man in a Hole
keywords:
  - narrative arc
  - rolling average
  - smoothing
  - syuzhet
  - pandas
  - time-series
---

# Plotting Emotional Arcs

In Digital Humanities, we often treat a book not as a single object, but as a **timeline**. By measuring sentiment from the first page to the last, we can visualize the "Emotional Arc" or "Shape" of a story.

## The Problem of Noise

If you plot the sentiment of every single sentence in a novel, the resulting graph looks like "static" or "noise." This is because a happy chapter might still contain a sentence like *"He died of laughter,"* which a computer sees as negative.

To see the **signal** (the overall trend) through the **noise** (individual word fluctuations), we use a **Rolling Average**.

## The Workflow

### 1. Segmentation (Chunking)
We break the text into equal parts. In DH, we often use "windows" of 100 or 500 words rather than chapters, because chapters vary in length.

```python
# Simple split by sentence
sentences = full_text.split('.')
```

### 2. The Sentiment Timeline
We run VADER on every chunk and store the compound score in a list. This creates a **Time Series**. Using the `vaderSentiment` library (from the previous lesson) the full pipeline looks like this:

```python
import micropip
await micropip.install("vaderSentiment")
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

sia = SentimentIntensityAnalyzer()

# Score every chunk and collect the compound values
timeline = [sia.polarity_scores(chunk)['compound'] for chunk in chunks]
# e.g. [0.1, 0.2, -0.5, -0.6, 0.1, 0.8]
```

### 3. Smoothing with Pandas
We use the **Pandas** library to calculate a "Moving Average." This replaces each score with the average of itself and its neighbors. This "smooths" the jagged peaks into a readable curve.

```python
import pandas as pd

# Convert list to a Pandas Series
series = pd.Series(timeline)

# Calculate average using a window of 10 sentences
smoothed_arc = series.rolling(window=10).mean()
```

## Narrative Shapes

There is an idea that most stories follow specific shapes:
*   **"Rags to Riches"**: A steady rise in sentiment.
*   **"Tragedy/Oedipus"**: A steady fall.
*   **"Person in a Hole"**: Fall, then a rise.
*   **"Cinderella"**: Rise, fall, then a massive rise.

---

## Practice

:::try-it
**Conceptualizing Windows**
If you have a window size of 1 (no smoothing), your graph is a zigzag. If your window size is 10,000 (the whole book), your graph is a flat line. Success in DH often involves finding the "Goldilocks" window size that shows the arc without losing too much detail.
:::

## Transfer

*   **Literary Studies**: Comparing the emotional arcs of 19th-century British novels vs. American novels.
*   **Film Studies**: Analyzing screenplays to see if "Action" movies have more frequent sentiment fluctuations than "Dramas."
*   **History**: Mapping the "rhetorical heat" of a long-running parliamentary debate to find the moment of peak tension.

:::challenge
Smooth a jagged list of sentiment scores and identify the turning points.
:::

---challenges---

### Challenge: Smoothing the Arc

- id: sentiment-03-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
import pandas as pd

# Raw sentiment scores from a short story
# Notice the "noise": 0.8 followed immediately by -0.8
raw_scores = [0.5, 0.6, 0.8, -0.8, -0.2, -0.5, 0.1, 0.4, 0.9, 1.0]

# 1. Convert the list to a Pandas Series
series = pd.Series(raw_scores)

# 2. Calculate a rolling mean with a window of 3
# Your code here
smoothed = 

# 3. Print the last value of the smoothed arc
print(round(smoothed.iloc[-1], 2))
```

#### Expected Output

```
0.77
```

#### Hints

1. Use `series.rolling(window=3).mean()`.
2. The last value is the average of 0.1, 0.4, and 0.9.
3. Note: The first two values will be `NaN` because a window of 3 needs at least 3 numbers.

#### Solution

```python
import pandas as pd

raw_scores = [0.5, 0.6, 0.8, -0.8, -0.2, -0.5, 0.1, 0.4, 0.9, 1.0]

series = pd.Series(raw_scores)
smoothed = series.rolling(window=3).mean()

print(round(smoothed.iloc[-1], 2))
```

### Challenge: Identifying the Climax

- id: sentiment-03-c2
- language: python
- difficulty: intermediate

#### Starter Code

```python
# A smoothed emotional arc of a story
# 0-2: Introduction, 3-5: Conflict, 6-9: Resolution
scores = [0.1, 0.2, 0.1, -0.4, -0.8, -0.3, 0.2, 0.5, 0.8, 0.9]

# Task: Find the "Darkest Moment" (lowest score) and its position
# 1. Find the minimum value in the list
# 2. Find the index (position) of that value

min_val = 0
min_index = 0

# Your code here

print(f"Darkest moment at index {min_index} with score {min_val}")
```

#### Expected Output

```
Darkest moment at index 4 with score -0.8
```

#### Hints

1. Use `min(scores)` to find the lowest number.
2. Use `scores.index(some_value)` to find where it is in the list.

#### Solution

```python
scores = [0.1, 0.2, 0.1, -0.4, -0.8, -0.3, 0.2, 0.5, 0.8, 0.9]

min_val = min(scores)
min_index = scores.index(min_val)

print(f"Darkest moment at index {min_index} with score {min_val}")
```

