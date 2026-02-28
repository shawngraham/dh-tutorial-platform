---
id: network-analysis-06
title: From Spreadsheets to Networks
moduleId: network-analysis
prerequisites:
  - network-analysis-05
  - structured-data-01
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Understand the Edge List format as the standard for network data exchange
  - Use Pandas to load and clean tabular data for network construction
  - Convert a DataFrame into a Graph using nx.from_pandas_edgelist
  - Attach metadata to connections using edge attributes
keywords:
  - csv
  - pandas
  - dataframe
  - import
  - reproducibility
  - edge list
---

# From Spreadsheets to Networks: The Data Pipeline

  ## Analogy: The Seating Chart
  Imagine trying to organize a wedding seating chart. You wouldn't write the name of every guest on a separate sticky note and then manually draw 500 lines between them. You would likely start with a spreadsheet: Column A is "Guest," Column B is "Knows."

  In previous lessons, we manually typed `G.add_edge("Romeo", "Juliet")`. This is fine for five connections, but impossible for 5,000. In Digital Humanities, your research data almost always lives in a spreadsheet (CSV) first. We need a bridge between the **"Row & Column"** world of spreadsheets and the **"Node & Edge"** world of networks.

  ---

  ## 1. The Edge List Format
  To build a network from a spreadsheet, your data must be formatted as an **Edge List**. This means every row represents exactly **one connection**.

  | Source (From) | Target (To) | Weight (Strength/Years) |
  | :--- | :--- | :--- |
  | Virginia Woolf | T.S. Eliot | 15 |
  | T.S. Eliot | Ezra Pound | 22 |

  ---

  ## 2. The Bridge: `from_pandas_edgelist`
  We use the **Pandas** library to read the CSV, and then use a NetworkX helper function to convert that table into a "living" graph.

  ```python
  import pandas as pd
  import networkx as nx

  # 1. Load the data (Simulating a CSV load)
  data = {
      'Sender': ['Alice', 'Bob'],
      'Receiver': ['Bob', 'Charlie'],
      'Letters': [5, 12]
  }
  df = pd.DataFrame(data)

  # 2. Convert to Graph
  # We must specify which columns represent the 'source' and the 'target'
  G = nx.from_pandas_edgelist(df, source='Sender', target='Receiver', edge_attr='Letters')

  # Now 'Letters' is stored as an attribute on the edge
  print(G['Alice']['Bob']['Letters']) # Output: 5
  ```

  ---

  ## 3. Why This Matters for DH
  1.  **Scale**: You can load an archive of 50,000 historical letters in milliseconds.
  2.  **Reproducibility**: If you find a new box of letters, you don't edit your code; you just add rows to your CSV and re-run the script.
  3.  **Rich Metadata**: By using the `edge_attr` parameter, you can attach dates, locations, or sentiment scores to every connection in your web.

  :::tip
  **DH Pro-Tip**: When creating your CSV, ensure your "Source" and "Target" columns use consistent names. If you have "V. Woolf" in one row and "Virginia Woolf" in another, the computer will create two different nodes for the same person!
  :::

  :::challenge
  In Challenge 1, you will build a correspondence network from a raw dataset. In Challenge 2, you will learn to attach some edge attribute data.
  :::

---challenges---

### Challenge: The Import Pipeline and the Dirty Data Problem

- id: network-analysis-06-c1
- language: python
- difficulty: intermediate

#### Starter Code
```python
import pandas as pd
import networkx as nx

# Raw transcription data from an archive of Bloomsbury Group letters.
# A research assistant transcribed these, introducing inconsistencies.
raw_data = {
    "Sender": [
        "Virginia Woolf",
        "Vita Sackville-West",
        "V. Woolf",           # Inconsistent — same person as row 1
        "T.S. Eliot",
        "Virginia Woolf",
        "Lytton Strachey",
        "T. S. Eliot",        # Inconsistent — same person as row 4
        "Lytton Strachey",
    ],
    "Recipient": [
        "Vita Sackville-West",
        "Virginia Woolf",
        "Lytton Strachey",
        "Ezra Pound",
        "T.S. Eliot",
        "Virginia Woolf",
        "Virginia Woolf",
        "T.S. Eliot",
    ],
    "Letters": [12, 15, 3, 8, 5, 9, 4, 6],
}

df = pd.DataFrame(raw_data)

# Step 1: Diagnose the problem.
# Print the number of unique values in the Sender column BEFORE cleaning.
# You should see 5 unique senders — but two are duplicates with different spellings.
print("Unique senders before cleaning:", df["Sender"].nunique())
print(sorted(df["Sender"].unique()))
print()

# Step 2: Clean the data.
# Apply a correction dictionary to standardise the inconsistent names.
# Use df["Sender"].replace() to fix them.
corrections = {
    "V. Woolf":    "Virginia Woolf",
    "T. S. Eliot": "T.S. Eliot",
}
df["Sender"] = df["Sender"].replace(corrections)

print("Unique senders after cleaning:", df["Sender"].nunique())
print()

# Step 3: Build the graph.
# Use nx.from_pandas_edgelist() with edge_attr="Letters".
# Use create_using=nx.DiGraph() since Sender → Recipient has direction.
G = nx.from_pandas_edgelist(
    df,
    source="Sender",
    target="Recipient",
    edge_attr="Letters",
    create_using=# Your code here
)

print(f"Nodes: {G.number_of_nodes()}")
print(f"Edges: {G.number_of_edges()}")
print()

# Step 4: Demonstrate the cost of skipping Step 2.
# Build a second graph from the UNCLEANED data and compare node counts.
raw_df = pd.DataFrame(raw_data)
G_dirty = nx.from_pandas_edgelist(
    raw_df, source="Sender", target="Recipient",
    edge_attr="Letters", create_using=nx.DiGraph()
)
print(f"Dirty graph nodes: {G_dirty.number_of_nodes()} "
      f"(clean: {G.number_of_nodes()})")
print(f"Ghost nodes created by inconsistent names: "
      f"{G_dirty.number_of_nodes() - G.number_of_nodes()}")
```

