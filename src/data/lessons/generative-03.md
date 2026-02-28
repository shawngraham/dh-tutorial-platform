---
id: generative-03
title: 'Recursive Structures: Context-Free Grammars'
moduleId: generative-poetics
prerequisites:
  - python-basics
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - 'Understand the "Symbol: Replacement" logic of grammars'
  - Use recursion or iteration to expand a grammar
  - Create a "Mad Libs" style generator
keywords:
  - grammars
  - tracery
  - recursion
  - symbols
---

# Recursive Structures: Context-Free Grammars

## Analogy
Think of a formal grammar like a **Russian Nesting Doll** or a **Tree**. You start with a big idea ("Sentence"), and you open it up to find smaller parts ("Noun" and "Verb"). You open the "Noun" doll and find "The Octopus." You keep replacing symbols with actual words until there are no more dolls to open.

## Key Concepts

:::definition
**Grammar**: A set of rules where a "Symbol" (like `#color#`) is replaced by a random selection from a list of options (like `["red", "blue"]`).
:::

This is the logic behind **Tracery**, [[link]](https://tracery.io/) a popular tool for making mad-libs style bots and procedurally generated stories (not to be confused with LLM text generation). We use a dictionary to hold our rules.

```python
rules = {
    "animal": ["cat", "walrus", "owl"],
    "action": ["sleeps", "dances", "computes"]
}

import random
# A template using placeholders
template = "The #animal# #action#."

# Replacing one placeholder
animal_choice = random.choice(rules["animal"])
output = template.replace("#animal#", animal_choice)
print(output)
```

## Practice
:::try-it
Create a rule called `"mood"` with three adjectives. Add `#mood#` to the template string and use `.replace()` to insert it.
:::

## Transfer
Grammars allow for **infinite** variety with very little data. By nesting rules (e.g., a `#noun#` could be a `#descriptor# #object#`), you can create complex, poetic sentences that never repeat.

:::challenge
Complete the "story" by replacing the symbols `#hero#` and `#weapon#` with random choices from the grammar dictionary.
:::

---challenges---

### Challenge: The Story Expander

- id: generative-03-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
import random

grammar = {
    "hero": ["Knight", "Coder", "Librarian"],
    "weapon": ["Sword", "Python Script", "Index Card"]
}

story = "The #hero# fought with a #weapon#."

# 1. Pick a random hero from grammar["hero"]
# 2. Pick a random weapon from grammar["weapon"]
# 3. Use .replace() to update the 'story' string
# 4. Print the result

# Your code here
```

#### Expected Output

```
The [Random Hero] fought with a [Random Weapon].
```

#### Hints

1. `random.choice(list)` is the best way to get one item.
2. You need to call `.replace("#hero#", choice)` and then call `.replace()` again on the *result* of the first one.

#### Solution

```python
import random

grammar = {
    "hero": ["Knight", "Coder", "Librarian"],
    "weapon": ["Sword", "Python Script", "Index Card"]
}

story = "The #hero# fought with a #weapon#."

h = random.choice(grammar["hero"])
w = random.choice(grammar["weapon"])

story = story.replace("#hero#", h).replace("#weapon#", w)
print(story)
```

