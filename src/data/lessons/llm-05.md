---
id: llm-05
title: 'Beyond the Model: LLMs as Complex Systems'
moduleId: llm-foundations
prerequisites:
  - llm-04
estimatedTimeMinutes: 10
difficulty: advanced
learningObjectives:
  - Describe an LLM as a probability distribution over token sequences
  - Identify the components surrounding the model in deployed systems
  - Articulate why LLMs are both a statistical phenomenon and a cultural object
keywords:
  - language model
  - systems
  - tokens
  - probability
  - emergent behavior
  - statistics of language
  - rag
  - culture
---

# Beyond the Model: LLMs as Complex Systems

## Analogy

A pipe organ is not its pipes. The pipes are the core mechanism, but the instrument also includes the keyboard, the bellows, the stops, the wind chest, the tuning, and the room in which it stands. Change any of these and you change the music. A large language model is like a pipe organ: the transformer weights are the pipes — remarkable and central — but what you experience when you interact with one is a *system*, not just a model.

## The Fundamental Object: A Distribution Over Token Sequences

At its core, a large language model is a mathematical function that assigns **probabilities to token sequences**. Given the tokens seen so far, it outputs a probability distribution over what the next token might be:

```
P( token_n  |  token_1, token_2, ..., token_{n-1} )
```

That is all it does. Every sentence, every creative leap, every apparent flash of insight is the result of repeatedly sampling from this distribution.

The model's billions of parameters — floating-point numbers stored as weights — encode the statistical regularities of the training corpus: which words co-occur, which syntactic patterns are common, which ideas appear together across millions of documents. The model has no beliefs, no desires, no understanding in any philosophically robust sense. It has **a vast, compressed representation of the statistics of language as written by human beings**.

```python
# A tiny bigram language model illustrates the same principle at miniature scale
from collections import defaultdict

corpus = [
    "the cat sat on the mat",
    "the cat ate the rat",
    "the rat sat on the hat",
]

# Build bigram counts: for each word, what word follows it?
bigrams = defaultdict(lambda: defaultdict(int))
for sentence in corpus:
    words = sentence.split()
    for i in range(len(words) - 1):
        bigrams[words[i]][words[i + 1]] += 1

def next_token_probs(word):
    counts = bigrams[word]
    total = sum(counts.values())
    return {w: c / total for w, c in sorted(counts.items(), key=lambda x: -x[1])}

probs = next_token_probs("the")
for word, prob in probs.items():
    print(f"  P('{word}' | 'the') = {prob:.2f}")
```

:::try-it
Add a fourth sentence to the `corpus` list — perhaps *"the dog chased the cat"* — and re-run the probability computation. Notice how even one sentence shifts the distribution. This is the miniature version of what changes when a model is retrained on a new or expanded dataset.
:::

## The System Around the Model

When you send a message to an LLM-based application, the journey passes through many components:

```bash
User Input
    │
    ▼
[Safety Classifier]      ← Is this input permitted?
    │
    ▼
[System Prompt]          ← Hidden instructions shaping behaviour
    │
    ▼
[Retrieval / RAG]        ← Relevant documents fetched from a database
    │
    ▼
[Tokenizer]              ← Text split into sub-word tokens
    │
    ▼
[Transformer Model]      ← The core probability machine
    │
    ▼
[Sampling Strategy]      ← Temperature, top-k, top-p control randomness
    │
    ▼
[Output Filter]          ← Post-hoc safety / content checks
    │
    ▼
Response
```

Each stage introduces its own assumptions, biases, and failure modes. The "AI" you interact with is this entire pipeline, not just the model weights.

:::definition
**Retrieval-Augmented Generation (RAG)**: A technique in which relevant documents are retrieved from an external database and injected into the model's context window before generation. It allows the model to answer questions about recent events or private corpora without retraining — at the cost of introducing a retrieval step whose errors compound with the model's own.
:::

## Emergent Capabilities

As models scale — more parameters, more training data, more compute — they seem to exhibit what are called **emergent capabilities**: abilities that appear suddenly at a scale threshold and were absent in smaller models. Multi-step arithmetic, low-resource language translation, and complex analogical reasoning have all shown this pattern.

This emergence is not fully understood. It may reflect genuine qualitative changes in what a sufficiently rich statistical representation can do, or it may reflect limitations in how capability is measured at smaller scales. Either way, it means that the behaviour of very large models cannot be reliably predicted by studying smaller ones. 

## The Cultural Dimension

