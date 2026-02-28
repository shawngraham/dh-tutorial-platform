---
id: pipeline-01
title: 'Stage 1: Loading and Cleaning Your Corpus'
moduleId: dh-pipeline
prerequisites:
  - python-basics
  - text-analysis-fundamentals
  - structured-data
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Normalize text fields using lowercase conversion and regex punctuation removal
  - Handle missing or empty metadata fields with safe defaults
  - Filter records from a corpus based on computed criteria like word count
keywords:
  - data cleaning
  - normalization
  - regular expressions
  - missing data
  - corpus preparation
---

# Stage 1: Loading and Cleaning Your Corpus

## Analogy

Think of corpus cleaning the way an archivist prepares a collection before researchers can use it. When a box of letters arrives at an archive, no one dives straight into analysis. First, the archivist inventories what is there, notes any missing pages or illegible sections, and creates a consistent catalog format — standardizing names, dates, and labels. Without this groundwork, every subsequent researcher would waste time reinventing the same fixes. In digital humanities, data cleaning is that archival groundwork: unglamorous, essential, and the foundation on which every later stage depends.

## Key Concepts

A research pipeline begins with raw data. In DH, that raw data is often a **corpus** — a structured collection of texts. Ours is a small set of historical newspaper articles stored as a list of Python dictionaries:

```python
corpus = [
    {"title": "Railway Opens New Route to the West", "date": "1869-05-15",
     "section": "Commerce", "author": "J. Hammond",
     "text": "The transcontinental railroad celebrated its completion yesterday with a golden spike ceremony at Promontory Summit."},
    {"title": "Women Demand the Right to Vote", "date": "1872-11-05",
     "section": "Politics", "author": "",
     "text": "Susan B. Anthony was arrested today for casting a ballot in the presidential election, an act of defiance that has galvanized the suffrage movement."},
    {"title": "Great Fire Devastates Chicago", "date": "1871-10-10",
     "section": "Local", "author": "R. Clarke",
     "text": "The fire which began on the evening of October eighth has left nearly one hundred thousand residents homeless and destroyed more than three square miles of the city."},
    {"title": "New Exhibit at Metropolitan Museum", "date": "1880-03-22",
     "section": "Culture", "author": "L. Foster",
     "text": "The Metropolitan Museum of Art opened its doors on Fifth Avenue to an eager public showcasing paintings and sculptures from across the European continent."},
    {"title": "Strikes Halt Production in Steel Mills", "date": "1877-07-20",
     "section": "Commerce", "author": "",
     "text": "Workers at steel mills along the river have ceased all labor demanding shorter hours and fair wages from the industrialists who profit from their toil."},
]
```

Before we can count, compare, or interpret anything, we need to clean this data. Cleaning means making the data consistent and handling anything that is missing or malformed.

### Normalizing Text

When comparing words across documents, capitalization creates false distinctions. "The" and "the" are the same word, but Python treats them as different strings. Similarly, punctuation attached to words — like the period in "Summit." — prevents exact matching. We solve both problems at once:

:::definition
**Text normalization**: The process of transforming text into a consistent format — typically lowercase with punctuation removed — so that comparisons and counts reflect actual content rather than surface-level formatting differences.
:::

```python
import re

raw = "The Metropolitan Museum of Art opened its doors."
normalized = re.sub(r'[^\w\s]', '', raw.lower())
print(normalized)
# Output: the metropolitan museum of art opened its doors
```

The pattern `[^\w\s]` matches any character that is neither a word character (`\w` covers letters, digits, and underscores) nor whitespace (`\s`). The `re.sub` call replaces every such character with an empty string, effectively stripping all punctuation. Calling `.lower()` first ensures uniform case.

### Handling Missing Fields

Real-world data has gaps. In our corpus, some articles have an empty string for the author. Rather than letting blanks propagate through our analysis, we replace them with a meaningful default:

:::definition
**Default substitution**: Replacing missing, empty, or null values with a sensible placeholder (like "Unknown") so that downstream code can treat every record uniformly without special-case checks.
:::

