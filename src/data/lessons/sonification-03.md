---
id: sonification-03
title: Multimodal Mapping (Pitch and Volume)
moduleId: data-sonification
prerequisites:
  - sonification-02
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Map multiple data variables to different sound parameters simultaneously
  - Understand the trade-offs between cognitive load and data density in audio
  - Translate raw data lists into structured "Note" dictionaries
  - Apply MIDI Velocity to represent quantitative scale
keywords:
  - multimodal
  - volume
  - velocity
  - synthesis
  - mapping
---

# Multimodal Mapping: Hearing Complexity

  ## Analogy
  Imagine watching a ballet. You aren't just watching the dancer's **feet** (the pitch); you are also watching the **force** of their movements (the volume/velocity) and the **speed** of the dance (the rhythm). By combining these, the dance tells a much richer story than any one movement could alone. Multimodal sonification does the same for your research data.

  ---

  ## 1. Independent Mapping
  In Digital Humanities, a single record usually has multiple facets. A diary entry has a **date**, a **word count**, and a **sentiment score**. In multimodal sonification, we assign each facet to a different "dimension" of sound:

  - **Date** &rarr;$ **Time** (When the note starts)
  - **Sentiment** &rarr;$ **Pitch** (High notes for joy, low notes for sorrow)
  - **Word Count** &rarr;$ **Velocity** (Loudness/Intensity)

  :::definition
  **Velocity**: In MIDI terminology, this refers to how "hard" a note is struck. It ranges from **0 (silent) to 127 (maximum force)**. It is the standard way to map the "weight" or "volume" of a data point.
  :::

  ---

  ## 2. Complexity vs. Clarity
  The more variables you map, the harder it is for the human ear to distinguish them. 
  - **Redundant Mapping**: Mapping one variable to two sounds (e.g., Year &rarr;$ Pitch AND Volume). This makes the data very easy to "hear" but uses up your available sounds.
  - **Independent Mapping**: Mapping different variables to different sounds (e.g., Year &rarr; Pitch, Count &rarr; Volume). This shows **correlation**. Can you hear the notes getting higher and louder at the same time?

  ---

  ## 3. Data Structures for Sound
  When we move from raw data to music, we often transform our lists into **Dictionaries**. This makes the code much more readable when we finally send it to the `midiutil` library.

  ```python
  # Raw Record: [Year, Sentiment, WordCount]
  raw_entry = [1850, 0.8, 500]

  # Mapping into a structured "Note" object
  note_data = {
      "pitch": int(60 + (raw_entry[1] * 12)), # Maps sentiment to one octave
      "velocity": int((raw_entry[2] / 1000) * 127), # Maps count to volume
      "time": raw_entry[0] - 1800 # Maps year to a relative start time
  }
  ```

  ---

  ## 4. The Math of Multi-Mapping
  Remember the formula from Lesson 1: `percent * range + offset`. When doing multimodal mapping, you simply perform this calculation for each sound parameter.

  :::tip
  **DH Insight**: Multimodal sonification is perfect for detecting **outliers**. If you hear a note that is suddenly very high (pitch) but very quiet (velocity), you have found a record that is highly positive but very short—a "blip" in your archive that might be worth a closer look.
  :::

  :::challenge
  You have a small "corpus" of books. Each book is a list: `[year, page_count]`. Convert these into a list of Note dictionaries. Map the **Year** to a pitch (60-72) and the **Page Count** to a velocity (0-127).
  :::

---challenges---

### Challenge: Multimodal Note Generation

- id: sonification-03-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
# Corpus: Each inner list is [publication_year, page_count]
  corpus = [
      [1818, 280],
      [1847, 400],
      [1897, 320]
  ]

  # Mapping Rules:
  # Pitch: 1818-1897 -> 60-72 (Range of 12)
  # Velocity (Volume): 0-500 pages -> 0-127 (Range of 127)

  def generate_note(item):
      year, pages = item
      
      # 1. Map year to pitch (60 to 72)
      # Formula: 60 + (year_percent * 12)
      pitch = 60 + int(((year - 1818) / (1897 - 1818)) * 12)
      
      # 2. Map pages to velocity (0 to 127)
      # Formula: (pages / 500) * 127
      velocity = int((pages / 500) * 127)
      
      return {"pitch": pitch, "velocity": velocity}

  # Use a list comprehension to process the corpus
  notes = [generate_note(b) for b in corpus]

  for n in notes:
      print(n)
  
```

#### Expected Output

```
{'pitch': 60, 'velocity': 71}
{'pitch': 64, 'velocity': 101}
{'pitch': 72, 'velocity': 81}
```

#### Hints

1. The "Year Percent" is (year - 1818) / (1897 - 1818).
2. Multiply the year percentage by 12 and add it to the base pitch of 60.
3. To get velocity, divide pages by 500 and multiply by 127.
4. Use int() to round your results to whole MIDI numbers.

#### Solution

```python
corpus = [
      [1818, 280],
      [1847, 400],
      [1897, 320]
  ]

  def generate_note(item):
      year, pages = item
      
      # Map Year to Pitch
      year_range = 1897 - 1818
      pitch_range = 12
      pitch = 60 + int(((year - 1818) / year_range) * pitch_range)
      
      # Map Pages to Velocity
      velocity = int((pages / 500) * 127)
      
      return {"pitch": pitch, "velocity": velocity}

  notes = [generate_note(b) for b in corpus]
  for n in notes:
      print(n)
```

