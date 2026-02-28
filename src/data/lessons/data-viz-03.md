---
id: data-viz-03
title: Customizing Visualizations
moduleId: data-visualization
prerequisites:
  - data-viz-02
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Modify plot styles and color palettes for readability
  - Create subplots for side-by-side comparative analysis
  - Adjust figure size and DPI to prevent label overlapping
  - Generate dynamic titles using summary statistics
keywords:
  - customization
  - subplots
  - styling
  - dpi
  - accessibility
---

# Customizing Visualizations: From Draft to Publication

  ## Beyond the Defaults
  Default charts are often sufficient for your own eyes, but for a conference presentation or a journal article, we need to tweak the details. This ensures our "visual argument" is both readable and accessible.

  ---

  ## 1. Using Styles
  Matplotlib comes with built-in themes that instantly change the background, gridlines, and fonts. In DH, `fivethirtyeight` and `ggplot` are popular for their high readability.

  ```python
  import matplotlib.pyplot as plt
  plt.clf()

  # List all available styles: print(plt.style.available)
  plt.style.use('fivethirtyeight') 
  ```

  ---

  ## 2. The Figure/Axes Hierarchy
  To create complex layouts (like side-by-side comparisons), we move away from simple commands and use the **Subplots** method. 

  Think of it this way:
  - **Figure (`fig`)**: The entire canvas or poster.
  - **Axes (`ax`)**: The individual frames or charts on that canvas.

  ```python
  # Create a layout with 1 row and 2 columns
  fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

  # Plotting on the first 'frame'
  ax1.bar(["A", "B"], [10, 20])
  ax1.set_title("Genre Distribution")

  # Plotting on the second 'frame'
  ax2.plot([1, 2, 3], [5, 15, 10])
  ax2.set_title("Publication Timeline")

  plt.tight_layout() # Prevents labels from overlapping!
  ```

  ---

  ## 3. Dynamic Titles and Summary Stats
  A professional DH visualization often includes the total count of the corpus in the title so the reader knows the scale of the data. 

  To do this, we calculate the total from our dictionary values:
  ```python
  data = {"Gothic": 15, "Romance": 22}
  total_books = sum(data.values())

  plt.title(f"Corpus Overview (Total: {total_books})")
  ```

  ---

  ## 4. Accessibility and Ethics
  - **Color Palettes**: Use color-blind friendly palettes (like those provided by the `Seaborn` library) to ensure your research is inclusive.
  - **Resolution**: Use `plt.savefig("plot.png", dpi=300)`. Lower DPI will make your text blurry and difficult to read for those with visual impairments.

  :::tip
  The `.values()` method on a dictionary returns only the numbers. Wrapping that in `sum()` gives you an instant total of your dataset.
  :::

  :::challenge
  In the challenge in the sandbox, you will practice generating a dynamic title. This is a vital skill for automated reporting, where your script might analyze a new folder of books every day.
  :::
  

---challenges---

### Challenge: Generate a Summary for a Title

- id: data-viz-03-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
# Data representing book counts per genre
  data = {"Gothic": 15, "Romance": 22, "Adventure": 8}

  # Goal: Calculate the total number of items and print it 
  # exactly in this format: "Total: X"

  # 1. Use sum() and data.values() to find the total
  # 2. Print the result using an f-string or string concatenation

  # Your code here
  
```

#### Expected Output

```
Total: 45
```

#### Hints

1. data.values() will give you [15, 22, 8].
2. sum(data.values()) will add those numbers together.
3. To print exactly "Total: 45", use: print(f"Total: {total_variable}")

#### Solution

```python
data = {"Gothic": 15, "Romance": 22, "Adventure": 8}
  total = sum(data.values())
  print(f"Total: {total}")
```

### Challenge: Style a Visualization

- id: data-viz-03-c2
- language: python
- difficulty: intermediate

#### Starter Code

```python
import matplotlib.pyplot as plt

plt.clf()

data = {"Gothic": 15, "Romance": 22, "Adventure": 8}
genres = list(data.keys())
counts = list(data.values())

# 1. Set the style to 'fivethirtyeight'
# 2. Calculate the sum of counts for a dynamic title
# 3. Create the bar chart and set the title to: "Corpus (Total: X)"
# 4. Print the plot title with: print(plt.gca().get_title())
# 5. Call plt.show()

# Your code here
```

#### Expected Output

```
Corpus (Total: 45)
```

#### Hints

1. Use plt.style.use('fivethirtyeight').
2. total = sum(counts) will give you the number for your title.
3. Use an f-string for the title: plt.title(f'Corpus (Total: {total})')
4. plt.gca() gets the current axes object; .get_title() returns the title string you just set.

#### Solution

```python
import matplotlib.pyplot as plt

plt.clf()

data = {"Gothic": 15, "Romance": 22, "Adventure": 8}
genres = list(data.keys())
counts = list(data.values())

plt.style.use('fivethirtyeight')
total = sum(counts)

plt.bar(genres, counts)
plt.title(f'Corpus (Total: {total})')
print(plt.gca().get_title())
plt.show()
```

