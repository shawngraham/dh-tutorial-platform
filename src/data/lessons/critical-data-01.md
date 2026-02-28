---
id: critical-data-01
title: 'Counting What Counts: How Categories Shape Data'
moduleId: critical-data
prerequisites:
  - python-basics
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Explain how classification systems are human-made choices rather than neutral reflections of reality
  - Demonstrate how changing category boundaries in a Python dictionary changes the results of an analysis
  - Critically evaluate a categorization scheme used in a humanities dataset
keywords:
  - classification
  - categorization
  - data construction
  - census categories
  - controlled vocabularies
  - critical data studies
---

# Counting What Counts: How Categories Shape Data

## Analogy

Imagine you are a librarian deciding how to organize a new collection of books. You must choose headings: does a book about popular songs of the 1870s belong under "Music" or "Folklore"? Each choice makes certain questions easy to ask and others nearly invisible. A researcher browsing "Music" would find the book; one browsing "Labor History" would not. The shelf is not a neutral container -- it is an argument about what matters.

Data works the same way. Every dataset begins with a choice about categories, and those categories determine what the data can and cannot tell us.

## Key Concepts

### Categories Are Not Found -- They Are Made

When we encounter a spreadsheet column called "Genre" or "Occupation" or "Race," it is tempting to treat those labels as natural facts. But every category system was designed by specific people, in a specific time and place, for a specific purpose.

:::definition
**Classification system**: A structured set of categories used to organize information. Examples include the Dewey Decimal System, the U.S. Census racial categories, and the Library of Congress Subject Headings. Each reflects the worldview of its creators.
:::

Consider U.S. Census racial categories. In 1790, the categories were "Free White Males," "Free White Females," "All Other Free Persons," and "Slaves." By 1890, the Census distinguished between "Black," "Mulatto," "Quadroon," and "Octoroon." By 2020, those sub-categories had long vanished, replaced by a different structure entirely. The people did not change -- the categories did.

### Counting Depends on Grouping

In Python, a dictionary is a natural tool for counting things by category. But the results you get depend entirely on how you define the categories.

```python
from collections import Counter

# Raw occupation labels from an 1880 census sample
occupations = [
    "farmer", "servant", "laborer", "washerwoman",
    "blacksmith", "farmer", "servant", "seamstress",
    "laborer", "farmer", "clerk", "teacher"
]

counts = Counter(occupations)
for occupation, n in counts.most_common():
    print(f"{occupation}: {n}")
```

This gives us a fine-grained picture. But what happens when we group these into broader categories?

### How Grouping Changes the Story

```python
from collections import Counter

occupations = [
    "farmer", "servant", "laborer", "washerwoman",
    "blacksmith", "farmer", "servant", "seamstress",
    "laborer", "farmer", "clerk", "teacher"
]

# One possible grouping scheme
grouping_a = {
    "farmer": "Agricultural", "servant": "Domestic",
    "laborer": "Manual", "washerwoman": "Domestic",
    "blacksmith": "Manual", "seamstress": "Manual",
    "clerk": "Professional", "teacher": "Professional"
}

grouped = [grouping_a[o] for o in occupations]
counts = Counter(grouped)
for cat, n in counts.most_common():
    print(f"{cat}: {n}")
```

With this scheme, "Manual" and "Agricultural" dominate. But watch what happens with a different grouping.

:::definition
**Data construction**: The process by which raw observations are transformed into structured data through choices about what to record, how to categorize it, and what to leave out. Data is never simply "collected" -- it is always constructed.
:::

### A Different Grouping, A Different Story

```python
from collections import Counter

occupations = [
    "farmer", "servant", "laborer", "washerwoman",
    "blacksmith", "farmer", "servant", "seamstress",
    "laborer", "farmer", "clerk", "teacher"
]

# Alternative grouping: gendered labor distinction
grouping_b = {
    "farmer": "Traditionally Male", "servant": "Traditionally Female",
    "laborer": "Traditionally Male", "washerwoman": "Traditionally Female",
    "blacksmith": "Traditionally Male", "seamstress": "Traditionally Female",
    "clerk": "Traditionally Male", "teacher": "Traditionally Female"
}

grouped = [grouping_b[o] for o in occupations]
counts = Counter(grouped)
for cat, n in counts.most_common():
    print(f"{cat}: {n}")
```

Now the data tells a story about gendered labor rather than economic sectors. Neither grouping is "wrong," but each makes different patterns visible and others invisible.

### The Stakes for Humanities Research

