
---
id: digital-literacy-01
title: Understanding Files and Directories
moduleId: digital-literacy-foundations
prerequisites: []
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Understand file system structure and hierarchy
  - Navigate directories using absolute and relative paths
  - Identify common file extensions in DH research
keywords:
  - files
  - directories
  - file types
  - paths
---

# Understanding Files and Directories

## The Digital Archive
Think of your computer's file system like a physical archive or library. Just as a library has wings, stacks, and individual boxes, your computer organizes information into a hierarchical structure of **drives**, **directories** (folders), and **files**.

## Key Concepts

### 1. What is a File?
A file is a discrete container for data. In Digital Humanities, we often distinguish between:
- **Plain Text** (.txt, .csv): Files containing only characters, readable by any computer. These are the "gold standard" for long-term preservation.
- **Structured Data** (.json, .xml): Files that use tags or keys to organize data (common in TEI encoding).
- **Binary Files** (.docx, .pdf, .jpg): Files that require specific software to interpret their internal structure.

### 2. Common DH File Extensions
| Extension | Type | DH Use Case |
| :--- | :--- | :--- |
| **.txt** | Plain Text | Cleaned corpora for text analysis. |
| **.csv** | Comma Separated Values | Datasets for mapping or network analysis. |
| **.xml / .tei** | Extensible Markup Language | Scholarly digital editions. |
| **.json** | JavaScript Object Notation | Data harvested from web APIs or social media. |

### 3. The Directory Tree and Paths
Directories are nested. A directory inside another is a "child," and the containing directory is the "parent." 

:::definition
**File Path**: The specific address of a file. 
- **Absolute Path**: The full address from the "root" (e.g., `C:\Users\Humanist\Project\data.txt` or `/`).
- **Relative Path**: The address relative to where you are currently "standing."
  - `.` (dot) represents the **current folder**.
  - `..` (double dot) represents the **parent folder** (moving up one level).
:::

## Navigating via Code
While we often use a mouse to move files, DH researchers use code to automate the processing of thousands of files at once. If you have 5,000 letters to analyze, you cannot click each one individually; you must tell the computer where the "stack" is located.

```python
import os
# 'os' stands for Operating System. 
# It lets Python talk to your folders.

# Get the Current Working Directory (CWD)
current_location = os.getcwd() 
print(f"You are currently at: {current_location}")

# List everything inside the current folder
files_here = os.listdir('.') 
print(f"Contents: {files_here}")
```

## Working with Files
In Python, we use the `with` statement to handle files. This ensures that the file is "closed" properly after we are done, preventing data loss.

```python
# Creating a file and writing text to it
with open("my_research_notes.txt", "w") as file:
    file.write("This is my first DH data file.")
```

:::challenge
Use the sandbox to create a structured project folder (get the **os** to **make** a **dir**ectory), then write a file to that folder. This mimics setting up a workspace for a new research project.
:::

---challenges---

### Challenge: Create a directory and file

- id: digital-literacy-01-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
import os

# 1. Create a directory called 'dh_project'
# 2. Create a file inside it called 'manifesto.txt'
# 3. Write "Digital Humanities is collaborative!" to the file
# 4. Print the contents to verify

# Your code here
```

#### Expected Output

```
Digital Humanities is collaborative!
```

#### Hints

1. Use os.makedirs("folder_name", exist_ok=True) to create a folder.
2. To write inside a folder, use the path "folder_name/filename.txt".
3. Use the "w" mode in open() to write, and "r" mode to read.

#### Solution

```python
import os
# Create the directory
os.makedirs('dh_project', exist_ok=True)

# Write to the file
path = 'dh_project/manifesto.txt'
with open(path, 'w') as f:
    f.write('Digital Humanities is collaborative!')

# Read and print to verify
with open(path, 'r') as f:
    print(f.read())
```

