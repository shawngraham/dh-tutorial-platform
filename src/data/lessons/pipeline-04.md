---
id: pipeline-04
title: 'Stage 4: Reporting Results'
moduleId: dh-pipeline
prerequisites:
  - pipeline-03
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Generate a structured text-based research summary from computed results
  - Build a simple ASCII bar chart to visualize comparative data in a terminal
  - Understand that reporting is a methodological act, not merely a cosmetic one
keywords:
  - reporting
  - ASCII visualization
  - methods section
  - research summary
  - bar chart
---

# Stage 4: Reporting Results

## Analogy

An archaeologist who digs a site, catalogs every artifact, and runs statistical analyses has done extraordinary work — but it means nothing if the findings stay in a notebook. The final stage of any research pipeline is **reporting**: transforming your processed data back into human-readable narrative. In DH, this means writing up what you did, what you found, and what it might mean. This lesson teaches you to generate that report programmatically, so the numbers and the narrative stay in sync.

## Key Concepts

### The Report as Method

A research report is not decoration added after the real work is done. It is the final methodological step. Every choice you document — how you cleaned, what you counted, what you excluded — becomes part of the scholarly argument. A report that says "we analyzed the corpus" is useless. A report that says "we normalized 5 articles to lowercase, removed punctuation, filtered articles under 20 words (reducing the corpus from 5 to 4), and counted word frequencies after removing 17 stopwords" is reproducible.

:::definition
**Research report**: A structured document summarizing the data, methods, findings, and interpretations of a study. In computational DH, this should include enough detail for another researcher to reproduce the analysis from scratch.
:::

### Generating Text from Data

Python's f-strings make it straightforward to weave computed values into prose:

```python
total_articles = 4
total_words = 350
avg_words = total_words / total_articles

report = f"The corpus contains {total_articles} articles with {total_words} total words (average: {avg_words:.1f} per article)."
print(report)
# Output: The corpus contains 4 articles with 350 total words (average: 87.5 per article).
```

### ASCII Bar Charts

When you cannot use a graphing library, a text-based bar chart is a simple and effective way to visualize proportions. The idea: map a numeric value to a number of repeated characters:

```python
data = {"Commerce": 19, "Politics": 24, "Culture": 19, "Local": 18}
max_val = max(data.values())

for label, value in sorted(data.items()):
    bar_length = int((value / max_val) * 20)
    bar = "█" * bar_length
    print(f"  {label:12s} | {bar} {value}")
```

The formula `int((value / max_val) * 20)` scales each value so that the largest gets 20 characters and the rest are proportional. The `{label:12s}` pads the label to 12 characters for alignment.

### Putting It All Together

A complete report combines narrative, statistics, and visualization:

```python
title = "Corpus Analysis Report"
print(title)
print("=" * len(title))
print(f"Articles analyzed: 4")
print(f"Top keyword: 'across' (4 occurrences)")
print()
print("Section Breakdown:")
sections = {"Commerce": 2, "Politics": 1, "Culture": 1, "Local": 1}
for s in sorted(sections):
    print(f"  {s}: {sections[s]} article(s)")
```

## Practice

:::try-it
Build an ASCII bar chart for this data and experiment with different bar widths:

```python
data = {"Novels": 45, "Poetry": 12, "Letters": 30, "Sermons": 8}
max_val = max(data.values())

for label in sorted(data):
    value = data[label]
    bar_length = int((value / max_val) * 25)
    bar = "█" * bar_length
    print(f"  {label:10s} | {bar} {value}")
```

Try changing `25` to `10` or `40`. What happens to the visual proportions?
:::

## Transfer

Reporting is where the humanities reclaim the pipeline. The numbers you computed in Stages 2 and 3 are inert until you interpret them. Why does "across" appear in every article? Perhaps because 19th-century journalism framed events spatially where things happened "across" the nation, "across" the city. That interpretation cannot be automated. But the report that presents the evidence *for* that interpretation can and should be generated from the same code that produced the numbers ensuring that no transcription error creeps in between analysis and argument.

:::challenge
Given pre-computed results from a newspaper corpus analysis, generate a formatted research summary report that includes article counts, top keywords, a section breakdown with an ASCII bar chart, and a methods note.
:::

---challenges---

### Challenge: Generate a Research Report

- id: pipeline-04-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
# Pre-computed results from earlier pipeline stages
results = {
    "total_articles": 4,
    "filtered_from": 5,
    "top_keywords": [("across", 4), ("workers", 3), ("new", 2)],
    "section_counts": {"Commerce": 2, "Culture": 1, "Local": 1, "Politics": 1},
}

# 1. Print the report header
print("=== Newspaper Corpus Analysis ===")
print()

# 2. Print summary statistics
print(f"Articles analyzed: {results['total_articles']} (filtered from {results['filtered_from']})")

# 3. Print top keywords
print("Top keywords:")
for word, count in results["top_keywords"]:
    print(f"  {word}: {count}")

# 4. Print section bar chart
print()
print("Articles per section:")
max_val = max(results["section_counts"].values())
for section in sorted(results["section_counts"]):
    count = results["section_counts"][section]
    # TODO: Calculate bar_length scaled to max 20 characters
    bar_length = ___
    bar = "█" * bar_length
    print(f"  {section:12s} | {bar} {count}")

# 5. Print methods note
print()
print("Methods: Text normalized to lowercase, punctuation removed.")
print(f"Excluded articles under 20 words ({results['filtered_from'] - results['total_articles']} removed).")
```

#### Expected Output

```
=== Newspaper Corpus Analysis ===

Articles analyzed: 4 (filtered from 5)
Top keywords:
  across: 4
  workers: 3
  new: 2

Articles per section:
  Commerce     | ████████████████████ 2
  Culture      | ██████████ 1
  Local        | ██████████ 1
  Politics     | ██████████ 1

Methods: Text normalized to lowercase, punctuation removed.
Excluded articles under 20 words (1 removed).
```

#### Hints

1. The formula for the bar is `int((count / max_val) * 20)`. When `count` equals `max_val`, this gives 20; when it is half, it gives 10.
2. `max_val` is 2 (Commerce has the most articles). So Commerce gets `int((2/2)*20) = 20` blocks and the others get `int((1/2)*20) = 10` blocks.
3. The `{section:12s}` format pads the section name to exactly 12 characters for alignment.

#### Solution

```python
results = {
    "total_articles": 4,
    "filtered_from": 5,
    "top_keywords": [("across", 4), ("workers", 3), ("new", 2)],
    "section_counts": {"Commerce": 2, "Culture": 1, "Local": 1, "Politics": 1},
}

print("=== Newspaper Corpus Analysis ===")
print()

print(f"Articles analyzed: {results['total_articles']} (filtered from {results['filtered_from']})")

print("Top keywords:")
for word, count in results["top_keywords"]:
    print(f"  {word}: {count}")

print()
print("Articles per section:")
max_val = max(results["section_counts"].values())
for section in sorted(results["section_counts"]):
    count = results["section_counts"][section]
    bar_length = int((count / max_val) * 20)
    bar = "█" * bar_length
    print(f"  {section:12s} | {bar} {count}")

print()
print("Methods: Text normalized to lowercase, punctuation removed.")
print(f"Excluded articles under 20 words ({results['filtered_from'] - results['total_articles']} removed).")
```

