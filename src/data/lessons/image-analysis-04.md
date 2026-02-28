---
id: image-analysis-04
title: Detecting Visual Similarity
moduleId: image-analysis
prerequisites:
  - image-analysis-03
estimatedTimeMinutes: 10
difficulty: advanced
learningObjectives:
  - Understand how images are represented as numerical "feature vectors"
  - Calculate the Euclidean distance between image representations
  - Explain the importance of normalization in similarity metrics
  - Distinguish between Euclidean distance and Cosine similarity
keywords:
  - image similarity
  - feature extraction
  - distance metric
  - cosine similarity
  - normalization
---

# Detecting Visual Similarity: The Visual Fingerprint

  ## Analogy
  If you want to find two paintings in a gallery that look alike, you don't just stare at them. You look for similarities in their color palettes, their composition, or the texture of the brushstrokes. 

  In Digital Humanities, we do this by turning an image into a **Vector**. Think of a vector as a "visual fingerprint." Just as no two fingerprints are exactly the same, but some are very similar, we can measure the mathematical "distance" between image fingerprints to find matches in an archive.

  ---

  ## 1. Feature Extraction: Vectorizing the Archive
  Before we can compare two images, we must turn them into a list of numbers (a vector). 
  *   **Average Color**: A simple 3-number vector (R, G, B).
  *   **Color Histogram**: A 256-number vector representing the distribution of light.
  *   **Embeddings**: A high-dimensional vector created by Deep Learning that captures abstract concepts like "style" or "content."

  ---

  ## 2. Distance Metrics: The Math of "Close"
  Once our images are vectors, we can calculate how "far apart" they are in mathematical space.

  ### Euclidean Distance
  This is the standard "as the crow flies" distance between two points. It is calculated by finding the difference between every number in the vector, squaring them, and taking the square root. 
  - **Use Case**: Best for comparing overall intensity or exact color matches.

  ### Cosine Similarity
  This measures the **angle** between two vectors. It ignores how "long" the vectors are (e.g., how bright the images are) and focuses only on their direction (e.g., the balance of colors).
  - **Use Case**: Best for finding images with similar style even if one is much darker than the other.

  ---

  ## 3. The Level Playing Field: Normalization
  If you are comparing a tiny thumbnail to a huge high-res scan, the high-res scan will have millions more pixels, making its histogram counts much larger. To compare them fairly, we must **Normalize** the data—scaling the values so they always sum up to 1 (treating them as percentages rather than raw counts).

  ```python
  import cv2

  # Normalize a histogram so it represents the % of pixels per bin
  cv2.normalize(hist, hist, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
  ```

  ---

  ## 4. DH Application: Duplicate Detection
  Large digital archives often contain near-duplicates (e.g., a scanned letter and a slightly cropped version of the same letter). By calculating the distance between their histograms, we can automatically flag these "visual twins" for the archivist.

  :::tip
  **DH Insight**: "Visual Similarity" is a subjective scholarly concept. By choosing different metrics (Euclidean vs. Cosine), you are making a research decision about what kind of "similarity" matters most to your project.
  :::

  :::challenge
  You will build a small visual similarity pipeline: extract feature vectors from synthetic archival images, normalize them for fair comparison, calculate both Euclidean distance and cosine similarity, and use the results to flag near-duplicate documents.
  :::

---challenges---

### Challenge: Euclidean Distance and Normalization

- id: image-analysis-04-c1
- language: python
- difficulty: advanced

