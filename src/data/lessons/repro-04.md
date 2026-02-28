---
id: repro-04
title: 'The Methods Section: Generating Human-Readable Reports'
moduleId: reproducibility
prerequisites:
  - repro-03
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Explain the purpose of a methods section in DH research documentation
  - Build a structured project metadata dictionary in Python
  - Use f-strings and string formatting to generate human-readable reports programmatically
  - Connect programmatic report generation to DH journal and grant reporting requirements
keywords:
  - methods section
  - report generation
  - f-strings
  - metadata
  - project documentation
  - formatted output
---

# The Methods Section: Generating Human-Readable Reports

## Analogy

Every published humanities article contains a section -- sometimes called "Methods," sometimes "Materials and Approach," sometimes woven into the introduction -- that explains **how** the research was conducted. In traditional humanities, this might describe which archives were consulted, which edition of a text was used, or how interviews were conducted. The goal is always the same: give the reader enough information to understand and evaluate the work.

In computational DH, the methods section must also describe the **technical pipeline**: what tools were used, what versions, what parameters, and in what order. Writing this by hand is tedious and error-prone. But if your project already stores its metadata in a structured format (like a Python dictionary), you can **generate** the methods section automatically -- ensuring it is always complete, consistent, and up to date.

## Key Concepts

### Metadata as a Dictionary

A well-structured project metadata dictionary captures everything a reader needs to know about your methods. Think of it as the structured data behind the prose:

```python
project = {
    'title': 'Sentiment in Suffragist Newspapers',
    'researcher': 'Dr. J. Doe',
    'institution': 'Anytown College',
    'date_range': '2024-01 to 2024-09',
    'corpus_size': 1200,
    'corpus_unit': 'articles',
    'languages': ['English'],
    'methods': ['sentiment analysis', 'keyword extraction'],
    'tools': ['Python 3.12', 'NLTK 3.8'],
    'output_formats': ['CSV', 'JSON'],
}
```

:::definition
**Project Metadata**: Structured information describing a research project's scope, data, methods, tools, and outputs. When stored as a Python dictionary, it becomes both human-readable documentation and machine-processable data.
:::

### Generating a Report with F-Strings

Python's f-strings let you embed dictionary values directly into formatted text. By building the report as a list of lines, you can assemble complex documents piece by piece:

```python
project = {
    'title': 'Sentiment in Suffragist Newspapers',
    'researcher': 'Dr. J. Doe',
    'corpus_size': 1200,
    'corpus_unit': 'articles',
    'methods': ['sentiment analysis', 'keyword extraction'],
    'tools': ['Python 3.12', 'NLTK 3.8'],
}

lines = []
lines.append(f"Project: {project['title']}")
lines.append(f"Researcher: {project['researcher']}")
lines.append(f"Corpus: {project['corpus_size']} {project['corpus_unit']}")
lines.append('')
lines.append('Methods applied:')
for i, method in enumerate(project['methods'], 1):
    lines.append(f"  {i}. {method}")

report = '\n'.join(lines)
print(report)
```

Output:
```
Project: Sentiment in Suffragist Newspapers
Researcher: Dr. J. Doe
Corpus: 1200 articles

Methods applied:
  1. sentiment analysis
  2. keyword extraction
```

### Structuring with Section Dividers

A professional report uses visual dividers to separate sections. This makes the output scannable whether it appears in a terminal, a log file, or a project README:

```python
def section_header(title):
    return f"--- {title} ---"

print(section_header("Corpus Description"))
print(f"Size: 1200 articles")
print(f"Languages: English")
print()
print(section_header("Tools and Versions"))
print(f"  - Python 3.12")
print(f"  - NLTK 3.8")
```

Output:
```
--- Corpus Description ---
Size: 1200 articles
Languages: English

--- Tools and Versions ---
  - Python 3.12
  - NLTK 3.8
```

:::definition
**Programmatic Report Generation**: The practice of writing code that produces human-readable documents from structured data. This ensures reports are always consistent with the actual project metadata and can be regenerated whenever the project evolves.
:::

### Joining Lists for Readable Output

When a metadata field contains a list (languages, output formats), you often want to display it as a comma-separated string. The `join()` method handles this cleanly:

```python
languages = ['English', 'Spanish', 'French']
formats = ['GraphML', 'CSV', 'JSON']

print(f"Languages: {', '.join(languages)}")
print(f"Data exported as: {', '.join(formats)}")
```

Output:
```
Languages: English, Spanish, French
Data exported as: GraphML, CSV, JSON
```

### Putting It All Together

Here is a complete report generator that takes a project dictionary and produces a formatted methods section:

```python
project = {
    'title': 'Mapping Trade Routes in Medieval Manuscripts',
    'researcher': 'Prof. J. Doe',
    'institution': 'Institute for Textual Studies',
    'date_range': '2023-09 to 2024-06',
    'corpus_size': 340,
    'corpus_unit': 'manuscripts',
    'languages': ['Latin', 'Arabic'],
    'methods': ['handwriting analysis', 'geographic tagging'],
    'tools': ['Python 3.11', 'OpenCV 4.9'],
    'output_formats': ['GeoJSON', 'CSV'],
}

lines = []
lines.append('=' * 50)
lines.append('METHODS REPORT')
lines.append('=' * 50)
lines.append('')
lines.append(f"Project: {project['title']}")
lines.append(f"Researcher: {project['researcher']}")
lines.append(f"Institution: {project['institution']}")
lines.append(f"Period: {project['date_range']}")
lines.append('')
lines.append('--- Corpus Description ---')
lines.append(f"Size: {project['corpus_size']} {project['corpus_unit']}")
lines.append(f"Languages: {', '.join(project['languages'])}")
lines.append('')
lines.append('--- Analytical Methods ---')
for i, method in enumerate(project['methods'], 1):
    lines.append(f"  {i}. {method}")
lines.append('')
lines.append('--- Tools and Versions ---')
for tool in project['tools']:
    lines.append(f"  - {tool}")
lines.append('')
lines.append('--- Output Formats ---')
lines.append(f"Data exported as: {', '.join(project['output_formats'])}")
lines.append('=' * 50)

print('\n'.join(lines))
```

