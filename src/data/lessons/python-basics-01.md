---
id: python-basics-01
title: Variables and Data Types
moduleId: python-basics
prerequisites:
  - digital-literacy-foundations
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Declare and update variables
  - Identify the four core primitive types (str, int, float, bool)
  - Perform basic type conversion (casting)
  - Use the type() function to inspect data
keywords:
  - variables
  - types
  - strings
  - integers
  - booleans
---

# Variables and Data Types

## Labeled Storage
In Python, a **variable** is a name that refers to a value stored in the computer's memory. In Digital Humanities, we use variables to store everything from the text of a novel to the coordinates of a historical site.

To create a variable, we use the assignment operator (`=`):

```python
# Variable assignment
project_name = "Mapping the Republic of Letters"
```

---

## The Four Core Types
To process humanities data correctly, Python needs to know what *kind* of data it is dealing with.

1. **String (`str`)**: Text data, always wrapped in quotes.
   - Example: `author = "Toni Morrison"`
2. **Integer (`int`)**: Whole numbers (no decimals).
   - Example: `publication_year = 1987`
3. **Float (`float`)**: Decimal numbers. Useful for statistics or coordinates.
   - Example: `average_sentence_length = 15.4`
4. **Boolean (`bool`)**: Logical values. Either `True` or `False` (note the capital letters).
   - Example: `is_digitized = True`

---

## Inspecting and Updating
### Finding the Type
If you are unsure what a variable is, you can ask Python using the `type()` function:

```python
year = 1818
print(type(year)) # Output: <class 'int'>
```

### Updating Values
Variables are called "variables" because their values can vary. You can overwrite a variable by assigning it a new value.

```python
current_page = 10
current_page = 11 # The value 10 is now replaced with 11
```

---

## Type Conversion (Casting)
Sometimes you need to treat a number like a string (for example, to print it as part of a sentence).

- `str(1818)` -> converts to `"1818"`
- `int("50")` -> converts to `50`
- `float(5)`   -> converts to `5.0`

:::definition
**Naming Rules**: Variable names should be descriptive and use **snake_case** (lowercase letters with underscores). 
- ✅ `word_count = 500`
- ❌ `WordCount = 500` (Not standard Python style)
- ❌ `2_word_count = 500` (Cannot start with a number)
:::

:::tip
In the challenge in the sandbox, remember that when you use `print(type(variable_name))`, Python will output the "class" of that variable (e.g., `<class 'str'>`).
:::

:::challenge
Create some variables and assign some values to those variables; what kind of variables are you creating?
:::

---challenges---

### Challenge: Create and Inspect Variables

- id: python-basics-01-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
# 1. Create a variable 'book_title' with the value "Frankenstein"
# 2. Create a variable 'pub_year' with the value 1818
# 3. Use the print() function to display 'book_title'
# 4. Use the print() function to display 'pub_year'
# 5. Use print(type(...)) to show the data type of both variables

# Your code here
```

#### Expected Output

```
Frankenstein
1818
<class 'str'>
<class 'int'>
```

#### Hints

1. To print a type, use: print(type(your_variable_name))
2. Make sure "Frankenstein" is in quotes because it is a string.
3. The variable pub_year should be a number (1818) without quotes.

#### Solution

```python
book_title = "Frankenstein"
pub_year = 1818
print(book_title)
print(pub_year)
print(type(book_title))
print(type(pub_year))
```

