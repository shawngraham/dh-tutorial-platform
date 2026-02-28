---
id: generative-04
title: Erasure and Deformance
moduleId: generative-poetics
prerequisites:
  - text-analysis-fundamentals
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Define "Deformance" as a critical DH method
  - Create an "Erasure Poetry" script
  - Programmatically filter text based on conditions
keywords:
  - deformance
  - erasure
  - blackout poetry
  - filtering
---

# Erasure and Deformance

## Analogy
Imagine taking a newspaper and a thick black marker. You cross out almost every word until only a few remain. The remaining words create a new, hidden poem. This is **Blackout Poetry**. In Digital Humanities, we call this "Deformance"—intentionally "breaking" a text to see it in a new light.

## Key Concepts

:::definition
**Deformance**: A portmanteau of "performance" and "deformity." It is the act of programmatically altering a text to interpret it.
:::

One way to "deform" a text is to remove everything except specific types of words. For example, what happens if you remove everything from a novel except the verbs? You are left with a "pure action" version of the story.

In Python, we can do this using a simple loop and an `if` statement.

```python
original = "The heavy rain fell on the quiet roof"
words = original.split()
# Keep only words shorter than 4 letters
erased = [w if len(w) < 4 else "___" for w in words]
print(" ".join(erased))
# Output: "The ___ ___ ___ on the ___ ___"
```

## Practice
:::try-it
Modify the code above to replace words with dots `...` instead of underscores.
:::

## Transfer
Erasure is a powerful tool for political DH. By erasing parts of a legal document or a historical archive, artists highlight the voices that are suppressed or the hidden biases within the text.

:::challenge
Create a "Vowel Erasure" function. Loop through a string and if a character is a vowel (a, e, i, o, u), replace it with an asterisk `*`.
:::

---challenges---

### Challenge: Vowel Blackout

- id: generative-04-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
text = "DIGITAL HUMANITIES"
vowels = "AEIOU"
output = ""

# Loop through each character in 'text'
# If the character is in 'vowels', add "*" to output
# Otherwise, add the character itself to output

# Your code here

print(output)
```

#### Expected Output

```
D*G*T*L H*M*N*T**S
```

#### Hints

1. Use `for char in text:` to look at every letter.
2. Use `if char in vowels:` to check for a vowel.

#### Solution

```python
text = "DIGITAL HUMANITIES"
vowels = "AEIOU"
output = ""

for char in text:
    if char in vowels:
        output += "*"
    else:
        output += char

print(output)
```