#### Expected Output
```
Unique senders before cleaning: 5
['Lytton Strachey', 'T. S. Eliot', 'T.S. Eliot', 'V. Woolf', 'Vita Sackville-West', 'Virginia Woolf']

Unique senders after cleaning: 4

Nodes: 6
Edges: 8

Dirty graph nodes: 8 (clean: 6)
Ghost nodes created by inconsistent names: 2
```

#### Hints

1. `df["Sender"].nunique()` counts distinct values; `df["Sender"].unique()` lists them — useful for spotting inconsistencies.
2. `df["Sender"].replace(corrections)` takes a dictionary and swaps each key for its value. Assign the result back: `df["Sender"] = df["Sender"].replace(corrections)`.
3. `create_using=nx.DiGraph()` tells `from_pandas_edgelist` to build a directed graph — without it you get an undirected `Graph` by default.
4. Step 4's comparison is the payoff: without cleaning, `"V. Woolf"` and `"Virginia Woolf"` become two separate nodes with no edges between them, silently corrupting every centrality score.

#### Solution
```python
import pandas as pd
import networkx as nx

raw_data = {
    "Sender": [
        "Virginia Woolf", "Vita Sackville-West", "V. Woolf",
        "T.S. Eliot", "Virginia Woolf", "Lytton Strachey",
        "T. S. Eliot", "Lytton Strachey",
    ],
    "Recipient": [
        "Vita Sackville-West", "Virginia Woolf", "Lytton Strachey",
        "Ezra Pound", "T.S. Eliot", "Virginia Woolf",
        "Virginia Woolf", "T.S. Eliot",
    ],
    "Letters": [12, 15, 3, 8, 5, 9, 4, 6],
}

df = pd.DataFrame(raw_data)

print("Unique senders before cleaning:", df["Sender"].nunique())
print(sorted(df["Sender"].unique()))
print()

corrections = {"V. Woolf": "Virginia Woolf", "T. S. Eliot": "T.S. Eliot"}
df["Sender"] = df["Sender"].replace(corrections)

print("Unique senders after cleaning:", df["Sender"].nunique())
print()

G = nx.from_pandas_edgelist(
    df, source="Sender", target="Recipient",
    edge_attr="Letters", create_using=nx.DiGraph()
)

print(f"Nodes: {G.number_of_nodes()}")
print(f"Edges: {G.number_of_edges()}")
print()

raw_df = pd.DataFrame(raw_data)
G_dirty = nx.from_pandas_edgelist(
    raw_df, source="Sender", target="Recipient",
    edge_attr="Letters", create_using=nx.DiGraph()
)
print(f"Dirty graph nodes: {G_dirty.number_of_nodes()} (clean: {G.number_of_nodes()})")
print(f"Ghost nodes created by inconsistent names: "
      f"{G_dirty.number_of_nodes() - G.number_of_nodes()}")
```

### Challenge: Using Edge Attributes for Research

- id: network-analysis-06-c2
- language: python
- difficulty: intermediate

