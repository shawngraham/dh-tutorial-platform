---
id: geospatial-05
title: Calculating Map Data
moduleId: geospatial-analysis
prerequisites:
  - data-viz-02
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Represent geographic locations as coordinate data (latitude/longitude) in Python
  - Understand the Haversine formula for calculating distance on a sphere
  - Execute nested loops to compare spatial relationships between multiple points
  - Summarize geographic distributions using Counter objects
keywords:
  - mapping
  - geographic
  - coordinates
  - spatial
  - geolocation
  - haversine
---

# Mapping Historical Data

  ## The Detective's Pin Board
  Think of a **pin board** in a detective's office. Each pin marks a location—a crime scene, a witness's home, or a suspect's workplace. Strings connect the pins to show relationships and movement. 

  In the Digital Humanities, we do this with thousands of historical events: the birthplaces of authors in a movement, the locations of every printing press in 18th-century Europe, or the stops along a trade route. **Geographic analysis** lets you find spatial patterns—like clusters of activity or vast "silences"—that are invisible in a simple table of names.

  ---

  ## 1. Coordinates as Data
  Every location on Earth is described by two numbers: **Latitude** (North-South) and **Longitude** (East-West). In DH, we store these as "Decimal Degrees."

  ```python
  locations = [
      {"place": "London", "lat": 51.5074, "lon": -0.1278},
      {"place": "Edinburgh", "lat": 55.9533, "lon": -3.1883},
  ]

  # Accessing longitude:
  print(locations[0]["lon"]) # Output: -0.1278
  ```

  :::definition
  **Geocoding**: The process of converting place names (like "Bath, England") into coordinates (51.38, -2.36). Most historical datasets require this cleaning step before you can map them.
  :::

  ---

  ## 2. Measuring Distance (The Haversine Formula)
  Because the Earth is a sphere, we can't use a simple ruler to measure the distance between two points. We use the **Haversine formula**, which accounts for the curvature of the planet.

  In Python, we use the `math` library to convert our degrees into **radians** before doing the calculation.

  ```python
  import math

  def haversine(lat1, lon1, lat2, lon2):
      R = 6371  # Earth's radius in kilometers
      # ... (Math happens here) ...
      return distance_in_km
  ```

  ---

  ## 3. Comparing Every Pair (Nested Loops)
  To find the "Closest Pair" in a list of cities, we have to compare every city to every other city. We use a **Nested Loop**:
  - The **Outer Loop** picks the first city.
  - The **Inner Loop** iterates through all the *remaining* cities.

  ```python
  for i in range(len(locations)):
      for j in range(i + 1, len(locations)):
          # Compare locations[i] and locations[j]
  ```

  ---

  ## 4. Grouping by Region
  Just as we group temporal data by decade, we group spatial data by country or city to see where "power centers" of culture lie. 

  :::tip
  **Spatial Ethics**: Remember that coordinates suggest a precision that historical records often lack. If a 17th-century letter is labeled "South of the River," placing a pin at a specific coordinate is a scholarly *interpretation*, not a neutral fact.
  :::

  :::challenge
  In the first challenge, use nested loops to calculate the distances between four literary cities and find which two are closest. In the second, summarize the geography of a publishing dataset.
  :::

---challenges---

### Challenge: Compute Distances Between Literary Locations

- id: geospatial-05-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
import math

  def haversine(lat1, lon1, lat2, lon2):
      R = 6371
      dlat = math.radians(lat2 - lat1)
      dlon = math.radians(lon2 - lon1)
      a = (math.sin(dlat / 2) ** 2 +
           math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
           math.sin(dlon / 2) ** 2)
      return round(R * 2 * math.asin(math.sqrt(a)))

  locations = [
      {"place": "London", "lat": 51.5074, "lon": -0.1278},
      {"place": "Bath", "lat": 51.3758, "lon": -2.3599},
      {"place": "Edinburgh", "lat": 55.9533, "lon": -3.1883},
      {"place": "Geneva", "lat": 46.2044, "lon": 6.1432},
  ]

  # Goal: Compare every location to every location AFTER it in the list.
  # 1. Print: "<Place A> to <Place B>: <dist> km"
  # 2. Track the minimum distance found
  # 3. Print: "Closest: <A> and <B> (<dist> km)"

  # Your code here
  
