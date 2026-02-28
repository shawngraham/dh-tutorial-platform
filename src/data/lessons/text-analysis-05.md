---
id: text-analysis-05
title: Basic NLP with NLTK
moduleId: text-analysis-fundamentals
prerequisites:
  - text-analysis-04
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Understand the difference between simple string splitting and linguistic tokenization
  - Use NLTK to perform Part-of-Speech (POS) tagging
  - Filter texts for specific grammatical categories (e.g., all proper nouns)
  - Handle the (word, tag) tuple structure in Python
keywords:
  - nltk
  - tokenization
  - pos-tagging
  - nlp
  - linguistics
---

# Natural Language Processing (NLP)

  ## Moving Beyond Strings
  Up to this point, we have treated text as a simple sequence of characters. **Natural Language Processing (NLP)** allows us to treat text as a linguistic structure. 

  While `.split()` and `.lower()` are useful, they don't "understand" the rules of language. To a computer using `.split()`, the string "don't" is one word. To an NLP tool, it is two linguistic units: "do" and "n't" (the negation).

  ---

  ## 1. Smarter Tokenization
  The NLTK (`Natural Language Toolkit`) tokenizer is designed for research. It knows that a period at the end of a sentence is a separate piece of punctuation and should not be attached to the last word.

  ```python

import nltk
from nltk.tokenize import word_tokenize

# We must download the 'instructions' for tokenization first
nltk.download('punkt_tab', quiet=True)

text = "Mary Shelley wrote Frankenstein."
tokens = word_tokenize(text)
print(tokens) 
# Result: ['Mary', 'Shelley', 'wrote', 'Frankenstein', '.']
  ```

  ---

  ## 2. Part-of-Speech (POS) Tagging
  POS tagging identifies the grammatical role of every word. In DH, this is often used to extract all the people/places (Proper Nouns) or to analyze the "tone" of a text (e.g., counting adjectives vs. adverbs).

  | Tag | Meaning | DH Use Case |
  | :--- | :--- | :--- |
  | **NNP** | Proper Noun, Singular | Extracting names of characters or cities. |
  | **JJ** | Adjective | Analyzing descriptive language in a novel. |
  | **VBD** | Verb, Past Tense | Identifying actions in a historical narrative. |

  ---

  ## 3. Handling the Output: Tuples
  When you run `nltk.pos_tag()`, it returns a **List of Tuples**. A tuple is like a list, but it uses parentheses `()`.

  ```python
  tagged = [('Mary', 'NNP'), ('wrote', 'VBD')]
  ```

  To filter this data, you can "unpack" the tuple in a loop:

  ```python
  for word, tag in tagged:
      if tag == "NNP":
          print(f"Found a proper noun: {word}")
  ```

  :::tip
  **Why use POS tagging?** 
  If you want to map a novel, you can't just search for every word that starts with a capital letter (that would include the start of every sentence). By filtering for **NNP**, you get a much cleaner list of actual names and places.
  :::

  :::challenge
  In the first challenge, you will practice smarter tokenization. In the second, you will use a loop to extract only the proper nouns from a sentence about Jane Austen.
  :::
  

---challenges---

### Challenge: Tokenize a Sentence

- id: text-analysis-05-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python

import nltk
nltk.download('punkt_tab', quiet=True)
from nltk.tokenize import word_tokenize

text = "Mary Shelley wrote Frankenstein in 1818."

  # Goal: Use word_tokenize(text) and print the list of tokens

  # Your code here
  
```

#### Expected Output

```
['Mary', 'Shelley', 'wrote', 'Frankenstein', 'in', '1818', '.']
```

#### Hints

1. Assign the result of word_tokenize(text) to a variable.
2. Print that variable to see how NLTK handles the period at the end.

#### Solution

```python

import nltk
nltk.download('punkt_tab', quiet=True)
from nltk.tokenize import word_tokenize

text = "Mary Shelley wrote Frankenstein in 1818."
tokens = word_tokenize(text)
print(tokens)
```

### Challenge: Extract Proper Nouns

- id: text-analysis-05-c2
- language: python
- difficulty: intermediate

#### Starter Code

```python
import nltk
  # Downloading the necessary tools
  nltk.download('punkt_tab', quiet=True)
  nltk.download('averaged_perceptron_tagger_eng', quiet=True)
  from nltk.tokenize import word_tokenize

  text = "Jane Austen published Pride and Prejudice in 1813."
  tokens = word_tokenize(text)

  # 1. Use nltk.pos_tag(tokens) to get a list of (word, tag) tuples
  # 2. Create an empty list called 'proper_nouns'
  # 3. Loop through the tagged items and check if the tag is 'NNP'
  # 4. If it is, append the word to your 'proper_nouns' list
  # 5. Print the list

  # Your code here
  
```

#### Expected Output

```
['Jane', 'Austen', 'Pride', 'Prejudice']
```

#### Hints

1. Use: tagged_text = nltk.pos_tag(tokens)
2. Your loop should look like: for word, tag in tagged_text:
3. Remember that NNP must be in quotes: if tag == "NNP":

#### Solution

```python
import nltk
  nltk.download('punkt_tab', quiet=True)
  nltk.download('averaged_perceptron_tagger_eng', quiet=True)
  from nltk.tokenize import word_tokenize

  text = "Jane Austen published Pride and Prejudice in 1813."
  tokens = word_tokenize(text)

  # Get the tags
  tagged = nltk.pos_tag(tokens)

  # Filter for NNP (Proper Nouns)
  proper_nouns = []
  for word, tag in tagged:
      if tag == 'NNP':
          proper_nouns.append(word)

  print(proper_nouns)
```

