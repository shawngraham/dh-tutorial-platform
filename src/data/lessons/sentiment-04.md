---
id: sentiment-04
title: Limitations and Bias
moduleId: sentiment-analysis
prerequisites:
  - sentiment-02
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Identify linguistic failure points such as negation, sarcasm, and irony
  - Explain how "historical semantic shift" can invalidate modern sentiment lexicons
  - Recognize algorithmic bias in sentiment tools when applied to non-standard dialects
  - Implement a "look-back" window to handle simple negation in Python
keywords:
  - negation
  - bias
  - sarcasm
  - semantic shift
  - AAVE
  - critique
---

# Limitations and Bias

Sentiment analysis is a powerful tool, but in Digital Humanities, it is often a "leaky" abstraction. If we don't understand where it fails, we risk making false claims about the past or present.

## 1. The Time Traveler Problem (Semantic Shift)

Imagine a sentiment tool trained on 2024 movie reviews. If you use it to analyze a diary from 1750, it will fail.
*   **"Wicked"**: Today might mean "cool" (positive); in 1750, it meant "evil" (negative).
*   **"Nice"**: In the 14th century, it meant "foolish" or "ignorant."
*   **"Terrific"**: Originally meant "causing terror."

**DH Rule:** Always match your dictionary to your era. Using VADER (designed for social media) on a Victorian novel is a methodological risk.

## 2. The Sarcasm Gap

Computers struggle with irony.
*   *Text:* "Oh great, another 5-hour meeting. Just what I wanted."
*   *VADER:* Likely sees "great" and "wanted" and gives a **positive** score.
*   *Human:* Clearly understands the frustration.

## 3. Negation: The "Not" Problem

Simple "Bag of Words" models treat sentences as a soup of words. 
*   "The service was **good**." (+1)
*   "The service was **not good**." (+1 if the computer only looks for "good")

To fix this, we need **Heuristics** (rules) that look for "valence shifters" like *not, never, no, or hardly*.

## 4. Algorithmic Bias

Sentiment analyzers are trained on specific datasets (often Wikipedia or news). 
*   **Dialect Bias:** Research has shown that sentiment tools often flag **AAVE (African American Vernacular English)** as more "negative" or "toxic" than Standard American English, even when the sentiment is positive.
*   **Domain Bias:** In a medical context, the word "Positive" (as in a test result) is often very "Negative" for the patient.

---

## Practice

:::try-it
**Contextual Flip**
Think of the word "Unpredictable." 
1. Write a sentence where "unpredictable" is a **compliment** (e.g., a thriller movie).
2. Write a sentence where "unpredictable" is a **complaint** (e.g., a car's brakes).
How would a single dictionary score both fairly?
:::

## Transfer: DH Critique

*   **Social Justice:** Investigating if automated content moderation (which uses sentiment analysis) unfairly silences marginalized voices.
*   **History of Emotions:** Using sentiment analysis to track the changing meaning of "Melancholy" from a medical condition to a poetic state.

:::challenge
Improve a manual scorer by implementing a "Look-Back" negation rule.
:::

---challenges---

### Challenge: The Negation Fix

- id: sentiment-04-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
positive_words = ["good", "happy", "excellent", "great"]

def get_sentiment(sentence):
    words = sentence.lower().split()
    score = 0
    
    for i in range(len(words)):
        word = words[i]
        
        if word in positive_words:
            # TASK: Check if the word BEFORE (i-1) is "not"
            # 1. Ensure i > 0 (so we don't look for words before the start)
            # 2. If words[i-1] is "not", subtract 1 from the score
            # 3. Otherwise, add 1 to the score
            
            # Your code here
            pass
                
    return score

# Test cases
print(f"Score 1: {get_sentiment('this is good')}")
print(f"Score 2: {get_sentiment('this is not good')}")
```

#### Expected Output

```
Score 1: 1
Score 2: -1
```

#### Hints

1. Use an `if` statement to check `if i > 0 and words[i-1] == "not":`.
2. If the condition is true, use `score -= 1`.
3. Use an `else:` block to handle the cases where "not" isn't there.

#### Solution

```python
positive_words = ["good", "happy", "excellent", "great"]

def get_sentiment(sentence):
    words = sentence.lower().split()
    score = 0
    
    for i in range(len(words)):
        word = words[i]
        
        if word in positive_words:
            if i > 0 and words[i-1] == "not":
                score -= 1
            else:
                score += 1
                
    return score

print(f"Score 1: {get_sentiment('this is good')}")
print(f"Score 2: {get_sentiment('this is not good')}")
```

