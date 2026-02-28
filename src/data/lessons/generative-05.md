---
id: generative-05
title: Visualizing Poetry
moduleId: generative-poetics
prerequisites:
  - data-visualization
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Map text strings to 2D coordinates (X, Y)
  - Use Matplotlib to render text-based art
  - Randomize visual properties (size, color, position)
keywords:
  - matplotlib
  - concrete poetry
  - visualization
  - spatial
---

# Visualizing Poetry

## Analogy
Think of a **Concrete Poem** (like George Herbert’s "Easter Wings"). The words are not just meant to be read; they are meant to be *seen*. The shape of the poem on the page is part of its meaning. In this lesson, we treat the screen as a canvas and the words as physical objects with coordinates.

## Key Concepts
Instead of printing text line-by-line, we can use a plotting library like `matplotlib` to place words anywhere on an X/Y axis.

```python
import matplotlib.pyplot as plt

# Create a blank plot
plt.figure(figsize=(5,5))
# Place a word at X=0.5, Y=0.5
plt.text(0.5, 0.5, "CENTER", fontsize=20, ha='center')
plt.xlim(0, 1)
plt.ylim(0, 1)
plt.show()
```

By using a loop and `random.random()`, we can scatter words across the screen to create "Atmospheric" or "Chaotic" poetry.

## Practice
:::try-it
Run the code above and try changing the `fontsize` or the `0.5` coordinates. Note how the coordinate system works (0,0 is bottom-left).
:::

## Transfer
Visualizing text allows us to represent "uncertainty" or "distance." For example, you could plot words from a novel where the "heavier" words (high frequency) are larger, or "sad" words are placed lower on the Y-axis.

:::challenge
Create a "Word Rain" visualization. Loop through a list of words and plot each one at a random X position, but with a Y position that decreases slightly each time, like they are falling.
:::

---challenges---

### Challenge: Generate Word Rain

- id: generative-05-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
import matplotlib.pyplot as plt
import random

words = ["pitter", "patter", "drip", "drop", "rain", "fall"]

plt.figure(figsize=(5,5))

y_pos = 0.9  # Starting height

for w in words:
    x_pos = random.random() # Random float between 0 and 1
    
    # 1. Plot the word 'w' at x_pos and y_pos
    # Use plt.text(x, y, word)
    
    # 2. Subtract 0.1 from y_pos so the next word is lower
    
    # Your code here

plt.xlim(0, 1)
plt.ylim(0, 1)
plt.show()
```

#### Expected Output

```
(A plot showing the words scattered horizontally but stepping downwards)
```

#### Hints

1. The function is `plt.text(x_pos, y_pos, w)`.
2. Don't forget to update `y_pos = y_pos - 0.1` inside the loop.

#### Solution

```python
import matplotlib.pyplot as plt
import random

words = ["pitter", "patter", "drip", "drop", "rain", "fall"]
plt.figure(figsize=(5,5))
y_pos = 0.9

for w in words:
    x_pos = random.random()
    plt.text(x_pos, y_pos, w, fontsize=12)
    y_pos -= 0.1

plt.xlim(0, 1)
plt.ylim(0, 1)
plt.show()
```

