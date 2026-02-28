---
id: image-analysis-02
title: Processing Images with Pillow/OpenCV
moduleId: image-analysis
prerequisites:
  - image-analysis-01
  - python-basics-04
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Navigate the BGR vs RGB color channel discrepancy
  - Resize and crop images programmatically to standardize a corpus
  - Convert images to grayscale to prepare for OCR or layout analysis
  - Understand the difference between (Width, Height) and (Rows, Columns) in code
keywords:
  - pillow
  - opencv
  - PIL
  - cv2
  - load image
  - grayscale
---

# Processing Images with Pillow and OpenCV

  ## The Librarian's Choice: Pillow or OpenCV?
  If NumPy arrays are the raw ingredients (pixels), then **Pillow** and **OpenCV** are the kitchen tools that let us prepare them. 

  *   **Pillow (PIL)**: The "human-friendly" library. It is great for basic tasks like resizing, cropping, and saving images in different formats. It is very common in web development and basic DH scripts.
  *   **OpenCV (cv2)**: The "computer-vision" powerhouse. It is designed for high-performance analysis, like detecting faces in historical photos or identifying specific symbols in a manuscript.

  ---

  ## 1. The BGR "Trap"
  This is the most important thing to remember: **OpenCV reads colors in the order Blue-Green-Red (BGR)**, while almost every other library (including Pillow and Matplotlib) uses **Red-Green-Blue (RGB)**.

  If you load an image in OpenCV and display it in another tool without converting it, everyone will look like they are under blue moonlight!

  ```python
  import cv2

  # Load image
  img = cv2.imread("manuscript.jpg")

  # Convert from BGR to RGB so it looks correct in other tools
  img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
  ```

  ---

  ## 2. Transforming the Frame
  In Digital Humanities, we often process thousands of images. We use code to **standardize** them so they all have the same dimensions.

  ### Resizing
  Note that OpenCV asks for **(Width, Height)**.
  ```python
  # Resize to 200 pixels wide and 100 pixels high
  resized = cv2.resize(img, (200, 100))
  ```

  ### Cropping
  Since OpenCV treats images as NumPy arrays, we crop using **Slicing**. Here, we use **[Rows, Columns]**, which is the same as **[Y, X]**.
  ```python
  # Crop from Row 50 to 150, and Column 20 to 100
  # crop = img[y1:y2, x1:x2]
  cropped = img[50:150, 20:100]
  ```

  ---

  ## 3. Grayscale: Simplifying the Signal
  Converting an image to grayscale removes color "noise." This is a standard step before performing **OCR (Optical Character Recognition)** because it allows the computer to focus on the contrast between the dark ink and the light page.

  ```python
  # OpenCV Grayscale
  gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

  # Pillow Grayscale
  from PIL import Image
  img_pil = Image.open("page.jpg").convert("L") # 'L' for Luminance
  ```

  :::tip
  **DH Use Case**: If you are studying a collection of 5,000 digitized 19th-century postcards, you can use these tools to automatically crop out the "stamp" area from every card to analyze the postal marks separately.
  :::
  
  :::challenge
  Because we are in a sandbox, we will create "synthetic images" using NumPy and then transform them as if they were real archival material. The challenges simulate a postcard digitization pipeline: standardizing dimensions, isolating a region of interest, and preparing for OCR.
  :::

---challenges---

### Challenge: The BGR Trap and Standardizing a Corpus

- id: image-analysis-02-c1
- language: python
- difficulty: intermediate

