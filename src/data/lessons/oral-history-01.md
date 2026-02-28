---
id: oral-history-01
title: 'The Shape of Speech: Understanding Transcripts as Data'
moduleId: oral-history
prerequisites:
  - python-basics
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Explain how oral history transcripts differ structurally from literary or archival texts
  - Represent a timestamped transcript as a list of dictionaries with speaker, text, and timestamp fields
  - Filter transcript data by speaker and count words per turn using Python
keywords:
  - oral history
  - transcript
  - timestamped data
  - speaker turns
  - structured text
---

# The Shape of Speech: Understanding Transcripts as Data

## Analogy

Think of a library card catalog. Each card holds structured information about a book: author, title, date, subject. A transcript works the same way, except each "card" represents a moment of speech. Instead of author, you have a speaker. Instead of a title, you have the words they said. And instead of a publication date, you have a timestamp marking exactly when those words were spoken. Just as the catalog transforms a chaotic pile of books into a searchable system, representing speech as structured data transforms a flowing conversation into something you can query, filter, and analyze.

## Key Concepts

### How Oral History Transcripts Differ from Literary Texts

A novel or a poem is a single stream of authored text. Oral history transcripts are fundamentally different. They are **multi-voiced**, capturing the back-and-forth between an interviewer and a narrator. They are **time-bound**, tied to specific moments in a recording. And they carry traces of **spontaneous speech**: false starts, repetition, dialectal phrasing, and pauses that a polished essay would edit away.

For the digital humanist, this means we need a richer data structure than a plain string. We need to preserve *who* spoke, *what* they said, and *when* they said it.

:::definition
**Transcript turn**: A single uninterrupted stretch of speech by one speaker, bounded by the moments another speaker begins or a significant pause occurs.
:::

### Representing a Transcript as Structured Data

In Python, the most natural way to represent a transcript is as a **list of dictionaries**. Each dictionary is one turn, and each turn carries metadata alongside the text.

```python
transcript = [
    {"speaker": "Interviewer", "text": "When did your family first arrive here?", "start": 0.0, "end": 4.2},
    {"speaker": "Mrs. Alvarez", "text": "My grandmother came in nineteen fifty two", "start": 4.5, "end": 8.1},
    {"speaker": "Interviewer", "text": "What do you remember about the neighborhood?", "start": 8.5, "end": 12.0},
    {"speaker": "Mrs. Alvarez", "text": "Oh it was so different then very close knit", "start": 12.3, "end": 16.7},
]

for turn in transcript:
    print(f"[{turn['start']:>5.1f}s] {turn['speaker']}: {turn['text']}")
```

```
[  0.0s] Interviewer: When did your family first arrive here?
[  4.5s] Mrs. Alvarez: My grandmother came in nineteen fifty two
[  8.5s] Interviewer: What do you remember about the neighborhood?
[ 12.3s] Mrs. Alvarez: Oh it was so different then very close knit
```

Notice how each turn stores `start` and `end` times as floating-point numbers representing seconds into the recording. This is how real transcription software (like ELAN, Whisper, or OHMS) exports data, and it lets us do time-based analysis later.

:::definition
**Timestamped transcript**: A transcript representation where each turn includes numerical start and end times, enabling analysis of pacing, overlap, and silence.
:::

### Filtering by Speaker

One of the most common first tasks in oral history analysis is separating the narrator's words from the interviewer's questions. A list comprehension makes this straightforward.

```python
narrator_turns = [t for t in transcript if t["speaker"] == "Mrs. Alvarez"]
print(f"Mrs. Alvarez speaks {len(narrator_turns)} times")
```

```
Mrs. Alvarez speaks 2 times
```

This is the digital humanities equivalent of highlighting every passage in a different color for each speaker -- except it scales to transcripts with thousands of turns.

### Counting Words per Turn

Word counts per turn give you a rough measure of how much each speaker contributes. In oral history, narrators typically produce longer turns than interviewers, but the ratio can reveal a great deal about the interview dynamic.