```python
author = ""
author = author if author else "Unknown"
print(author)
# Output: Unknown
```

The expression `author if author else "Unknown"` leverages Python's truthiness rules: an empty string is falsy, so the condition fails and the default kicks in. A non-empty string is truthy and passes through unchanged.

### Filtering by Criteria

Not every record belongs in every analysis. Perhaps you want only articles longer than a certain threshold, or only articles from a specific section. Filtering lets you trim the corpus to fit your research question:

```python
import re

text = "The fire which began on the evening of October eighth has left nearly one hundred thousand residents homeless and destroyed more than three square miles of the city."
normalized = re.sub(r'[^\w\s]', '', text.lower())
word_count = len(normalized.split())
print(f"Words: {word_count}")
# Output: Words: 28

# Keep only if 20 or more words
if word_count >= 20:
    print("Included in corpus")
# Output: Included in corpus
```

The `.split()` method breaks a string on whitespace and returns a list of words. Wrapping that in `len()` gives us a word count we can use as a filter criterion.

### Putting It Together: A Cleaning Function

A typical cleaning pass walks through every article, normalizes text, fills in defaults, and filters:

```python
import re

corpus = [
    {"title": "Short Note", "author": "", "text": "Brief item."},
    {"title": "Long Article", "author": "A. Smith",
     "text": "This is a much longer article with many more words to meet the threshold we have set for inclusion in our analysis."},
]

cleaned = []
for article in corpus:
    clean = dict(article)  # shallow copy
    clean["text"] = re.sub(r'[^\w\s]', '', clean["text"].lower())
    clean["author"] = clean["author"] if clean["author"] else "Unknown"
    if len(clean["text"].split()) >= 10:
        cleaned.append(clean)

print(f"Kept {len(cleaned)} of {len(corpus)} articles")
# Output: Kept 1 of 2 articles
```

Notice that we create a copy with `dict(article)` rather than modifying the original. This preserves our raw data in case we need it later — a good habit borrowed from archival practice, where you never write on the original document.

## Practice

:::try-it
Try cleaning a single article. Normalize the text, handle the missing author, and check the word count:

```python
import re

article = {"title": "Test Article", "author": "",
           "text": "The quick brown fox jumps over the lazy dog."}

# Normalize text: lowercase and remove punctuation
article["text"] = re.sub(r'[^\w\s]', '', article["text"].lower())

# Fill in missing author
article["author"] = article["author"] if article["author"] else "Unknown"

# Count words
word_count = len(article["text"].split())

print(f"Author: {article['author']}")
print(f"Text: {article['text']}")
print(f"Words: {word_count}")
```

Experiment: What happens if you change the regex pattern to `[^a-z\s]` instead? Which characters would that miss that `[^\w\s]` catches?
:::

## Transfer

Every DH project begins with this stage, whether the corpus is five newspaper articles or five thousand. The decisions you make during cleaning — what to normalize, what defaults to use, what to filter out — are **methodological choices** that shape your findings. A historian studying authorship patterns might keep only articles with known authors. A linguist studying sentence structure might keep punctuation. There is no single "correct" way to clean; there is only transparency about what you chose and why.

When you write up your research, your methods section should document these decisions: "Text was normalized to lowercase with punctuation removed. Articles with fewer than 20 words were excluded, reducing the corpus from N to M articles. Missing author fields were replaced with 'Unknown.'" This kind of reporting makes your work reproducible — another researcher can follow the same steps and reach the same results.

:::challenge
Clean the full newspaper corpus: normalize each article's text to lowercase with punctuation removed, replace empty author fields with "Unknown", and filter out articles with fewer than 20 words. Print how many articles remain and the title of the first cleaned article.
:::

---challenges---

### Challenge: Clean the Newspaper Corpus

- id: pipeline-01-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
import re