#### Starter Code
```python
import cv2
import numpy as np

# Simulated archival scan: a 120x80 pixel "postcard" loaded by OpenCV.
# OpenCV stores colour as BGR. This postcard has a warm sepia tone —
# but because of BGR ordering, we must set it as (B, G, R) not (R, G, B).
# Sepia in RGB is approximately (112, 66, 20).
# In BGR that same colour is (20, 66, 112).

postcard_bgr = np.zeros((80, 120, 3), dtype=np.uint8)
postcard_bgr[:, :] = [20, 66, 112]   # sepia in BGR order

# Step 1: Confirm the shape and explain what each dimension means.
h, w, c = postcard_bgr.shape
print(f"Shape: {postcard_bgr.shape}")
print(f"  Rows (height): {h}px  |  Columns (width): {w}px  |  Channels: {c}")
print()

# Step 2: Demonstrate the BGR trap.
# Sample the top-left pixel from the BGR image and print its values.
# Then convert the image to RGB using cv2.cvtColor and sample the same pixel.
# The R and B values should swap — confirming the channel order changed.
pixel_bgr = postcard_bgr[0, 0]
postcard_rgb = cv2.cvtColor(postcard_bgr, cv2.COLOR_BGR2RGB)
pixel_rgb = # Your code here — same pixel, different array

print(f"Top-left pixel (BGR): {pixel_bgr}")
print(f"Top-left pixel (RGB): {pixel_rgb}")
print(f"R and B swapped: {pixel_bgr[0] == pixel_rgb[2] and pixel_bgr[2] == pixel_rgb[0]}")
print()

# Step 3: Standardize the corpus.
# A batch pipeline requires all postcards to be the same size.
# Resize postcard_bgr to a standard 100x60 pixels.
# Remember: cv2.resize() takes (Width, Height), NOT (Height, Width).
standard_size = (100, 60)
resized = cv2.resize(postcard_bgr, standard_size)
print(f"Original shape: {postcard_bgr.shape}")   # (80, 120, 3)
print(f"Resized shape:  {resized.shape}")         # (60, 100, 3)
print(f"Note: resize() took (width={standard_size[0]}, height={standard_size[1]}) "
      f"but shape shows (rows={resized.shape[0]}, cols={resized.shape[1]})")
print()

# Step 4: Convert the resized postcard to grayscale to prepare for OCR.
# Print the grayscale shape — it should have no channel dimension.
gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
print(f"Grayscale shape: {gray.shape}")
print(f"Channels removed: {len(postcard_bgr.shape) - len(gray.shape)}")
```

#### Expected Output
```
Shape: (80, 120, 3)
  Rows (height): 80px  |  Columns (width): 120px  |  Channels: 3

Top-left pixel (BGR): [ 20  66 112]
Top-left pixel (RGB): [112  66  20]
R and B swapped: True

Original shape: (80, 120, 3)
Resized shape:  (60, 100, 3)
Note: resize() took (width=100, height=60) but shape shows (rows=60, cols=100)

Grayscale shape: (60, 100)
Channels removed: 1
```

#### Hints

1. `postcard_rgb[0, 0]` samples the top-left pixel from the converted array — same indexing as before, different array.
2. `cv2.resize(img, (width, height))` — the argument order is the *opposite* of NumPy's shape, which is `(height, width, channels)`. This is the Width/Height trap: `(100, 60)` produces a shape of `(60, 100, 3)`.
3. `cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)` produces a 2D array — the channel dimension disappears entirely because each pixel is now a single luminance value.

#### Solution
```python
import cv2
import numpy as np

postcard_bgr = np.zeros((80, 120, 3), dtype=np.uint8)
postcard_bgr[:, :] = [20, 66, 112]

h, w, c = postcard_bgr.shape
print(f"Shape: {postcard_bgr.shape}")
print(f"  Rows (height): {h}px  |  Columns (width): {w}px  |  Channels: {c}")
print()

pixel_bgr    = postcard_bgr[0, 0]
postcard_rgb = cv2.cvtColor(postcard_bgr, cv2.COLOR_BGR2RGB)
pixel_rgb    = postcard_rgb[0, 0]

print(f"Top-left pixel (BGR): {pixel_bgr}")
print(f"Top-left pixel (RGB): {pixel_rgb}")
print(f"R and B swapped: {pixel_bgr[0] == pixel_rgb[2] and pixel_bgr[2] == pixel_rgb[0]}")
print()

standard_size = (100, 60)
resized = cv2.resize(postcard_bgr, standard_size)
print(f"Original shape: {postcard_bgr.shape}")
print(f"Resized shape:  {resized.shape}")
print(f"Note: resize() took (width={standard_size[0]}, height={standard_size[1]}) "
      f"but shape shows (rows={resized.shape[0]}, cols={resized.shape[1]})")
print()

gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
print(f"Grayscale shape: {gray.shape}")
print(f"Channels removed: {len(postcard_bgr.shape) - len(gray.shape)}")
```

### Challenge: Cropping a Region of Interest with Pillow

- id: image-analysis-02-c2
- language: python
- difficulty: intermediate

