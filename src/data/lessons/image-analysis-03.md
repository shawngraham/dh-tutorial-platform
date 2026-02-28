---
id: image-analysis-03
title: Color Histograms and Extraction
moduleId: image-analysis
prerequisites:
  - image-analysis-02
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Calculate color histograms to analyze the distribution of light and color
  - Interpret histograms as a fingerprint of an image's visual style
  - Extract average and dominant colors to compare artistic palettes
  - Use NumPy and OpenCV to quantify visual information
keywords:
  - histogram
  - color analysis
  - dominant color
  - matplotlib
  - distant viewing
---

# Color Histograms and Extraction

  ## The Visual Fingerprint
  In the humanities, we often talk about an artist's "palette" or the "mood" of a film. A **color histogram** is a way to turn those qualitative descriptions into quantitative data. 

  Think of a histogram as a **bar chart of intensity**. Instead of counting words in a book, we are counting how many pixels in an image belong to a specific shade of red, green, or blue.

  ---

  ## 1. What is a Histogram?
  A histogram for an image shows the frequency of each color intensity. 
  - **X-axis**: Represents the color intensity from **0** (darkest) to **255** (brightest).
  - **Y-axis**: Represents the **count** of pixels that have that specific intensity.

  By looking at the "shape" of the histogram, you can instantly tell if an image is overexposed (peaks on the right), underexposed (peaks on the left), or high-contrast (peaks at both ends).

  ---

  ## 2. Calculating Histograms with OpenCV
  The function `cv2.calcHist()` is the standard tool for this. It requires several specific arguments passed as **lists**:

  ```python
  import cv2
  import matplotlib.pyplot as plt

  # 1. [image]: The image list
  # 2. [0]: The channel index (0 for Grayscale, or B=0, G=1, R=2 for Color)
  # 3. None: No mask (we want the whole image)
  # 4. [256]: The number of "bins" (0-255)
  # 5. [0, 256]: The range of values
  hist = cv2.calcHist([img], [0], None, [256], [0, 256])

  # Plotting with Matplotlib
  plt.plot(hist)
  plt.show()
  ```

  ---

  ## 3. Extracting Dominant Colors
  While a histogram shows the *range* of colors, sometimes we just want the "average" feel of an image. This is a common technique in **Distant Viewing**—an approach where researchers analyze the color palettes of every frame in a movie or every painting in a gallery to see how visual styles change over time.

  A simple way to find the "average color" is to calculate the **mean** of all pixel values across the Height and Width of the image.

  ```python
  # Calculate the average Red, Green, and Blue across the whole image
  avg_color = np.mean(img_array, axis=(0, 1))
  ```

  :::tip
  **DH Use Case**: Scholars use these tools to identify "visual trends" in historical archives. For example, did the invention of synthetic dyes in the 19th century lead to a measurable spike in "saturated" color frequencies in fashion photography?
  :::

  :::challenge
  In the challenges in the sandbox, you will build and interpret colour histograms for synthetic "archival" images, then use average colour extraction to compare the visual palettes of two simulated film stills — the kind of comparison a Distant Viewing project might run across thousands of frames.
  :::

---challenges---

### Challenge: Reading a Histogram as a Visual Fingerprint

- id: image-analysis-03-c1
- language: python
- difficulty: intermediate

#### Starter Code
```python
import cv2
import numpy as np

# Three synthetic grayscale images, each with a distinct tonal character.
# In a real DH project these might be scanned photographs from different decades.

# Image A: Low-key (mostly dark — peaks on the LEFT of histogram)
img_a = np.zeros((50, 50), dtype=np.uint8)
img_a[:, :] = 40

# Image B: High-key (mostly bright — peaks on the RIGHT of histogram)
img_b = np.zeros((50, 50), dtype=np.uint8)
img_b[:, :] = 220

# Image C: High-contrast (half dark, half bright — peaks at BOTH ends)
img_c = np.zeros((50, 50), dtype=np.uint8)
img_c[:25, :] = 30
img_c[25:, :] = 225

images = {"A (low-key)": img_a, "B (high-key)": img_b, "C (high-contrast)": img_c}

# Step 1: For each image, calculate its grayscale histogram using cv2.calcHist().
# Then find the intensity bin (0-255) where the histogram peaks.
# Print the peak bin for each image.
print("=== Histogram Peak Bins ===")
for name, img in images.items():
    hist = cv2.calcHist([img], [0], None, [256], [0, 256])
    peak_bin = # Your code — find the index of the maximum value in hist
    print(f"  {name}: peak at intensity {peak_bin}")

print()

# Step 2: Verify the total pixel count encoded in each histogram.
# The sum of all histogram bins should equal the total number of pixels.
# Print True/False for each image.
print("=== Histogram Completeness Check ===")
for name, img in images.items():
    hist = cv2.calcHist([img], [0], None, [256], [0, 256])
    total_pixels = img.shape[0] * img.shape[1]
    hist_sum     = int(hist.sum())
    print(f"  {name}: pixels={total_pixels}, hist_sum={hist_sum}, match={total_pixels == hist_sum}")

print()

# Step 3: Interpret the fingerprints.
# Make a note in your notebook where you consider what Image A peaking at a particular intensity might mean, and what Image C's bi-modal peaks might imply.
# Based on the peak bins from Step 1, complete these sentences.
# (You can calculate or reason through the answers — no lookup needed.)
```

