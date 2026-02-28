---
id: data-viz-05
title: 'The Capstone: Comparative Visualization'
moduleId: data-visualization
prerequisites:
  - data-viz-04
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Execute a full DH visualization workflow
  - Compare two datasets side-by-side using subplots
  - Apply aesthetic and ethical principles to a final product
keywords:
  - subplots
  - comparative-analysis
  - capstone
---

# Final Project: Comparing Narratives

In this final step, we combine everything. We will compare the 'thematic weight' of two different text snippets using side-by-side subplots. This is the foundation of **Stylometry** and **Comparative Literature** in the digital age.

### The Workflow:
1. **Clean**: Lowercase the text so 'The' and 'the' are counted together.
2. **Count**: Use `Counter` to find the most frequent terms.
3. **Layout**: Use `plt.subplots(1, 2)` to create a comparative view.
4. **Refine**: Add labels, styles, and titles to make the 'argument' clear.

:::challenge
In the code sandbox, use what you've learned so far to do a complete analytical/visualization sequence.
:::

---challenges---

### Challenge: The Comparative Capstone

- id: data-viz-05-c1
- language: python
- difficulty: advanced

#### Starter Code

```python
import matplotlib.pyplot as plt
plt.clf()
from collections import Counter

# Two snippets of DH 'capta'
text_a = "ghostly mystery ghost mystery shadow ghost"
text_b = "reason logic logic evidence reason logic"

# Goal: Create a 1x2 subplot comparing the top 2 words of each text
# 1. Process text_a and text_b (split and count top 2)
# 2. Create fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
# 3. Plot text_a on ax1 and text_b on ax2
# 4. Set titles for each: "Gothic Terms" and "Scientific Terms"
# 5. Add a figure-level super-title: fig.suptitle('Corpus Comparison')
# 6. Print the suptitle: print(fig.get_suptitle())

# Your code here
```

#### Expected Output

```
Corpus Comparison
```

#### Hints

1. Remember to unzip the tuples for each text separately.
2. Use ax1.bar() instead of plt.bar() when working with subplots.
3. fig.suptitle() sets a title for the whole figure, above both subplot titles — it is different from ax.set_title(), which labels a single panel.
4. Use plt.tight_layout() before plt.show() to keep things tidy.

#### Solution

```python
import matplotlib.pyplot as plt
plt.clf()
from collections import Counter

text_a = "ghostly mystery ghost mystery shadow ghost"
text_b = "reason logic logic evidence reason logic"

# Process A
counts_a = Counter(text_a.split()).most_common(2)
words_a = [i[0] for i in counts_a]
freqs_a = [i[1] for i in counts_a]

# Process B
counts_b = Counter(text_b.split()).most_common(2)
words_b = [i[0] for i in counts_b]
freqs_b = [i[1] for i in counts_b]

# Plot
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))

ax1.bar(words_a, freqs_a, color='purple')
ax1.set_title('Gothic Terms')

ax2.bar(words_b, freqs_b, color='green')
ax2.set_title('Scientific Terms')

fig.suptitle('Corpus Comparison')
print(fig.get_suptitle())
plt.tight_layout()
plt.show()
```

