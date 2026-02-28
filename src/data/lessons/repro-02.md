---
id: repro-02
title: 'Naming Things: Conventions that Save Your Future Self'
moduleId: reproducibility
prerequisites:
  - repro-01
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Describe why consistent file naming conventions matter for reproducibility
  - Use Python string methods and regular expressions to validate file names
  - Explain semantic versioning and apply version numbering to project files
keywords:
  - file naming
  - naming conventions
  - versioning
  - semantic versioning
  - regular expressions
  - validation
---

# Naming Things: Conventions that Save Your Future Self

## Analogy

Librarians and archivists have spent centuries developing cataloguing systems. The Dewey Decimal System, Library of Congress classification, and archival arrangement standards all exist because **naming things consistently** is the foundation of findability. Imagine a library where every librarian shelved books by their own personal system -- one alphabetical by title, another by color, a third by date acquired. Finding anything would be impossible.

Digital projects face the same challenge. A folder full of files named `final_draft.txt`, `FINAL_final.txt`, `thesis v3 (2).docx`, and `new_version_FIXED.txt` is the digital equivalent of that chaotic library. Naming conventions are your cataloguing system for computational work.

## Key Concepts

### The Cost of Bad Names

When file names are inconsistent, three things break down:

1. **Sorting fails** -- `v2` sorts after `v19` alphabetically, not numerically
2. **Scripts break** -- spaces, uppercase, and special characters cause errors in automated pipelines
3. **Humans get confused** -- which "final" is actually final?

:::definition
**Naming Convention**: A set of rules that dictate how files, variables, and other identifiers are named within a project. Good conventions are documented, consistent, and machine-friendly.
:::

### A Simple Convention for DH Projects

A practical convention for research files:

- **All lowercase** -- avoids case-sensitivity issues across operating systems
- **No spaces** -- use underscores instead
- **No special characters** -- no parentheses, brackets, or ampersands
- **Version suffix** -- end with `_vNN` before the extension (e.g., `_v01`, `_v02`)

Example: `interview_notes_v01.txt`, `corpus_cleaned_v03.csv`

### Validating Names with String Methods

Python's built-in string methods can check many naming rules without any imports:

```python
filename = "interview_notes_v01.txt"

# Check for lowercase
is_lower = filename == filename.lower()
print(f"All lowercase: {is_lower}")   # True

# Check for spaces
has_spaces = ' ' in filename
print(f"Has spaces: {has_spaces}")     # False

# Check for version suffix (simple approach)
name_part = filename.rsplit('.', 1)[0]  # 'interview_notes_v01'
has_version = name_part[-4:-2] == '_v' and name_part[-2:].isdigit()
print(f"Has version: {has_version}")   # True
```

### Validating Names with Regular Expressions

For more precise validation, the `re` module lets you define a **pattern** that correct names must match:

```python
import re

# Pattern: lowercase letters/digits/underscores, then _vNN, then .ext
pattern = r'^[a-z][a-z0-9_]*_v\d{2}\.[a-z]+$'

good_name = "corpus_cleaned_v02.csv"
bad_name = "My Thesis Draft.docx"

print(re.match(pattern, good_name))  # <re.Match object ...>
print(re.match(pattern, bad_name))   # None
```

:::definition
**Regular Expression (regex)**: A pattern language for matching text. In file naming validation, regex lets you express rules like "starts with a lowercase letter, ends with _vNN.ext" as a single testable pattern.
:::

### Semantic Versioning

In software, **semantic versioning** uses three numbers: `MAJOR.MINOR.PATCH` (e.g., `3.2.1`). For DH file management, a simpler two-digit version number works well:

```python
# Simple version tracking for a research file
versions = {
    'v01': 'Initial transcription from scanned pages',
    'v02': 'Corrected OCR errors in chapters 1-5',
    'v03': 'Normalized spelling variants to modern forms',
}

for version, description in versions.items():
    print(f"corpus_{version}.txt -- {description}")
```

Output:
```
corpus_v01.txt -- Initial transcription from scanned pages
corpus_v02.txt -- Corrected OCR errors in chapters 1-5
corpus_v03.txt -- Normalized spelling variants to modern forms
```

:::definition
**Semantic Versioning**: A versioning scheme where each number communicates the nature of the change. For research files, even a simple sequential version number (v01, v02, v03) with a changelog provides essential traceability.
:::

### Building a Validator Function

