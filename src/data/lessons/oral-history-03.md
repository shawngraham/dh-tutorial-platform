---
id: oral-history-03
title: 'Turn-Taking and Power: Analyzing Conversation Structure'
moduleId: oral-history
prerequisites:
  - oral-history-02
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Analyze turn-taking patterns to reveal power dynamics in oral history interviews
  - Calculate per-speaker statistics including turn count, total speaking time, and percentage share
  - Identify the dominant speaker in a transcript using aggregated timing data
keywords:
  - turn-taking
  - power dynamics
  - speaking time
  - conversation analysis
  - speaker dominance
  - interview structure
---

# Turn-Taking and Power: Analyzing Conversation Structure

## Analogy

Think about how historians analyze the layout of a medieval manuscript. Who gets the largest illuminated initial? Whose words occupy the center of the page, and whose are pushed to the margins? The physical space a voice occupies on the page tells you something about power and authority. In an oral history interview, **time** is the equivalent of page space. Who speaks longer? Who gets interrupted? Whose turns are brief questions, and whose are expansive narratives? By measuring speaking time per person, we can make visible the power dynamics that shape every recorded conversation -- dynamics that are easy to sense but hard to prove without numbers.

## Key Concepts

### Turn-Taking as a Window into Power

In a well-conducted oral history interview, the narrator should do most of the talking. The interviewer asks brief, open-ended questions and then gets out of the way. But this ideal is not always the reality. Some interviewers dominate. Some narrators give only terse answers. Analyzing the **distribution of speaking time** reveals these patterns quantitatively.

Conversation analysts use several metrics:

- **Turn count**: How many times each person speaks.
- **Total speaking time**: The sum of all turn durations for each speaker.
- **Speaking time share**: Each speaker's percentage of the total recorded speech.

:::definition
**Speaking time share**: A speaker's total speaking time divided by the combined speaking time of all participants, expressed as a percentage. A narrator share below 50% in an oral history may indicate interviewer dominance.
:::

### Counting Words per Speaker

Before we work with timestamps, a simple word count per speaker can already reveal imbalances. We use a dictionary to accumulate totals.

```python
transcript = [
    {"speaker": "Interviewer", "text": "Tell me about your childhood", "start": 0.0, "end": 2.5},
    {"speaker": "Ms. Rivera", "text": "We lived on a farm with my grandparents and cousins", "start": 3.0, "end": 7.8},
    {"speaker": "Interviewer", "text": "What was that like", "start": 8.1, "end": 9.3},
    {"speaker": "Ms. Rivera", "text": "Hard work but we were happy together as a family", "start": 9.8, "end": 14.2},
]

word_counts = {}
for turn in transcript:
    name = turn["speaker"]
    words = len(turn["text"].split())
    word_counts[name] = word_counts.get(name, 0) + words

for name, count in word_counts.items():
    print(f"{name}: {count} words")
```

```
Interviewer: 9 words
Ms. Rivera: 20 words
```

Ms. Rivera produces more than twice as many words as the Interviewer -- a healthy ratio for an oral history. The `.get(name, 0)` pattern is essential here: it initializes a speaker's count to zero the first time we encounter them, so we can accumulate without checking whether the key already exists.

### Calculating Speaking Time per Speaker

Word counts are useful but imperfect -- a slow, deliberate speaker may use few words over many seconds. **Speaking time**, derived from timestamps, gives us a more direct measure.

```python
speaker_time = {}
for turn in transcript:
    name = turn["speaker"]
    duration = round(turn["end"] - turn["start"], 1)
    speaker_time[name] = round(speaker_time.get(name, 0) + duration, 1)

total = round(sum(speaker_time.values()), 1)
for name in speaker_time:
    pct = round(speaker_time[name] / total * 100, 1)
    print(f"{name}: {speaker_time[name]}s of {total}s ({pct}%)")
```

```
Interviewer: 3.7s of 14.9s (24.8%)
Ms. Rivera: 11.2s of 14.9s (75.2%)
```

:::definition
**Turn duration**: The length of a single speaking turn, calculated as `end - start` for that turn. Summing all turn durations for a speaker gives their total speaking time.
:::

This pattern -- accumulate into a dictionary, then compute summary statistics -- is one of the most versatile tools in data analysis. You will use it again and again across digital humanities projects.

### Identifying the Dominant Speaker

Once we have a dictionary mapping speakers to their total time, finding the dominant speaker is a one-liner using `max()` with a key function.

```python
dominant = max(speaker_time, key=speaker_time.get)
print(f"Dominant speaker: {dominant}")
```

```
Dominant speaker: Ms. Rivera
```

In oral history, we *expect* the narrator to be dominant. When the interviewer dominates, it is a signal worth investigating -- perhaps the narrator was reluctant, or the interviewer was steering the conversation too aggressively.