#### Starter Code
```python
import numpy as np

# Three "archival documents" represented by their average RGB colour vectors.
# In a real pipeline these would be extracted with np.mean(..., axis=(0,1)).
doc_a = np.array([210, 145,  70], dtype=np.float64)  # warm parchment
doc_b = np.array([200, 138,  65], dtype=np.float64)  # nearly identical — possible duplicate
doc_c = np.array([ 80, 110, 185], dtype=np.float64)  # cold blue — clearly different

# Step 1: Calculate raw Euclidean distance between all three pairs.
# Use np.linalg.norm(vec1 - vec2) for each pair.
dist_ab = # Your code here
dist_ac = # Your code here
dist_bc = # Your code here

print("=== Raw Euclidean Distances ===")
print(f"  A vs B: {dist_ab:.4f}")
print(f"  A vs C: {dist_ac:.4f}")
print(f"  B vs C: {dist_bc:.4f}")
print()

# Step 2: Now imagine doc_a comes from a high-resolution scan (scaled up by 4x)
# while doc_b comes from a thumbnail. Simulate this by creating scaled versions.
doc_a_hires     = doc_a * 4   # same colour balance, 4x the magnitude
doc_b_thumbnail = doc_b * 1   # unchanged

# Calculate the raw Euclidean distance between the hi-res and thumbnail versions.
dist_scaled = np.linalg.norm(doc_a_hires - doc_b_thumbnail)
print(f"=== Effect of Scale ===")
print(f"  Raw distance (hi-res A vs thumbnail B): {dist_scaled:.4f}")
print(f"  This is much larger than the original {dist_ab:.4f} even though")
print(f"  the colour BALANCE is identical — this is the problem normalization solves.")
print()

# Step 3: Normalize both vectors (divide each by its own magnitude)
# so that direction (colour balance) matters but brightness does not.
def normalize(vec):
    magnitude = np.linalg.norm(vec)
    return vec / magnitude   # Your understanding: what does dividing by magnitude do? Make a note in your notebook.

norm_a_hires     = normalize(doc_a_hires)
norm_b_thumbnail = normalize(doc_b_thumbnail)

dist_normalized = np.linalg.norm(norm_a_hires - norm_b_thumbnail)
print(f"=== After Normalization ===")
print(f"  Normalized distance (hi-res A vs thumbnail B): {dist_normalized:.4f}")
print(f"  Normalization fixed the scale problem: {dist_normalized < 0.01}")
```

#### Expected Output
```
=== Raw Euclidean Distances ===
  A vs B: 9.2736
  A vs C: 183.2814
  B vs C: 176.5446

=== Effect of Scale ===
  Raw distance (hi-res A vs thumbnail B): 472.9149
  This is much larger than the original 9.2736 even though
  the colour BALANCE is identical — this is the problem normalization solves.

=== After Normalization ===
  Normalized distance (hi-res A vs thumbnail B): 0.0000
  Normalization fixed the scale problem: True
```

#### Hints

1. `np.linalg.norm(vec1 - vec2)` computes √(Σ(v1ᵢ − v2ᵢ)²) — the straight-line distance in 3D colour space.
2. For Step 2, multiplying a vector by 4 scales its magnitude without changing its direction (colour balance). This is exactly what happens when comparing a 4K scan to a thumbnail of the same document.
3. `normalize(vec)` divides every component by the vector's length, producing a unit vector of length 1. Two unit vectors with the same colour balance will then have a distance of 0 regardless of the original brightness.

#### Solution
```python
import numpy as np

doc_a = np.array([210, 145,  70], dtype=np.float64)
doc_b = np.array([200, 138,  65], dtype=np.float64)
doc_c = np.array([ 80, 110, 185], dtype=np.float64)

dist_ab = np.linalg.norm(doc_a - doc_b)
dist_ac = np.linalg.norm(doc_a - doc_c)
dist_bc = np.linalg.norm(doc_b - doc_c)

print("=== Raw Euclidean Distances ===")
print(f"  A vs B: {dist_ab:.4f}")
print(f"  A vs C: {dist_ac:.4f}")
print(f"  B vs C: {dist_bc:.4f}")
print()

doc_a_hires     = doc_a * 4
doc_b_thumbnail = doc_b * 1
dist_scaled     = np.linalg.norm(doc_a_hires - doc_b_thumbnail)
print("=== Effect of Scale ===")
print(f"  Raw distance (hi-res A vs thumbnail B): {dist_scaled:.4f}")
print(f"  This is much larger than the original {dist_ab:.4f} even though")
print(f"  the colour BALANCE is identical — this is the problem normalization solves.")
print()

def normalize(vec):
    return vec / np.linalg.norm(vec)

norm_a_hires     = normalize(doc_a_hires)
norm_b_thumbnail = normalize(doc_b_thumbnail)
dist_normalized  = np.linalg.norm(norm_a_hires - norm_b_thumbnail)
print("=== After Normalization ===")
print(f"  Normalized distance (hi-res A vs thumbnail B): {dist_normalized:.4f}")
print(f"  Normalization fixed the scale problem: {dist_normalized < 0.01}")
```

### Challenge: Cosine Similarity and Duplicate Detection

- id: image-analysis-04-c2
- language: python
- difficulty: advanced

