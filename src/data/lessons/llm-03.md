---
id: llm-03
title: 'Memory in Motion: Building a Toy Recurrent Network'
moduleId: llm-foundations
prerequisites:
  - llm-02
estimatedTimeMinutes: 10
difficulty: advanced
learningObjectives:
  - Explain how a recurrent network maintains hidden state across time steps
  - Implement a single RNN cell update in pure Python
  - Describe why LSTMs were developed to address the vanishing gradient problem
keywords:
  - rnn
  - lstm
  - recurrent neural network
  - hidden state
  - vanishing gradient
  - sequence modeling
  - tanh
---

# Memory in Motion: Building a Toy Recurrent Network

## Analogy

Imagine reading a mystery novel. As each new sentence arrives, you update your mental model: new suspects, new clues, shifting alibis. You do not restart from scratch with each sentence — you carry forward a *compressed summary* of everything read so far. A **Recurrent Neural Network (RNN)** does exactly this, maintaining a **hidden state** vector that is updated at every time step.

## What Is an RNN?

A standard feedforward neural network takes a fixed-size input and produces an output. An RNN processes a *sequence* one element at a time, carrying a hidden state forward:

```
h_t = tanh( W_h · h_{t-1}  +  W_x · x_t  +  b )
```

Where:
- **x_t** is the input at time step t (e.g., a word embedding)
- **h_{t-1}** is the hidden state from the previous step — the network's "memory"
- **W_h**, **W_x** are learned weight matrices
- **b** is a bias vector
- **tanh** squashes the result into the range (−1, 1), keeping values bounded

:::definition
**Hidden State**: A vector that summarises what the RNN has processed so far. It is updated at every time step and passed forward to the next, carrying information through the sequence.
:::

## Implementing One RNN Cell

Here is a complete, minimal RNN in pure Python. The weight matrices are tiny (2×2) to keep the arithmetic readable. In a real language model they would be thousands of dimensions wide.

```python
import math

def tanh_scalar(v):
    """Hyperbolic tangent for a single number."""
    return (math.exp(v) - math.exp(-v)) / (math.exp(v) + math.exp(-v))

def mat_vec(W, x):
    """Multiply matrix W (list of rows) by vector x."""
    return [sum(W[i][j] * x[j] for j in range(len(x))) for i in range(len(W))]

def vec_add(a, b):
    return [a[i] + b[i] for i in range(len(a))]

# Weight matrices and bias — normally learned by backpropagation
W_h = [[0.5, 0.1], [0.1, 0.5]]   # hidden-to-hidden connections
W_x = [[0.8, 0.0], [0.0, 0.8]]   # input-to-hidden connections
b   = [0.0, 0.0]

def rnn_step(h_prev, x_t):
    """One RNN time step: blend previous memory with new input."""
    pre_activation = vec_add(vec_add(mat_vec(W_h, h_prev), mat_vec(W_x, x_t)), b)
    return [tanh_scalar(v) for v in pre_activation]

# Process a tiny sequence of 3 two-dimensional input vectors
# Imagine these represent embeddings for three successive words
inputs = [
    [1.0, 0.0],   # word 1
    [0.0, 1.0],   # word 2
    [0.5, 0.5],   # word 3
]

h = [0.0, 0.0]  # initial hidden state: all zeros

for t, x in enumerate(inputs):
    h = rnn_step(h, x)
    print(f"Step {t+1}: h = [{h[0]:.4f}, {h[1]:.4f}]")
```

:::try-it
Change the input at step 2 from `[0.0, 1.0]` to `[1.0, 0.0]` and observe how the final hidden state changes. Notice that each step's output depends on *all previous steps* — that is the essence of recurrence. The hidden state after step 3 encodes, however imperfectly, the entire sequence.
:::

## The Vanishing Gradient Problem

Plain RNNs struggle with long sequences. During training, the signals used to update weights — **gradients** — must flow backwards through every time step. When multiplied together across many steps, small gradients shrink toward zero (*vanishing*) or large gradients explode. In practice, an RNN trained on 500-word documents mostly "forgets" what happened in word 1 by the time it processes word 500.

This is why RNNs were rarely competitive on tasks requiring long-range context.

## Enter the LSTM

