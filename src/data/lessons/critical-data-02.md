---
id: critical-data-02
title: 'The Gaps in the Archive: Measuring Representation'
moduleId: critical-data
prerequisites:
  - critical-data-01
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Identify missing or underrepresented groups in a structured dataset
  - Calculate proportional representation using Python dictionaries and basic arithmetic
  - Articulate why gaps in archival data are not random but reflect historical power structures
keywords:
  - representation
  - missing data
  - archival silence
  - proportional analysis
  - survivorship bias
---

# The Gaps in the Archive: Measuring Representation

## Analogy

Think of a group photograph taken at a university in 1910. The photograph shows who was present -- but it cannot show who was excluded from enrolling, who could not afford to attend, or who stood just outside the frame. A historian who studies only the photograph might conclude that the university was entirely white and male. The photograph is not lying, but it is profoundly incomplete. The absences are as meaningful as the presences.

Digital archives work the same way. When we count what is in the archive, we must also ask: who is missing, and why?

## Key Concepts

### Archival Silence Is Not Accidental

Every archive has gaps. Some materials were never created (because certain people lacked access to literacy or publishing). Some were created but not preserved (because institutions did not value them). Some were preserved but not digitized (because funding priorities favored other collections). These are not random omissions -- they are patterns shaped by power.

:::definition
**Archival silence**: The systematic absence of certain voices, perspectives, or groups from a historical record. Silences are produced by the same power structures that the archive documents.
:::

### Measuring What Is Present

The first step in detecting bias is simply counting. Given a dataset, we can calculate the proportion of entries belonging to each group.

```python
# A small archive of literary manuscripts
archive = {"entry_1": "male", "entry_2": "male",
           "entry_3": "female", "entry_4": "male",
           "entry_5": "male", "entry_6": "female"}

total = len(archive)
gender_counts = {}
for gender in archive.values():
    gender_counts[gender] = gender_counts.get(gender, 0) + 1

for gender, count in sorted(gender_counts.items()):
    pct = round(count / total * 100, 1)
    print(f"{gender}: {count}/{total} ({pct}%)")
```

This tells us that 66.7% of the archive is male-authored and 33.3% is female-authored. But is that ratio "correct"? That depends on what population the archive claims to represent.

### Identifying the Gap

:::definition
**Representation gap**: The difference between a group's proportion in a dataset and its proportion in the population the dataset claims to describe. A dataset where 80% of entries are from one region, when that region held only 30% of the population, has a 50-point representation gap.
:::

To find gaps, we compare what we have against what we would expect. If women wrote roughly 30% of published novels in the 1920s, an archive showing 20% female authorship has an underrepresentation gap. If a particular region dominated the archive far beyond its population share, that region is overrepresented.

```python
# Counting by multiple attributes
entries = [
    {"region": "Northeast"}, {"region": "Northeast"},
    {"region": "South"}, {"region": "Northeast"},
    {"region": "West"}, {"region": "Northeast"},
]

region_counts = {}
for entry in entries:
    r = entry["region"]
    region_counts[r] = region_counts.get(r, 0) + 1

most = max(region_counts, key=region_counts.get)
least = min(region_counts, key=region_counts.get)
print(f"Most represented: {most} ({region_counts[most]})")
print(f"Least represented: {least} ({region_counts[least]})")
```

### Why This Matters for Digital Humanities

When we build tools on top of biased archives -- training text models, generating visualizations, drawing conclusions -- the gaps silently shape every result. A topic model trained on an archive that underrepresents women's writing will generate topics that reflect men's concerns. A network graph built from correspondence archives that preserved elite letters will show elite networks. The tool does not announce these biases. The researcher must look for them.

## Practice

:::try-it
Take the archive dictionary from the challenge in the sandbox and calculate the representation by decade. Which decade is most represented? Least represented? What historical factors might explain the gap?
:::

## Transfer

Think about a dataset or archive you work with:

- What demographic or categorical attributes does it track?
- Can you calculate the proportional representation for each group?
- How does the archive's composition compare to the historical population it claims to represent?
- What groups might be entirely absent -- not underrepresented, but invisible?