This is not merely a technical issue. When historical archives categorize people, those categories carry power:

- **Library subject headings** that used "illegal aliens" instead of "undocumented immigrants" shaped how researchers found material about migration.
- **Museum catalogs** that listed Indigenous artifacts under "Primitive Art" reflected colonial hierarchies.
- **Genre labels** that separate "literature" from "genre fiction" encode value judgments about whose stories matter.

## Practice

:::try-it
Take the list of occupations above and create a third grouping scheme -- perhaps one based on whether the work is "Indoor" vs. "Outdoor," or "Skilled" vs. "Unskilled." Use a Python dictionary to map each occupation to your new category, then count the results with `Counter`. Notice how the story changes again.
:::

## Transfer

Think about a dataset you use or plan to use in your own research:

- What are the main categories or labels in it?
- Who decided on those categories, and when?
- What might be invisible because of how the categories were drawn?
- Could you re-categorize the same raw data to reveal a different pattern?

These questions are the foundation of critical data studies. They do not require you to abandon quantitative methods -- they require you to be honest about the choices embedded in every count.

:::challenge
Given a list of historical occupation labels, write code that groups them into two different categorization schemes and prints the counts for each, showing how the grouping changes what we "see."
:::

### Challenge: Re-Categorizing Historical Occupations

- id: critical-data-01-challenge
- language: python
- difficulty: beginner

#### Starter Code
```python
from collections import Counter

# Occupation records from an 1870 census sample
records = [
    "carpenter", "domestic servant", "field laborer",
    "laundress", "carpenter", "midwife", "field laborer",
    "domestic servant", "preacher", "field laborer",
    "carpenter", "laundress", "domestic servant", "teacher"
]

# SCHEME A: Economic sector — "Skilled" or "Unskilled"
# Assign each occupation to one of the two categories.
# There is no single correct answer: think about what assumptions
# the label "Unskilled" carries, and who historically applied it.
scheme_a = {
    "carpenter":        "Skilled",
    "domestic servant": "",   # Your assignment
    "field laborer":    "",   # Your assignment
    "laundress":        "",   # Your assignment
    "midwife":          "",   # Your assignment — is this skilled or unskilled?
    "preacher":         "",   # Your assignment
    "teacher":          "",   # Your assignment
}

# SCHEME B: Work location — "Indoor" or "Outdoor"
scheme_b = {
    "carpenter":        "",   # Your assignment
    "domestic servant": "Indoor",
    "field laborer":    "",   # Your assignment
    "laundress":        "",   # Your assignment — think carefully
    "midwife":          "",   # Your assignment
    "preacher":         "",   # Your assignment
    "teacher":          "",   # Your assignment
}

# Apply scheme_a and count
grouped_a = [scheme_a[r] for r in records]
counts_a  = Counter(grouped_a)
print("=== Scheme A: Skilled vs. Unskilled ===")
for cat in sorted(counts_a):
    print(f"  {cat}: {counts_a[cat]}")

print()

# Apply scheme_b and count
grouped_b = [scheme_b[r] for r in records]
counts_b  = Counter(grouped_b)
print("=== Scheme B: Indoor vs. Outdoor ===")
for cat in sorted(counts_b):
    print(f"  {cat}: {counts_b[cat]}")

print()

# SCHEME C: Design your own.
# Create a third two-category grouping that reveals a different pattern.
# Examples: "Paid by household" vs. "Paid by client"; "Gendered Female" vs.
# "Gendered Male" (as the 1870 census implicitly coded them); "Religious" vs.
# "Secular"; or any other axis you find historically interesting.
# Name your categories meaningfully.

scheme_c = {
    "carpenter":        "",
    "domestic servant": "",
    "field laborer":    "",
    "laundress":        "",
    "midwife":          "",
    "preacher":         "",
    "teacher":          "",
}

scheme_c_name = "=== Scheme C: ___ vs. ___ ==="  # Fill in your category names

grouped_c = [scheme_c[r] for r in records]
counts_c  = Counter(grouped_c)
print(scheme_c_name)
for cat in sorted(counts_c):
    print(f"  {cat}: {counts_c[cat]}")

print()

# REFLECTION: Answer these two questions in the strings below.
# 1. Which single occupation was hardest to place, and why?
# 2. What does your Scheme C make visible that Schemes A and B do not?
print("Hardest occupation to categorize and why:")
print("  ___")
print()
print("What Scheme C reveals that A and B do not:")
print("  ___")
```

#### Expected Output

