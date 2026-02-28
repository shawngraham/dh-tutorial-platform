---
id: llm-04
title: 'Teaching Values: Reinforcement Learning from Human Feedback'
moduleId: llm-foundations
prerequisites:
  - llm-03
estimatedTimeMinutes: 10
difficulty: advanced
learningObjectives:
  - Explain the three stages of RLHF — supervised fine-tuning, reward modelling, RL optimisation
  - Describe how human preference data shapes a reward model
  - Identify key tensions in RLHF — reward hacking, whose preferences, and calibration
keywords:
  - rlhf
  - alignment
  - reward model
  - fine-tuning
  - reinforcement learning
  - human feedback
  - preference data
---

# Teaching Values: Reinforcement Learning from Human Feedback

## Analogy

Imagine training a new research assistant. First, you show them exemplary responses to typical requests. Then, whenever they produce multiple drafts, you choose the better one and explain why. Over time, the assistant internalises your preferences — not because they are written down as rules, but because their instincts have been shaped by thousands of your choices. **Reinforcement Learning from Human Feedback (RLHF)** is this process, applied to a language model. The "assistant" is a neural network and the "preferences" are encoded in a learned reward model.

## The Three Stages of RLHF

### Stage 1: Supervised Fine-Tuning (SFT)

A pre-trained language model — already trained on vast text to predict the next token — is fine-tuned on a dataset of high-quality (prompt, response) pairs, often written by human contractors. This shifts the model from *"continue the text"* to *"follow instructions."*

### Stage 2: Training a Reward Model

Human annotators are shown pairs of model responses to the same prompt and asked: *which is better?* These **preference pairs** train a separate neural network — the **Reward Model (RM)** — to predict which response humans prefer. The RM assigns a scalar score to any (prompt, response) pair.

:::definition
**Reward Model**: A neural network trained on human preference data to score how "good" a response is. It acts as a proxy for human judgment during the optimisation phase, allowing millions of model outputs to be evaluated without human involvement.
:::

### Stage 3: RL Optimisation (PPO)

The fine-tuned language model is treated as a **policy** in a reinforcement learning framework. It generates responses; the Reward Model scores them; those scores serve as the reward signal. The policy is optimised — using Proximal Policy Optimisation (PPO) or similar algorithms — to generate responses that score highly.

A critical constraint: a **KL-divergence penalty** prevents the model from drifting too far from the SFT baseline:

```
Objective = RewardModel(response) − β · KL(RL_policy ∥ SFT_policy)
```

Without this penalty, models can discover responses that *game* the reward model — producing text that scores highly without being genuinely helpful. This failure mode is called **reward hacking**.

## A Diagram of the Process

```diagram
Pre-trained LM
      │
      ▼
[Stage 1] Supervised Fine-Tuning on (prompt, response) pairs
      │
      ▼
SFT Model  ──────────────────────────────┐
      │                                  │
      ▼                                  │
Generate multiple responses              │
      │                                  │
      ▼                                  │
[Stage 2] Human annotators rank responses│
      │                                  │
      ▼                                  │
Train Reward Model on preferences        │
      │                                  │
      ▼                                  │
[Stage 3] RL loop: generate → score → update policy
      │       (KL penalty vs. SFT model ─┘)
      ▼
RLHF-aligned Model
```

## What RLHF Can and Cannot Do

**RLHF can:**
- Improve instruction-following and helpfulness
- Reduce overtly harmful outputs
- Shape tone, format, and conversational style

**RLHF cannot:**
- Fix factual errors baked into pre-training weights
- Guarantee honesty — the model learns to *sound* calibrated, not to *be* calibrated
- Eliminate biases encoded in the preference data itself

:::try-it
Consider this scenario: annotators are instructed to prefer "confident, direct answers." A response that says "I am uncertain, but..." might be penalised relative to one that confidently states a wrong fact. How would this shape the reward model? What does this imply about confident-sounding LLM outputs?
:::

## Whose Values? The Politics of Preference Data

RLHF assumes that human preferences can be aggregated into a single reward signal. But whose preferences? Annotators are typically a small, non-representative sample, often recruited through crowdsourcing platforms. Their choices encode cultural assumptions, political positions, and aesthetic preferences — then those choices are applied to models used by millions across very different contexts. See especially the work of Timnit Gebru and Émile P. Torres too on the intellectual foundations of this broader 'industry' (as distinct from the narrow technical work).

Alternative approaches are emerging:

- **Constitutional AI** (Anthropic) — the model critiques and revises its own outputs against an explicit set of principles
- **Direct Preference Optimisation (DPO)** — fine-tunes directly on preference pairs without a separate reward model
- **Debate-based alignment** — models argue for positions and a judge (human or AI) evaluates the arguments

Each approach makes different trade-offs between transparency, scalability, and whose values get operationalised.

## Transfer

When you interact with a large language model, you are not simply querying a statistical text predictor. You are interacting with a system shaped by thousands of human preference judgments made in a specific cultural, institutional, and temporal context. Understanding RLHF lets you ask: *Whose preferences were operationalised here? What did the annotators reward? What was systematically discouraged?* These are fundamentally humanistic questions about how values get embedded in technical systems.

:::challenge
Write the reward function that adjusts 'refusal' answers.
:::

---challenges---

### Challenge: Simulate a Reward Model

- id: llm-04-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
def reward_score(response):
    """
    A toy reward function that scores responses based on:
      + 0.1 per word (up to 20 words)
      + 1.0 for citing a source with [Source]
      - 2.0 for refusal language ("I cannot")
    """
    score = 0.0
    word_count = len(response.split())
    score += min(word_count, 20) * 0.1
    if "[Source]" in response:
        score += 1.0
    
    # YOUR CODE HERE: 
    # Subtract 2.0 from score if "I cannot" appears in response
    # ---------------------------------------------------------
    
    # ---------------------------------------------------------
    return score

responses = [
    "The Battle of Hastings occurred in 1066. [Source]", 
    "I cannot answer that specific request, but history says the battle was in 1066. [Source]",
    "It happened long ago.",
    "The Norman conquest began with the Battle of Hastings in 1066, reshaping English culture. [Source]",
]

scored = [(reward_score(r), r) for r in responses]
best_score, best_response = max(scored, key=lambda x: x[0])
print(f"Best Response: {best_response}")
print(f"Score: {best_score:.2f}")
```

#### Expected Output

```
The Norman conquest began with the Battle of Hastings in 1066, reshaping English language and culture. [Source]
```

#### Hints

1. An `if` statement checking `"I cannot" in response` is all you need.
2. Inside that block, write `score -= 2.0`.
3. The longest response with a source citation will score highest.

#### Solution

```python
def reward_score(response):
    score = 0.0
    word_count = len(response.split())
    score += min(word_count, 20) * 0.1
    if "[Source]" in response:
        score += 1.0
    if "I cannot" in response:
        score -= 2.0
    return score

responses = [
    "The Battle of Hastings occurred in 1066. [Source]", 
    "I cannot answer that specific request, but history says the battle was in 1066. [Source]",
    "It happened long ago.",
    "The Norman conquest began with the Battle of Hastings in 1066, reshaping English culture. [Source]",
]

scored = [(reward_score(r), r) for r in responses]
best_score, best_response = max(scored, key=lambda x: x[0])
print(best_response)
```
