---
id: data-viz-04
title: Visualizing Textual Patterns
moduleId: data-visualization
prerequisites:
  - data-viz-03
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Map text analysis output (Counter objects) to Matplotlib charts
  - Visualize the most common words in a corpus while handling stopwords
  - Understand Lexical Dispersion as a way to visualize narrative time
  - Compare word usage patterns across different texts
keywords:
  - frequency
  - dispersion
  - corpus-viz
  - textual-data
  - nltk
---

# Visualizing Textual Patterns

  ## Turning Words into Shapes
  In Digital Humanities, we often move from "Close Reading" (analyzing a single page) to "Distant Reading" (analyzing a whole library). To do this effectively, we must turn our linguistic counts into visual evidence.

  ---

  ## 1. The "Tuple Problem"
  In the Text Analysis module, we learned that `Counter.most_common()` gives us a list of tuples:
  `[('the', 10), ('whale', 5)]`

  However, Matplotlib needs two separate lists: one for **labels** (the words) and one for **values** (the counts). We can use a **List Comprehension** to "unzip" these tuples:

  ```python
  from collections import Counter
  import matplotlib.pyplot as plt

  text = "the whale the sea the whale ship"
  counts = Counter(text.split())
  top_words = counts.most_common(2) 

  # Unzipping the tuples
  words = [item[0] for item in top_words]  # ['the', 'whale']
  freqs = [item[1] for item in top_words]  # [3, 2]

  plt.bar(words, freqs)
  plt.title("Word Frequency in Moby Dick Snippet")
  plt.show()
  ```

  ---

  ## 2. Lexical Dispersion: Narrative Time
  A **Lexical Dispersion Plot** is a uniquely DH way of looking at a book. Imagine the X-axis is the timeline of a novel (from the first word to the last). A dispersion plot draws a vertical line every time a specific word appears.

  - **Use Case**: Does the word "Ghost" appear only at the end of the story? Does the word "Marriage" appear in the first chapter and then disappear until the last?
  - **Visualization**: This helps scholars see the "thematic rhythm" of a text without reading the whole thing.

  ---

  ## 3. Comparative Visualization
  To compare two authors, we often use side-by-side bar charts (subplots). This reveals **Stylometry**—the study of linguistic style. For example, you might find that while two authors write about "Death," one uses the word as a noun while the other uses it as an adjective.

  :::tip
  **Filter the Noise**: If you plot your frequencies without removing "Stopwords" (the, and, of, is), your chart will always look the same regardless of the book. Always clean your text *before* plotting to see the words that actually matter to your research.
  :::

  :::challenge
  Before you can create a chart, you must be able to extract the frequency data correctly. In the challenge in the sandbox, use the `Counter` object to find the most frequent words in a short string.
  :::
  

---challenges---

### Challenge: Prepare Frequency Data

- id: data-viz-04-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
from collections import Counter

  text = "the the the and and or"

  # Goal: 
  # 1. Split the text into individual words
  # 2. Use Counter to find the 2 most common words
  # 3. Print the resulting list of tuples

  # Your code here
  
```

#### Expected Output

```
[('the', 3), ('and', 2)]
```

#### Hints

1. Use words = text.split() first.
2. Initialize your Counter with that list of words.
3. Call the .most_common(2) method on your counter object.

#### Solution

```python
from collections import Counter

  text = "the the the and and or"

  # Split and Count
  words = text.split()
  counts = Counter(words)

  # Get top 2
  top_words = counts.most_common(2)

  print(top_words)
```

### Challenge: Plotting Most Common Words

- id: data-viz-04-c2
- language: python
- difficulty: intermediate

#### Starter Code

```python
import matplotlib.pyplot as plt
plt.clf()
from collections import Counter

text = "whale whale whale sea sea ship ship ship ship sea sea"
counts = Counter(text.split())
top_words = counts.most_common(3)

# 1. Use list comprehension to 'unzip' top_words into two lists:
#    words (the strings) and freqs (the integers)
# 2. Create a bar chart
# 3. Add a Y-axis label: "Frequency"

# Your code here
```

#### Expected Output

```
plt.show() called
```

#### Hints

1. words = [item[0] for item in top_words] extracts the labels.
2. freqs = [item[1] for item in top_words] extracts the counts.
3. Use plt.ylabel('Frequency') for the axis label.

#### Solution

```python
import matplotlib.pyplot as plt
plt.clf()
from collections import Counter

text = "whale whale whale sea sea ship ship ship ship sea sea"
counts = Counter(text.split())
top_words = counts.most_common(3)

words = [item[0] for item in top_words]
freqs = [item[1] for item in top_words]

plt.bar(words, freqs)
plt.ylabel('Frequency')
plt.title('Top Word Frequencies')
plt.show()
```