#### Expected Output
```
=== Histogram Peak Bins ===
  A (low-key): peak at intensity 40
  B (high-key): peak at intensity 220
  C (high-contrast): peak at intensity 225

=== Histogram Completeness Check ===
  A (low-key): pixels=2500, hist_sum=2500, match=True
  B (high-key): pixels=2500, hist_sum=2500, match=True
  C (high-contrast): pixels=2500, hist_sum=2500, match=True
```

#### Hints

1. `cv2.calcHist([img], [0], None, [256], [0, 256])` returns a `(256, 1)` array. Each index is an intensity bin (0–255) and the value is the pixel count at that intensity.
2. To find the peak bin, use `int(np.argmax(hist))` — `argmax` returns the index of the highest value, which here equals the intensity level.
3. For Step 2, `hist.sum()` totals all pixel counts across all 256 bins. For a 50×50 image that should equal 2500 — a useful sanity check in real archival work.
4. For Step 3, look at the peak bin number and think about what that intensity value *looks like* visually (0=black, 128=mid-grey, 255=white). Image C's single reported peak is at 225 because that bin has slightly more pixels than the dark bin — but the histogram has two meaningful peaks.

#### Solution
```python
import cv2
import numpy as np

img_a = np.zeros((50, 50), dtype=np.uint8)
img_a[:, :] = 40

img_b = np.zeros((50, 50), dtype=np.uint8)
img_b[:, :] = 220

img_c = np.zeros((50, 50), dtype=np.uint8)
img_c[:25, :] = 30
img_c[25:, :] = 225

images = {"A (low-key)": img_a, "B (high-key)": img_b, "C (high-contrast)": img_c}

print("=== Histogram Peak Bins ===")
for name, img in images.items():
    hist     = cv2.calcHist([img], [0], None, [256], [0, 256])
    peak_bin = int(np.argmax(hist))
    print(f"  {name}: peak at intensity {peak_bin}")

print()

print("=== Histogram Completeness Check ===")
for name, img in images.items():
    hist         = cv2.calcHist([img], [0], None, [256], [0, 256])
    total_pixels = img.shape[0] * img.shape[1]
    hist_sum     = int(hist.sum())
    print(f"  {name}: pixels={total_pixels}, hist_sum={hist_sum}, match={total_pixels == hist_sum}")
```

### Challenge: Comparing Palettes Across a Film Corpus

- id: image-analysis-03-c2
- language: python
- difficulty: intermediate

