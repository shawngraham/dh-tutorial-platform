---
id: python-basics-05
title: Reading and Writing Files
moduleId: python-basics
prerequisites:
  - python-basics-04
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Safely open files using Context Managers (the "with" statement)
  - Identify the difference between Read (r) and Write (w) modes
  - Use newline characters (\n) to format output
  - Output research results to a permanent .txt file
keywords:
  - files
  - open
  - read
  - write
  - with
  - newline
---

# Reading and Writing Files

The power of Digital Humanities comes from moving beyond the screen. We need to be able to pull in a collection of texts (Reading) and save our analysis results (Writing).

---

## 1. The "With" Statement (Context Managers)
In Python, the safest way to handle a file is with the `with` keyword. It creates a temporary "bridge" to the file. Once the code inside the block is finished, Python automatically "closes" the bridge.

```python
# Open for reading ('r')
with open('diary.txt', 'r', encoding='utf-8') as f:
    text = f.read()
    # After this line, the file is automatically closed!
```

---

## 2. Modes: Read vs. Write
When you open a file, you must tell Python what you intend to do with it.

| Mode | Name | Action |
| :--- | :--- | :--- |
| **'r'** | Read | Opens a file for reading. (Throws an error if the file doesn't exist). |
| **'w'** | Write | Creates a new file or **overwrites** an existing one completely! |
| **'a'** | Append | Adds new text to the end of an existing file without deleting it. |

---

## 3. Formatting with Newlines
Computers don't see the "Enter" key like we do. To tell Python to move to a new line in a file, we use the **newline character**: `\n`.

```python
# Writing two lines to a file
with open('output.txt', 'w', encoding='utf-8') as f:
    f.write("First Line of Analysis\nSecond Line of Analysis")
```

---

## 4. Why Encoding Matters (Again!)
As a DH researcher, you will often work with historical texts or data from international archives. Always include `encoding='utf-8'`. If you leave it out, your script might work on your computer but break on a colleague's machine, or it might turn accented characters into "mojibake."

:::warning
**The 'w' Mode Danger**: Be careful! Opening a file with `'w'` wipes it clean immediately. Never use `'w'` on your only copy of a primary source!
:::

:::challenge
In the challenge in the sandbox, you will perform two steps. First, you will "Save" some data to a file. Then, in a second block, you will "Open" it back up to prove it was saved correctly.
:::

---challenges---

### Challenge: Create and Read an Archive File

- id: python-basics-05-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
# 1. Use a 'with' statement to open a file named 'test.txt' in WRITE mode ('w')
# 2. Write three lines to it: "Line 1", "Line 2", and "Line 3" 
#    (Hint: Use \n to separate them)

# 3. Use a second 'with' statement to open 'test.txt' in READ mode ('r')
# 4. Read the contents into a variable and print it

# Your code here
```

#### Expected Output

```
Line 1
Line 2
Line 3
```

#### Hints

1. The string you write should look like "Line 1\nLine 2\nLine 3".
2. Make sure you stop indenting after the first block before starting the second "with" block.
3. Always use encoding="utf-8" as a best practice.

#### Solution

```python
# Step 1 & 2: Writing
with open('test.txt', 'w', encoding='utf-8') as f:
    f.write('Line 1\nLine 2\nLine 3')

# Step 3 & 4: Reading
with open('test.txt', 'r', encoding='utf-8') as f:
    content = f.read()
    print(content)
```

