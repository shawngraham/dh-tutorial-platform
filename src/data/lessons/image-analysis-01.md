---
id: image-analysis-01
title: Pixels as Data
moduleId: image-analysis
prerequisites:
  - python-basics-05
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Understand that digital images are structured grids of pixels
  - Explain the RGB color model and the 0-255 intensity range
  - Access and modify pixel data using NumPy array indexing
  - Identify the "shape" of image data (Height, Width, Channels)
keywords:
  - pixels
  - rgb
  - numpy
  - image data
  - distant viewing
---

# Pixels as Data

  ## The Digital Mosaic
  Think of a digital image like a giant, extremely detailed mosaic. Each tiny tile in the mosaic is a **pixel** (short for "picture element"). In Digital Humanities, we use **Computer Vision** to analyze thousands of these "mosaics" at once—detecting patterns in historical photography, analyzing color trends in cinema, or identifying features in digitized manuscripts.

  ---

  ## 1. The Pixel Grid
  Every image is a matrix (a grid) with a specific height and width.
  *   **Resolution**: An image that is 800 pixels wide and 600 pixels high contains 480,000 individual tiles.
  *   **Coordinate System**: In Python, we count from the top-left corner. The pixel at `[0, 0]` is the very first pixel in the top-left.

  ---

  ## 2. Color Representation (RGB)
  Most digital images use the **RGB** color model. Every single pixel is actually composed of three values representing the intensity of **Red, Green, and Blue** light.

  Values typically range from **0 (black/no intensity)** to **255 (full intensity)**. This is because 256 levels fit perfectly into one "byte" of computer memory (`uint8`).

  | Color | RGB Value |
  | :--- | :--- |
  | **Pure Red** | `(255, 0, 0)` |
  | **Pure White** | `(255, 255, 255)` |
  | **Pure Black** | `(0, 0, 0)` |
  | **Yellow** | `(255, 255, 0)` (Red + Green) |

  ---

  ## 3. NumPy: The Image Engine
  In Python, we use the **NumPy** library to handle images. An image is stored as a 3D array with the shape: **(Height, Width, Channels)**.

  ```python
  import numpy as np

  # Create a tiny 2x2 black image
  # dtype=np.uint8 ensures values stay between 0-255
  image = np.zeros((2, 2, 3), dtype=np.uint8)

  # Change the top-left pixel to Red
  image[0, 0] = [255, 0, 0]
  ```

  :::tip
  **Distant Viewing**: This is a DH method where we analyze "visual style" computationally. By looking at the average pixel values of every frame in a film, we can visualize the "color palette" of a director across their entire career.
  :::

  :::challenge
  In the first challenge, you learn how to inspect the pixel grid. In the second, you read the colours across a kind of 'film strip'.
  :::

---challenges---

### Challenge: Build and Inspect a Pixel Grid

- id: image-analysis-01-c1
- language: python
- difficulty: beginner

#### Starter Code
```python
import numpy as np

# Step 1: Create a 3x3 black image using np.zeros().
# It needs three dimensions: (Height, Width, Channels).
# Use dtype=np.uint8 to keep values in the 0-255 range.
image = # Your code here

# Step 2: Print the shape of the array.
# The output should confirm (Height, Width, Channels).
print("Shape:", image.shape)

# Step 3: Paint four pixels to make a 2x2 block of colour
# in the top-left corner of the image.
# Top-left (0,0)     = Red
# Top-right (0,1)    = Green
# Bottom-left (1,0)  = Blue
# Bottom-right (1,1) = White
# Leave all remaining pixels black.

# Your code here — four assignment statements

print(image)
```

#### Expected Output
```
Shape: (3, 3, 3)
[[[255   0   0]
  [  0 255   0]
  [  0   0   0]]

 [[  0   0 255]
  [255 255 255]
  [  0   0   0]]

 [[  0   0   0]
  [  0   0   0]
  [  0   0   0]]]
```

#### Hints

1. `np.zeros((height, width, channels), dtype=np.uint8)` creates an array filled with zeros — a black image.
2. `image.shape` returns a tuple `(H, W, C)` — for a 3×3 RGB image that is `(3, 3, 3)`.
3. Assign pixels with `image[row, col] = [R, G, B]`. Remember rows count from the top, columns from the left.

#### Solution
```python
import numpy as np

image = np.zeros((3, 3, 3), dtype=np.uint8)

print("Shape:", image.shape)

image[0, 0] = [255,   0,   0]   # Red
image[0, 1] = [  0, 255,   0]   # Green
image[1, 0] = [  0,   0, 255]   # Blue
image[1, 1] = [255, 255, 255]   # White

print(image)
```

### Challenge: Reading a Colour Palette

- id: image-analysis-01-c2
- language: python
- difficulty: intermediate