```

#### Expected Output

```
London to Bath: 150 km
London to Edinburgh: 534 km
London to Geneva: 747 km
Bath to Edinburgh: 562 km
Bath to Geneva: 814 km
Edinburgh to Geneva: 1082 km
Closest: London and Bath (150 km)
```

#### Hints

1. Use nested loops: for i in range(len(locations)) and for j in range(i + 1, len(locations)).
2. Set min_dist = float("inf") at the start so any first distance will be smaller than it.
3. Access the data using locations[i]["lat"], etc.

#### Solution

```python
import math

  def haversine(lat1, lon1, lat2, lon2):
      R = 6371
      dlat = math.radians(lat2 - lat1)
      dlon = math.radians(lon2 - lon1)
      a = (math.sin(dlat / 2) ** 2 +
           math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
           math.sin(dlon / 2) ** 2)
      return round(R * 2 * math.asin(math.sqrt(a)))

  locations = [
      {"place": "London", "lat": 51.5074, "lon": -0.1278},
      {"place": "Bath", "lat": 51.3758, "lon": -2.3599},
      {"place": "Edinburgh", "lat": 55.9533, "lon": -3.1883},
      {"place": "Geneva", "lat": 46.2044, "lon": 6.1432},
  ]

  min_dist = float("inf")
  closest_pair = ""

  for i in range(len(locations)):
      for j in range(i + 1, len(locations)):
          loc1 = locations[i]
          loc2 = locations[j]
          d = haversine(loc1["lat"], loc1["lon"], loc2["lat"], loc2["lon"])
          print(f"{loc1['place']} to {loc2['place']}: {d} km")
          
          if d < min_dist:
              min_dist = d
              closest_pair = f"{loc1['place']} and {loc2['place']}"

  print(f"Closest: {closest_pair} ({min_dist} km)")
```

### Challenge: Count Locations by Region

- id: geospatial-05-c2
- language: python
- difficulty: beginner

#### Starter Code

```python
from collections import Counter

  publishers = [
      {"city": "London", "country": "England"},
      {"city": "Edinburgh", "country": "Scotland"},
      {"city": "London", "country": "England"},
      {"city": "Paris", "country": "France"},
      {"city": "London", "country": "England"},
      {"city": "Dublin", "country": "Ireland"},
      {"city": "Paris", "country": "France"},
      {"city": "Edinburgh", "country": "Scotland"},
  ]

  # 1. Use a Counter to count publications per country
  # 2. Print alphabetical results: "<country>: <count>"
  # 3. Print the most common country

  # Your code here
  
```

#### Expected Output

```
England: 3
France: 2
Ireland: 1
Scotland: 2
Most publications: England
```

#### Hints

1. To get the country names for the Counter, use (p["country"] for p in publishers).
2. Use sorted(counts.items()) to handle the alphabetical requirement.
3. The most common country is counts.most_common(1)[0][0].

#### Solution

```python
from collections import Counter

  publishers = [
      {"city": "London", "country": "England"},
      {"city": "Edinburgh", "country": "Scotland"},
      {"city": "London", "country": "England"},
      {"city": "Paris", "country": "France"},
      {"city": "London", "country": "England"},
      {"city": "Dublin", "country": "Ireland"},
      {"city": "Paris", "country": "France"},
      {"city": "Edinburgh", "country": "Scotland"},
  ]

  # Count
  counts = Counter(p["country"] for p in publishers)

  # Sort and print
  for country, count in sorted(counts.items()):
      print(f"{country}: {count}")

  # Print winner
  print(f"Most publications: {counts.most_common(1)[0][0]}")
```

