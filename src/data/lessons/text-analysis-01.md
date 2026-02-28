---
id: text-analysis-01
title: Introduction to String Operations
moduleId: text-analysis-fundamentals
prerequisites:
  - python-basics-05
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Perform case normalization to ensure data consistency
  - Clean text using strip() and replace()
  - Tokenize text using basic string splitting
  - Understand method chaining in Python
keywords:
  - string
  - text
  - normalization
  - splitting
  - tokenization
---

# String Operations for Text Analysis

In Digital Humanities, we often engage in **Distant Reading**—using algorithms to look at thousands of texts at once. But before a computer can "read," we must treat text as a simple series of characters and "normalize" it.

---

## 1. Case Normalization
To a computer, "The", "THE", and "the" are three completely different words. If you are counting word frequencies, your results will be inaccurate unless you normalize the case.

```python
original_text = "The Raven"
normalized_text = original_text.lower()
print(normalized_text) # Output: "the raven"
```

---

## 2. Cleaning with Strip and Replace
Raw text—especially text from OCR (Optical Character Recognition) or web scraping—is often "dirty."

### Removing Whitespace (`.strip()`)
The `.strip()` method removes extra spaces or "newline" characters (`\n`) from the very beginning and very end of a string.
```python
messy_input = "  chapter one  \n"
clean_input = messy_input.strip()
print(clean_input) # Output: "chapter one"
```

### Finding and Replacing (`.replace()`)
Use this to remove punctuation or unwanted characters that might interfere with your analysis.
```python
raw_text = "Title: Frankenstein; or, The Modern Prometheus"
# Remove the semicolon
cleaned_text = raw_text.replace(";", "")
```

---

## 3. Basic Tokenization (`.split()`)
**Tokenization** is the process of breaking a long string into individual pieces (usually words). By default, `.split()` cuts a string wherever it finds a space.

```python
sentence = "Deep into that darkness peering"
tokens = sentence.split() 
# Result: ['Deep', 'into', 'that', 'darkness', 'peering']
```

---

## 4. Method Chaining
In Python, you can perform multiple operations in a single line. They are processed from **left to right**. This is a very common pattern in DH scripts:

```python
text = "  The Raven!  "
# 1. Strip spaces, 2. Lowercase, 3. Replace punctuation, 4. Split into words
words = text.strip().lower().replace("!", "").split()
print(words) # Output: ['the', 'raven']
```

:::tip
Think of method chaining like a factory assembly line. Each method takes the output of the previous one and modifies it further.
:::

:::challenge
Text analysis usually begins with a "word count." In the challenge in the sandbox, use what you've learned about splitting strings to create a basic word counter.
:::

---challenges---

### Challenge: Count words in a text

- id: text-analysis-01-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
# Goal: Write a function that returns the number of words in a string.

def count_words(text):
    # 1. Use .split() to turn the string into a list of words
    # 2. Use len() to count how many items are in that list
    # 3. Return that count
    pass

sample = "The quick brown fox"
print(count_words(sample))
```

#### Expected Output

```
4
```

#### Hints

1. The .split() method returns a list.
2. Apply len() to the list you created inside the function.
3. Don't forget to "return" the result!

#### Solution

```python
def count_words(text):
    words = text.split()
    word_count = len(words)
    return word_count

sample = "The quick brown fox"
print(count_words(sample))
```

