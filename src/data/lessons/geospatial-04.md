---
id: geospatial-04
title: 'Interactive Maps: Logic and Data'
moduleId: geospatial-analysis
prerequisites:
  - geospatial-03
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Understand the difference between static (Matplotlib) and interactive (Folium) mapping logic
  - Navigate the "Latitude/Longitude" vs "X/Y" coordinate order discrepancy
  - Programmatically add markers to a map object using loops
  - Validate map state using internal object attributes
keywords:
  - folium
  - interactive
  - leaflet
  - markers
  - web mapping
  - coordinates
---

# Interactive Maps: The Digital Exhibit

  ## Why Folium?
  If Matplotlib is for a **research paper**, Folium is for a **website**. Folium generates the HTML and JavaScript (via Leaflet.js) needed to create "slippy maps" that users can zoom and click.

  :::warning
  **Sandbox Limitation**: Because Folium produces an interactive website, it won't "render" a picture in our sandbox like Matplotlib does. Instead, we will use the sandbox to practice the **data logic**—ensuring our coordinates are in the right order and our markers are correctly structured.
  :::

  ---

  ## 1. The Great Coordinate Flip ⚠️
  This is the most common error in Geospatial Python:
  - **GeoPandas/Shapely**: Uses **(Longitude, Latitude)**. This is "Math" order (X, Y).
  - **Folium/Leaflet**: Uses **[Latitude, Longitude]**. This is "Navigation" order.

  If you pass GeoPandas coordinates directly into Folium without flipping them, your map of London will end up in the middle of the Indian Ocean.

  ---

  ## 2. Popups and Tooltips
  Interaction is the primary goal of Folium. 
  - **Popup**: Appears when you **click**.
  - **Tooltip**: Appears when you **hover**.

  ```python
  folium.Marker(
      location=[51.5, -0.12], 
      popup="The British Library",
      tooltip="Click for details"
  ).add_to(m)
  ```

  ---

  ## 3. Programmatic Mapping
  In DH, we rarely map one point at a time. We usually have a list of historical locations. We use a `for` loop to "batch" these onto our map object. 

  To verify our work in a script, we can check the `m._children` attribute. Each time you add a marker, the number of "children" in the map object increases.

  :::challenge
  In the following challenges, you will practice centering a map and, more importantly, "flipping" data from a list to fit the Latitude/Longitude requirements of Folium. Then we'll try some conditional styling.
  :::

---challenges---

### Challenge: Center and Validate

- id: geospatial-04-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
# we'll install folium
import micropip
await micropip.install('folium')

import folium

# 1. Create a folium Map centered on New York City: [40.71, -74.00]
# 2. Set the 'zoom_start' to 12
# 3. Assign it to the variable 'm'

# Your code here

# Verification logic
print(f"Lat: {m.location[0]}, Lon: {m.location[1]}")
print(f"Zoom: {m.options['zoom']}")
```

#### Expected Output

```
Lat: 40.71, Lon: -74.0
Zoom: 12
```

#### Hints

1. The syntax is m = folium.Map(location=[lat, lon], zoom_start=Z)
2. Check your brackets! The location must be a list: [40.71, -74.00].

#### Solution

```python
# we'll install folium
import micropip
await micropip.install('folium')

import folium
m = folium.Map(location=[40.71, -74.00], zoom_start=12)
print(f"Lat: {m.location[0]}, Lon: {m.location[1]}")
print(f"Zoom: {m.options['zoom']}")
```

### Challenge: The Data Flip Challenge

- id: geospatial-04-c2
- language: python
- difficulty: intermediate

#### Starter Code

```python
import folium

m = folium.Map(location=[20.0, 0.0], zoom_start=2)

# This data is in (Longitude, Latitude) format—the "Math" order.
# Folium needs [Latitude, Longitude]—the "Navigation" order.
raw_data = [
    {"name": "Dakar", "coords": (-17.44, 14.69)},
    {"name": "Cairo", "coords": (31.23, 30.04)}
]

# Goal: Loop through raw_data, flip the coordinates, and add markers.
for place in raw_data:
    lon = place["coords"][0]
    lat = place["coords"][1]
    
    # 1. Create a Marker using the flipped order: [lat, lon]
    # 2. Add it to the map 'm'
    # Your code here
    

# Verification: Map should have 1 base layer + 2 markers = 3 children
print(len(m._children))
```

#### Expected Output

```
3
```

#### Hints

1. Inside the loop, use folium.Marker(location=[lat, lon]).add_to(m)
2. Make sure lat is index 1 and lon is index 0 from the original tuple.

#### Solution

```python
import folium

m = folium.Map(location=[20.0, 0.0], zoom_start=2)

raw_data = [
    {"name": "Dakar", "coords": (-17.44, 14.69)},
    {"name": "Cairo", "coords": (31.23, 30.04)}
]

for place in raw_data:
    lon = place["coords"][0]
    lat = place["coords"][1]
    # Flip to [lat, lon] for Folium
    folium.Marker(location=[lat, lon], popup=place["name"]).add_to(m)

print(len(m._children))
```

