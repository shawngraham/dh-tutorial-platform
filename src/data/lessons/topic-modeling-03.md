---
id: topic-modeling-03
title: Training an LDA Model
moduleId: topic-modeling
prerequisites:
  - topic-modeling-02
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Convert preprocessed text into a numerical Document-Term Matrix
  - Understand the importance of the "K" (number of topics) parameter
  - Train a basic model using the Gensim library
  - Interpret the mapping between Word IDs and actual tokens
keywords:
  - gensim
  - dictionary
  - corpus
  - hyperparameters
  - doc2bow
---

# Training an LDA Model: The Numerical Archive

  ## Analogy
  Training a model is like giving a student a stack of 1,000 books and saying, "I want you to find 10 different themes in here." 

  The student doesn't know what the themes are yet; they just start looking for groups of words that appear together frequently. You, the researcher, have to decide the number of themes (the **K**) *before* the student starts. You are the architect; the computer is the builder.

  ---

  ## 1. Dictionary vs. Corpus
  Computers can't read words; they read numbers. To bridge this gap, the **Gensim** library (the standard for topic modeling in Python) uses two specialized objects:

  - **The Dictionary**: A master map that assigns a unique ID number to every unique word in your entire collection. 
    - *Example: {"whale": 0, "ship": 1, "sea": 2}*
  - **The Corpus (Bag of Words)**: A numerical version of your documents. Instead of storing the text "the whale, the whale," it stores a list of tuples: `[(0, 2)]`. This means: "Word ID 0 (whale) appears 2 times."

  ---

  ## 2. Choosing the "Goldilocks K"
  The most important decision you make is choosing the number of topics (**K**). 

  - **If K is too small**: Your topics will be "mushy" and over-generalized (e.g., a single topic that contains both "Religion" and "Politics").
  - **If K is too large**: Your topics will be too "splintered," creating dozens of tiny, overlapping categories that are hard to interpret.

  :::definition
  **Hyperparameter**: A setting you choose *before* the training starts (like K) that determines how the model learns. In DH, we often run several models with different K values (e.g., 10, 20, 50) to see which one yields the most useful results.
  :::

  ---

  ## 3. The Gensim Workflow
  To train a model, you follow three standard steps:
  1. **Build the Dictionary**: `dictionary = corpora.Dictionary(texts)`
  2. **Create the Bag of Words**: `corpus = [dictionary.doc2bow(text) for text in texts]`
  3. **Train the Model**: `lda = models.LdaModel(corpus, num_topics=K, id2word=dictionary)`

  ---

  ## 4. The Stochastic Nature of LDA
  LDA is "stochastic," meaning it uses a degree of randomness. If you run the exact same model twice, you might get slightly different results. In scholarly research, we look for **stable topics**—clusters of words that consistently appear together across multiple runs.

  :::tip
  **doc2bow** stands for "Document to Bag of Words." It is the function that translates your human-readable word lists into the numerical tuples the computer needs for its math. In production DH work you would use `gensim.corpora.Dictionary` to do this automatically; in the challenge you will build the same logic yourself so you can see exactly what Gensim does internally.
  :::

  :::challenge
  Before handing your texts to Gensim, you need to understand what it builds for you. Implement a Dictionary and a doc2bow converter from scratch, then use them to inspect the numerical representation of your corpus and answer a research question
  about topic granularity.
  :::

---challenges---

### Challenge: Build a Dictionary and BoW Corpus

- id: topic-modeling-03-c1
- language: python
- difficulty: intermediate