```python
for turn in transcript:
    word_count = len(turn["text"].split())
    print(f"{turn['speaker']}: {word_count} words")
```

```
Interviewer: 7 words
Mrs. Alvarez: 7 words
Interviewer: 7 words
Mrs. Alvarez: 9 words
```

The `.split()` method breaks a string on whitespace, returning a list of words. Counting that list gives us a simple but effective word count.

## Practice

:::try-it
Create your own transcript list with at least four turns between two speakers -- perhaps a mock interview about a family recipe, a local tradition, or a childhood memory. Print each turn with its timestamp, then filter to show only the narrator's turns. Experiment: what happens if you misspell the speaker name in your filter?
:::

## Transfer

If you work with oral history collections, folklore archives, or ethnographic interviews, you likely already have transcripts in some format -- Word documents, subtitle files, or spreadsheets. The list-of-dictionaries structure you learned here is the bridge between those messy real-world formats and computational analysis. As a next step, think about how you would convert your own transcript files into this format. What fields would you add beyond speaker, text, and timestamps? Topic tags? Emotional tone annotations? The data model is yours to extend.

:::challenge
Given a transcript of a labor history interview (provided as a list of dictionaries), filter to only the narrator's turns, count the total number of words across all of their turns, and print the results.
:::

---challenges---

### Challenge: Count a Speaker's Words

- id: oral-history-01-challenge
- language: python
- difficulty: beginner

#### Starter Code

```python
transcript = [
    {"speaker": "Interviewer", "text": "Tell me about the factory work", "start": 0.0, "end": 3.5},
    {"speaker": "Mr. Okafor", "text": "We started before dawn every single day", "start": 4.0, "end": 7.8},
    {"speaker": "Interviewer", "text": "How did that affect your family", "start": 8.2, "end": 10.5},
    {"speaker": "Mr. Okafor", "text": "The children barely saw me it was hard", "start": 11.0, "end": 15.2},
    {"speaker": "Interviewer", "text": "Did conditions ever improve", "start": 15.8, "end": 18.0},
    {"speaker": "Mr. Okafor", "text": "After the strike things changed for the better", "start": 18.5, "end": 22.3},
]

target_speaker = "Mr. Okafor"

# Step 1: Filter transcript to only turns by target_speaker
speaker_turns = ___ # Your code here

# Step 2: Count total words across all of target_speaker's turns
total_words = ___ # Your code here

# Step 3: Print the results (must match expected output exactly)
print(f"Speaker: {target_speaker}")
print(f"Number of turns: {___}") # Your code here
print(f"Total words: {___}") # Your code here
```

#### Expected Output

```
Speaker: Mr. Okafor
Number of turns: 3
Total words: 23
```

#### Hints

1. Use a list comprehension to filter: `[t for t in transcript if t["speaker"] == target_speaker]`
2. To count words in a single turn, use `len(turn["text"].split())`
3. Use `sum()` with a generator expression to total the word counts across all filtered turns

#### Solution

```python
transcript = [
    {"speaker": "Interviewer", "text": "Tell me about the factory work", "start": 0.0, "end": 3.5},
    {"speaker": "Mr. Okafor", "text": "We started before dawn every single day", "start": 4.0, "end": 7.8},
    {"speaker": "Interviewer", "text": "How did that affect your family", "start": 8.2, "end": 10.5},
    {"speaker": "Mr. Okafor", "text": "The children barely saw me it was hard", "start": 11.0, "end": 15.2},
    {"speaker": "Interviewer", "text": "Did conditions ever improve", "start": 15.8, "end": 18.0},
    {"speaker": "Mr. Okafor", "text": "After the strike things changed for the better", "start": 18.5, "end": 22.3},
]

target_speaker = "Mr. Okafor"

speaker_turns = [t for t in transcript if t["speaker"] == target_speaker]
total_words = sum(len(t["text"].split()) for t in speaker_turns)

print(f"Speaker: {target_speaker}")
print(f"Number of turns: {len(speaker_turns)}")
print(f"Total words: {total_words}")
```