:::challenge
Given a dictionary of archive entries with demographic attributes, calculate the percentage representation for each group across two dimensions and identify the most significant gap.
:::

### Challenge: Measure the Gaps in an Archive

- id: critical-data-02-c1
- language: python
- difficulty: beginner

#### Starter Code
```python
# Archive of literary manuscripts with metadata
archive = {
    "entry_1":  {"author_gender": "male",   "region": "Northeast", "decade": "1920s"},
    "entry_2":  {"author_gender": "male",   "region": "Northeast", "decade": "1920s"},
    "entry_3":  {"author_gender": "female", "region": "South",     "decade": "1930s"},
    "entry_4":  {"author_gender": "male",   "region": "Midwest",   "decade": "1920s"},
    "entry_5":  {"author_gender": "male",   "region": "Northeast", "decade": "1940s"},
    "entry_6":  {"author_gender": "female", "region": "Northeast", "decade": "1930s"},
    "entry_7":  {"author_gender": "male",   "region": "South",     "decade": "1920s"},
    "entry_8":  {"author_gender": "male",   "region": "Northeast", "decade": "1920s"},
    "entry_9":  {"author_gender": "male",   "region": "West",      "decade": "1940s"},
    "entry_10": {"author_gender": "male",   "region": "Northeast", "decade": "1930s"},
}

total = len(archive)

# Step 1: Count and print representation by gender (sorted alphabetically).
# Format: "  gender: count/total (pct%)"
gender_counts = {}
for entry in archive.values():
    g = entry["author_gender"]
    # Your code here

print("=== Representation by Gender ===")
for gender in sorted(gender_counts):
    count = gender_counts[gender]
    pct   = round(count / total * 100, 1)
    print(f"  {gender}: {count}/{total} ({pct}%)")

print()

# Step 2: Count and print representation by region (sorted alphabetically).
# Then print the most and least represented regions.
region_counts = {}
for entry in archive.values():
    # Your code here
    pass

print("=== Representation by Region ===")
for region in sorted(region_counts):
    count = region_counts[region]
    pct   = round(count / total * 100, 1)
    print(f"  {region}: {count}/{total} ({pct}%)")

max_region = max(region_counts, key=region_counts.get)
min_region = min(region_counts, key=region_counts.get)
print(f"  → Most represented: {max_region} ({region_counts[max_region]} entries)")
print(f"  → Least represented: {min_region} ({region_counts[min_region]} entries)")

print()

# Step 3: Count and print representation by decade (sorted chronologically).
# Which decade has the most entries? Which has the fewest?
decade_counts = {}
for entry in archive.values():
    # Your code here
    pass

print("=== Representation by Decade ===")
for decade in sorted(decade_counts):
    count = decade_counts[decade]
    pct   = round(count / total * 100, 1)
    print(f"  {decade}: {count}/{total} ({pct}%)")

max_decade = max(decade_counts, key=decade_counts.get)
min_decade = min(decade_counts, key=decade_counts.get)
print(f"  → Most represented: {max_decade} ({decade_counts[max_decade]} entries)")
print(f"  → Least represented: {min_decade} ({decade_counts[min_decade]} entries)")

print()

# Step 4: Reflect on TWO of the gaps you found.
# For each, suggest a historical reason why the gap might exist —
# not a technical reason (the data wasn't entered), but a structural one
# (who had access to publishing, whose work was preserved, whose was funded).
# Complete the strings below.
print("=== Interpretation ===")
print("The gender gap (80% male) may reflect:")
print("  ___")
print()
print("The decade gap (1920s dominant) may reflect:")
print("  ___")
```

#### Expected Output
```
=== Representation by Gender ===
  female: 2/10 (20.0%)
  male: 8/10 (80.0%)

=== Representation by Region ===
  Midwest: 1/10 (10.0%)
  Northeast: 6/10 (60.0%)
  South: 2/10 (20.0%)
  West: 1/10 (10.0%)
  → Most represented: Northeast (6 entries)
  → Least represented: Midwest (1 entries)

=== Representation by Decade ===
  1920s: 5/10 (50.0%)
  1930s: 3/10 (30.0%)
  1940s: 2/10 (20.0%)
  → Most represented: 1920s (5 entries)
  → Least represented: 1940s (2 entries)

=== Interpretation ===
The gender gap (80% male) may reflect:
  institutional barriers to women's publishing in this period, combined
  with archive collection policies that prioritized "canonical" authors
  who were overwhelmingly male

The decade gap (1920s dominant) may reflect:
  the Depression and wartime disrupting both literary production and
  the funding of archive collection efforts in the 1930s and 1940s
```