LLMs are trained on human writing. Human writing is not a neutral sample of reality — it is a record of *who had access to literacy, publication, and archival preservation*. The statistics of language encoded in a training corpus reflect:

- The languages and dialects with the most digitised text (heavily skewed toward English)
- The time periods, geographies, and demographics with the largest published output
- The editorial and platform choices of the organisations that assembled and filtered the data

An LLM's "knowledge" is therefore not encyclopaedic — it is *situated*. It knows more about European history than Andean history, more about the 20th century than the 12th, more about published fiction than oral tradition. It knows how to role play 'ai run amok' because our fiction is filled with stories that tell it. The silences (and the crashing cymbals!) in an LLM's knowledge are archives of who and what has been excluded (or included) from digitised text.

## LLMs as Humanistic Objects

The lesson of this module is not simply technical. It is this:

**A large language model is among the largest objects ever produced by the humanities.** It is a single mathematical structure that has ingested more text than any human could read in a thousand lifetimes. **It is a model of culture**. It is an artefact. It has no intention, no consciousness, no interpretation. And yet — because it is built from human language, shaped by human preferences through RLHF, deployed through human-designed pipelines — it expresses, amplifies, and distorts human thought at unprecedented scale.

The models are no longer just models. They have become complex sociotechnical systems, retrieval pipelines, safety classifiers, system prompts, fine-tuned personas, built on top of a fundamental digital object: a vast, compressed, and inevitably partial representation of the statistics of human language.

To use these systems responsibly, and to critique them rigorously, we need both the technical literacy to understand how they work and the humanistic sensibility to ask *whose language*, *whose values*, and *whose silences* they encode, and **where they are deployed**. The questions your disciplines have always asked, about power, representation, interpretation, and meaning, are exactly the questions we need to bring to these systems. The point of a system is what it does...

:::challenge
Implement a Weighted Probability function that combines two different "archives" (e.g., a "Mainstream Archive" and a "Marginalized Archive") to show how the "system" can tune which "culture" it amplifies.
:::

---challenges---

### Challenge: The Weighted Archive

- id: llm-05-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
# Archive A: Colonial records regarding land (focus on expansion)
discovery_archive = {"expansion": 12, "territory": 8, "resource": 10}

# Archive B: Indigenous records regarding land (focus on heritage)
stewardship_archive = {"kinship": 15, "territory": 11, "custodianship": 9}

# The system weight (0.0 to 1.0) for Archive B. 
# A weight of 0.8 means the system heavily prioritizes the stewardship perspective.
weight_b = 0.8

all_words = set(discovery_archive.keys()) | set(stewardship_archive.keys())
weighted_results = {}

for word in all_words:
    score_a = discovery_archive.get(word, 0)
    score_b = stewardship_archive.get(word, 0)

    # Your code here: Calculate the weighted score for this word
    # Archive A should be multiplied by (1 - weight_b)
    # Archive B should be multiplied by weight_b
    weighted_score = 

    weighted_results[word] = weighted_score

# Your code here: Find the word with the highest score in the weighted_results dictionary
top_concept = 

print(f"Top Concept: {top_concept}")
print(f"Score for 'territory': {weighted_results['territory']:.1f}")
```

#### Expected Output

```
Top Concept: kinship
Score for 'territory': 10.4
```

#### Hints
1. To balance the archives, multiply score_a by (1 - weight_b) and add it to score_b * weight_b.
2. To find the key with the highest value in a dictionary, use max(weighted_results, key=weighted_results.get).
3. Even though "territory" appears in both archives, at a weight of 0.8, the word "kinship" (which only appears in Archive B) becomes the statistically dominant concept in the system.

#### Solution

```python
discovery_archive = {"expansion": 12, "territory": 8, "resource": 10}
stewardship_archive = {"kinship": 15, "territory": 11, "custodianship": 9}
weight_b = 0.8

all_words = set(discovery_archive.keys()) | set(stewardship_archive.keys())
weighted_results = {}

for word in all_words:
    score_a = discovery_archive.get(word, 0)
    score_b = stewardship_archive.get(word, 0)

    # Calculate the weighted score
    weighted_score = (score_a * (1 - weight_b)) + (score_b * weight_b)
    weighted_results[word] = weighted_score

# Find the most likely word
top_concept = max(weighted_results, key=weighted_results.get)

print(f"Top Concept: {top_concept}")
print(f"Score for 'territory': {weighted_results['territory']:.1f}")
```
