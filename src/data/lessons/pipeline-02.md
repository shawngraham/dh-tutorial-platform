---
id: pipeline-02
title: 'Stage 2: Extracting Features and Counting Patterns'
moduleId: dh-pipeline
prerequisites:
  - pipeline-01
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Build word frequency distributions from a cleaned corpus using collections.Counter
  - Remove stopwords from a frequency count to surface meaningful content words
  - Compute basic corpus statistics such as average article length
keywords:
  - word frequency
  - Counter
  - stopwords
  - distant reading
  - feature extraction
---

# Stage 2: Extracting Features and Counting Patterns

## Analogy

Imagine a scholar who has just read five hundred letters from the Civil War era. If asked "What are these letters about?", they might say "longing, hardship, faith." But another scholar reading the same letters might see "economics, logistics, weather." Both readings could be valid, but neither is verifiable. **Distant reading** offers a different approach: instead of interpreting individual letters, you count the words across all of them and let the patterns speak. The most frequent words become a collective fingerprint — not a replacement for close reading, but a complement to it. This lesson teaches you to take that fingerprint.

## Key Concepts

### Word Frequency with Counter

Python's `collections.Counter` is purpose-built for counting things. Feed it a list of words and it returns a dictionary-like object mapping each word to its count:

```python
from collections import Counter

words = ["the", "fire", "the", "city", "fire", "fire"]
counts = Counter(words)
print(counts.most_common(3))
# Output: [('fire', 3), ('the', 2), ('city', 1)]
```

:::definition
**Distant reading**: An umbrella term for computational methods that analyze large volumes of text by extracting quantitative features (word counts, patterns, trends) rather than reading individual texts closely.
:::

### Stopword Removal

Raw word counts are dominated by function words — "the", "of", "and", "a" — that carry grammatical meaning but reveal little about content. We filter these out using a **stopword list**:

```python
from collections import Counter

words = ["the", "railroad", "the", "golden", "spike", "the", "ceremony"]
stopwords = {"the", "a", "an", "of", "and", "in", "to", "is", "was"}

filtered = [w for w in words if w not in stopwords]
counts = Counter(filtered)
print(counts.most_common())
# Output: [('railroad', 1), ('golden', 1), ('spike', 1), ('ceremony', 1)]
```

By storing stopwords in a **set** (using curly braces `{}`), we get fast lookup — checking `w not in stopwords` is nearly instant even for large lists.

### Corpus-Level Counting

To count words across an entire corpus, we combine each article's words into a single Counter:

```python
from collections import Counter

corpus_texts = [
    "workers demanded fair wages from the factory owners",
    "the workers organized across the city for fair treatment"
]

stopwords = {"the", "from", "for"}
all_words = []
for text in corpus_texts:
    all_words.extend(text.split())

filtered = [w for w in all_words if w not in stopwords]
counts = Counter(filtered)
print(f"Top 3: {counts.most_common(3)}")
# Output: Top 3: [('workers', 2), ('fair', 2), ('demanded', 1)]
```

The `.extend()` method adds all elements from one list to another, building up a single flat list of every word in the corpus.

### Basic Corpus Statistics

Simple statistics paint a picture of the corpus as a whole:

```python
article_lengths = [15, 24, 28, 22, 20]
avg_length = sum(article_lengths) / len(article_lengths)
print(f"Average article length: {avg_length} words")
# Output: Average article length: 21.8 words
```

## Practice

:::try-it
Take the two-sentence corpus below, remove the stopwords, and find the top 3 words:

```python
from collections import Counter

texts = [
    "the museum opened its doors to the eager public",
    "the public welcomed the new exhibit at the museum"
]
stopwords = {"the", "to", "its", "at", "a", "an"}

all_words = []
for t in texts:
    all_words.extend(t.split())

filtered = [w for w in all_words if w not in stopwords]
counts = Counter(filtered)
print(counts.most_common(3))
```

What words dominate? Does this match your intuition about what these sentences are "about"?
:::

## Transfer

Distant reading does not replace close reading — it redirects your attention. When you count words across a thousand newspaper articles and discover that "strike" spikes in 1877, that is not an interpretation. It is an observation that invites interpretation: *Why* does the word spike? What events coincide? Whose voices are using it? The count tells you where to look; the reading tells you what it means.

In your own research, feature extraction is the bridge between raw data and argument. The choices you make here, which words to count, which to exclude, how to group them, shape what patterns you can find. Document those choices.

:::challenge
Given a cleaned newspaper corpus, compute the 5 most frequent words across all articles after removing a provided stopword list. Print each word and its count.
:::

---challenges---

### Challenge: Top 5 Corpus Keywords

- id: pipeline-02-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
from collections import Counter

# Pre-cleaned newspaper corpus (lowercase, no punctuation)
corpus = [
    {"title": "Railway Route", "text": "the new railway line connecting the eastern cities to the western frontier was celebrated by workers and merchants across the nation"},
    {"title": "Factory Strike", "text": "workers across the city demanded fair wages and shorter hours from factory owners who profit from their labor"},
    {"title": "Museum Opens", "text": "the new museum opened its doors to an eager public with art and sculptures from across the european continent"},
    {"title": "City Fire", "text": "the fire destroyed homes across three city blocks leaving hundreds of workers and families homeless in the district"},
]

stopwords = {"the", "a", "an", "of", "and", "in", "to", "at", "on", "for",
             "its", "from", "who", "was", "by", "with", "their"}

# 1. Collect all words from all articles into one list
all_words = []
for article in corpus:
    all_words.extend(article["text"].split())

# 2. Filter out stopwords
# Hint: use a list comprehension with "not in"
filtered = ___

# 3. Count and print the top 5
counts = Counter(filtered)
for word, count in counts.most_common(5):
    print(f"{word}: {count}")
```

#### Expected Output

```
across: 4
workers: 3
new: 2
city: 2
railway: 1
```

#### Hints

1. Use `filtered = [w for w in all_words if w not in stopwords]` to keep only non-stopwords.
2. `Counter.most_common(5)` returns the 5 words with the highest count. When counts are tied, words appear in the order they were first encountered in the list.
3. "across" appears in all 4 articles, "workers" in 3 of them. The word "city" appears in articles 2 and 4.

#### Solution

```python
from collections import Counter

corpus = [
    {"title": "Railway Route", "text": "the new railway line connecting the eastern cities to the western frontier was celebrated by workers and merchants across the nation"},
    {"title": "Factory Strike", "text": "workers across the city demanded fair wages and shorter hours from factory owners who profit from their labor"},
    {"title": "Museum Opens", "text": "the new museum opened its doors to an eager public with art and sculptures from across the european continent"},
    {"title": "City Fire", "text": "the fire destroyed homes across three city blocks leaving hundreds of workers and families homeless in the district"},
]

stopwords = {"the", "a", "an", "of", "and", "in", "to", "at", "on", "for",
             "its", "from", "who", "was", "by", "with", "their"}

all_words = []
for article in corpus:
    all_words.extend(article["text"].split())

filtered = [w for w in all_words if w not in stopwords]

counts = Counter(filtered)
for word, count in counts.most_common(5):
    print(f"{word}: {count}")
```