The **Long Short-Term Memory (LSTM)** network, introduced by Hochreiter & Schmidhuber in 1997, addressed this with a *cell state* — a separate conveyor belt of memory that flows through the sequence with only minor, multiplicative modifications. Three learned **gates** control access to this memory:

| Gate | Question it learns to answer |
|------|------------------------------|
| **Forget gate** | Should I erase part of my memory? |
| **Input gate** | How much of this new input should I store? |
| **Output gate** | What part of memory should influence this step's output? |

Gates use **sigmoid** activations (output range 0–1) to act as soft on/off switches. Because the cell state can flow through many steps with gradient-preserving additions rather than multiplications, LSTMs can learn dependencies spanning hundreds of time steps.

LSTMs were the dominant sequence model from roughly 2014–2017 — powering machine translation, speech recognition, and early language models — before being largely superseded by the Transformer's parallel attention mechanism.

## Why This History Matters

Understanding RNNs and LSTMs explains *why* Transformers were such a breakthrough. The Transformer replaced sequential hidden-state recurrence with parallel self-attention, meaning an entire sequence could be processed simultaneously and each position could directly attend to any other position. This unlocked the ability to train on far more data and to scale to billions of parameters.

:::challenge
To make the concept of a Recurrent Neural Network (RNN) accessible, this challenge focuses on the **Hidden State**. In an RNN, the "Hidden State" is the model's memory. As the model reads a sequence of words, it updates this memory at every step. The current memory is always a combination of the **new input** and the **previous memory**. In the second challenge you will see some rather complex math. You are trying to complete the RNN step; it's ok to just reveal the code to see what's happening.
:::

---challenges---

### Challenge: The Memory Loop (Toy RNN)

- id: llm-03-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
# A toy RNN updates its 'hidden_state' (memory) word by word.
# We will model a sequence of words and track the "running sentiment."

sequence = ["hopeful", "inspiring", "victory"]
word_impact = {"hopeful": 0.5, "inspiring": 0.8, "victory": 1.2}

# In an RNN, the hidden state usually starts at 0.0
hidden_state = 0.0

print("Initial Hidden State:", hidden_state)

for word in sequence:
    # Get the value for the current word
    current_input = word_impact[word]
    
    # Your code here: Update the hidden_state.
    # It should be the SUM of the previous hidden_state and the current_input.
    hidden_state = 
    
    print(f"Read '{word}': New Hidden State is {hidden_state:.1f}")

# Your code here: print the final value of the hidden state
print("Final Memory Score:", )
```

#### Expected Output

```
Initial Hidden State: 0.0
Read 'hopeful': New Hidden State is 0.5
Read 'inspiring': New Hidden State is 1.3
Read 'victory': New Hidden State is 2.5
Final Memory Score: 2.5
```

#### Hints

1. To update the state, you need to re-assign the variable: `hidden_state = hidden_state + current_input`.
2. This loop simulates how an RNN "accumulates" information over time. By the time it reaches "victory," the hidden state contains the sum total of all previous words.
3. In a real RNN, this math involves matrices and activation functions (like `tanh`), but the core logic—**New State = Old State + Input**—remains the same.

#### Solution

```python
sequence = ["hopeful", "inspiring", "victory"]
word_impact = {"hopeful": 0.5, "inspiring": 0.8, "victory": 1.2}

hidden_state = 0.0

print("Initial Hidden State:", hidden_state)

for word in sequence:
    current_input = word_impact[word]
    
    # Update the hidden_state by adding the current input to the previous state
    hidden_state = hidden_state + current_input
    
    print(f"Read '{word}': New Hidden State is {hidden_state:.1f}")

print("Final Memory Score:", hidden_state)
```

### Challenge: The Sustainable Memory

- id: llm-04-c2
- language: python
- difficulty: beginner/intermediate

#### Starter Code

```python
# A toy RNN needs two things to stay "stable":
# 1. Weights: To decide how much of the old memory to keep.
# 2. Squashing: To keep the memory from growing too large.

sequence = [1.0, 2.0, 1.5] # New information at each step

# Parameters (The "Weights" the model would normally learn)
persistence = 0.5  # Keep 50% of the old memory
input_weight = 0.8 # Focus on 80% of the new input

hidden_state = 0.0

def squash(value):
    """A toy activation function that keeps values between -2.0 and 2.0"""
    return max(-2.0, min(2.0, value))

