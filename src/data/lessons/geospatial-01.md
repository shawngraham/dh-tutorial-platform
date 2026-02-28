---
id: geospatial-01
title: Coordinates and Projections
moduleId: geospatial-analysis
prerequisites:
  - structured-data-05
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Explain the difference between geographic (Lat/Lon) and projected coordinate systems
  - Create geometric objects (Points) using the Shapely library
  - Understand why the order of coordinates (x, y) matters in GIS software
  - Identify common EPSG codes used in Digital Humanities
keywords:
  - gis
  - coordinates
  - shapely
  - crs
  - projection
---

# Coordinates and Projections: Flattening the World

  ## The Orange Peel Problem
  Imagine trying to peel an orange and flatten the peel perfectly onto a rectangular table. It is impossible to do so without tearing or stretching the skin. 

  This is the fundamental problem of map-making: the Earth is a three-dimensional sphere, but our screens and printed pages are two-dimensional flats. To solve this, we use **Projections**.

  ---

  ## 1. Geographic vs. Projected Systems

  ### Geographic Coordinates (Lat/Lon)
  These treat the earth like a sphere. Points are measured in **degrees** based on their angle from the center of the earth.
  *   **Unit**: Degrees
  *   **Standard**: EPSG:4326 (The "GPS" standard)

  ### Projected Coordinates
  The "orange peel" has been flattened mathematically. Points are measured in linear units like **meters**. This is necessary if you want to calculate the area of a historical site or the length of a trade route accurately.
  *   **Unit**: Meters
  *   **Standard**: EPSG:3857 (The "Web Map" standard used by Google Maps)

  ---

  ## 2. Geometry as Data (Shapely)
  In Digital Humanities, we don't just treat locations as two separate columns in a spreadsheet. We treat them as **Geometric Objects**. The library **Shapely** is a common tool (nb, not the only tool!) for creating these objects in Python.

  ```python
  from shapely.geometry import Point

  # IMPORTANT: GIS software almost always expects (x, y)
  # x = Longitude (East/West)
  # y = Latitude (North/South)
  # This represents Paris:
  paris = Point(2.35, 48.85)

  print(paris) # Output: POINT (2.35 48.85)
  ```

  :::warning
  **The Lon/Lat Trap**: Most people say "Latitude and Longitude." But mathematically, Longitude is the horizontal axis (**X**) and Latitude is the vertical axis (**Y**). If you put Latitude first in a `Point()`, your map of Paris will end up in Somalia!
  :::

  ---

  ## 3. WKT: Well-Known Text
  When you print a Shapely object, you see a format like `POINT (31.13 29.97)`. This is called **WKT**. It is a standardized way to describe shapes as text, making it easy to move data between Python, QGIS, and web maps.

  :::tip
  **DH Use Case**: 
  - **Archaeology**: Recording the exact meter-grid location of an artifact within a trench requires a projected system.
  - **History**: Mapping the spread of a manuscript across Europe requires understanding that medieval "projections" were based on travel time, not modern GPS coordinates.
  :::

  :::challenge
  In the first challenge, create a Point representing the Great Pyramid. In the second, use Shapely's built-in math to calculate the "straight-line" distance between two points on a flat plane.
  :::

---challenges---

### Challenge: Point Creation

- id: geospatial-01-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
from shapely.geometry import Point

  # 1. Create a Point object for the Pyramids of Giza.
  # Longitude (x): 31.13
  # Latitude (y): 29.97

  giza = 

  # Your code here

  # This prints the Well-Known Text representation
  print(giza.wkt)
  
```

#### Expected Output

```
POINT (31.13 29.97)
```

#### Hints

1. Use the syntax: giza = Point(31.13, 29.97)
2. Remember: (Longitude, Latitude) is the (X, Y) order GIS expects.

#### Solution

```python
from shapely.geometry import Point

  # Create the point using X (Lon) and Y (Lat)
  giza = Point(31.13, 29.97)

  print(giza.wkt)
```

### Challenge: Distance in Degrees

- id: geospatial-01-c2
- language: python
- difficulty: intermediate

#### Starter Code

```python
from shapely.geometry import Point

  # Point 1 is at the origin
  p1 = Point(0, 0)

  # Point 2 is 3 units East and 4 units North
  p2 = Point(3, 4)

  # 1. Calculate the distance between p1 and p2 using the .distance() method
  # 2. Store it in a variable called 'dist' and print it

  # Your code here
  
```

#### Expected Output

```
5.0
```

#### Hints

1. Use the syntax: dist = p1.distance(p2)
2. This is a "Euclidean" distance (Pythagorean theorem), not "Haversine" distance.

#### Solution

```python
from shapely.geometry import Point

  p1 = Point(0, 0)
  p2 = Point(3, 4)

  # Calculate the straight-line distance
  dist = p1.distance(p2)

  print(dist)
```

