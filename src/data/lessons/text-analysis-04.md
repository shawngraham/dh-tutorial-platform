---
id: text-analysis-04
title: Text Cleaning and Normalization
moduleId: text-analysis-fundamentals
prerequisites:
  - text-analysis-02
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Remove punctuation using robust Regex patterns
  - Understand the difference between Tokens (total words) and Types (unique words)
  - Calculate the Type/Token Ratio (lexical diversity)
  - Handle "messy" whitespace and newlines for cleaner data
keywords:
  - cleaning
  - normalization
  - preprocessing
  - punctuation
  - set
---

# Text Cleaning: The Unsung Work of DH

  ## Garbage In, Garbage Out
  Computational analysis is only as good as the data you feed it. If your text contains "End?", "end,", and "end!", a computer treats them as three different words. To perform accurate "Distant Reading," we must strip away the noise.

  ---

  ## 1. The Normalization Pipeline
  In Digital Humanities, "Normalization" is the process of converting text into a standard, consistent format. A typical pipeline includes:

  1.  **Lowercasing**: `text.lower()` ensures "The" and "the" match.
  2.  **Stripping**: `text.strip()` removes leading/trailing whitespace.
  3.  **Punctuation Removal**: Using `re.sub()` to find and delete symbols.

  ### Mastering the Regex "Clean-up"
  The most robust way to remove punctuation while keeping words intact is using a "negated character class" in Regex:

  ```python
  import re
  raw_text = "  History: it's complicated!!!  "

  # r'[^ws]' means: "Find anything that is NOT a word or a space"
  clean_text = re.sub(r'[^ws]', '', raw_text)

  print(clean_text.strip().lower()) 
  # Output: "history its complicated"
  ```

  ---

  ## 2. Types vs. Tokens (Lexical Diversity)
  How "rich" is an author's vocabulary? DH researchers measure this using the **Type/Token Ratio (TTR)**.

  *   **Tokens**: The total number of words in a text.
  *   **Types**: The number of *unique* words in a text.

  ### Finding Uniqueness with `set()`
  In Python, a `set` is a collection that **disallows duplicates**. If you turn a list of words into a set, Python automatically deletes every repeated word, leaving you with the "Types."

  ```python
  words = ["to", "be", "or", "not", "to", "be"]
  unique_words = set(words)

  print(len(words))        # Tokens: 6
  print(len(unique_words)) # Types: 4
  ```

  :::definition
  **Type/Token Ratio (TTR)**: Calculated as `(Types / Tokens)`. A high TTR indicates a diverse vocabulary (like Shakespeare), while a low TTR indicates a more repetitive text (like a children's book).
  :::

  :::challenge
  In the challenge in the sandbox, you will process a famous quote. You must normalize the text (lower case and no punctuation) before using `set()` to find the unique word count.
  :::
  

---challenges---

### Challenge: Clean a text passage

- id: text-analysis-04-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
import re

  text = "  It was the BEST of times, it was the WORST of times...  "

  # 1. Normalize the text: 
  #    - Use .strip() and .lower()
  #    - Use re.sub(r'[^\w\s]', '', text) to remove punctuation
  # 2. Split the cleaned text into a list of words
  # 3. Use set() to get the unique words
  # 4. Print the count (length) of the unique words

  # Your code here
  
```

#### Expected Output

```
7
```

#### Hints

1. First, apply .strip().lower() to the string.
2. Then use re.sub() to remove the comma and the dots.
3. Finally, convert the list of words into a set() and find its len().

#### Solution

```python
import re

  text = "  It was the BEST of times, it was the WORST of times...  "

  # Clean and normalize
  text_cleaned = re.sub(r'[^\w\s]', '', text.strip().lower())

  # Tokenize
  words = text_cleaned.split()

  # Find unique count
  unique_count = len(set(words))

  print(unique_count)
```

