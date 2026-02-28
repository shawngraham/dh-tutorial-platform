---
id: python-basics-03
title: Control Flow
moduleId: python-basics
prerequisites:
  - python-basics-02
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Write conditional logic (if/else) using comparison operators
  - Automate repetitive tasks with for-loops
  - Understand indentation as a requirement for Python logic
  - Combine loops and conditionals to filter data
keywords:
  - if
  - else
  - for
  - loops
  - indentation
  - logic
---

# Control Flow: Logic and Loops

Programming is the art of telling the computer: *"If this condition is met, do that. Otherwise, do this. And keep doing it until you reach the end of the list."* This is known as **Control Flow**.

---

## 1. Conditionals (`if`, `elif`, `else`)
Conditionals allow your script to make decisions. In DH, you might use this to categorize texts by century or to find specific keywords.

To make decisions, we use **Comparison Operators**:
- `==` (Equal to)
- `!=` (Not equal to)
- `>` (Greater than)
- `<` (Less than)

```python
year = 1850

if year < 1800:
    print("This is an early modern text.")
elif year < 1900:
    print("This is a 19th-century text.")
else:
    print("This is a modern text.")
```

---

## 2. For Loops
A `for` loop tells Python to take a collection (like a list) and perform the same action for **every item** in that collection.

```python
corpus = ["Moby Dick", "Oliver Twist", "Beloved"]

# 'book' is a temporary name we give to the current item
for book in corpus:
    print("Analyzing " + book)
```

---

## 3. The Golden Rule: Indentation
In many languages, curly brackets `{}` are used to group code. In Python, we use **indentation** (usually 4 spaces or one Tab). 

Anything indented under an `if` or a `for` statement is considered "inside" the block. When you stop indenting, the block ends.
 
```python
for book in corpus:
    print(book) # This is INSIDE the loop and runs 3 times.
print("Done!")  # This is OUTSIDE and runs only once at the end.
```

---

## 4. Combining the Two (Filtering)
A very common DH task is to loop through a list and only print items that meet a certain requirement. This is called **filtering**.

```python
# Example: Find years in the 20th Century
years = [1750, 1920, 1810, 1950]

for y in years:
    if y >= 1900:
        print(y) # This only runs if the 'if' condition is True
```

:::try-it
Look at the challenge in the sandbox. You will need to "nest" an `if` statement inside a `for` loop. Make sure your `if` is indented once, and your `print` is indented twice!
:::

:::challenge
Build a list, iterate through it and stop when the condition is met.
:::

---challenges---

### Challenge: Loop and Filter Word Counts

- id: python-basics-03-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
# A list of word counts from different chapters
word_counts = [500, 1200, 800, 3000, 150, 2500]

# Goal: Loop through the list and print ONLY the counts greater than 1000

# Your code here
```

#### Expected Output

```
1200
3000
2500
```

#### Hints

1. Start with: for count in word_counts:
2. Inside the loop, add an if statement: if count > 1000:
3. Remember to indent the print() function so it is inside the if statement.

#### Solution

```python
word_counts = [500, 1200, 800, 3000, 150, 2500]

for count in word_counts:
    if count > 1000:
        print(count)
```

