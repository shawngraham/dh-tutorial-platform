---
id: topic-modeling-04
title: Interpreting and Navigating Topics
moduleId: topic-modeling
prerequisites:
  - topic-modeling-03
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Read and interpret word-topic distributions (Weights)
  - Analyze document-topic proportions to track themes across a corpus
  - Identify and troubleshoot "Junk Topics" resulting from poor preprocessing
  - Apply the "Human-in-the-loop" philosophy to labeling machine output
keywords:
  - interpretation
  - weights
  - visualization
  - coherence
  - junk topics
---

# Interpreting and Navigating Topics

  ## The Scholar as Interpreter
  A topic model output is like a **map of a new territory**. The computer provides the coordinates and the landmarks, but it doesn't tell you what they "mean." 

  You, the human historian or literary scholar, have to look at a cluster of words like *"ship, whale, harpoon, sea"* and decide to label that landmark "Whaling Industry." Topic modeling is not an answer; it is a way of organizing an archive so you can ask better questions.

  ---

  ## 1. Word Weights (Probabilities)
  Each word in a topic is assigned a "weight." This number tells you how important that word is to that specific topic. 

  - **Topic 1**: `0.045*"whale" + 0.030*"sea" + 0.025*"ship"`
  - **Translation**: If you see "whale" in a document, there is a 4.5% chance the computer thinks that specific word belongs to Topic 1. 

  The words with the highest weights are your **Top Terms**. These are the words you use to decide what a topic is "about."

  ---

  ## 2. Document-Topic Proportions
  This is the "Gold Mine" for Digital Humanities. Once a model is trained, we can see exactly how much of each topic exists in every document. 

  Imagine analyzing *Moby Dick* vs. *Paradise Lost*:
  - **Moby Dick**: 85% "Whaling", 10% "Religion", 5% "Biology".
  - **Paradise Lost**: 2% "Whaling", 95% "Religion", 3% "Biology".

  By looking at these percentages, you can find "hidden" religious documents in a maritime archive, or track how the "Religion" topic fluctuates from the beginning of a novel to the end.

  ---

  ## 3. Identifying "Junk Topics"
  Sometimes a model will produce a topic that looks like this: *"said, went, came, back, told."* 
  This is a **Junk Topic**. 

  Junk topics occur when common verbs or "noise" words haven't been filtered out properly. They don't represent a meaningful discourse; they represent the structural skeleton of the language. If you see too many junk topics, you need to go back to the **Preprocessing** stage and add those words to your **Stopword List**.

  ---

  ## 4. Distant Reading vs. Close Reading
  Topic modeling is a "Distant Reading" tool, but it works best when paired with "Close Reading." If a specific diary entry has a 90% score in a "Grief" topic, you should use that as a signpost to go back and read that specific page. Use the machine to find the needle, then use your human brain to analyze the needle.

  :::tip
  **Human-in-the-loop**: This is the DH philosophy that the machine's output is only the *start* of the research. Your labels and interpretations are what turn "data" into "scholarship."
  :::

:::challenge
  Below is a simulated LDA model output represented as plain Python dictionaries, exactly the kind of data structure Gensim produces internally. Your job is to act as the "Scholar as Interpreter": read the weights, track document-topic proportions, flag junk topics, and apply human labels to what the machine found.
  :::

---challenges---

### Challenge: Interpret a Topic Model

- id: topic-modeling-04-c1
- language: python
- difficulty: intermediate

#### Starter Code
```python
# Simulated LDA output: 4 topics, each as a list of (word, weight) pairs
# sorted from highest to lowest weight
topics = {
    0: [("whale", 0.045), ("sea", 0.030), ("ship", 0.025), ("harpoon", 0.021), ("ocean", 0.018)],
    1: [("said", 0.062), ("went", 0.058), ("came", 0.047), ("told", 0.039), ("back", 0.031)],
    2: [("parliament", 0.041), ("vote", 0.038), ("law", 0.029), ("election", 0.027), ("crown", 0.019)],
    3: [("prayer", 0.050), ("sin", 0.044), ("soul", 0.033), ("grace", 0.028), ("faith", 0.022)],
}

# Simulated document-topic proportions: each document's percentage per topic
# Rows = documents, columns = topic IDs 0-3
documents = {
    "Moby Dick Ch.1":      {0: 0.82, 1: 0.04, 2: 0.03, 3: 0.11},
    "Moby Dick Ch.9":      {0: 0.41, 1: 0.05, 2: 0.02, 3: 0.52},
    "Parliament Report":   {0: 0.03, 1: 0.06, 2: 0.88, 3: 0.03},
    "Parish Register":     {0: 0.05, 1: 0.08, 2: 0.12, 3: 0.75},
    "Admiralty Minutes":   {0: 0.55, 1: 0.05, 2: 0.35, 3: 0.05},
}

# ------------------------------------------------------------------
# Step 1: Print the top 3 words for each topic.
# Format: "Topic <id>: word1, word2, word3"
# Your code here


# ------------------------------------------------------------------
# Step 2: Identify junk topics.
# A topic is "junk" if its top word has a weight below 0.05 AND
# all its top-5 words are common function/structural words.
# We define structural words as:
junk_words = {"said", "went", "came", "told", "back", "got", "looked", "asked", "made"}

# Print: "Junk topic detected: Topic <id>" for any topic that qualifies.
# A topic qualifies if MORE THAN HALF of its top 5 words are in junk_words.
# Your code here


# ------------------------------------------------------------------
# Step 3: Assign human labels to the non-junk topics.
# Fill in this dictionary with a short interpretive label for each topic
# based on its top words. Topic 1 should be labelled "JUNK".
labels = {
    0: "",   # Your label here
    1: "JUNK",
    2: "",   # Your label here
    3: "",   # Your label here
}

# ------------------------------------------------------------------
# Step 4: Find the dominant topic for each document (highest proportion)
# and print it with its human label.
# Format: "<document title>: <label> ({proportion:.0%})"
# Your code here


# ------------------------------------------------------------------
# Step 5 (Close reading signpost): Print the title of any document
# where Topic 3 (whichever label you gave it) exceeds 40%.
# These are the documents a scholar should close-read for that theme.
print("\nDocuments to close-read for theme:", labels[3])
# Your code here
```