corpus = [
    {"title": "Railway Opens New Route to the West", "date": "1869-05-15", "section": "Commerce", "author": "J. Hammond", "text": "The transcontinental railroad celebrated its completion yesterday with a golden spike ceremony at Promontory Summit."},
    {"title": "Women Demand the Right to Vote", "date": "1872-11-05", "section": "Politics", "author": "", "text": "Susan B. Anthony was arrested today for casting a ballot in the presidential election, an act of defiance that has galvanized the suffrage movement."},
    {"title": "Great Fire Devastates Chicago", "date": "1871-10-10", "section": "Local", "author": "R. Clarke", "text": "The fire which began on the evening of October eighth has left nearly one hundred thousand residents homeless and destroyed more than three square miles of the city."},
    {"title": "New Exhibit at Metropolitan Museum", "date": "1880-03-22", "section": "Culture", "author": "L. Foster", "text": "The Metropolitan Museum of Art opened its doors on Fifth Avenue to an eager public showcasing paintings and sculptures from across the European continent."},
    {"title": "Strikes Halt Production in Steel Mills", "date": "1877-07-20", "section": "Commerce", "author": "", "text": "Workers at steel mills along the river have ceased all labor demanding shorter hours and fair wages from the industrialists who profit from their toil."},
]

cleaned = []
for article in corpus:
    clean = dict(article)
    # TODO: Normalize text to lowercase and remove punctuation using re.sub
    clean["text"] = ___ 
    # TODO: Replace empty author with "Unknown"
    clean["author"] = ___ 
    # TODO: Filter — only keep articles with 20 or more words
    if ___: 
        cleaned.append(clean)

print(f"Articles after cleaning: {len(cleaned)}")
print(f"First cleaned title: {cleaned[0]['title']}")
```

#### Expected Output

```
Articles after cleaning: 4
First cleaned title: Women Demand the Right to Vote
```

#### Hints

1. Use `re.sub(r'[^\w\s]', '', text.lower())` to strip punctuation and lowercase in one step.
2. The expression `clean["author"] if clean["author"] else "Unknown"` returns the author when present and "Unknown" when the string is empty.
3. Count words with `len(clean["text"].split())` and compare to 20 using `>=`.
4. The Railway article has only 15 words after cleaning, so it gets filtered out. The remaining 4 articles all have 20+ words.

#### Solution

```python
import re

corpus = [
    {"title": "Railway Opens New Route to the West", "date": "1869-05-15", "section": "Commerce", "author": "J. Hammond", "text": "The transcontinental railroad celebrated its completion yesterday with a golden spike ceremony at Promontory Summit."},
    {"title": "Women Demand the Right to Vote", "date": "1872-11-05", "section": "Politics", "author": "", "text": "Susan B. Anthony was arrested today for casting a ballot in the presidential election, an act of defiance that has galvanized the suffrage movement."},
    {"title": "Great Fire Devastates Chicago", "date": "1871-10-10", "section": "Local", "author": "R. Clarke", "text": "The fire which began on the evening of October eighth has left nearly one hundred thousand residents homeless and destroyed more than three square miles of the city."},
    {"title": "New Exhibit at Metropolitan Museum", "date": "1880-03-22", "section": "Culture", "author": "L. Foster", "text": "The Metropolitan Museum of Art opened its doors on Fifth Avenue to an eager public showcasing paintings and sculptures from across the European continent."},
    {"title": "Strikes Halt Production in Steel Mills", "date": "1877-07-20", "section": "Commerce", "author": "", "text": "Workers at steel mills along the river have ceased all labor demanding shorter hours and fair wages from the industrialists who profit from their toil."},
]

cleaned = []
for article in corpus:
    clean = dict(article)
    clean["text"] = re.sub(r'[^\w\s]', '', clean["text"].lower())
    clean["author"] = clean["author"] if clean["author"] else "Unknown"
    if len(clean["text"].split()) >= 20:
        cleaned.append(clean)

print(f"Articles after cleaning: {len(cleaned)}")
print(f"First cleaned title: {cleaned[0]['title']}")
```

