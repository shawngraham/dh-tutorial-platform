---
id: digital-literacy-03
title: Character Encoding and Plain Text
moduleId: digital-literacy-foundations
prerequisites:
  - digital-literacy-02
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Explain how computers represent characters as numbers
  - Identify UTF-8 as the universal standard for DH
  - Troubleshoot "Mojibake" (broken characters) in historical datasets
  - Correctly specify encoding when opening files in Python
keywords:
  - encoding
  - utf-8
  - ascii
  - unicode
  - mojibake
---

# Character Encoding

## Why Do Characters Break?
Have you ever seen text like `cafÃ©` instead of `café` or `ï»¿` at the start of a document? This is called **Mojibake** (Japanese for "character transformation"). It happens because the computer is using the wrong "map" to translate binary numbers (0s and 1s) into human characters.

:::definition
**Character Encoding**: A lookup table (a "map") that assigns a unique number to every character.
:::

## The Map Gallery

### 1. ASCII (The Old Map)
The original American standard. It only had 128 characters—enough for English letters and basic punctuation, but useless for accented letters, emojis, or non-Latin scripts (like Cyrillic, Arabic, or Kanji).

### 2. Unicode / UTF-8 (The Global Map)
Unicode is a standard that aims to give every character in every language a unique number. **UTF-8** is the most common way to implement Unicode.
- It covers over 140,000 characters.
- It is the "One Map to Rule Them All."
- **DH Rule of Thumb**: Always save and open your research data as **UTF-8**.

---

## Strings vs. Bytes
In Python, we deal with two ways of looking at text:
1. **Strings** (`str`): Human-readable text (e.g., `"History"`).
2. **Bytes** (`bytes`): The machine's version, prefixed with a `b` (e.g., `b'History'`).

```python
word = "café"
# Encoding: String -> Bytes
encoded_word = word.encode("utf-8") 
print(encoded_word) # Output: b'caf\xc3\xa9'

# Decoding: Bytes -> String
decoded_word = encoded_word.decode("utf-8")
print(decoded_word) # Output: café
```

---

## The DH Workflow: Opening Files
The most common place you will encounter encoding is when opening a file. If your archive was digitized in the 1990s, it might be in an old format like `latin-1`. If you don't tell Python to use `utf-8`, it might guess wrong.

**The Golden Rule for DH Scripting:**
Always include `encoding="utf-8"` when opening files:

```python
# Correct way to open a file in DH
with open("manuscript.txt", "r", encoding="utf-8") as f:
    text = f.read()
```

:::tip
If you ever see `Ã©`, your computer is reading **UTF-8** data as if it were **Latin-1**. To fix it, you need to ensure the "map" you use to read matches the "map" used to save.
:::

:::challenge
Encode and then decode a string of text to see how accents and emojis are rendered  - or not! You could go further by passing the text through other encoding standards to see how things differ.
:::

---challenges---

### Challenge: Explore Text Encoding

- id: digital-literacy-03-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
# A piece of text with an accent and an emoji
text = "Renée 📜"

# 1. Encode 'text' into UTF-8 bytes and print it
# 2. Decode those bytes back into a string and print it
# 3. Observe how the emoji and accent are handled in the bytes version

# Your code here
```

#### Expected Output

```
b'Ren\xc3\xa9e \xf0\x9f\x93\x9c'
Renée 📜
```

#### Hints

1. Use the .encode("utf-8") method on your string first.
2. Store that in a variable, then use the .decode("utf-8") method on it.
3. Notice how the emoji takes up more bytes than a standard letter!

#### Solution

```python
text = "Renée 📜"

# Encode to bytes
encoded = text.encode("utf-8")
print(encoded)

# Decode back to string
decoded = encoded.decode("utf-8")
print(decoded)
```