#### Expected Output
```
Topic 0: whale, sea, ship
Topic 1: said, went, came
Topic 2: parliament, vote, law
Topic 3: prayer, sin, soul

Junk topic detected: Topic 1

Moby Dick Ch.1: Whaling Industry (82%)
Moby Dick Ch.9: Whaling Industry (41%)
Parliament Report: Political Governance (88%)
Parish Register: Religion & Faith (75%)
Admiralty Minutes: Whaling Industry (55%)

Documents to close-read for theme: Religion & Faith
Moby Dick Ch.9 (52%)
Parish Register (75%)
```

#### Hints

1. For Step 1, `topics[tid]` gives you a list of `(word, weight)` tuples. Slice `[:3]` for the top 3, then join just the words with `", ".join(word for word, _ in ...)`.
2. For Step 2, check each topic: `sum(1 for word, _ in topics[tid][:5] if word in junk_words)`. If that count is greater than 2 (more than half of 5), it's junk.
3. For Step 4, use `max(proportions.items(), key=lambda x: x[1])` to find the `(topic_id, proportion)` pair with the highest value.
4. For Step 5, loop through `documents.items()` and check `proportions[3] > 0.40`.

#### Solution
```python
topics = {
    0: [("whale", 0.045), ("sea", 0.030), ("ship", 0.025), ("harpoon", 0.021), ("ocean", 0.018)],
    1: [("said", 0.062), ("went", 0.058), ("came", 0.047), ("told", 0.039), ("back", 0.031)],
    2: [("parliament", 0.041), ("vote", 0.038), ("law", 0.029), ("election", 0.027), ("crown", 0.019)],
    3: [("prayer", 0.050), ("sin", 0.044), ("soul", 0.033), ("grace", 0.028), ("faith", 0.022)],
}

documents = {
    "Moby Dick Ch.1":      {0: 0.82, 1: 0.04, 2: 0.03, 3: 0.11},
    "Moby Dick Ch.9":      {0: 0.41, 1: 0.05, 2: 0.02, 3: 0.52},
    "Parliament Report":   {0: 0.03, 1: 0.06, 2: 0.88, 3: 0.03},
    "Parish Register":     {0: 0.05, 1: 0.08, 2: 0.12, 3: 0.75},
    "Admiralty Minutes":   {0: 0.55, 1: 0.05, 2: 0.35, 3: 0.05},
}

junk_words = {"said", "went", "came", "told", "back", "got", "looked", "asked", "made"}

# Step 1: Top 3 words per topic
for tid, word_weights in topics.items():
    top = ", ".join(word for word, _ in word_weights[:3])
    print(f"Topic {tid}: {top}")

print()

# Step 2: Junk topic detection
for tid, word_weights in topics.items():
    junk_count = sum(1 for word, _ in word_weights[:5] if word in junk_words)
    if junk_count > 2:
        print(f"Junk topic detected: Topic {tid}")

print()

# Step 3: Human labels
labels = {
    0: "Whaling Industry",
    1: "JUNK",
    2: "Political Governance",
    3: "Religion & Faith",
}

# Step 4: Dominant topic per document
for title, proportions in documents.items():
    top_id, top_prop = max(proportions.items(), key=lambda x: x[1])
    print(f"{title}: {labels[top_id]} ({top_prop:.0%})")

print()

# Step 5: Close-reading signpost for Topic 3
print("Documents to close-read for theme:", labels[3])
for title, proportions in documents.items():
    if proportions[3] > 0.40:
        print(f"{title} ({proportions[3]:.0%})")
```

