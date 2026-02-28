---
id: critical-data-04
title: 'Auditing a Word List: Bias in Language Tools'
moduleId: critical-data
prerequisites:
  - critical-data-03
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Explain how sentiment lexicons and word lists encode cultural biases
  - Cross-reference a word list with a set of culturally-coded terms to detect bias
  - Calculate and interpret a bias ratio for a language resource
keywords:
  - sentiment analysis
  - lexicon bias
  - NLP bias
  - culturally-coded language
  - word list audit
  - algorithmic fairness
---

# Auditing a Word List: Bias in Language Tools

## Analogy

Imagine a judge who consults a handbook listing "suspicious" behaviors. The handbook was written decades ago by people who considered certain styles of dress, speech patterns, or neighborhoods inherently dangerous. The judge may believe they are being objective -- after all, they are following the book. But the book itself encodes the prejudices of its authors. Every "neutral" judgment the judge makes carries those biases forward.

Sentiment lexicons and word lists in natural language processing work the same way. They are handbooks that tell algorithms which words are "positive" and which are "negative." But who decided? And whose cultural assumptions shaped those decisions?

## Key Concepts

### What Is a Sentiment Lexicon?

:::definition
**Sentiment lexicon**: A curated list of words, each assigned a sentiment score (positive, negative, or neutral). NLP tools use these lists to automatically classify the emotional tone of texts. Examples include AFINN, SentiWordNet, and the Bing Liu lexicon.
:::

A sentiment lexicon might contain entries like:

- "excellent" -> +3 (strongly positive)
- "terrible" -> -3 (strongly negative)
- "average" -> 0 (neutral)

When an algorithm analyzes a text, it looks up each word in the lexicon, sums the scores, and produces an overall sentiment rating. The method is simple and widely used -- but it inherits every bias baked into the word list.

### Where Bias Enters

Consider the word "aggressive." In many sentiment lexicons, it receives a negative score. But research in sociolinguistics has shown that "aggressive" is disproportionately applied to Black men and women in media and institutional contexts, while the same behaviors in white individuals are described as "assertive" or "passionate." The lexicon does not know this -- it simply labels "aggressive" as negative, and any text describing someone as "aggressive" gets penalized.

Other examples of culturally-coded words that carry hidden bias:

- **"articulate"** -- coded as positive, but frequently used as a backhanded compliment toward people of color, implying surprise at their eloquence.
- **"exotic"** -- coded as positive, but routinely applied to non-Western people and cultures in an othering way.
- **"thug"** -- coded as negative, but applied with heavily racialized patterns in media coverage.

### Auditing by Cross-Reference

An audit is straightforward: take your sentiment lexicon and cross-reference it against a list of terms that scholars have identified as culturally coded. For each flagged word, record its sentiment score and examine whether the score might produce biased results when applied to texts about particular communities.

```python
# A small sentiment lexicon
lexicon = {"bright": 2, "thug": -2, "gentle": 1, "savage": -2}

# Culturally-coded terms (flagged by scholars)
flagged = {"thug", "savage"}

for word in sorted(lexicon):
    if word in flagged:
        label = "negative" if lexicon[word] < 0 else "positive"
        print(f"FLAGGED: '{word}' (score: {lexicon[word]}, {label})")
```

### Measuring the Scale of Bias

A single flagged word might be an isolated problem. But if a large proportion of the lexicon consists of culturally-coded terms -- especially if they cluster on the negative end -- then the tool has a systematic bias. We can quantify this with a bias ratio.

```python
# Bias ratio: what fraction of the lexicon is culturally flagged?
total_words = 4
flagged_words = 2
ratio = flagged_words / total_words * 100
print(f"Bias ratio: {ratio}%")
```

:::definition
**Bias audit**: A systematic examination of a tool, dataset, or algorithm to identify patterns of unfair treatment toward particular groups. In NLP, this often involves cross-referencing language resources with lists of culturally-coded terms.
:::

### Why This Matters for Humanities Research

Digital humanists routinely use sentiment analysis to study literary texts, historical newspapers, political speeches, and social media. If the underlying lexicon treats culturally-coded language as inherently negative, the analysis will systematically misrepresent texts written by or about marginalized communities. A sentiment analysis of African American newspapers, for instance, might report more "negative" language not because the content is more negative, but because the lexicon penalizes terms common in those texts.

Sentiment analysis does not measure some objective temperature of feeling. It measures alignment with the assumptions embedded in the word list.

## Practice

:::try-it
Take the sentiment lexicon from the challenge in the sandbox and experiment: What happens if you add more neutral words (score 0) to the lexicon? Does the bias ratio go down? Does the actual bias in the flagged words change? This distinction between diluting a metric and actually fixing a problem is important in algorithmic fairness.
:::

## Transfer

Consider a text analysis project in your field:

- What sentiment lexicon or word list does your tool use?
- Can you access and inspect the actual word list? (Many tools hide this from users.)
- Are there terms in the list that might carry different connotations in different cultural contexts?
- How might you supplement an automated analysis with domain expertise to catch what the lexicon misses?

