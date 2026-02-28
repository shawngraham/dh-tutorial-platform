---
id: data-viz-06
title: Creating Timelines from Historical Data
moduleId: data-visualization
prerequisites:
  - data-viz-02
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Represent historical events as structured dictionary objects
  - Use lambda functions to sort complex datasets chronologically
  - Compute time spans (intervals) between events to analyze density
  - Identify and extract the longest periods of silence or activity in an archive
keywords:
  - timeline
  - chronology
  - temporal data
  - dates
  - history
  - lambda
---

# Creating Timelines from Historical Data

  ## The Clothesline of History
  A timeline is a **clothesline for history**. Imagine stringing a line across a room and pegging cards to it—each card has a date and an event. 

  The line gives you spatial intuition about temporal relationships: which events cluster together (density), where the long gaps are (silence), and what happened in parallel. In the Digital Humanities, we use code to build "clotheslines" for thousands of events, helping us visualize patterns across centuries of archival data.

  ---

  ## 1. Structuring Events as Data
  Before you can build a timeline, each event needs a minimum of two attributes: **When** it happened and **What** it was. We use a list of dictionaries to keep this metadata organized.

  ```python
  events = [
      {"year": 1818, "event": "Frankenstein published"},
      {"year": 1847, "event": "Jane Eyre published"},
      {"year": 1813, "event": "Pride and Prejudice published"}
  ]
  ```

  ---

  ## 2. Sorting with Lambda Functions
  Archives rarely arrive in chronological order. To sort a list of dictionaries, we have to tell Python which "key" to look at. We use a **lambda function**—a tiny, one-line function that acts as a pointer.

  ```python
  # "Sort the events. For every element (e), use e['year'] as the basis for sorting."
  chronological = sorted(events, key=lambda e: e["year"])

  for e in chronological:
      print(f"{e['year']}: {e['event']}")
  ```

  ---

  ## 3. Computing Time Spans (Density)
  The gaps between events are often as informative as the events themselves. A "burst" of publications might signal a literary movement; a long "silence" might suggest a period of war, economic depression, or censorship.

  To calculate these gaps, we loop through our sorted years and subtract the **previous** year from the **current** year:

  ```python
  # Calculate the gap between consecutive items
  for i in range(1, len(years)):
      gap = years[i] - years[i-1]
      print(f"Gap: {gap} years")
  ```

  ---

  ## 4. Questioning Periodization
  In DH, timelines allow us to test "periodization"—the way historians group years into blocks like "The Romantic Era" or "The Victorian Age." By calculating the density of events, we can see if our data actually fits those traditional labels or if the "rhythm" of history suggests a different story.

  :::tip
  **The Running Maximum**: To find the "longest gap," you initialize a variable at 0. As you loop through the gaps, you check: *"Is this current gap bigger than my record?"* If yes, you update your record. This is a fundamental pattern in data analysis.
  :::

  ## 5. Visualizing the Timeline (The Stem Plot)
  To turn our list of events into a "nice" plot, we use a **Stem Plot** approach. Instead of just putting dots on a line, we draw vertical "stems" of different heights. This staggers the text so the labels don't overlap.

  Key Matplotlib functions for timelines:
  - `plt.axhline(0)`: Draws the horizontal "clothesline."
  - `plt.text(x, y, label)`: Places the event title at a specific year (x) and height (y).
  - `plt.vlines(x, 0, y)`: Draws the vertical stem connecting the line to the text.

  :::tip
  To stagger labels automatically, you can use the "Modulo" operator (`%`). 
  If you have a list of heights like `[1, -1, 2, -2]`, the code `heights[i % 4]` will cycle through those four heights repeatedly as you loop through your events.
  :::

  :::challenge
  In the first challenge, you will sort a list of literary milestones. In the second, you will identify the "Great Silence"—the longest gap between any two publications in the list. In the third, you'll plot a timeline.
  :::

---challenges---

### Challenge: Build a Sorted Timeline

- id: data-viz-06-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
# Sort these literary events chronologically
  events = [
      {"year": 1847, "event": "Jane Eyre published"},
      {"year": 1818, "event": "Frankenstein published"},
      {"year": 1891, "event": "Tess of the d'Urbervilles published"},
      {"year": 1813, "event": "Pride and Prejudice published"},
      {"year": 1859, "event": "A Tale of Two Cities published"},
      {"year": 1851, "event": "Moby-Dick published"},
  ]

  # 1. Sort the events by the "year" key
  # 2. Loop through the sorted list
  # 3. Print each event in the format: "year - event"

  # Your code here
  
```

#### Expected Output

```
1813 - Pride and Prejudice published
1818 - Frankenstein published
1847 - Jane Eyre published
1851 - Moby-Dick published
1859 - A Tale of Two Cities published
1891 - Tess of the d'Urbervilles published
```

#### Hints

1. Use sorted_list = sorted(events, key=lambda e: e["year"])
2. Use an f-string for the print: f"{e['year']} - {e['event']}"

#### Solution

```python
events = [
      {"year": 1847, "event": "Jane Eyre published"},
      {"year": 1818, "event": "Frankenstein published"},
      {"year": 1891, "event": "Tess of the d'Urbervilles published"},
      {"year": 1813, "event": "Pride and Prejudice published"},
      {"year": 1859, "event": "A Tale of Two Cities published"},
      {"year": 1851, "event": "Moby-Dick published"},
  ]

  # Sort chronologically
  chronological = sorted(events, key=lambda e: e["year"])

  # Print formatted timeline
  for e in chronological:
      print(f"{e['year']} - {e['event']}")