#### Starter Code
```python
import numpy as np

# A 2x5 "filmstrip" — each column represents the dominant colour
# of one scene from a short film. This is the kind of data
# a Distant Viewing pipeline might extract automatically.
filmstrip = np.array([
    [[20, 10, 80], [180,  60,  20], [240, 230, 200], [10, 120, 40], [200, 30, 30]],
    [[20, 10, 80], [180,  60,  20], [240, 230, 200], [10, 120, 40], [200, 30, 30]],
], dtype=np.uint8)

# Step 1: Confirm the shape. Print it and explain what each dimension means
# by filling in the f-string below.
h, w, c = filmstrip.shape
print(f"Shape: {filmstrip.shape}")
print(f"  {h} rows (duplicate for visibility), {w} scenes, {c} colour channels")

# Step 2: Extract the RGB values for scene 0 (col 0) and scene 4 (col 4).
# Print each with a human-readable colour description.
scene_0 = # Your code here
scene_4 = # Your code here
print(f"\nScene 0 dominant colour: {scene_0}")
print(f"Scene 4 dominant colour: {scene_4}")

# Step 3: Identify the "coldest" and "warmest" scenes.
# A scene is "warm" if its Red channel value is the highest of R, G, B.
# A scene is "cold" if its Blue channel value is the highest.
# Loop through all 5 columns (scene indices 0-4), check each pixel's
# R and B values, and collect the warm and cold scene indices.

warm_scenes = []
cold_scenes = []

for col in range(w):
    pixel = filmstrip[0, col]   # use row 0 — both rows are identical
    r, g, b = pixel[0], pixel[1], pixel[2]
    # Your code here — append col to warm_scenes or cold_scenes

print(f"\nWarm scenes (Red dominant): {warm_scenes}")
print(f"Cold scenes (Blue dominant): {cold_scenes}")

# Step 4: Compute the average Red, Green, and Blue value across all 5 scenes.
# This gives the "overall colour palette" of the film — a core Distant Viewing metric.
avg_r = int(np.mean(filmstrip[:, :, 0]))
avg_g = # Your code here
avg_b = # Your code here
print(f"\nOverall palette — R: {avg_r}, G: {avg_g}, B: {avg_b}")
```

#### Expected Output
```
Shape: (2, 5, 3)
  2 rows (duplicate for visibility), 5 scenes, 3 colour channels

Scene 0 dominant colour: [20 10 80]
Scene 4 dominant colour: [200  30  30]

Warm scenes (Red dominant): [1, 2, 4]
Cold scenes (Blue dominant): [0]

Overall palette — R: 130, G: 90, B: 74
```

#### Hints

1. Access a pixel with `filmstrip[row, col]` — use row 0 for all scene lookups since both rows are identical.
2. For Step 3, `r, g, b = pixel[0], pixel[1], pixel[2]`. A warm scene has `r > g and r > b`; a cold scene has `b > r and b > g`.
3. For Step 4, `np.mean(filmstrip[:, :, 0])` takes the mean of the entire Red channel (index 0 on the third axis). Repeat for channels 1 and 2, then wrap in `int()` to get a whole number.
4. The overall palette tells you something about the film's visual mood — a high average Red suggests a warm, intense palette; a high average Blue suggests cool detachment. This is exactly what Distant Viewing researchers measure across entire films.

#### Solution
```python
import numpy as np

filmstrip = np.array([
    [[20, 10, 80], [180,  60,  20], [240, 230, 200], [10, 120, 40], [200, 30, 30]],
    [[20, 10, 80], [180,  60,  20], [240, 230, 200], [10, 120, 40], [200, 30, 30]],
], dtype=np.uint8)

# Step 1
h, w, c = filmstrip.shape
print(f"Shape: {filmstrip.shape}")
print(f"  {h} rows (duplicate for visibility), {w} scenes, {c} colour channels")

# Step 2
scene_0 = filmstrip[0, 0]
scene_4 = filmstrip[0, 4]
print(f"\nScene 0 dominant colour: {scene_0}")
print(f"Scene 4 dominant colour: {scene_4}")

# Step 3
warm_scenes = []
cold_scenes = []
for col in range(w):
    pixel = filmstrip[0, col]
    r, g, b = pixel[0], pixel[1], pixel[2]
    if r > g and r > b:
        warm_scenes.append(col)
    elif b > r and b > g:
        cold_scenes.append(col)

print(f"\nWarm scenes (Red dominant): {warm_scenes}")
print(f"Cold scenes (Blue dominant): {cold_scenes}")

# Step 4
avg_r = int(np.mean(filmstrip[:, :, 0]))
avg_g = int(np.mean(filmstrip[:, :, 1]))
avg_b = int(np.mean(filmstrip[:, :, 2]))
print(f"\nOverall palette — R: {avg_r}, G: {avg_g}, B: {avg_b}")
```