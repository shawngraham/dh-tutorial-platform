---
id: data-viz-02
title: Basic Plots with Matplotlib
moduleId: data-visualization
prerequisites:
  - data-viz-01
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Create bar and line charts using Matplotlib
  - Map data lists to X and Y axes
  - Label axes and add titles for scholarly clarity
  - Save plots as high-quality image files for research papers
keywords:
  - matplotlib
  - bar
  - line
  - pyplot
  - axes
---

# Plotting with Matplotlib

  ## The "Grandfather" of Python Viz
  `matplotlib` is the most established plotting library in Python. While there are many newer tools, `matplotlib` remains the "engine" that powers most of them. In DH, we use it to turn the numbers we’ve counted (like word frequencies or publication years) into visual evidence.

  ---

  ## 1. The Pyplot Pipeline
  To create a visualization, we follow a specific order of operations. We usually import the library under the alias `plt`.

  ```python

  # 3. Add Scholarly Metadata (Labels)
  plt.xlabel("Decade of Publication")
  plt.ylabel("Number of Novels")
  plt.title("Growth of the Gothic Novel")

  # 4. Display or Save
  # remember, anything with a # in front of it is a comment,
  # so in this example, you'd remove the # in front of plt.savefig
  plt.show() 
  # plt.savefig("gothic_trends.png", dpi=300) # dpi=300 ensures it's clear for print

  # 5. Memory
  # You'll notice in the code in the sandbox this line:
  # plt.clf()
  # That means 'clear figure' and it's good practice for us _in this sandbox_ to make sure that our canvas is clear and ready for the next plot. On your own computer you won't generally need this.
  ```

  ---

  ## 2. Anatomy of a Plot
  - **The Figure**: The overall window or page where everything is drawn.
  - **The Axes**: The area where the data is actually plotted (the X and Y lines).
  - **Markers/Bars**: The visual representation of your data points.

  ---

  ## 3. Common DH Visualizations

  ### The Line Chart (`plt.plot`)
  Best for "Diachronic Analysis" (looking at changes over time).
  ```python
  # Imagine tracking the word 'electricity' across 3 chapters
  plt.plot([1, 2, 3], [10, 45, 30])
  ```

  ### The Bar Chart (`plt.bar`)
  Best for comparing distinct categories, such as different authors or different archives.

  :::tip
  **Handling Long Labels**: In DH, our labels are often long (like book titles). If your X-axis labels are overlapping and unreadable, add this line before `plt.show()`:
  `plt.xticks(rotation=45)`
  :::

  :::challenge
  Every plot starts with two matching lists: the **Labels** (X) and the **Values** (Y). In the challenge in the sandbox, prepare the data needed to compare the lengths of three famous DH texts.
  :::
  

---challenges---

### Challenge: Prepare Data for a Plot

- id: data-viz-02-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
# load the library you'll use
  import matplotlib.pyplot as plt

  #intialize the plot canvas
  plt.clf()
  
  # 1. Create a list called 'labels' with these 3 titles: 
  #    'Frankenstein', 'Dracula', 'Jane Eyre'
  # 2. Create a list called 'word_counts' with these 3 integers: 
  #    75000, 160000, 180000
  # 3. Print both lists to verify they match in order
  # 4. Plot the data as a bar plot. 

  # Your code here
  
```

#### Expected Output

```
['Frankenstein', 'Dracula', 'Jane Eyre']
[75000, 160000, 180000]
```

#### Hints

1. Ensure the order of counts matches the order of the titles.
2. Strings need quotes; integers do not.
3. Use two separate print statements.
4. plot the barchart with the labels, data
5. Show your plot: plt.show()

#### Solution

```python
import matplotlib.pyplot as plt
  plt.clf()
  labels = ['Frankenstein', 'Dracula', 'Jane Eyre']
  word_counts = [75000, 160000, 180000]
  print(labels)
  print(word_counts)
  plt.bar(labels, word_counts)
  plt.show()
```