```

### Challenge: Compute the Longest Gap

- id: data-viz-06-c2
- language: python
- difficulty: intermediate

#### Starter Code

```python
# Identify the longest temporal gap between publications
  events = [
      {"year": 1847, "event": "Jane Eyre published"},
      {"year": 1818, "event": "Frankenstein published"},
      {"year": 1891, "event": "Tess of the d'Urbervilles published"},
      {"year": 1813, "event": "Pride and Prejudice published"},
      {"year": 1859, "event": "A Tale of Two Cities published"},
      {"year": 1851, "event": "Moby-Dick published"},
  ]

  # 1. Sort the events by year
  # 2. Extract just the years into a new list
  # 3. Loop through the years and find the gap (Year[i] - Year[i-1])
  # 4. Keep track of which gap is the largest
  # 5. Print the gaps and the final longest gap

  # Your code here
  
```

#### Expected Output

```
1813 -> 1818: 5 years
1818 -> 1847: 29 years
1847 -> 1851: 4 years
1851 -> 1859: 8 years
1859 -> 1891: 32 years
Longest gap: 32 years (1859 to 1891)
```

#### Hints

1. Start your loop at range(1, len(years)) to avoid comparing the first year to nothing.
2. Use variables like max_gap, gap_start, and gap_end to store the record-breaking gap.
3. If gap > max_gap: update your variables.

#### Solution

```python
events = [
      {"year": 1847, "event": "Jane Eyre published"},
      {"year": 1818, "event": "Frankenstein published"},
      {"year": 1891, "event": "Tess of the d'Urbervilles published"},
      {"year": 1813, "event": "Pride and Prejudice published"},
      {"year": 1859, "event": "A Tale of Two Cities published"},
      {"year": 1851, "event": "Moby-Dick published"},
  ]

  # Step 1: Sort
  sorted_events = sorted(events, key=lambda e: e["year"])
  years = [e["year"] for e in sorted_events]

  # Step 2: Trackers
  max_gap = 0
  start_year = 0
  end_year = 0

  # Step 3: Loop through gaps
  for i in range(1, len(years)):
      gap = years[i] - years[i-1]
      print(f"{years[i-1]} -> {years[i]}: {gap} years")
      
      # Step 4: Update record if this gap is the largest
      if gap > max_gap:
          max_gap = gap
          start_year = years[i-1]
          end_year = years[i]

  # Step 5: Final report
  print(f"Longest gap: {max_gap} years ({start_year} to {end_year})")
```

### Challenge: Plotting the Timeline

- id: data-viz-06-c3
- language: python
- difficulty: intermediate

#### Starter Code

```python
import matplotlib.pyplot as plt

# 1. Clear the figure to start fresh
plt.clf()

events = [
    {"year": 1813, "title": "Pride & Prejudice"},
    {"year": 1818, "title": "Frankenstein"},
    {"year": 1847, "title": "Jane Eyre"},
    {"year": 1851, "title": "Moby-Dick"},
    {"year": 1859, "title": "Two Cities"},
    {"year": 1891, "title": "Tess"}
]

# A list of heights to stagger our labels
levels = [1, -1, 1.5, -1.5]

# Draw the baseline
plt.axhline(0, color="black", linewidth=2)

# 2. Complete the loop to draw stems and labels
for i, e in enumerate(events):
    year = e["year"]
    title = e["title"]
    
    # Use the modulo operator (%) to cycle through the 'levels' list
    # replace the ???
    h = levels[???]
    
    # Draw a vertical line (stem) from the year on the axis (0) to height (h); replace the ???
    plt.vlines(year, 0, ???, color="gray", linestyle="--")
    
    # Add the text label at the top/bottom of the stem
    # Syntax: plt.text(x_position, y_position, string_to_print)
    plt.text(year, h, ???, ha='center')

# 3. Final cleanup
plt.ylim(-2, 2)
plt.title("Literary Milestones Timeline")
plt.yticks([]) # Remove Y-axis numbers for a cleaner look
plt.show()
```

#### Expected Output

```
plt.show() called
```

#### Hints

1. To cycle through the levels using index 'i', use: i % len(levels)
2. For plt.vlines, the three required arguments here are the year, the start (0), and the end height (h).
3. In the plt.text function, the third argument should be the 'title' variable you extracted from the dictionary.

#### Solution

```python
import matplotlib.pyplot as plt

plt.clf()

events = [
    {"year": 1813, "title": "Pride & Prejudice"},
    {"year": 1818, "title": "Frankenstein"},
    {"year": 1847, "title": "Jane Eyre"},
    {"year": 1851, "title": "Moby-Dick"},
    {"year": 1859, "title": "Two Cities"},
    {"year": 1891, "title": "Tess"}
]

levels = [1, -1, 1.5, -1.5]

plt.axhline(0, color="black", linewidth=2)

for i, e in enumerate(events):
    year = e["year"]
    title = e["title"]
    
    # Calculate height by cycling through levels
    h = levels[i % len(levels)]
    
    # Draw stem
    plt.vlines(year, 0, h, color="gray", linestyle="--")
    
    # Draw point on the line
    plt.scatter(year, 0, color="red", zorder=3)
    
    # Add label
    plt.text(year, h, title, ha='center')

plt.ylim(-2, 2)
plt.title("Literary Milestones Timeline")
plt.yticks([])
plt.show()
```