This pattern -- metadata dictionary in, formatted report out -- scales to any project size and can be adapted for different audiences (grant reports, journal appendices, project wikis).

## Practice

:::try-it
Create a project metadata dictionary for a fictional DH project of your choice. Include at least: title, researcher, corpus_size, corpus_unit, methods (list of 2+), and tools (list of 2+). Then generate a formatted report using f-strings and `'\n'.join()`.
:::

## Transfer

DH journals like *Digital Scholarship in the Humanities*, *Digital Humanities Quarterly*, and *Journal of Cultural Analytics* increasingly expect detailed technical methods sections, as do many grant agencies.

By storing your project metadata as a structured dictionary from the start, you can generate these reports at any point -- for a mid-project review, a final grant report, or a journal submission appendix. If your methods change (you upgrade a tool version, add a processing step), you update the dictionary and regenerate. The report is never out of date because it is computed from the single source of truth.

:::challenge
You are preparing a methods report for a DH project studying colonial correspondence networks. Given the project metadata dictionary below, generate a complete formatted methods report with all required sections.
:::

---challenges---

### Challenge: Generate the Methods Report

- id: repro-04-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
project = {
    'title': 'Mapping Colonial Correspondence Networks',
    'researcher': 'Dr. J. Doe',
    'institution': 'University of Anytown',
    'date_range': '2023-06 to 2024-12',
    'corpus_size': 2350,
    'corpus_unit': 'letters',
    'languages': ['English', 'Spanish', 'French'],
    'methods': ['network analysis', 'named entity recognition', 'topic modeling'],
    'tools': ['Python 3.11', 'spaCy 3.7', 'NetworkX 3.2'],
    'output_formats': ['GraphML', 'CSV', 'JSON'],
}

lines = []
# TODO: Add a header with '=' * 50, then 'METHODS REPORT', then '=' * 50
# TODO: Add project title, researcher, institution, and period
# TODO: Add a '--- Corpus Description ---' section with size and languages
# TODO: Add a '--- Analytical Methods ---' section with numbered methods
# TODO: Add a '--- Tools and Versions ---' section with bulleted tools
# TODO: Add a '--- Output Formats ---' section
# TODO: Add a closing '=' * 50

report = '\n'.join(lines)
print(report)
```

#### Expected Output

```
==================================================
METHODS REPORT
==================================================

Project: Mapping Colonial Correspondence Networks
Researcher: Dr. J. Doe
Institution: University of Anytown
Period: 2023-06 to 2024-12

--- Corpus Description ---
Size: 2350 letters
Languages: English, Spanish, French

--- Analytical Methods ---
  1. network analysis
  2. named entity recognition
  3. topic modeling

--- Tools and Versions ---
  - Python 3.11
  - spaCy 3.7
  - NetworkX 3.2

--- Output Formats ---
Data exported as: GraphML, CSV, JSON
==================================================
```

#### Hints

1. Use `'=' * 50` to create a line of 50 equals signs for the header and footer.
2. Add an empty string `''` to the lines list to create blank lines between sections.
3. Use `enumerate(project['methods'], 1)` to number the methods starting from 1.
4. Use `', '.join(project['languages'])` and `', '.join(project['output_formats'])` to format lists as comma-separated strings.

#### Solution

```python
project = {
    'title': 'Mapping Colonial Correspondence Networks',
    'researcher': 'Dr. J. Doe',
    'institution': 'University of Anytown',
    'date_range': '2023-06 to 2024-12',
    'corpus_size': 2350,
    'corpus_unit': 'letters',
    'languages': ['English', 'Spanish', 'French'],
    'methods': ['network analysis', 'named entity recognition', 'topic modeling'],
    'tools': ['Python 3.11', 'spaCy 3.7', 'NetworkX 3.2'],
    'output_formats': ['GraphML', 'CSV', 'JSON'],
}

lines = []
lines.append('=' * 50)
lines.append('METHODS REPORT')
lines.append('=' * 50)
lines.append('')
lines.append(f"Project: {project['title']}")
lines.append(f"Researcher: {project['researcher']}")
lines.append(f"Institution: {project['institution']}")
lines.append(f"Period: {project['date_range']}")
lines.append('')
lines.append('--- Corpus Description ---')
lines.append(f"Size: {project['corpus_size']} {project['corpus_unit']}")
lines.append(f"Languages: {', '.join(project['languages'])}")
lines.append('')
lines.append('--- Analytical Methods ---')
for i, method in enumerate(project['methods'], 1):
    lines.append(f"  {i}. {method}")
lines.append('')
lines.append('--- Tools and Versions ---')
for tool in project['tools']:
    lines.append(f"  - {tool}")
lines.append('')
lines.append('--- Output Formats ---')
lines.append(f"Data exported as: {', '.join(project['output_formats'])}")
lines.append('=' * 50)

report = '\n'.join(lines)
print(report)
```

