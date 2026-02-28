---
id: repro-01
title: 'The Lab Notebook: Why Documentation Matters'
moduleId: reproducibility
prerequisites:
  - python-basics
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Explain why computational reproducibility matters in digital humanities research
  - Build a processing log as a list of dictionaries to record workflow steps
  - Format and display a structured log for human readability
keywords:
  - reproducibility
  - processing log
  - documentation
  - workflow
  - provenance
---

# The Lab Notebook: Why Documentation Matters

## Analogy

In the sciences, the lab notebook is sacred. Every experiment gets a dated entry recording what was done, what materials were used, and what happened. Historians have their own parallel: the archival finding aid, which documents exactly where a source came from, how it was catalogued, and what condition it was in when examined. Without these records, no one can retrace the researcher's steps.

Computational work in the digital humanities needs the same discipline. When you clean a corpus of 18th-century letters, run topic models, or normalize spelling variants, each step transforms your data. A **processing log** is your digital lab notebook: a structured record that lets you -- or anyone else -- reproduce your work months or years later.

## Key Concepts

### The Reproducibility Problem

Imagine a colleague publishes a study analyzing word frequency in Victorian novels. You want to verify their findings, but the paper says only "the texts were cleaned and tokenized." Which texts? What cleaning rules? Were headers removed? Was punctuation stripped before or after tokenization? Without a detailed record, the work is a black box.

:::definition
**Computational Reproducibility**: The ability to obtain the same results from the same data by following the same documented procedures. In DH, this means recording every transformation applied to your sources.
:::

### Building a Processing Log in Python

You could just write things down in a text document or even a physical notepad. A more elegant way might be to document your code so that it adds to a processing log as you go. A processing log is a **list of dictionaries**, where each dictionary records one step in your workflow. Every entry should capture four things: what was done, what went in, what came out, and when.

