---
id: text-analysis-02
title: Regular Expressions for Text Matching
moduleId: text-analysis-fundamentals
prerequisites:
  - text-analysis-01
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Build complex search patterns with Regex
  - Use character classes to identify types of data (digits, words, whitespace)
  - Use quantifiers to specify the length of a pattern
  - Extract patterns like dates or metadata from archival text
keywords:
  - regex
  - pattern matching
  - re
  - wildcards
---

# Regular Expressions (Regex)

## Find on Steroids
Imagine you are looking at a 500-page OCR transcript of a 19th-century ledger. You need to find every year mentioned. Searching for "1800", then "1801", then "1802" would take days. 

**Regular Expressions (Regex)** allow you to search for the *structure* of the data rather than the literal characters. Instead of searching for "1818", you search for "any four digits in a row."

---

## 1. The `re` Module
Python uses the `re` library for regex. To use it, you must `import re` at the top of your script. The most common function for text analysis is `re.findall()`, which returns a list of every match found in your text.

## 2. The Regex Cheat Sheet

| Symbol | Meaning | Example |
| :--- | :--- | :--- |
| **`\d`** | Any Digit (0-9) | `\d\d` matches "18" |
| **`\w`** | Any "Word" character (letters, numbers) | `\w\w\w` matches "cat" |
| **`\s`** | Any Whitespace (spaces, tabs, newlines) | `\d\s\d` matches "1 2" |
| **`.`** | The Wildcard (matches almost anything) | `t.t` matches "tat", "tet", "t!t" |

## 3. Quantifiers (How many?)
Instead of typing `\d\d\d\d` to find a year, we use curly brackets to say "how many" of the preceding symbol we want.

- **`{n}`**: Exactly *n* times. (e.g., `\d{4}` finds exactly 4 digits).
- **`+`**: One or more times. (e.g., `\d+` finds "1", "12", or "12345").
- **`*`**: Zero or more times.

```python
import re
text = "The price is $50 and the date is 1818."

# Find all groups of 1 or more digits
numbers = re.findall(r'\d+', text) 
print(numbers) # Output: ['50', '1818']

# Find exactly 4 digits
years = re.findall(r'\d{4}', text)
print(years) # Output: ['1818']
```

---

## 4. The "r" Prefix (Raw Strings)
When writing regex in Python, always put an `r` before your quotes: `r'\d+'`. This tells Python: "Treat the backslashes literally; don't try to interpret them as special Python commands."

## DH Use Case: Cleaning OCR
Historical documents often have "scannos" (OCR errors). Regex can find them!
- **Pattern**: `r'l8\d{2}'`
- **Matches**: "l818" or "l831" (where the scanner mistook the "1" for an "l").
- **Action**: You can then use `re.sub()` to replace all those "l"s with "1"s across thousands of files.

:::challenge
Regex is a language of its own. In the challenge in the sandbox, combine the digit symbol (`\d`) with the quantifier for "exactly four" (`{4}`) to extract dates from a string.
:::

---challenges---

### Challenge: Extract Years from Text

- id: text-analysis-02-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
import re

text = "Published in 1818, revised in 1831, reprinted in 1869."

# Goal: Use re.findall to find all 4-digit years.
# 1. Create a pattern using \d and the {4} quantifier.
# 2. Use re.findall(pattern, text)
# 3. Assign the result to a variable 'years' and print it.

# Your code here
```

#### Expected Output

```
['1818', '1831', '1869']
```

#### Hints

1. The pattern should be a raw string: r'...'
2. The digit symbol is \\d and the quantifier is {4}.
3. Syntax: years = re.findall(r'\\d{4}', text)

#### Solution

```python
import re

text = "Published in 1818, revised in 1831, reprinted in 1869."

# Pattern for exactly four digits
pattern = r'\d{4}'

# Find all matches
years = re.findall(pattern, text)

# Print result
print(years)
```

