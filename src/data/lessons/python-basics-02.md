---
id: python-basics-02
title: Lists and Dictionaries
moduleId: python-basics
prerequisites:
  - python-basics-01
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Store collections of data in Lists
  - Use Dictionaries for structured "record-like" data
  - Access items using indices and keys
  - Calculate the size of a collection using len()
keywords:
  - lists
  - dictionaries
  - collections
  - indexing
---

# Collections of Data

In Digital Humanities, we rarely work with a single piece of data. We work with **corpora** (collections of texts) and **metadata** (structured information about those texts). To handle these, Python uses **Lists** and **Dictionaries**.

---

## 1. Lists (Ordered Sequences)
A list is an ordered collection of items. In DH, you might use a list to store a series of stop-words or the titles of all poems in a collection.

- **Syntax**: Uses square brackets `[]`.
- **Ordering**: Items stay in the order you put them in.
- **Indexing**: Python starts counting at **0**.

```python
# A list of authors
authors = ["Austen", "Shelley", "Brontë"]

print(authors[0]) # Output: Austen
print(authors[1]) # Output: Shelley
```

:::tip
To find out how many items are in a list, use the `len()` function (short for length):
```python
print(len(authors)) # Output: 3
```
:::

---

## 2. Dictionaries (Key-Value Pairs)
A dictionary is an unordered collection of "labels" (keys) and "data" (values). This is the perfect format for **metadata**.

- **Syntax**: Uses curly braces `{}`.
- **Structure**: `"Key": Value`
- **Access**: You don't use a number to get data; you use the **Key**.

```python
book_data = {
    "title": "Frankenstein", 
    "author": "Shelley", 
    "year": 1818
}

# Looking up the value associated with the "author" key
print(book_data["author"]) # Output: Shelley
```

---

## Which one should I use?
- Use a **List** if you have a simple sequence of items where the order matters (like chapters in a book).
- Use a **Dictionary** if you need to label your data (like a library catalog record).

:::definition
**Mutable**: Both lists and dictionaries are "mutable," meaning you can change them after they are created. You can add a new author to your list or update the publication year in your dictionary.
:::

:::try-it
Try creating a list of four years. Use `print(years[0])` to see the first year and `print(years[3])` to see the last one. What happens if you try to print `years[4]`?
:::

:::challenge
Understand the difference between lists and dictionaries, and that you use different methods to access the data they contain.
:::

---challenges---

### Challenge: Work with collections

- id: python-basics-02-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
# 1. Create a list called 'books' containing 3 book titles (strings)
# 2. Create a dictionary called 'meta' with these keys: "title", "author", "year"
#    (Use "Frankenstein", "Shelley", and 1818 as the values)
# 3. Print the length of the 'books' list using len()
# 4. Print the author's name from the 'meta' dictionary

# Your code here
```

#### Expected Output

```
3
Shelley
```

#### Hints

1. For the list, use square brackets: books = ["A", "B", "C"]
2. For the length, use print(len(books))
3. To get the author from the dictionary, use meta["author"]

#### Solution

```python
books = ["Frankenstein", "Dracula", "Jane Eyre"]
meta = {
    "title": "Frankenstein", 
    "author": "Shelley", 
    "year": 1818
}
print(len(books))
print(meta["author"])
```