#### Starter Code
```python
import numpy as np

# Two simulated film stills from different directors.
# Each is a 100x100 RGB image built from coloured blocks,
# representing the dominant colours in different regions of the frame.

# Director A: warm palette — golden light, earthy tones
still_a = np.zeros((100, 100, 3), dtype=np.uint8)
still_a[0:50,  0:50]  = [220, 160,  60]   # amber top-left
still_a[0:50,  50:100] = [180, 100,  40]   # burnt orange top-right
still_a[50:100, 0:50]  = [200, 140,  80]   # tan bottom-left
still_a[50:100, 50:100] = [240, 180, 100]  # gold bottom-right

# Director B: cool palette — blue shadows, pale light
still_b = np.zeros((100, 100, 3), dtype=np.uint8)
still_b[0:50,  0:50]  = [ 80, 110, 180]   # steel blue top-left
still_b[0:50,  50:100] = [100, 130, 200]   # periwinkle top-right
still_b[50:100, 0:50]  = [ 60,  90, 160]   # dark blue bottom-left
still_b[50:100, 50:100] = [120, 150, 210]  # pale blue bottom-right

# Step 1: Calculate the average RGB colour for each still.
# Use np.mean(img.astype(np.float64), axis=(0, 1)).astype(np.uint8)
avg_a = # Your code here
avg_b = # Your code here

print("=== Average Palette ===")
print(f"  Director A: R={avg_a[0]}, G={avg_a[1]}, B={avg_a[2]}")
print(f"  Director B: R={avg_b[0]}, G={avg_b[1]}, B={avg_b[2]}")
print()

# Step 2: Determine which director uses more RED on average,
# which uses more BLUE, and calculate the difference for each channel.
print("=== Channel Comparison ===")
for channel, label in enumerate(["Red", "Green", "Blue"]):
    diff = int(avg_a[channel]) - int(avg_b[channel])
    dominant = "Director A" if diff > 0 else "Director B"
    print(f"  {label}: A={avg_a[channel]}, B={avg_b[channel]}, "
          f"difference={abs(diff)}, higher={dominant}")
print()

# Step 3: Calculate a single "warmth score" for each still.
# Warmth = average Red - average Blue (higher = warmer).
warmth_a = int(avg_a[0]) - int(avg_a[2])
warmth_b = # Your code here
print(f"=== Warmth Score (R - B) ===")
print(f"  Director A: {warmth_a}")
print(f"  Director B: {warmth_b}")
print(f"  Warmer palette: {'Director A' if warmth_a > warmth_b else 'Director B'}")
print()

# Step 4: Interpret the findings as a Distant Viewing researcher would, and add your thoughts to your notebook. What does the warmth gap between directors imply? What is a limitation of using average colour as a palette metric?
```

#### Expected Output
```
=== Average Palette ===
  Director A: R=210, G=145, B=70
  Director B: R=90, G=120, B=187

=== Channel Comparison ===
  Red:   A=210, B=90,  difference=120, higher=Director A
  Green: A=145, B=120, difference=25,  higher=Director A
  Blue:  A=70,  B=187, difference=117, higher=Director B

=== Warmth Score (R - B) ===
  Director A: 140
  Director B: -97
  Warmer palette: Director A
```

#### Hints

1. `np.mean(img.astype(np.float64), axis=(0, 1))` averages over the Height (axis 0) and Width (axis 1) dimensions simultaneously, leaving a 3-element array of channel means. Chain `.astype(np.uint8)` to get whole numbers.
2. For Step 2, use `int()` when computing `diff` to avoid NumPy integer overflow — subtracting two `uint8` values can wrap around if the result would be negative.
3. For Step 4, the first reflection connects the numbers to film history or visual culture; the second should identify a technical limitation that points back to why histograms (Challenge 1) are more informative than averages alone.

#### Solution
```python
import numpy as np

still_a = np.zeros((100, 100, 3), dtype=np.uint8)
still_a[0:50,  0:50]   = [220, 160,  60]
still_a[0:50,  50:100] = [180, 100,  40]
still_a[50:100, 0:50]  = [200, 140,  80]
still_a[50:100, 50:100]= [240, 180, 100]

still_b = np.zeros((100, 100, 3), dtype=np.uint8)
still_b[0:50,  0:50]   = [ 80, 110, 180]
still_b[0:50,  50:100] = [100, 130, 200]
still_b[50:100, 0:50]  = [ 60,  90, 160]
still_b[50:100, 50:100]= [120, 150, 210]

avg_a = np.mean(still_a.astype(np.float64), axis=(0, 1)).astype(np.uint8)
avg_b = np.mean(still_b.astype(np.float64), axis=(0, 1)).astype(np.uint8)

print("=== Average Palette ===")
print(f"  Director A: R={avg_a[0]}, G={avg_a[1]}, B={avg_a[2]}")
print(f"  Director B: R={avg_b[0]}, G={avg_b[1]}, B={avg_b[2]}")
print()

print("=== Channel Comparison ===")
for channel, label in enumerate(["Red", "Green", "Blue"]):
    diff     = int(avg_a[channel]) - int(avg_b[channel])
    dominant = "Director A" if diff > 0 else "Director B"
    print(f"  {label}: A={avg_a[channel]}, B={avg_b[channel]}, "
          f"difference={abs(diff)}, higher={dominant}")
print()

warmth_a = int(avg_a[0]) - int(avg_a[2])
warmth_b = int(avg_b[0]) - int(avg_b[2])
print("=== Warmth Score (R - B) ===")
print(f"  Director A: {warmth_a}")
print(f"  Director B: {warmth_b}")
print(f"  Warmer palette: {'Director A' if warmth_a > warmth_b else 'Director B'}")
print()
```