The scholar Ruha Benjamin coined the term "the New Jim Code" to describe how seemingly neutral technologies reproduce racial hierarchies. Auditing word lists is one concrete way to look inside the black box and see whose values are encoded there.

:::challenge
Cross-reference a sentiment lexicon with a set of culturally-coded terms. Report each flagged word, its score, and whether it is positive or negative. Then calculate the overall bias ratio and the proportion of flagged words that carry negative scores. Think about what the directionality implies and make a note in your notebook.
:::

---challenges---

### Challenge: Audit a Sentiment Lexicon for Cultural Bias

- id: critical-data-04-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
# A sentiment lexicon: word -> score (positive = good, negative = bad)
sentiment_lexicon = {
    "aggressive": -2, "articulate": 2, "exotic": 1,
    "illegal": -2, "thug": -2, "civilized": 2,
    "primitive": -2, "bright": 2, "sassy": -1,
    "hardworking": 2, "loud": -1, "gentle": 1,
    "savage": -2, "elegant": 2, "pushy": -1,
}

# Terms identified by scholars as culturally coded
# (disproportionately applied to marginalized groups)
flagged_terms = {"aggressive", "articulate", "exotic", "illegal",
                 "thug", "primitive", "sassy", "savage"}

# 1. For each word in the lexicon (sorted), if it is flagged,
#    print: "  FLAGGED: 'word' (score: N, positive/negative)"

# 2. Print total words, flagged count, bias ratio, and
#    how many flagged words have negative scores

# 3. Print a breakdown of the flagged words by score direction.

print()
print("=== Score Direction of Flagged Words ===")
flagged_negative = [w for w in flagged_in_lexicon if sentiment_lexicon[w] < 0]
flagged_positive = [w for w in flagged_in_lexicon if sentiment_lexicon[w] > 0]
print(f"  Flagged negative: {sorted(flagged_negative)}")
print(f"  Flagged positive: {sorted(flagged_positive)}")

# Your code here
```

#### Expected Output

```
=== Sentiment Lexicon Audit ===
  FLAGGED: 'aggressive' (score: -2, negative)
  FLAGGED: 'articulate' (score: 2, positive)
  FLAGGED: 'exotic' (score: 1, positive)
  FLAGGED: 'illegal' (score: -2, negative)
  FLAGGED: 'primitive' (score: -2, negative)
  FLAGGED: 'sassy' (score: -1, negative)
  FLAGGED: 'savage' (score: -2, negative)
  FLAGGED: 'thug' (score: -2, negative)

Total words in lexicon: 15
Flagged as culturally biased: 8
Bias ratio: 8/15 (53.3%)
Flagged words with negative scores: 6/8
=== Score Direction of Flagged Words ===
  Flagged negative: ['aggressive', 'illegal', 'primitive', 'sassy', 'savage', 'thug']
  Flagged positive: ['articulate', 'exotic']
```

#### Hints

1. Iterate over `sorted(sentiment_lexicon)` and check if each word is `in flagged_terms`. Use a list to collect the flagged words you find.
2. Determine "positive" or "negative" by checking if the score is less than 0. Use `round(count/total*100, 1)` for the percentage.
3. Count negative-scored flagged words with a sum: `sum(1 for w in flagged_list if sentiment_lexicon[w] < 0)`.

#### Solution

```python
sentiment_lexicon = {
    "aggressive": -2, "articulate": 2, "exotic": 1,
    "illegal": -2, "thug": -2, "civilized": 2,
    "primitive": -2, "bright": 2, "sassy": -1,
    "hardworking": 2, "loud": -1, "gentle": 1,
    "savage": -2, "elegant": 2, "pushy": -1,
}

flagged_terms = {"aggressive", "articulate", "exotic", "illegal",
                 "thug", "primitive", "sassy", "savage"}

print("=== Sentiment Lexicon Audit ===")
flagged_in_lexicon = []
for word in sorted(sentiment_lexicon):
    if word in flagged_terms:
        score = sentiment_lexicon[word]
        label = "negative" if score < 0 else "positive"
        flagged_in_lexicon.append(word)
        print(f"  FLAGGED: '{word}' (score: {score}, {label})")

print(f"\nTotal words in lexicon: {len(sentiment_lexicon)}")
print(f"Flagged as culturally biased: {len(flagged_in_lexicon)}")
print(f"Bias ratio: {len(flagged_in_lexicon)}/{len(sentiment_lexicon)} ({round(len(flagged_in_lexicon)/len(sentiment_lexicon)*100, 1)}%)")

neg_flagged = sum(1 for w in flagged_in_lexicon if sentiment_lexicon[w] < 0)
print(f"Flagged words with negative scores: {neg_flagged}/{len(flagged_in_lexicon)}")

print("=== Score Direction of Flagged Words ===")
flagged_negative = [w for w in flagged_in_lexicon if sentiment_lexicon[w] < 0]
flagged_positive = [w for w in flagged_in_lexicon if sentiment_lexicon[w] > 0]
print(f"  Flagged negative: {sorted(flagged_negative)}")
print(f"  Flagged positive: {sorted(flagged_positive)}")
```