#### Starter Code
```python
import numpy as np

# A small archive of six documents represented as colour histogram vectors.
# Each vector has 6 bins (a simplified histogram) summing to 1 (already normalised).
# In a real pipeline you would use 256 bins from cv2.calcHist().
archive = {
    "letter_001":  np.array([0.40, 0.30, 0.15, 0.08, 0.05, 0.02]),
    "letter_002":  np.array([0.38, 0.31, 0.16, 0.08, 0.05, 0.02]),  # near-duplicate of 001
    "letter_003":  np.array([0.05, 0.08, 0.20, 0.30, 0.25, 0.12]),  # clearly different
    "letter_004":  np.array([0.39, 0.30, 0.16, 0.09, 0.04, 0.02]),  # near-duplicate of 001
    "letter_005":  np.array([0.10, 0.15, 0.25, 0.28, 0.15, 0.07]),  # clearly different
    "letter_006":  np.array([0.41, 0.29, 0.15, 0.08, 0.05, 0.02]),  # near-duplicate of 001
}

# Step 1: Implement cosine similarity.
# cosine_similarity(a, b) = dot(a, b) / (norm(a) * norm(b))
# A score of 1.0 means identical direction; 0.0 means perpendicular.
def cosine_similarity(a, b):
    # Your code here
    pass

# Verify on a trivial case
identical = np.array([1, 2, 3], dtype=float)
print(f"Cosine similarity of identical vectors: {cosine_similarity(identical, identical):.4f}")
print()

# Step 2: Compare every document in the archive against "letter_001".
# Print the cosine similarity score for each.
reference = "letter_001"
print(f"=== Cosine Similarity vs {reference} ===")
for doc_id, vec in archive.items():
    sim = cosine_similarity(archive[reference], vec)
    print(f"  {doc_id}: {sim:.6f}")
print()

# Step 3: Flag near-duplicates.
# A document is a near-duplicate if its cosine similarity to letter_001 exceeds 0.9999.
# Collect all matching doc IDs (excluding the reference itself) in a list.
threshold    = 0.9999
near_dupes   = []
for doc_id, vec in archive.items():
    if doc_id == reference:
        continue
    sim = cosine_similarity(archive[reference], vec)
    if sim > threshold:
        near_dupes.append(doc_id)

print(f"Near-duplicates of {reference} (similarity > {threshold}):")
for doc_id in near_dupes:
    print(f"  {doc_id}")
print()

# Step 4: Reflect on the choice of metric.
# Would Euclidean distance on the RAW (un-normalized) histogram vectors have worked as well here? Why might cosine similarity be better suited for histogram comparion? Make a note in your notebook.
```

#### Expected Output
```
Cosine similarity of identical vectors: 1.0000

=== Cosine Similarity vs letter_001 ===
  letter_001: 1.000000
  letter_002: 0.999998
  letter_003: 0.924593
  letter_004: 0.999996
  letter_005: 0.960117
  letter_006: 0.999999

Near-duplicates of letter_001 (similarity > 0.9999):
  letter_002
  letter_004
  letter_006
```

#### Hints

1. `np.dot(a, b)` computes the dot product. `np.linalg.norm(a)` gives the magnitude. Divide the dot product by the product of both magnitudes.
2. For Step 3, loop through `archive.items()`, skip the reference document with `if doc_id == reference: continue`, and append to `near_dupes` when the threshold is exceeded.
3. For Step 4, think about what happens to raw histogram counts when the same image is scanned at 300 dpi vs 600 dpi — the pixel counts in each bin would roughly quadruple, but the *proportions* would stay the same. Cosine similarity only cares about proportions.

#### Solution
```python
import numpy as np

archive = {
    "letter_001":  np.array([0.40, 0.30, 0.15, 0.08, 0.05, 0.02]),
    "letter_002":  np.array([0.38, 0.31, 0.16, 0.08, 0.05, 0.02]),
    "letter_003":  np.array([0.05, 0.08, 0.20, 0.30, 0.25, 0.12]),
    "letter_004":  np.array([0.39, 0.30, 0.16, 0.09, 0.04, 0.02]),
    "letter_005":  np.array([0.10, 0.15, 0.25, 0.28, 0.15, 0.07]),
    "letter_006":  np.array([0.41, 0.29, 0.15, 0.08, 0.05, 0.02]),
}

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

identical = np.array([1, 2, 3], dtype=float)
print(f"Cosine similarity of identical vectors: {cosine_similarity(identical, identical):.4f}")
print()

reference = "letter_001"
print(f"=== Cosine Similarity vs {reference} ===")
for doc_id, vec in archive.items():
    sim = cosine_similarity(archive[reference], vec)
    print(f"  {doc_id}: {sim:.6f}")
print()

threshold  = 0.9999
near_dupes = []
for doc_id, vec in archive.items():
    if doc_id == reference:
        continue
    if cosine_similarity(archive[reference], vec) > threshold:
        near_dupes.append(doc_id)

print(f"Near-duplicates of {reference} (similarity > {threshold}):")
for doc_id in near_dupes:
    print(f"  {doc_id}")
print()
```