Here is a reusable function that checks a filename and returns specific reasons for failure:

```python
import re

def validate_filename(name):
    reasons = []
    if name != name.lower():
        reasons.append("contains uppercase")
    if ' ' in name:
        reasons.append("contains spaces")
    if '(' in name or ')' in name:
        reasons.append("contains special characters")
    if not re.search(r'_v\d{2}\.', name):
        reasons.append("missing version number (_vNN)")
    return reasons

# Test it
test_files = ["corpus_v01.txt", "My Notes.docx"]
for f in test_files:
    issues = validate_filename(f)
    if not issues:
        print(f"  PASS: {f}")
    else:
        joined = '; '.join(issues)
        print(f"  FAIL: {f} -- {joined}")
```

Output:
```
  PASS: corpus_v01.txt
  FAIL: My Notes.docx -- contains uppercase; contains spaces; missing version number (_vNN)
```

## Practice

:::try-it
Write a regex pattern that matches filenames following this convention: starts with a lowercase letter, contains only lowercase letters, digits, and underscores, includes a version suffix like `_v01`, and ends with a file extension. Test it against `"metadata_v05.json"` and `"Data Set.xlsx"`.
:::

## Transfer

In collaborative DH projects -- such as those involving TEI-encoded texts, GIS layers, or oral history transcripts -- inconsistent naming can derail an entire team. When ten researchers each name their transcription files differently, merging them into a single corpus becomes a manual nightmare.

Many digital archives and repositories (HathiTrust, the Internet Archive, institutional repositories) enforce strict naming conventions for exactly this reason. Learning to validate names programmatically means you can check hundreds of files in seconds rather than reviewing them by hand.

:::challenge
You have received a batch of files from collaborators on a digitization project. Check each filename against your project's convention (all lowercase, no spaces, no special characters, version suffix `_vNN` before the extension) and print whether each passes or fails, with specific reasons for failures.
:::

---challenges---

### Challenge: Validate the File Batch

- id: repro-02-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
import re

filenames = [
    'My Thesis Draft.docx',
    'interview_notes_v01.txt',
    'Final FINAL v3.pdf',
    'corpus_cleaned_v02.csv',
    'MAP scan(1).tiff',
    'metadata_archive_v10.json',
]

print('=== File Name Validation ===')
for name in filenames:
    reasons = []
    # TODO: Check if name contains uppercase letters
    # TODO: Check if name contains spaces
    # TODO: Check if name contains special characters like ( or )
    # TODO: Check if name is missing a version number in _vNN format

    if not reasons:
        print(f'  PASS: {name}')
    else:
        joined = '; '.join(reasons)
        print(f'  FAIL: {name} -- {joined}')
```

#### Expected Output

```
=== File Name Validation ===
  FAIL: My Thesis Draft.docx -- contains uppercase; contains spaces; missing version number (_vNN)
  PASS: interview_notes_v01.txt
  FAIL: Final FINAL v3.pdf -- contains uppercase; contains spaces; missing version number (_vNN)
  PASS: corpus_cleaned_v02.csv
  FAIL: MAP scan(1).tiff -- contains uppercase; contains spaces; contains special characters; missing version number (_vNN)
  PASS: metadata_archive_v10.json
```

#### Hints

1. Use `name != name.lower()` to detect uppercase letters.
2. Use `' ' in name` to detect spaces.
3. Use `'(' in name or ')' in name` to detect parentheses as special characters.
4. Use `re.search(r'_v\d{2}\.', name)` to check for a `_vNN.` version pattern. If it returns `None`, the version number is missing.

#### Solution

```python
import re

filenames = [
    'My Thesis Draft.docx',
    'interview_notes_v01.txt',
    'Final FINAL v3.pdf',
    'corpus_cleaned_v02.csv',
    'MAP scan(1).tiff',
    'metadata_archive_v10.json',
]

print('=== File Name Validation ===')
for name in filenames:
    reasons = []
    if name != name.lower():
        reasons.append('contains uppercase')
    if ' ' in name:
        reasons.append('contains spaces')
    if '(' in name or ')' in name:
        reasons.append('contains special characters')
    if not re.search(r'_v\d{2}\.', name):
        reasons.append('missing version number (_vNN)')

    if not reasons:
        print(f'  PASS: {name}')
    else:
        joined = '; '.join(reasons)
        print(f'  FAIL: {name} -- {joined}')
```

