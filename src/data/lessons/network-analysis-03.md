---
id: network-analysis-03
title: Centrality Measures
moduleId: network-analysis
prerequisites:
  - network-analysis-02
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Explain the difference between Degree and Betweenness centrality
  - Calculate centrality metrics using NetworkX functions
  - Sort and filter centrality dictionaries to identify top influencers
  - Interpret centrality scores within a historical or literary context
keywords:
  - degree centrality
  - betweenness centrality
  - hubs
  - brokers
  - metrics
---

# Centrality: Mapping Power and Influence

  ## Analogy: The High School Cafeteria
  In a social network, who is the most "important" person? The answer depends on how you define importance:

  1.  **The Hub (Degree Centrality)**: This is the person sitting at a table with 20 people talking to them. They are the most "popular" or connected.
  2.  **The Broker (Betweenness Centrality)**: This is the person who sits between the "Theater Kids" and the "Athletes." They might only have two friends, but they are the only ones who can pass information from one group to the other.

  Both are powerful, but for different reasons.

  ---

  ## 1. Degree Centrality (Popularity)
  Degree centrality measures the fraction of nodes a specific node is connected to. 
  - **High Score**: Indicates a "Hub."
  - **DH Use Case**: Identifying the protagonist of a play by seeing who interacts with the most other characters.

  ```python
  # Returns a dictionary: {'Name': 0.85, ...}
  # Scores are "normalized" between 0.0 and 1.0
  degree_dict = nx.degree_centrality(G)
  ```

  ---

  ## 2. Betweenness Centrality (Gatekeeping)
  This measures how often a node acts as a bridge along the shortest path between other nodes.
  - **High Score**: Indicates a "Broker" or "Gatekeeper."
  - **DH Use Case**: Finding a mid-level diplomat in an archive who, despite not being famous, was the only person connecting two different royal courts.

  ```python
  # Measures who controls the "flow" of information
  betweenness_dict = nx.betweenness_centrality(G)
  ```

  ---

  ## 3. Interpreting the Math
  NetworkX normalizes these scores so they stay between **0 and 1**. 
  - A Degree Centrality of **1.0** means that node is connected to **every other node** in the network.
  - A score of **0.0** means the node is totally isolated.

  ---

  ## 4. Sorting the Results
  Because centrality functions return a dictionary, we usually need to sort them to find our "top" figures.

  ```python
  # Sort dictionary by value (item[1]) in descending order
  ranked = sorted(degree_dict.items(), key=lambda x: x[1], reverse=True)

  # Print the top person
  print(f"The Hub is {ranked[0][0]} with a score of {ranked[0][1]}")
  ```

  :::tip
  **Humanities Insight**: A character might have a very low word count in a novel but a very high **Betweenness Centrality**. This suggests they are a "messenger" or a "witness" who links disparate parts of the plot together.
  :::

  :::challenge
  In this challenge, you'll examine the structure of the graph to answer historical questions.
  :::

---challenges---

### Challenge: Identifying Hubs and Brokers in a Republic of Letters Network

- id: network-analysis-03-c1
- language: python
- difficulty: intermediate

#### Starter Code
```python
import networkx as nx

# A correspondence network among Enlightenment figures.
# Each edge represents an exchange of letters.
G = nx.Graph()
G.add_edges_from([
    ("Voltaire",    "Rousseau"),
    ("Voltaire",    "d'Alembert"),
    ("Voltaire",    "Hume"),
    ("Voltaire",    "Diderot"),
    ("Voltaire",    "Montesquieu"),
    ("d'Alembert",  "Diderot"),
    ("d'Alembert",  "Hume"),
    ("Diderot",     "Holbach"),
    ("Holbach",     "Hume"),
    ("Hume",        "Rousseau"),
    ("Rousseau",    "Condillac"),
    ("Condillac",   "Turgot"),
    ("Turgot",      "du_Chatelet"),
    ("du_Chatelet", "Maupertuis"),
])

# Step 1: Calculate BOTH degree centrality and betweenness centrality.
degree_scores      = # Your code here
betweenness_scores = # Your code here

# Step 2: Sort each dictionary by score (descending) and print the top 3
# for each measure. Format:
# "  1. <name>: <score>" rounded to 3 decimal places.

print("Top 3 by Degree Centrality (Hubs):")
degree_ranked = # Your code here — sort degree_scores
for i, (name, score) in enumerate(degree_ranked[:3]):
    print(f"  {i+1}. {name}: {score:.3f}")

print()

print("Top 3 by Betweenness Centrality (Brokers):")
betweenness_ranked = # Your code here — sort betweenness_scores
for i, (name, score) in enumerate(betweenness_ranked[:3]):
    print(f"  {i+1}. {name}: {score:.3f}")

print()

# Step 3: Find figures who rank in the TOP HALF of betweenness
# but the BOTTOM HALF of degree — these are the "hidden brokers":
# people who aren't popular but control the flow of information.
n = G.number_of_nodes()
median_degree      = sorted(degree_scores.values())[n // 2]
median_betweenness = sorted(betweenness_scores.values())[n // 2]

print("Hidden brokers (high betweenness, low degree):")
for name in G.nodes:
    if betweenness_scores[name] > median_betweenness and degree_scores[name] < median_degree:
        print(f"  {name} — degree: {degree_scores[name]:.3f}, "
              f"betweenness: {betweenness_scores[name]:.3f}")

print()

# Step 4: Voltaire dominates degree centrality. But is he also the
# top broker? Print a one-line comparison of his two scores and
# reflect in your notebook on what that combination tells you about his role.
v_deg = degree_scores["Voltaire"]
v_bet = betweenness_scores["Voltaire"]
print(f"Voltaire — degree: {v_deg:.3f}, betweenness: {v_bet:.3f}")

```