#### Starter Code
```python
import pandas as pd
import networkx as nx

# Extended Bloomsbury correspondence data with two metadata columns:
# Letters = total letters exchanged, Years = span of the correspondence
raw_data = {
    "Sender": [
        "Virginia Woolf", "Vita Sackville-West", "Virginia Woolf",
        "T.S. Eliot", "Lytton Strachey", "Lytton Strachey",
        "Virginia Woolf", "T.S. Eliot",
    ],
    "Recipient": [
        "Vita Sackville-West", "Virginia Woolf", "Lytton Strachey",
        "Ezra Pound", "Virginia Woolf", "T.S. Eliot",
        "T.S. Eliot", "Virginia Woolf",
    ],
    "Letters": [12, 15, 9, 8, 9, 6, 5, 4],
    "Years":   [10, 10, 8, 6, 8, 5, 4, 4],
}

df = pd.DataFrame(raw_data)

# Step 1: Build a DiGraph with BOTH metadata columns attached as edge attributes.
# Pass a list to edge_attr to load multiple columns at once.
G = nx.from_pandas_edgelist(
    df,
    source="Sender",
    target="Recipient",
    edge_attr=# Your code here — pass a list of both column names
    create_using=nx.DiGraph()
)

# Step 2: Access edge attributes directly.
# Print the Letters and Years for the Woolf → Sackville-West edge.
edge = G["Virginia Woolf"]["Vita Sackville-West"]
print(f"Woolf → Sackville-West: {edge['Letters']} letters over {edge['Years']} years")

print()

# Step 3: Find the most sustained correspondence — the edge with the highest
# "Years" attribute. Loop through G.edges(data=True), which yields
# (sender, recipient, attribute_dict) triples.
longest_sender    = ""
longest_recipient = ""
longest_years     = 0

for sender, recipient, attrs in G.edges(data=True):
    # Your code here
    pass

print(f"Longest correspondence: {longest_sender} → {longest_recipient} "
      f"({longest_years} years)")

print()

# Step 4: Calculate letters-per-year for every edge as a measure of intensity,
# and print the top 2 most intensive correspondences.
intensity = {}
for sender, recipient, attrs in G.edges(data=True):
    key   = f"{sender} → {recipient}"
    ratio = attrs["Letters"] / attrs["Years"]
    intensity[key] = round(ratio, 2)

top_2 = sorted(intensity.items(), key=lambda x: x[1], reverse=True)[:2]
print("Top 2 most intensive correspondences (letters/year):")
for pair, ratio in top_2:
    print(f"  {pair}: {ratio}")
```

#### Expected Output
```
Woolf → Sackville-West: 12 letters over 10 years

Longest correspondence: Virginia Woolf → Vita Sackville-West (10 years)

Top 2 most intensive correspondences (letters/year):
  Vita Sackville-West → Virginia Woolf: 1.5
  Virginia Woolf → Vita Sackville-West: 1.2
```

#### Hints

1. To attach multiple columns, pass a list: `edge_attr=["Letters", "Years"]`.
2. `G.edges(data=True)` yields `(u, v, dict)` triples — unpack as `for sender, recipient, attrs in ...` and access attributes with `attrs["Letters"]` etc.
3. For Step 3, the same `if value > current_best:` pattern from network-analysis-04 applies here, now checking `attrs["Years"]`.
4. Step 4's letters-per-year ratio is a genuine humanities metric — a correspondence with 15 letters over 10 years is less intensive than one with 8 letters over 4 years, even though the raw count is lower.

#### Solution
```python
import pandas as pd
import networkx as nx

raw_data = {
    "Sender": [
        "Virginia Woolf", "Vita Sackville-West", "Virginia Woolf",
        "T.S. Eliot", "Lytton Strachey", "Lytton Strachey",
        "Virginia Woolf", "T.S. Eliot",
    ],
    "Recipient": [
        "Vita Sackville-West", "Virginia Woolf", "Lytton Strachey",
        "Ezra Pound", "Virginia Woolf", "T.S. Eliot",
        "T.S. Eliot", "Virginia Woolf",
    ],
    "Letters": [12, 15, 9, 8, 9, 6, 5, 4],
    "Years":   [10, 10, 8, 6, 8, 5, 4, 4],
}

df = pd.DataFrame(raw_data)

# Step 1
G = nx.from_pandas_edgelist(
    df, source="Sender", target="Recipient",
    edge_attr=["Letters", "Years"],
    create_using=nx.DiGraph()
)

# Step 2
edge = G["Virginia Woolf"]["Vita Sackville-West"]
print(f"Woolf → Sackville-West: {edge['Letters']} letters over {edge['Years']} years")
print()

# Step 3
longest_sender = longest_recipient = ""
longest_years  = 0
for sender, recipient, attrs in G.edges(data=True):
    if attrs["Years"] > longest_years:
        longest_years     = attrs["Years"]
        longest_sender    = sender
        longest_recipient = recipient

print(f"Longest correspondence: {longest_sender} → {longest_recipient} "
      f"({longest_years} years)")
print()

# Step 4
intensity = {}
for sender, recipient, attrs in G.edges(data=True):
    key            = f"{sender} → {recipient}"
    intensity[key] = round(attrs["Letters"] / attrs["Years"], 2)

top_2 = sorted(intensity.items(), key=lambda x: x[1], reverse=True)[:2]
print("Top 2 most intensive correspondences (letters/year):")
for pair, ratio in top_2:
    print(f"  {pair}: {ratio}")
```