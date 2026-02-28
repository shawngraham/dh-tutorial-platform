---
id: topic-modeling-01
title: 'Topic Modeling: Conceptual Foundations'
moduleId: topic-modeling
prerequisites:
  - text-analysis-04
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Explain the logic of Latent Dirichlet Allocation (LDA)
  - Understand the "Bag of Words" assumption and its trade-offs
  - Differentiate between a "Topic" (word clusters) and a "Category" (fixed labels)
  - Identify the importance of Stopword removal in modeling
keywords:
  - LDA
  - distant reading
  - latent
  - probability
  - bag-of-words
---

# Topic Modeling: Conceptual Foundations

  ## Analogy
  Imagine you have a giant pile of 1,000 unsorted newspaper clippings from the 1920s. You don't have time to read them, but you notice that some clippings use the words "stadium," "goal," and "referee" frequently, while others use "election," "vote," and "parliament." 

  Even without reading the articles, you can guess that the first group represents a discourse on **Sports** and the second on **Politics**. Topic modeling is a digital assistant that sorts these clippings by looking at which words tend to "hang out" together in the same documents.

  ---

  ## 1. Latent Dirichlet Allocation (LDA)
  LDA is the most common algorithm for topic modeling in the humanities. It works on a "probabilistic" basis, assuming two things:
  1.  **Documents are mixtures of topics**: A single letter from a soldier might be 60% "military life" and 40% "family affection."
  2.  **Topics are mixtures of words**: The "Military" topic has a high probability of containing words like "march," "camp," and "officer."

  :::definition
  **Latent**: This means "hidden." We call it *Latent* Dirichlet Allocation because the topics aren't explicitly labeled in the text; the computer has to discover the hidden patterns.
  :::

  ---

  ## 2. The Bag of Words (BoW)
  To a topic model, **grammar and word order do not matter**. "The cat sat on the mat" and "The mat sat on the cat" are identical to the model. It treats a document like a "bag" of individual words, only caring about how many of each word are present.

  ```python
  # A "Bag of Words" representation
  doc = "history is a set of lies"
  bag = doc.split()
  counts = {word: bag.count(word) for word in set(bag)}
  # Result: {'set': 1, 'is': 1, 'lies': 1, 'a': 1, 'history': 1, 'of': 1}
  ```

  ---

  ## 3. The Problem of "The": Stopwords
  In the challenge in the sandbox, you will find shared words between two sentences. You will notice that common words like "the" appear in both. In real topic modeling, these are called **Stopwords**. Because they appear in *every* document, they don't help the computer distinguish between topics. Most researchers remove them before running a model.

  ---

  ## 4. Why Use This in DH?
  Topic modeling is a form of **Distant Reading**. It allows a scholar to:
  -   Survey thousands of documents at once.
  -   Discover themes they didn't know existed.
  -   Track how a "Topic" (like *democracy* or *nature*) changes in its word usage over 200 years.

  :::tip
  **Topics vs. Categories**: A category is a label *you* give a book (like "Fiction"). A topic is a cluster of words the *computer* finds (like "ship, sea, whale, captain"). It is up to the researcher to interpret what those clusters mean.
  :::

:::challenge
  You have three short documents from a historical corpus. Your task is to simulate the first step of topic modeling: building word frequency profiles, removing stopwords, and identifying the words with the strongest cross-document presence. The word that scores highest is the model's best candidate for a shared latent topic.
  :::

---challenges---

### Challenge: Simulating Topic Discovery

- id: topic-modeling-01-c1
- language: python
- difficulty: beginner

#### Starter Code
```python
# A small corpus: three documents from a historical archive
corpus = [
    "the soldiers marched through the camp and the officers gave orders to march at dawn",
    "the officer wrote a letter from camp describing the long march to the northern ridge",
    "a letter arrived from the front the soldiers had reached camp after a night march",
]

# Words so common they carry no meaning for topic discovery
stopwords = {"the", "a", "and", "to", "at", "from", "had", "after", "through", "gave"}

# Step 1: Build a Bag of Words for each document.
# Create a list called `bags`. For each document in the corpus:
#   - Split it into words
#   - Build a dictionary of {word: count} pairs, EXCLUDING any stopwords
#   - Append that dictionary to `bags`
bags = []
# Your code here

# Step 2: Count how many documents each word appears in (its "document frequency").
# Create a dictionary called `doc_freq`.
# Loop through each bag; for each unique word in that bag,
# increment its count in doc_freq by 1.
doc_freq = {}
# Your code here

# Step 3: Find words that appear in ALL THREE documents (doc_freq == 3).
# Store them in a list called `topic_words`, sorted alphabetically.
topic_words = []
# Your code here

print("Candidate topic words:", topic_words)

# Step 4: Of those topic words, which has the highest TOTAL count across all documents?
# Sum each topic word's count across all three bags and print the word
# and its total in the format: "Strongest signal: <word> (<total> occurrences)"
# Your code here
```

#### Expected Output
```
Candidate topic words: ['camp', 'letter', 'march', 'soldiers']
Strongest signal: march (4 occurrences)
```

#### Hints

1. For Step 1, a nested loop works well: `for doc in corpus:` then `for word in doc.split():`. Check `if word not in stopwords` before adding to the bag dictionary. Use `bag.get(word, 0) + 1` to increment safely.
2. For Step 2, loop `for bag in bags:` and then `for word in bag:` — iterating a dictionary gives you its unique keys, so each word is counted once per document automatically.
3. For Step 3, a list comprehension is clean: `[word for word, count in doc_freq.items() if count == 3]`.
4. For Step 4, loop through `topic_words`, sum `bag.get(word, 0)` across all bags, and track the highest total.

#### Solution
```python
corpus = [
    "the soldiers marched through the camp and the officers gave orders to march at dawn",
    "the officer wrote a letter from camp describing the long march to the northern ridge",
    "a letter arrived from the front the soldiers had reached camp after a night march",
]

stopwords = {"the", "a", "and", "to", "at", "from", "had", "after", "through", "gave"}

# Step 1: Build Bags of Words
bags = []
for doc in corpus:
    bag = {}
    for word in doc.split():
        if word not in stopwords:
            bag[word] = bag.get(word, 0) + 1
    bags.append(bag)

# Step 2: Document frequency count
doc_freq = {}
for bag in bags:
    for word in bag:
        doc_freq[word] = doc_freq.get(word, 0) + 1

# Step 3: Words present in all three documents
topic_words = sorted([word for word, count in doc_freq.items() if count == 3])
print("Candidate topic words:", topic_words)

# Step 4: Strongest signal by total count
best_word = ""
best_total = 0
for word in topic_words:
    total = sum(bag.get(word, 0) for bag in bags)
    if total > best_total:
        best_total = total
        best_word = word

print(f"Strongest signal: {best_word} ({best_total} occurrences)")
```

