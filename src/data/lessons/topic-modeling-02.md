---
id: topic-modeling-02
title: Preprocessing for Topic Models
moduleId: topic-modeling
prerequisites:
  - topic-modeling-01
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Identify and remove "noise" words using custom stopword lists
  - Understand Lemmatization as a tool for grouping semantic variations
  - Apply frequency filtering to focus on statistically meaningful terms
  - Implement a multi-step cleaning pipeline in Python
keywords:
  - stopwords
  - lemmatization
  - filtering
  - tokens
  - noise
---

# Preprocessing for Topic Models: Straining the Soup

  ## The Signal vs. Noise Problem
  If you are trying to taste the subtle spices in a stew, you need to strain out the large bones and the excess water. In topic modeling, words like "the," "is," and "of" are the "water." They appear everywhere, and because they are in every document, they don't help the computer distinguish one topic from another. To find the "signal" (the topics), we must first remove the "noise."

  ---

  ## 1. Custom Stopwords
  Most programming libraries provide a default list of English stopwords. However, as a DH researcher, you often need **domain-specific stopwords**. 

  -   **Example**: If you are analyzing a collection of 18th-century legal documents, the word "court" or "witness" might appear in every single file. Because they are universal to your corpus, they provide no distinctive information. You should treat them as stopwords.

  ---

  ## 2. Lemmatization: Grouping Concepts
  LDA works best when "running," "ran," and "runs" are all treated as the single concept: **run**. 

  :::definition
  **Lemmatization**: Reducing a word to its "lemma" or dictionary root. Unlike "Stemming" (which just chops off the ends of words), lemmatization uses a dictionary to ensure the result is a real word.
  -   "Better" &rarr; "Good"
  -   "Civilians" &rarr; "Civilian"
  :::

  ---

  ## 3. Extreme Frequency Filtering
  Beyond stopwords, we often filter words based on how many documents they appear in:
  -   **Too Frequent**: If a word appears in 95% of your documents, it won't help define a specific topic.
  -   **Too Rare (Hapax Legomena)**: If a word appears only once in 10,000 pages, the computer doesn't have enough evidence to "group" it with anything else. These are usually removed to speed up the model.

  ---

  ## 4. The Cleaning Pipeline
  In a real DH project, your "cleaning recipe" looks like this:
  1.  **Lowercase** everything.
  2.  **Remove Punctuation** and numbers.
  3.  **Lemmatize** the words.
  4.  **Remove Stopwords** (Standard + Custom).
  5.  **Remove Short Words** (Words with 1 or 2 letters are rarely useful for topics).

  ```python
  # A cleaned "Bag of Words" result:
  raw = "The kings were running through the kingdom"
  # After lowercase, lemmatization, and stopword removal:
  clean = ["king", "run", "kingdom"]
  ```

  :::tip
  **Humanities Insight**: Be careful! Removing "he" and "she" is standard for topic models, but if your research question is about **gender and power**, those "stopwords" are actually your most important data points. Always match your cleaning to your research question.
  :::

  :::challenge
  A passage from a 19th-century legal report has been tokenised for you. Your job is to act as the cleaning pipeline: lowercase, lemmatize using a provided dictionary, then filter out stopwords (standard and domain-specific) and short tokens. The resulting cleaned list is what you would feed into an LDA model.
  :::

---challenges---

### Challenge: Build the Cleaning Pipeline

- id: topic-modeling-02-c1
- language: python
- difficulty: intermediate

#### Starter Code
```python
import string

# Raw tokens from a 19th-century legal report
tokens = [
    "The", "witnesses", "were", "examined", "by", "the", "Court",
    "concerning", "the", "alleged", "offences", "committed", "by",
    "the", "accused", "parties", "The", "witness", "testified",
    "that", "he", "had", "seen", "the", "accused", "running",
    "Courts", "rarely", "dismiss", "such", "testimony"
]

# A small lemma lookup: maps inflected forms to their dictionary root
lemma_lookup = {
    "witnesses":  "witness",
    "offences":   "offence",
    "parties":    "party",
    "committed":  "commit",
    "examined":   "examine",
    "testified":  "testify",
    "alleged":    "allege",
    "running":    "run",
    "courts":     "court",
    "rarely":     "rare",
}

# Standard stopwords
stopwords = {"the", "a", "an", "by", "was", "were", "that", "he", "had", "such"}

# Domain-specific stopwords: these appear in every legal document
# and carry no distinctive topic information for THIS corpus
domain_stopwords = {"court", "witness", "accused"}

# --- Your pipeline ---

# Step 1: Lowercase every token
# Step 2: Replace any token found in lemma_lookup with its lemma
# Step 3: Remove tokens that are in stopwords OR domain_stopwords
# Step 4: Remove tokens with 3 or fewer characters

# Build the cleaned list step by step and print it
cleaned = []
# Your code here

print(cleaned)
```

#### Expected Output
```
['examine', 'concern', 'allege', 'offence', 'commit', 'party', 'testify', 'run', 'testimony']
```

#### Hints

1. Do Steps 1 and 2 together in a first pass: `word = token.lower()`, then `word = lemma_lookup.get(word, word)` — this replaces the word if it's in the lookup, or keeps it unchanged if not.
2. Combine the two stopword sets with `|` before your loop: `all_stopwords = stopwords | domain_stopwords`. Then one check covers both.
3. Apply the length filter with `len(word) > 3`.
4. Only `append` if the word passes both the stopword check and the length check.

#### Solution
```python
import string

tokens = [
    "The", "witnesses", "were", "examined", "by", "the", "Court",
    "concerning", "the", "alleged", "offences", "committed", "by",
    "the", "accused", "parties", "The", "witness", "testified",
    "that", "he", "had", "seen", "the", "accused", "running",
    "Courts", "rarely", "dismiss", "such", "testimony"
]

lemma_lookup = {
    "witnesses":  "witness",
    "offences":   "offence",
    "parties":    "party",
    "committed":  "commit",
    "examined":   "examine",
    "testified":  "testify",
    "alleged":    "allege",
    "running":    "run",
    "courts":     "court",
    "rarely":     "rare",
}

stopwords = {"the", "a", "an", "by", "was", "were", "that", "he", "had", "such"}
domain_stopwords = {"court", "witness", "accused"}
all_stopwords = stopwords | domain_stopwords

cleaned = []
for token in tokens:
    # Step 1: lowercase
    word = token.lower()
    # Step 2: lemmatize via lookup
    word = lemma_lookup.get(word, word)
    # Steps 3 & 4: filter
    if word not in all_stopwords and len(word) > 3:
        cleaned.append(word)

print(cleaned)
```