#### Starter Code
```python
from PIL import Image
import numpy as np

# Simulated postcard: 200px wide, 120px tall.
# The left two-thirds (columns 0-133) is the image/illustration area.
# The right third (columns 134-199) is the message/stamp area.
# We want to isolate the stamp zone in the top-right corner:
#   columns 150-199, rows 0-39 (a 50x40 pixel block).

# Build the postcard as a NumPy array then hand it to Pillow.
# Fill the whole card with a muted blue (sky scene).
card_array = np.zeros((120, 200, 3), dtype=np.uint8)
card_array[:, :]   = [135, 175, 200]   # sky blue (RGB)

# Mark the stamp zone in red so we can verify the crop worked.
card_array[0:40, 150:200] = [200, 50, 50]

img = Image.fromarray(card_array)

# Step 1: Confirm the Pillow image size.
# NOTE: Pillow's .size returns (Width, Height) — the opposite of NumPy's .shape.
print(f"NumPy shape (H, W, C): {card_array.shape}")
print(f"Pillow size  (W, H):   {img.size}")
print(f"Width/Height agree: "
      f"{card_array.shape[1] == img.size[0] and card_array.shape[0] == img.size[1]}")
print()

# Step 2: Crop the stamp zone.
# Pillow's .crop() takes a box: (left, upper, right, lower) = (x1, y1, x2, y2).
# Isolate columns 150-199, rows 0-39.
# Be careful: Pillow's box uses pixel coordinates, not slice notation —
# the right and lower values are EXCLUSIVE (like Python slicing).
stamp_box  = # Your code here — a tuple of four values
stamp_crop = img.crop(stamp_box)

print(f"Stamp crop size (W, H): {stamp_crop.size}")   # Expected: (50, 40)
print()

# Step 3: Verify the crop contains the right colour.
# Convert the cropped Pillow image back to a NumPy array and
# check that the top-left pixel is the red stamp colour, not sky blue.
stamp_array    = np.array(stamp_crop)
top_left_pixel = stamp_array[0, 0]
print(f"Top-left pixel of crop: {top_left_pixel}")
print(f"Is stamp red (R>150, G<100): "
      f"{top_left_pixel[0] > 150 and top_left_pixel[1] < 100}")
print()

# Step 4: Crop the illustration area (left two-thirds: columns 0-133, all rows).
# Print its size and confirm it is sky blue throughout by checking the centre pixel.
illus_box   = # Your code here
illus_crop  = img.crop(illus_box)
illus_array = np.array(illus_crop)
centre      = illus_array[illus_array.shape[0]//2, illus_array.shape[1]//2]
print(f"Illustration crop size (W, H): {illus_crop.size}")   # Expected: (134, 120)
print(f"Centre pixel (should be sky blue): {centre}")
```

#### Expected Output
```
NumPy shape (H, W, C): (120, 200, 3)
Pillow size  (W, H):   (200, 120)
Width/Height agree: True

Stamp crop size (W, H): (50, 40)

Top-left pixel of crop: [200  50  50]
Is stamp red (R>150, G<100): True

Illustration crop size (W, H): (134, 120)
Centre pixel (should be sky blue): [135 175 200]
```

#### Hints

1. For Step 1, `img.size` returns `(width, height)` while `card_array.shape` returns `(height, width, channels)` — they are the same dimensions in a different order, which is exactly objective 4's warning.
2. For Step 2, `stamp_box = (left, upper, right, lower)` maps to `(x1, y1, x2, y2)`. The stamp zone is columns 150–199 (so left=150, right=200) and rows 0–39 (so upper=0, lower=40). The right/lower values are exclusive.
3. For Step 4, the illustration covers columns 0–133 (left=0, right=134) and all rows (upper=0, lower=120).

#### Solution
```python
from PIL import Image
import numpy as np

card_array = np.zeros((120, 200, 3), dtype=np.uint8)
card_array[:, :]        = [135, 175, 200]
card_array[0:40, 150:200] = [200,  50,  50]

img = Image.fromarray(card_array)

print(f"NumPy shape (H, W, C): {card_array.shape}")
print(f"Pillow size  (W, H):   {img.size}")
print(f"Width/Height agree: "
      f"{card_array.shape[1] == img.size[0] and card_array.shape[0] == img.size[1]}")
print()

stamp_box  = (150, 0, 200, 40)
stamp_crop = img.crop(stamp_box)
print(f"Stamp crop size (W, H): {stamp_crop.size}")
print()

stamp_array    = np.array(stamp_crop)
top_left_pixel = stamp_array[0, 0]
print(f"Top-left pixel of crop: {top_left_pixel}")
print(f"Is stamp red (R>150, G<100): "
      f"{top_left_pixel[0] > 150 and top_left_pixel[1] < 100}")
print()

illus_box   = (0, 0, 134, 120)
illus_crop  = img.crop(illus_box)
illus_array = np.array(illus_crop)
centre      = illus_array[illus_array.shape[0]//2, illus_array.shape[1]//2]
print(f"Illustration crop size (W, H): {illus_crop.size}")
print(f"Centre pixel (should be sky blue): {centre}")
```