#### Expected Output
```
Top 3 by Degree Centrality (Hubs):
  1. Voltaire: 0.500
  2. Hume: 0.400
  3. Rousseau: 0.300

Top 3 by Betweenness Centrality (Brokers):
  1. Rousseau: 0.533
  2. Condillac: 0.467
  3. Voltaire: 0.374

Hidden brokers (high betweenness, low degree):

Voltaire — degree: 0.500, betweenness: 0.374
```

#### Hints

1. Both functions follow the same pattern: `nx.degree_centrality(G)` and `nx.betweenness_centrality(G)` each return a `{name: score}` dictionary.
2. To sort a dictionary: `sorted(scores.items(), key=lambda x: x[1], reverse=True)` returns a list of `(name, score)` tuples, highest first.
3. For Step 3, a figure is a hidden broker if their betweenness is *above* the median and their degree is *below* it — two independent threshold checks joined with `and`.
4. For Step 4, consider what it means that Voltaire ranks #1 in *both* measures — most scholars in this period were either hubs OR brokers, not both.

#### Solution
```python
import networkx as nx

G = nx.Graph()
G.add_edges_from([
    ("Voltaire",    "Rousseau"),
    ("Voltaire",    "d'Alembert"),
    ("Voltaire",    "Hume"),
    ("Voltaire",    "Diderot"),
    ("Voltaire",    "Montesquieu"),
    ("d'Alembert",  "Diderot"),
    ("d'Alembert",  "Hume"),
    ("Diderot",     "Holbach"),
    ("Holbach",     "Hume"),
    ("Hume",        "Rousseau"),
    ("Rousseau",    "Condillac"),
    ("Condillac",   "Turgot"),
    ("Turgot",      "du_Chatelet"),
    ("du_Chatelet", "Maupertuis"),
])

# Step 1
degree_scores      = nx.degree_centrality(G)
betweenness_scores = nx.betweenness_centrality(G)

# Step 2
print("Top 3 by Degree Centrality (Hubs):")
degree_ranked = sorted(degree_scores.items(), key=lambda x: x[1], reverse=True)
for i, (name, score) in enumerate(degree_ranked[:3]):
    print(f"  {i+1}. {name}: {score:.3f}")

print()

print("Top 3 by Betweenness Centrality (Brokers):")
betweenness_ranked = sorted(betweenness_scores.items(), key=lambda x: x[1], reverse=True)
for i, (name, score) in enumerate(betweenness_ranked[:3]):
    print(f"  {i+1}. {name}: {score:.3f}")

print()

# Step 3
n = G.number_of_nodes()
median_degree      = sorted(degree_scores.values())[n // 2]
median_betweenness = sorted(betweenness_scores.values())[n // 2]

print("Hidden brokers (high betweenness, low degree):")
for name in G.nodes:
    if betweenness_scores[name] > median_betweenness and degree_scores[name] < median_degree:
        print(f"  {name} — degree: {degree_scores[name]:.3f}, "
              f"betweenness: {betweenness_scores[name]:.3f}")

print()

# Step 4
v_deg = degree_scores["Voltaire"]
v_bet = betweenness_scores["Voltaire"]
print(f"Voltaire — degree: {v_deg:.3f}, betweenness: {v_bet:.3f}")
```
