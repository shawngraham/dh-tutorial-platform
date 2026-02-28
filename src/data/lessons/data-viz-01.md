---
id: data-viz-01
title: Principles of Effective Visualization
moduleId: data-visualization
prerequisites:
  - python-basics-05
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Understand the rhetorical power of visualization in "Distant Reading"
  - Select the appropriate chart type for specific humanities research questions
  - Apply the "Data-Ink Ratio" to reduce chart junk
  - Identify ethical issues like misleading scales and data silences
keywords:
  - visualization
  - charts
  - design
  - principles
  - ethics
  - distant reading
---

# Principles of Visualization: Argumentation through Design

  ## Why Visualize?
  In the humanities, a visualization is more than a pretty picture; it is an **argument**. Drawing on the general concept of **Distant Reading**, we use charts to see patterns across a corpus of 1,000 books that would be impossible to see through traditional close reading.

  ---

  ## 1. Choosing Your Chart
  The most important step is matching your research question to the correct visual structure.

  | Chart Type | Research Question | DH Example |
  | :--- | :--- | :--- |
  | **Bar Chart** | Comparison | Comparing the number of female vs. male authors in a collection. |
  | **Line Chart** | Change Over Time | Tracking the frequency of the word "science" from 1700 to 1900. |
  | **Scatter Plot** | Correlation | Plotting sentence length against vocabulary diversity in a novel. |
  | **Histogram** | Distribution | Seeing if most poems in a corpus are short (10 lines) or long (100 lines). |

  ---

  ## 2. The Data-Ink Ratio
  Coined by Edward Tufte, the **Data-Ink Ratio** argues that most of the "ink" on a page should be dedicated to the data itself.
  - **Avoid "Chart Junk"**: Remove unnecessary 3D effects, shadows, or distracting background grids.
  - **Simplify**: If a decorative element doesn't help the reader understand the data, delete it.

  ---

  ## 3. Visualization Ethics
  Visuals carry an air of "objectivity," but they can be highly misleading. 
  1. **The Y-Axis Trap**: Starting a bar chart at a number other than zero can make small differences look massive.
  2. **Data Silences**: What is *not* in your chart? If you are visualizing a colonial archive, whose voices are missing? A chart of "total publications" may hide the fact that certain populations were barred from publishing.
  3. **Labels**: Every axis must have a title. A chart without a label is a riddle, not an argument.

  :::definition
  **Capta vs. Data**: Many humanists prefer the term "capta" (taken) over "data" (given) to remind us that our information is always selected and interpreted by researchers, not just found in the world.
  :::

  :::try-it
  When you start building charts in the next lesson, always ask yourself: *"If I deleted the title and labels, would a reader still know what this represents?"* If the answer is no, your design needs work.
  :::
  
  :::challenge
  In the code sandbox, set the variable appropriately and print the result.
  :::

---challenges---

### Challenge: Match the Research Question

- id: data-viz-01-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
# Match the research question to the best chart type.
  # Options: "bar", "line", "scatter"

  # Question 1: I want to see how the use of the word "democracy" 
  # changes year-by-year across the 19th century.
  answer_1 = ___

  # Question 2: I want to compare the total number of letters 
  # written by 5 different historical figures.
  answer_2 = ___

  # Goal: Set the variables correctly and print answer_2
  
```

#### Expected Output

```
bar
```

#### Hints

1. Line charts are best for diachronic analysis (change over time).
2. Bar charts are best for comparing categorical totals (like a list of people).

#### Solution

```python
answer_1 = "line"
  answer_2 = "bar"
  print(answer_2)
```

