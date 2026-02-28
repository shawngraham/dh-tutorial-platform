---
id: python-basics-04
title: 'Functions: Building Your DH Toolkit'
moduleId: python-basics
prerequisites:
  - python-basics-03
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Encapsulate logic into reusable Functions
  - Use parameters to pass data into functions
  - Use the return keyword to output data
  - Understand the difference between printing and returning
keywords:
  - functions
  - def
  - return
  - arguments
  - split
---

# Functions: Your Custom Tools

## Don't Repeat Yourself (DRY)
In Digital Humanities, you often perform the same task hundreds of times—cleaning a text, calculating word frequencies, or formatting dates. A **function** is a reusable "recipe" that you write once and call whenever you need it.

---

## 1. Anatomy of a Function
To create a function, we use the `def` keyword (short for define).

```python
def greet_researcher(name):
    # 'name' is a parameter (a placeholder for data)
    message = "Hello, " + name + "! Welcome to the lab."
    return message

# To use it, we "call" the function with an argument
print(greet_researcher("Alex")) 
# Output: Hello, Alex! Welcome to the lab.
```

---

## 2. Inputs and Outputs: Parameters vs. Return
Think of a function like a specialized machine in a library:
- **Parameters (Inputs)**: The raw materials you put into the machine.
- **Return (Output)**: The finished product the machine hands back to you.

:::warning
**Print vs. Return**: 
- `print()` just shows a value on your screen. It’s like looking at a book.
- `return` hands the value back to the program so you can use it later. **If a function doesn't have a `return`, it won't give you any data back to store in a variable!**
:::

---

## 3. A Handy DH Tool: `.split()`
In the challenge in the sandbox, you need to count words. In Python, you can turn a long string of text into a **List of words** using the `.split()` method.

```python
sentence = "Digital Humanities is great"
words = sentence.split() 
print(words) 
# Output: ['Digital', 'Humanities', 'is', 'great']

# Now you can use len() to count them!
print(len(words)) # Output: 4
```

---

## Why Use Functions in Research?
1. **Readability**: Your code looks like a series of logical steps (`clean_text()`, then `count_words()`).
2. **Maintenance**: If you decide to change how you count words, you only have to fix it in one place (the function definition).
3. **Collaboration**: You can write a complex function for "Parsing 18th Century Dates" and share it with other historians.

:::try-it
Functions must be defined *before* they are called. In your code, always put your `def` blocks at the top of the file.
:::

:::challenge
Build a function that you could re-use to estimate the amount of time it might take to read a document.
:::

---challenges---

### Challenge: Write a Reading Time Function

- id: python-basics-04-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
# Write a function 'reading_time' that takes a text string
# and returns the estimated reading time in minutes.

def reading_time(text):
    # 1. Split the text into a list of words
    # 2. Count how many words are in that list using len()
    # 3. Calculate minutes (assume 200 words per minute)
    # 4. Return the result
    pass

# Test your function
sample_text = "word " * 400  # This creates a string of 400 words
result = reading_time(sample_text)
print(result)
```

#### Expected Output

```
2.0
```

#### Hints

1. Use words = text.split() to get a list of words.
2. The number of words is len(words).
3. Your last line inside the function should be something like: return word_count / 200

#### Solution

```python
def reading_time(text):
    words = text.split()
    word_count = len(words)
    minutes = word_count / 200
    return minutes

sample_text = "word " * 400
print(reading_time(sample_text))
```

