---
id: critical-data-03
title: 'Feedback Loops: When Output Becomes Input'
moduleId: critical-data
prerequisites:
  - critical-data-02
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Explain how algorithmic feedback loops amplify small initial biases into large disparities
  - Simulate a multi-round feedback loop in Python using weighted random selection
  - Identify real-world examples of feedback loops in digital humanities and cultural data
keywords:
  - feedback loop
  - bias amplification
  - algorithmic bias
  - runaway effect
  - weighted selection
  - compounding bias
---

# Feedback Loops: When Output Becomes Input

## Analogy

Imagine a bookstore that tracks which books sell best and then gives those books more prominent shelf space. The prominently displayed books sell even better -- because customers see them first. Next month, the algorithm gives them still more space. Within a few cycles, a handful of bestsellers dominate the entire storefront, while equally worthy books gather dust in the back. The algorithm did not set out to silence those books. It simply treated its own output as trustworthy input, and a small initial advantage compounded into dominance.

This is a feedback loop: when a system's outputs are fed back as its inputs, small biases do not stay small. They grow.

## Key Concepts

### What Is a Feedback Loop?

:::definition
**Feedback loop**: A process in which the output of a system becomes part of its future input, causing effects to compound over time. In algorithmic systems, feedback loops can amplify small initial biases into large systematic distortions.
:::

In digital humanities, feedback loops appear whenever algorithmic results influence future data:

- A search engine that ranks frequently-clicked results higher causes those results to be clicked even more.
- A recommendation system that suggests popular texts makes those texts more popular, crowding out lesser-known works.
- A digitization priority list based on "research demand" favors already-digitized collections, because researchers can only request what they know exists.

### Simulating a Feedback Loop

We can model this with a simple simulation. Suppose we have two groups, A and B, where A starts with a slight majority (55% vs 45%). An algorithm selects items from this pool -- but it gives a small extra weight to whichever group is currently in the majority. Each round's output becomes the next round's input.

```python
import random

random.seed(27)

pool = ["A"] * 550 + ["B"] * 450
total = len(pool)

a_count = pool.count("A")
b_count = pool.count("B")
print(f"Start: A={a_count/total*100:.0f}%, B={b_count/total*100:.0f}%")

# One round of biased selection
weight_a = a_count * 1.15  # 15% bonus to majority
weight_b = b_count
pool = random.choices(["A", "B"], weights=[weight_a, weight_b], k=total)
a_count = pool.count("A")
b_count = pool.count("B")
print(f"After: A={a_count/total*100:.0f}%, B={b_count/total*100:.0f}%")
```

After just one round, Group A's advantage has grown. The 15% bonus does not look dramatic in a single iteration -- but watch what happens when we repeat the process.

### Why Small Biases Compound

The key insight is multiplicative amplification. Each round, the majority group's advantage is not just preserved -- it is multiplied. If Group A has 55% and receives a 15% weight bonus, it will likely end up with more than 55% after selection. In the next round, that higher percentage gets the bonus again. The gap widens not by a fixed amount but by an accelerating amount.

This is analogous to compound interest: a small rate applied repeatedly produces exponential growth. In bias terms, a 10-point gap can become a 40-point gap within a few cycles.

:::definition
**Bias amplification**: The process by which an initially small disparity grows larger through repeated application of a biased process. Even a "slight" algorithmic preference can produce dramatic disparities over multiple iterations.
:::

### The Real-World Stakes

Feedback loops are not hypothetical:

- **Predictive policing**: Algorithms that direct police to neighborhoods where past arrests were highest lead to more arrests in those neighborhoods, which "confirms" the algorithm's prediction, which sends even more police.
- **Search autocomplete**: Suggestions based on past searches reinforce stereotypical associations. If many users have searched biased phrases, the autocomplete presents those phrases to new users, who click on them, reinforcing the pattern.
- **Canon formation**: Digital archives that prioritize frequently-studied authors make those authors easier to study, which produces more scholarship on them, which makes them seem even more "canonical."

### Breaking the Loop

Recognizing a feedback loop is the first step to breaking it. Strategies include:

- **Diversification quotas**: Ensuring that selection algorithms reserve space for underrepresented items.
- **Decay weighting**: Reducing the influence of historical data over time so that past biases do not permanently determine future outcomes.
- **Audit rounds**: Periodically measuring representation (as we learned in the previous lesson) to detect amplification before it becomes extreme.

## Practice

:::try-it
Modify the simulation below to experiment with different bias levels. What happens if the weight bonus is 5% instead of 15%? What about 25%? How many rounds does it take for Group B to drop below 20% in each case? Try changing `random.seed()` to different values -- does the overall trend hold even when individual rounds vary?
:::

## Transfer

Consider a digital humanities project that involves ranking, recommendation, or selection:

- Does the system's output influence its future input in any way?
- Could a small initial imbalance in the training data compound over time?
- What would an "audit round" look like for your project -- how would you measure whether bias is amplifying?

The media scholar Safiya Umoja Noble documents how search engine feedback loops perpetuate racist and sexist representations. Her work reminds us that algorithms do not need malicious intent to produce harmful outcomes -- they only need to run in loops.