:::tip 
Check out [[Kiara]](https://docs.dharpa.org/) from the _Digital History Advanced Research Projects Accelerator (DHARPA)_.
:::

```python
# Create a processing log for a digitization project
processing_log = []

# Record the first step
processing_log.append({
    'step': 'transcription',
    'input_desc': '50 handwritten diary pages',
    'output_desc': '50 plain text files',
    'date': '2024-03-01'
})

# Record the second step
processing_log.append({
    'step': 'normalization',
    'input_desc': '50 plain text files',
    'output_desc': '50 normalized text files',
    'date': '2024-03-10'
})

# Display the log
for i, entry in enumerate(processing_log, 1):
    print(f"Step {i}: {entry['step']}")
    print(f"  Input:  {entry['input_desc']}")
    print(f"  Output: {entry['output_desc']}")
    print(f"  Date:   {entry['date']}")
```

Output:
```
Step 1: transcription
  Input:  50 handwritten diary pages
  Output: 50 plain text files
  Date:   2024-03-01
Step 2: normalization
  Input:  50 plain text files
  Output: 50 normalized text files
  Date:   2024-03-10
```

### Why Dictionaries?

Each log entry is a dictionary because dictionaries give every piece of information a **named key**. Compare these two approaches:

```python
# Hard to read -- what does each position mean?
step_tuple = ('transcription', '50 pages', '50 files', '2024-03-01')

# Self-documenting -- keys explain themselves
step_dict = {
    'step': 'transcription',
    'input_desc': '50 handwritten diary pages',
    'output_desc': '50 plain text files',
    'date': '2024-03-01'
}

# Accessing by name is clear and unambiguous
print(step_dict['step'])       # transcription
print(step_dict['input_desc']) # 50 handwritten diary pages
```

:::definition
**Provenance**: The documented history of a data object -- where it came from, what transformations were applied, and by whom. Processing logs create provenance records for computational research.
:::

### Chaining Steps Together

Notice how each step's output becomes the next step's input. This creates a **chain of provenance** -- an unbroken record from raw source to final result.

```python
log = [
    {'step': 'import', 'input_desc': 'raw XML from archive',
     'output_desc': '200 XML files', 'date': '2024-01-05'},
    {'step': 'parsing', 'input_desc': '200 XML files',
     'output_desc': '200 text extracts', 'date': '2024-01-12'},
    {'step': 'deduplication', 'input_desc': '200 text extracts',
     'output_desc': '187 unique text extracts', 'date': '2024-01-15'},
]

# Verify the chain is unbroken
for i in range(1, len(log)):
    prev_output = log[i - 1]['output_desc']
    curr_input = log[i]['input_desc']
    match = "OK" if prev_output == curr_input else "BREAK"
    print(f"Step {i} -> Step {i+1}: {match}")
```

Output:
```
Step 1 -> Step 2: OK
Step 2 -> Step 3: OK
```

## Practice

:::try-it
Create a processing log with three steps for a project that (1) downloads 100 newspaper pages as images, (2) runs OCR to produce text files, and (3) extracts dates from the text files into a CSV. Print each step with its number, name, input, output, and date.
:::

## Transfer

In digital humanities, funding agencies like SSHRC and AHRC increasingly require **data management plans** that describe how data will be processed and preserved. A processing log written in Python can be exported as part of your project's documentation, ensuring that reviewers, collaborators, and future researchers can understand every transformation you applied.

Consider how this applies to your own work: if you are building a corpus from digitized manuscripts, every decision -- which pages to include, how to handle damaged text, whether to modernize spelling -- should appear as an entry in your log.

:::challenge
You are documenting a text digitization project. A partial processing log has been started, but two entries are missing. Complete the log so the chain of provenance is unbroken, then print the formatted result.
:::

---challenges---

### Challenge: Complete the Digitization Log

- id: repro-01-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
processing_log = [
    {
        'step': 'scanning',
        'input_desc': '500 page manuscript',
        'output_desc': '500 TIFF images at 600dpi',
        'date': '2024-01-15'
    },
    # TODO: Add the OCR step
    # input: the TIFF images from scanning
    # output: 500 plain text files
    # date: 2024-01-20
    {
        'step': 'text_cleaning',
        'input_desc': '500 plain text files',
        'output_desc': '500 cleaned text files',
        'date': '2024-02-01'
    },
    # TODO: Add the corpus assembly step
    # input: the cleaned text files
    # output: 1 merged corpus file
    # date: 2024-02-10
]

print('=== Processing Log ===')
for i, entry in enumerate(processing_log, 1):
    print(f"Step {i}: {entry['step']}")
    print(f"  Input:  {entry['input_desc']}")
    print(f"  Output: {entry['output_desc']}")
    print(f"  Date:   {entry['date']}")
```

#### Expected Output

```
=== Processing Log ===
Step 1: scanning
  Input:  500 page manuscript
  Output: 500 TIFF images at 600dpi
  Date:   2024-01-15
Step 2: ocr_processing
  Input:  500 TIFF images at 600dpi
  Output: 500 plain text files
  Date:   2024-01-20
Step 3: text_cleaning
  Input:  500 plain text files
  Output: 500 cleaned text files
  Date:   2024-02-01
Step 4: corpus_assembly
  Input:  500 cleaned text files
  Output: 1 merged corpus file
  Date:   2024-02-10
```

#### Hints

1. Each log entry is a dictionary with four keys: `'step'`, `'input_desc'`, `'output_desc'`, and `'date'`.
2. The OCR step must go between scanning and text_cleaning. Its input should match scanning's output exactly: `'500 TIFF images at 600dpi'`.
3. The corpus assembly step goes at the end. Its input should match text_cleaning's output exactly: `'500 cleaned text files'`.

#### Solution

```python
processing_log = [
    {
        'step': 'scanning',
        'input_desc': '500 page manuscript',
        'output_desc': '500 TIFF images at 600dpi',
        'date': '2024-01-15'
    },
    {
        'step': 'ocr_processing',
        'input_desc': '500 TIFF images at 600dpi',
        'output_desc': '500 plain text files',
        'date': '2024-01-20'
    },
    {
        'step': 'text_cleaning',
        'input_desc': '500 plain text files',
        'output_desc': '500 cleaned text files',
        'date': '2024-02-01'
    },
    {
        'step': 'corpus_assembly',
        'input_desc': '500 cleaned text files',
        'output_desc': '1 merged corpus file',
        'date': '2024-02-10'
    },
]

print('=== Processing Log ===')
for i, entry in enumerate(processing_log, 1):
    print(f"Step {i}: {entry['step']}")
    print(f"  Input:  {entry['input_desc']}")
    print(f"  Output: {entry['output_desc']}")
    print(f"  Date:   {entry['date']}")
```