#### Hints

1. The counting pattern is the same for all three steps: loop through `archive.values()`, access the relevant key, and use `dict.get(key, 0) + 1` to increment safely.
2. `max(counts_dict, key=counts_dict.get)` returns the key with the highest value; `min(...)` returns the lowest. These work the same way for region and decade.
3. For Step 4, the lesson's prose gives you direct starting points: think about literacy and publishing access, institutional preservation decisions, and funding priorities — not about the data entry process.

#### Solution
```python
archive = {
    "entry_1":  {"author_gender": "male",   "region": "Northeast", "decade": "1920s"},
    "entry_2":  {"author_gender": "male",   "region": "Northeast", "decade": "1920s"},
    "entry_3":  {"author_gender": "female", "region": "South",     "decade": "1930s"},
    "entry_4":  {"author_gender": "male",   "region": "Midwest",   "decade": "1920s"},
    "entry_5":  {"author_gender": "male",   "region": "Northeast", "decade": "1940s"},
    "entry_6":  {"author_gender": "female", "region": "Northeast", "decade": "1930s"},
    "entry_7":  {"author_gender": "male",   "region": "South",     "decade": "1920s"},
    "entry_8":  {"author_gender": "male",   "region": "Northeast", "decade": "1920s"},
    "entry_9":  {"author_gender": "male",   "region": "West",      "decade": "1940s"},
    "entry_10": {"author_gender": "male",   "region": "Northeast", "decade": "1930s"},
}

total = len(archive)

# Step 1: Gender
gender_counts = {}
for entry in archive.values():
    g = entry["author_gender"]
    gender_counts[g] = gender_counts.get(g, 0) + 1

print("=== Representation by Gender ===")
for gender in sorted(gender_counts):
    count = gender_counts[gender]
    pct   = round(count / total * 100, 1)
    print(f"  {gender}: {count}/{total} ({pct}%)")
print()

# Step 2: Region
region_counts = {}
for entry in archive.values():
    r = entry["region"]
    region_counts[r] = region_counts.get(r, 0) + 1

print("=== Representation by Region ===")
for region in sorted(region_counts):
    count = region_counts[region]
    pct   = round(count / total * 100, 1)
    print(f"  {region}: {count}/{total} ({pct}%)")

max_region = max(region_counts, key=region_counts.get)
min_region = min(region_counts, key=region_counts.get)
print(f"  → Most represented: {max_region} ({region_counts[max_region]} entries)")
print(f"  → Least represented: {min_region} ({region_counts[min_region]} entries)")
print()

# Step 3: Decade
decade_counts = {}
for entry in archive.values():
    d = entry["decade"]
    decade_counts[d] = decade_counts.get(d, 0) + 1

print("=== Representation by Decade ===")
for decade in sorted(decade_counts):
    count = decade_counts[decade]
    pct   = round(count / total * 100, 1)
    print(f"  {decade}: {count}/{total} ({pct}%)")

max_decade = max(decade_counts, key=decade_counts.get)
min_decade = min(decade_counts, key=decade_counts.get)
print(f"  → Most represented: {max_decade} ({decade_counts[max_decade]} entries)")
print(f"  → Least represented: {min_decade} ({decade_counts[min_decade]} entries)")
print()

# Step 4: Interpretation
print("=== Interpretation ===")
print("The gender gap (80% male) may reflect:")
print("  institutional barriers to women's publishing in this period, combined")
print("  with archive collection policies that prioritized 'canonical' authors")
print("  who were overwhelmingly male")
print()
print("The decade gap (1920s dominant) may reflect:")
print("  the Depression and wartime disrupting both literary production and")
print("  the funding of archive collection efforts in the 1930s and 1940s")
```