## Practice

:::try-it
Create a transcript with three speakers -- perhaps two narrators and one interviewer, simulating a group oral history session. Calculate each speaker's turn count, total speaking time, and percentage share. Which speaker dominates? Does the result match what you would expect from the content of the turns?
:::

## Transfer

Quantitative turn-taking analysis is widely used in sociolinguistics, courtroom discourse studies, and political debate analysis. In digital humanities, researchers have applied these methods to compare interviewing styles across large oral history collections. For instance, an archive with hundreds of interviews can be profiled to ask: do certain interviewers consistently dominate the conversation? Do narrators from particular demographic groups receive less speaking time? These questions move oral history research from individual close readings toward corpus-level patterns that reveal systemic biases in how stories are collected.

:::challenge
Given a transcript of a civil rights oral history interview, calculate each speaker's turn count, total speaking time, and percentage share of speaking time. Identify and print the dominant speaker.
:::

---challenges---

### Challenge: Who Holds the Floor?

- id: oral-history-03-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
transcript = [
    {"speaker": "Interviewer", "text": "Tell me about your years in the movement", "start": 0.0, "end": 3.2},
    {"speaker": "Dr. James", "text": "I joined when I was barely eighteen we marched every weekend that summer", "start": 3.8, "end": 10.5},
    {"speaker": "Interviewer", "text": "What kept you going", "start": 11.0, "end": 12.3},
    {"speaker": "Dr. James", "text": "Belief I suppose and the people around me they were like family", "start": 12.8, "end": 19.0},
    {"speaker": "Interviewer", "text": "Were there moments of doubt", "start": 19.5, "end": 21.2},
    {"speaker": "Dr. James", "text": "Oh many times especially after the arrests but we kept on", "start": 21.8, "end": 27.4},
]

# Step 1: Accumulate speaking time and turn count per speaker
speaker_time = {}
speaker_turns = {}

# 
for turn in transcript:
    name = turn["speaker"]
    duration = round(turn["end"] - turn["start"], 1)
    speaker_time[name] = round(___, 1) #Your code here
    speaker_turns[name] = ___ #Your code here

# Step 2: Calculate total speaking time
total_time = round(sum(speaker_time.values()), 1)

# Step 3: Print per-speaker stats
print("Speaker analysis:")
for name in speaker_time:
    pct = round(___ / ___ * 100, 1) #Your code here
    print(f"  {name}: {speaker_turns[name]} turns, {speaker_time[name]}s ({pct}%)")

# Step 4: Find and print the dominant speaker
dominant = max(___, key=___) #Your code here
print(f"Dominant speaker: {dominant}")
```

#### Expected Output

```
Speaker analysis:
  Interviewer: 3 turns, 6.2s (25.1%)
  Dr. James: 3 turns, 18.5s (74.9%)
Dominant speaker: Dr. James
```

#### Hints

1. To accumulate time: `speaker_time.get(name, 0) + duration` adds the new duration to the running total
2. To accumulate turns: `speaker_turns.get(name, 0) + 1` increments the count by one each time
3. Percentage is `speaker_time[name] / total_time * 100`
4. `max(speaker_time, key=speaker_time.get)` returns the key with the highest value

#### Solution

```python
transcript = [
    {"speaker": "Interviewer", "text": "Tell me about your years in the movement", "start": 0.0, "end": 3.2},
    {"speaker": "Dr. James", "text": "I joined when I was barely eighteen we marched every weekend that summer", "start": 3.8, "end": 10.5},
    {"speaker": "Interviewer", "text": "What kept you going", "start": 11.0, "end": 12.3},
    {"speaker": "Dr. James", "text": "Belief I suppose and the people around me they were like family", "start": 12.8, "end": 19.0},
    {"speaker": "Interviewer", "text": "Were there moments of doubt", "start": 19.5, "end": 21.2},
    {"speaker": "Dr. James", "text": "Oh many times especially after the arrests but we kept on", "start": 21.8, "end": 27.4},
]

speaker_time = {}
speaker_turns = {}

for turn in transcript:
    name = turn["speaker"]
    duration = round(turn["end"] - turn["start"], 1)
    speaker_time[name] = round(speaker_time.get(name, 0) + duration, 1)
    speaker_turns[name] = speaker_turns.get(name, 0) + 1

total_time = round(sum(speaker_time.values()), 1)

print("Speaker analysis:")
for name in speaker_time:
    pct = round(speaker_time[name] / total_time * 100, 1)
    print(f"  {name}: {speaker_turns[name]} turns, {speaker_time[name]}s ({pct}%)")

dominant = max(speaker_time, key=speaker_time.get)
print(f"Dominant speaker: {dominant}")
```