for val in sequence:
    # Your code here: Update the hidden_state.
    # 1. Multiply the old hidden_state by the 'persistence' factor.
    # 2. Multiply the current 'val' by the 'input_weight'.
    # 3. Add them together and pass the result into the squash() function.
    
    hidden_state = 
    
    print(f"Input: {val} -> Memory: {hidden_state:.2f}")

print("Final Sustainable Memory:", hidden_state)
```

#### Expected Output

```
Input: 1.0 -> Memory: 0.80
Input: 2.0 -> Memory: 2.00
Input: 1.5 -> Memory: 2.00
Final Sustainable Memory: 2.0
```

#### Hints

1. **The Formula**: Your update should look like: `squash( (old_state * weight) + (new_input * weight) )`.
2. **The "Squash"**: Without the `squash()` function, the memory would keep growing. In real AI, we use functions like `tanh` to do this automatically.
3. **Persistence**: By multiplying the `hidden_state` by 0.5, the model "forgets" half of its past at every step. This prevents the memory from becoming "saturated" with old data.

#### Solution

```python
sequence = [1.0, 2.0, 1.5]
persistence = 0.5
input_weight = 0.8
hidden_state = 0.0

def squash(value):
    return max(-2.0, min(2.0, value))

for val in sequence:
    # Calculate weighted parts
    weighted_memory = hidden_state * persistence
    weighted_input = val * input_weight
    
    # Update and squash
    hidden_state = squash(weighted_memory + weighted_input)
    
    print(f"Input: {val} -> Memory: {hidden_state:.2f}")

print("Final Sustainable Memory:", hidden_state)
```
### Challenge: Complete the RNN Step

- id: llm-03-c3
- language: python
- difficulty: advanced

#### Starter Code

```python
import math

def tanh_scalar(v):
    return (math.exp(v) - math.exp(-v)) / (math.exp(v) + math.exp(-v))

def rnn_step(h_prev, x_t, W_h, W_x, b):
    size = len(h_prev)
    h_new = []
    for i in range(size):
        # Weighted contribution from the previous hidden state
        from_hidden = sum(W_h[i][j] * h_prev[j] for j in range(size))
        # Weighted contribution from the current input
        from_input  = sum(W_x[i][j] * x_t[j]  for j in range(size))
        raw = from_hidden + from_input + b[i]
        # Your code here: apply tanh_scalar to raw and append the result to h_new

    return h_new

# W_h = zero matrix: previous hidden state has no influence
W_h = [[0.0, 0.0], [0.0, 0.0]]
# W_x = identity matrix: input passes through unchanged before tanh
W_x = [[1.0, 0.0], [0.0, 1.0]]
b   = [0.0, 0.0]

h0 = [0.0, 0.0]
x  = [0.5, -0.5]

h1 = rnn_step(h0, x, W_h, W_x, b)
print(f"{h1[0]:.4f}")
print(f"{h1[1]:.4f}")
```

#### Expected Output

```
0.4621
-0.4621
```

#### Hints

1. `h_new.append(tanh_scalar(raw))` is the one line you need inside the loop.
2. With W_h all zeros the hidden-to-hidden term vanishes; with W_x as identity, `raw = x_t[i] + b[i]`.
3. `tanh(0.5) ≈ 0.4621` and `tanh(-0.5) ≈ -0.4621`.

#### Solution

```python
import math

def tanh_scalar(v):
    return (math.exp(v) - math.exp(-v)) / (math.exp(v) + math.exp(-v))

def rnn_step(h_prev, x_t, W_h, W_x, b):
    size = len(h_prev)
    h_new = []
    for i in range(size):
        from_hidden = sum(W_h[i][j] * h_prev[j] for j in range(size))
        from_input  = sum(W_x[i][j] * x_t[j]  for j in range(size))
        raw = from_hidden + from_input + b[i]
        h_new.append(tanh_scalar(raw))
    return h_new

W_h = [[0.0, 0.0], [0.0, 0.0]]
W_x = [[1.0, 0.0], [0.0, 1.0]]
b   = [0.0, 0.0]

h0 = [0.0, 0.0]
x  = [0.5, -0.5]

h1 = rnn_step(h0, x, W_h, W_x, b)
print(f"{h1[0]:.4f}")
print(f"{h1[1]:.4f}")
```