:::challenge
Simulate 5 rounds of biased selection where a majority group receives a 15% weight bonus each round. Print the percentages after each round, showing how the initial 55/45 split widens progressively.
:::

---challenges---

### Challenge: Simulate Bias Amplification

- id: critical-data-03-c1
- language: python
- difficulty: intermediate

#### Starter Code
```python
import random

random.seed(27)

# Initial pool: 55% Group A, 45% Group B (1000 items for stable percentages)
pool  = ["A"] * 550 + ["B"] * 450
total = len(pool)

print("=== Feedback Loop Simulation ===")
a_count = pool.count("A")
b_count = pool.count("B")
print(f"Round 0: A={a_count/total*100:.0f}%, B={b_count/total*100:.0f}%")

# Step 1: Simulate 5 rounds of biased selection.
# Each round:
#   1. Count current A and B in the pool.
#   2. Give whichever group is in the majority a 15% weight bonus.
#   3. Use random.choices() to create a new pool of 1000 items.
#   4. Print the new percentages.
# Assign the new pool back to `pool` so each round feeds the next.

for round_num in range(1, 6):
    # Your code here
    pass

initial_gap = 55 - 45
final_gap   = round(abs(a_count - b_count) / total * 100)
print("=== Result ===")
print(f"Initial gap: {initial_gap} percentage points")
print(f"Final gap:   {final_gap} percentage points")

print()

# Step 2: Run the same simulation with a SMALLER bias weight of 1.05 (5% bonus).
# Reset the pool and seed, then repeat the 5-round loop.
# Print the final gap for the 5% scenario so you can compare.

random.seed(27)
pool = ["A"] * 550 + ["B"] * 450

for round_num in range(1, 6):
    # Your code here — same structure, but use 1.05 instead of 1.15
    pass

gap_5pct = round(abs(a_count - b_count) / total * 100)
print(f"Final gap with 5% bias:  {gap_5pct} percentage points")
print(f"Final gap with 15% bias: {final_gap} percentage points")
print()

# Step 3: Reflect on what the comparison tells you once the simulation is run, and consider making a note that addresses these questions:
# A 5% weight bonus sounds modest. Does the final gap support that intuition?
# Then connect the simulation to ONE real-world example from the lesson's prose.

```

#### Expected Output
```
=== Feedback Loop Simulation ===
Round 0: A=55%, B=45%
Round 1: A=55%, B=45%
Round 2: A=58%, B=42%
Round 3: A=62%, B=38%
Round 4: A=62%, B=38%
Round 5: A=66%, B=34%
=== Result ===
Initial gap: 10 percentage points
Final gap:   32 percentage points

Final gap with 5% bias:  10 percentage points
Final gap with 15% bias: 32 percentage points
```

#### Hints

1. Inside each round, `pool.count("A")` gives the current count. Then: `weight_a = a_count * 1.15 if a_count >= b_count else a_count` and the reverse for B. Pass both weights to `random.choices(["A", "B"], weights=[weight_a, weight_b], k=1000)` and assign the result back to `pool`.
2. For Step 2, the structure is identical — only change `1.15` to `1.05`. Reset both `random.seed(27)` and `pool` before the second loop so the two simulations start from the same conditions.
3. For Step 3, the lesson gives three concrete examples (predictive policing, search autocomplete, canon formation via digitization). Pick the one that best fits the A/B majority-reinforcement model and explain the feedback mechanism specifically, not just the outcome.

#### Solution
```python
import random

random.seed(27)

pool  = ["A"] * 550 + ["B"] * 450
total = len(pool)

print("=== Feedback Loop Simulation ===")
a_count = pool.count("A")
b_count = pool.count("B")
print(f"Round 0: A={a_count/total*100:.0f}%, B={b_count/total*100:.0f}%")

for round_num in range(1, 6):
    a_count  = pool.count("A")
    b_count  = pool.count("B")
    weight_a = a_count * 1.15 if a_count >= b_count else a_count
    weight_b = b_count * 1.15 if b_count > a_count  else b_count
    pool     = random.choices(["A", "B"], weights=[weight_a, weight_b], k=1000)
    a_count  = pool.count("A")
    b_count  = pool.count("B")
    print(f"Round {round_num}: A={a_count/total*100:.0f}%, B={b_count/total*100:.0f}%")

initial_gap = 55 - 45
final_gap   = round(abs(a_count - b_count) / total * 100)
print("=== Result ===")
print(f"Initial gap: {initial_gap} percentage points")
print(f"Final gap:   {final_gap} percentage points")
print()

# Step 2: 5% bias
random.seed(27)
pool = ["A"] * 550 + ["B"] * 450

for round_num in range(1, 6):
    a_count  = pool.count("A")
    b_count  = pool.count("B")
    weight_a = a_count * 1.05 if a_count >= b_count else a_count
    weight_b = b_count * 1.05 if b_count > a_count  else b_count
    pool     = random.choices(["A", "B"], weights=[weight_a, weight_b], k=1000)
    a_count  = pool.count("A")
    b_count  = pool.count("B")

gap_5pct = round(abs(a_count - b_count) / total * 100)
print(f"Final gap with 5% bias:  {gap_5pct} percentage points")
print(f"Final gap with 15% bias: {final_gap} percentage points")
print()
```