#### Starter Code
```python
# A preprocessed corpus: five documents from a 19th-century archive
documents = [
    ["king", "throne", "crown", "parliament"],
    ["sword", "battle", "king", "soldier"],
    ["throne", "crown", "parliament", "law"],
    ["soldier", "battle", "sword", "march"],
    ["parliament", "law", "king", "crown"],
]

# Step 1: Build a Dictionary — a mapping of {word: unique_integer_id}
# Loop through every document and every word. If the word has not been
# seen before, assign it the next available integer ID.
# Store the result in a dict called `word2id`.
word2id = {}
# Your code here

print("Vocabulary size:", len(word2id))
print("Sample entries:", {k: word2id[k] for k in list(word2id)[:4]})

# Step 2: Implement doc2bow.
# Given a document (list of words) and a word2id dictionary, return a
# sorted list of (word_id, count) tuples — one tuple per unique word.
def doc2bow(document, word2id):
    # Count how many times each word appears in the document
    # Then convert those counts into (id, count) tuples
    # Return the list sorted by word_id
    pass

# Step 3: Convert ALL documents into BoW format.
# Build a list called `corpus` by calling doc2bow on each document.
corpus = []
# Your code here

# Step 4: Build the reverse mapping — id2word — so you can look up
# what a word_id means. This is what Gensim uses for human-readable output.
id2word = {}
# Your code here

# Inspect one document: print a human-readable version of corpus[1]
# by replacing each word_id with its actual word.
# Expected format: [('sword', 1), ('battle', 1), ('king', 1), ('soldier', 1)]
readable = [(id2word[wid], count) for wid, count in corpus[1]]
print("Document 1 in BoW:", sorted(readable))

# Step 5 (Research question): How many unique words appear in at least 3 documents?
# This is the pool of words informative enough to anchor a topic.
# A reasonable K should be smaller than this number.
doc_freq = {}
# Your code here — count document frequency for each word, then filter

informative_words = [w for w, freq in doc_freq.items() if freq >= 3]
print(f"Words in 3+ docs: {sorted(informative_words)}")
print(f"Suggested max K: {len(informative_words)}")
```

#### Expected Output
```
Vocabulary size: 10
Sample entries: {'king': 0, 'throne': 1, 'crown': 2, 'parliament': 3}
Document 1 in BoW: [('battle', 1), ('king', 1), ('soldier', 1), ('sword', 1)]
Words in 3+ docs: ['crown', 'king', 'parliament']
Suggested max K: 3
```

#### Hints

1. For Step 1, use `if word not in word2id:` then `word2id[word] = len(word2id)` — since `len()` grows with each insertion, it automatically assigns the next available ID.
2. For Step 2, first build a plain frequency dict with `counts.get(word, 0) + 1`, then convert it: `[(word2id[w], c) for w, c in counts.items()]`. Sort with `sorted(..., key=lambda x: x[0])`.
3. For Step 4, `id2word` is just the reverse of `word2id` — swap keys and values: `{v: k for k, v in word2id.items()}`.
4. For Step 5, loop through the corpus (not the raw documents) — for each BoW list, each tuple represents one unique word in that document, so incrementing `doc_freq` by the tuple's word_id covers you. Or loop the raw documents — either works.

#### Solution
```python
documents = [
    ["king", "throne", "crown", "parliament"],
    ["sword", "battle", "king", "soldier"],
    ["throne", "crown", "parliament", "law"],
    ["soldier", "battle", "sword", "march"],
    ["parliament", "law", "king", "crown"],
]

# Step 1: Build word2id
word2id = {}
for doc in documents:
    for word in doc:
        if word not in word2id:
            word2id[word] = len(word2id)

print("Vocabulary size:", len(word2id))
print("Sample entries:", {k: word2id[k] for k in list(word2id)[:4]})

# Step 2: doc2bow implementation
def doc2bow(document, word2id):
    counts = {}
    for word in document:
        counts[word] = counts.get(word, 0) + 1
    return sorted([(word2id[w], c) for w, c in counts.items()], key=lambda x: x[0])

# Step 3: Build corpus
corpus = [doc2bow(doc, word2id) for doc in documents]

# Step 4: Build id2word
id2word = {v: k for k, v in word2id.items()}

readable = [(id2word[wid], count) for wid, count in corpus[1]]
print("Document 1 in BoW:", sorted(readable))

# Step 5: Document frequency and K guidance
doc_freq = {}
for bow in corpus:
    for wid, _ in bow:
        word = id2word[wid]
        doc_freq[word] = doc_freq.get(word, 0) + 1

informative_words = [w for w, freq in doc_freq.items() if freq >= 3]
print(f"Words in 3+ docs: {sorted(informative_words)}")
print(f"Suggested max K: {len(informative_words)}")
```