There is no single correct expected output for this challenge — your category assignments are your argument. The output should show two non-zero counts for each scheme summing to 14, and your Scheme C should produce a distribution different from both A and B. What matters is that your assignments are internally consistent and that your reflection explains the contested choices you made.

A sample consistent output (one of many valid answers):
```
=== Scheme A: Skilled vs. Unskilled ===
  Skilled: 6
  Unskilled: 8

=== Scheme B: Indoor vs. Outdoor ===
  Indoor: 8
  Outdoor: 6

=== Scheme C: Waged Labour vs. Fee / Stipend ===
  Fee / Stipend: 5
  Waged Labour: 9

Hardest occupation to categorize and why:
  midwife — contemporary observers labeled it unskilled domestic work,
  but it required substantial knowledge; the label reflected class
  bias more than the actual demands of the role

What Scheme C reveals that A and B do not:
  the distinction between workers paid by an employer (wage dependence)
  and those paid per service or by a church (relative autonomy), which
  cuts across both the skilled/unskilled and indoor/outdoor lines
```

#### Hints

1. The records list has 14 entries total. Count each occupation: carpenter ×3, domestic servant ×3, field laborer ×3, laundress ×2, midwife ×1, preacher ×1, teacher ×1. Use these counts to check that your scheme sums to 14.
2. For Scheme B, laundress is genuinely ambiguous — laundering could be done in a client's home, in the laundress's own home, or outdoors at a water source. Your assignment is a choice, not a fact.
3. For Scheme C, look at the lesson's prose for inspiration — the gendered labor example, the colonial artifact example, and the library subject headings example all suggest possible axes.
4. The reflection is the most important part of the challenge. A one-sentence answer that just names the occupation without explaining the power dynamic embedded in the label misses the point.

#### Solution
```python
from collections import Counter

records = [
    "carpenter", "domestic servant", "field laborer",
    "laundress", "carpenter", "midwife", "field laborer",
    "domestic servant", "preacher", "field laborer",
    "carpenter", "laundress", "domestic servant", "teacher"
]

# SCHEME A: Skilled vs. Unskilled
# Note: "midwife" classified as Skilled here — a contested but defensible choice
scheme_a = {
    "carpenter":        "Skilled",
    "domestic servant": "Unskilled",
    "field laborer":    "Unskilled",
    "laundress":        "Unskilled",
    "midwife":          "Skilled",
    "preacher":         "Skilled",
    "teacher":          "Skilled",
}

# SCHEME B: Indoor vs. Outdoor
# Note: "laundress" classified as Indoor — another contested choice
scheme_b = {
    "carpenter":        "Outdoor",
    "domestic servant": "Indoor",
    "field laborer":    "Outdoor",
    "laundress":        "Indoor",
    "midwife":          "Indoor",
    "preacher":         "Indoor",
    "teacher":          "Indoor",
}

# SCHEME C: Waged Labour vs. Fee / Stipend
scheme_c = {
    "carpenter":        "Fee / Stipend",
    "domestic servant": "Waged Labour",
    "field laborer":    "Waged Labour",
    "laundress":        "Fee / Stipend",
    "midwife":          "Fee / Stipend",
    "preacher":         "Fee / Stipend",
    "teacher":          "Fee / Stipend",
}

scheme_c_name = "=== Scheme C: Waged Labour vs. Fee / Stipend ==="

grouped_a = [scheme_a[r] for r in records]
counts_a  = Counter(grouped_a)
print("=== Scheme A: Skilled vs. Unskilled ===")
for cat in sorted(counts_a):
    print(f"  {cat}: {counts_a[cat]}")
print()

grouped_b = [scheme_b[r] for r in records]
counts_b  = Counter(grouped_b)
print("=== Scheme B: Indoor vs. Outdoor ===")
for cat in sorted(counts_b):
    print(f"  {cat}: {counts_b[cat]}")
print()

grouped_c = [scheme_c[r] for r in records]
counts_c  = Counter(grouped_c)
print(scheme_c_name)
for cat in sorted(counts_c):
    print(f"  {cat}: {counts_c[cat]}")
print()

print("Hardest occupation to categorize and why:")
print("  midwife — contemporary observers labeled it unskilled domestic work,")
print("  but it required substantial knowledge; the label reflected class")
print("  bias more than the actual demands of the role")
print()
print("What Scheme C reveals that A and B do not:")
print("  the distinction between workers paid by an employer (wage dependence)")
print("  and those paid per service or by a church (relative autonomy), which")
print("  cuts across both the skilled/unskilled and indoor/outdoor lines")
```