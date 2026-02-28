---
id: text-analysis-06
title: Sentiment Analysis
moduleId: text-analysis-fundamentals
prerequisites:
  - text-analysis-05
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Understand rule-based sentiment scoring using lexicons
  - Calculate "polarity" scores for text passages
  - Use the dictionary .get() method to handle missing data safely
  - Conceptualize emotional "arcs" in narrative structures
keywords:
  - sentiment
  - polarity
  - lexicon
  - emotion
  - vader
---

# Sentiment Analysis: Listening for Tone

  Sentiment analysis is the computational study of opinions, sentiments, and emotions in text. In Digital Humanities, we use it to track the emotional "arc" of a novel, analyze the public mood in historical newspapers, or compare the "positivity" of different political speeches.

  ---

  ## 1. The Lexicon-Based Approach
  The most common way to measure sentiment is using a **lexicon**—a dictionary where words are pre-labeled with emotional scores.

  - **"Excellent"**: +1.0 (Positive)
  - **"Terrible"**: -1.0 (Negative)
  - **"Table"**: 0.0 (Neutral)

  By adding up the scores of every word in a sentence, we calculate its **Polarity** (how positive or negative it is overall).

  ---

  ## 2. Coding Safely with `.get()`
  When we loop through a text to calculate sentiment, we will encounter many words (like "the" or "and") that aren't in our sentiment lexicon. 

  Normally, looking up a missing key in a dictionary causes an error. To avoid this, we use the `.get()` method, which allows us to provide a **default value** (0) if the word is not found.

  ```python
  lexicon = {"happy": 2, "sad": -2}

  # If "today" isn't in the lexicon, it returns 0 instead of crashing
  score = lexicon.get("today", 0) 
  ```

  ---

  ## 3. The "Shape" of a Story
  A famous DH application of this technique is mapping the "emotional arc" of a text. By calculating the sentiment of every paragraph in a novel and plotting it on a graph, researchers can visualize the narrative structure.

  - **The "Rags to Riches" Arc**: A steady rise in sentiment.
  - **The "Person in a Hole" Arc**: A fall into negative sentiment followed by a recovery.

  :::tip
  While our "toy" example here is simple, professional DH tools like **VADER** or **TextBlob** are smarter: they understand that "not happy" is negative and "VERY HAPPY" is more positive than just "happy."
  :::

  :::challenge
  In the challenge in the sandbox, you will build a basic sentiment engine. You'll need to split a sentence into words, check each word against a provided lexicon, and keep a running total of the score.
  :::
  

---challenges---

### Challenge: Calculate Sentiment Score

- id: text-analysis-06-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
lexicon = {"dark": -1, "stormy": -1, "bright": 1, "hope": 1}
  text = "it was a dark and stormy night but i had hope"

  # 1. Initialize a variable called 'total_score' at 0
  # 2. Split the text into a list of words
  # 3. Loop through each word
  # 4. Use lexicon.get(word, 0) to get the score and add it to total_score
  # 5. Print the total_score

  # Your code here
  
```

#### Expected Output

```
-1
```

#### Hints

1. Initialize your score with: total_score = 0
2. Use the += operator to add the word score to your total: total_score += lexicon.get(word, 0)
3. The words "dark" (-1), "stormy" (-1), and "hope" (+1) are the only ones that should change the score.

#### Solution

```python
lexicon = {"dark": -1, "stormy": -1, "bright": 1, "hope": 1}
  text = "it was a dark and stormy night but i had hope"

  total_score = 0
  words = text.split()

  for word in words:
      # Look up word score, defaulting to 0 if not found
      score = lexicon.get(word, 0)
      total_score += score

  print(total_score)
```

