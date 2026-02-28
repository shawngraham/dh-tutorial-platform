---
id: geospatial-03
title: Plotting Maps
moduleId: geospatial-analysis
prerequisites:
  - geospatial-02
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Create static maps using the GeoDataFrame .plot() method
  - Generate Choropleth maps to visualize variables across regions
  - Layer multiple spatial datasets using Matplotlib Axes
  - Perform CRS transformations to calculate accurate geometric area
keywords:
  - matplotlib
  - plot
  - choropleth
  - mapping
  - visualization
  - to_crs
---

# Plotting Maps: Visualizing Spatial Arguments

  ## Analogy
  If `print(gdf)` gives you the raw numbers, `gdf.plot()` gives you the evidence. 

  Think of mapping as using **transparency sheets**. If you have one sheet for "Country Boundaries" and another for "Locations of 18th Century Printing Presses," you can stack them on top of each other. This allows you to see the relationship between political borders and technological spread.

  ---

  ## 1. Basic Plotting
  GeoPandas uses **Matplotlib** as its engine. The simplest way to see your data is the `.plot()` method.

  ```python
  # This draws the shapes in the geometry column
  gdf.plot()
  ```

  ---

  ## 2. Choropleth Maps: Color-Coding History
  A **Choropleth** map colors regions based on a value in your data (like population, literacy rates, or the number of manuscripts found in a region).

  ```python
  # Color countries by 'population' and add a legend (color bar)
  world.plot(column='pop_est', legend=True, cmap='OrRd')
  ```

  ---

  ## 3. Layering Data
  To show points (cities) on top of polygons (countries), you have to tell both plot commands to use the same "drawing board" or **axis (ax)**.

  ```python
  import matplotlib.pyplot as plt

  fig, ax = plt.subplots(figsize=(10, 6))

  # 1. Plot the base layer (the map) on ax
  countries.plot(ax=ax, color='lightgrey')

  # 2. Plot the second layer (the points) on the SAME ax
  cities.plot(ax=ax, color='red', markersize=10)

  plt.show()
  ```

  ---

  ## 4. The "Projection" Trap: Calculating Area
  In Digital Humanities, we often want to measure things: *"How big was this empire?"* or *"What is the density of monasteries in this valley?"*

  If your data is in **EPSG:4326** (Latitude/Longitude), calculations will be wrong because degrees are not a consistent unit of distance (a degree is wider at the equator than the poles). To calculate area, you must **project** your data into a system that uses **meters**.

  ```python
  # Convert to a Mercator projection (meters)
  gdf_meters = gdf.to_crs("EPSG:3395")

  # Now calculate area (in square meters)
  gdf_meters['area_sqm'] = gdf_meters.area
  ```

  :::tip
  **DH Use Case**: By layering a map of "Cholera Deaths" over a map of "Water Pumps," John Snow famously discovered the source of an 1854 outbreak. Layering is how we find **spatial correlation**.
  :::

  :::challenge
  In the first challenge, generate a plot object. In the second, perform a CRS transformation to calculate the area of a region in meters. In the third, we'll make a very small map of a very strange country!
  :::

---challenges---

### Challenge: The First Map

- id: geospatial-03-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
import geopandas as gpd
import pandas as pd
import matplotlib.pyplot as plt

# Clear any previous plots
plt.clf()

# Creating a tiny dataset of coordinates
data = {'name': ['Site A', 'Site B', 'Site C'], 'finds': [12, 45, 22], 
        'lat': [10, 20, 15], 'lon': [10, 20, 25]}
df = pd.DataFrame(data)
gdf = gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df.lon, df.lat), crs="EPSG:4326")

# Goal: Create a choropleth map of archaeological finds
# 1. Call the .plot() method on 'gdf'
# 2. Use the 'finds' column to color the points
# 3. Add a legend by setting legend=True
# 4. Use plt.show() to see your map

# Your code here
```

#### Expected Output

```
plt.show() called
```

#### Hints

1. The basic syntax is gdf.plot(column="column_name", legend=True)
2. Make sure you use the column name "finds" (quotes required).
3. Always finish with plt.show() to render the image in the sandbox.

#### Solution

```python
import geopandas as gpd
import pandas as pd
import matplotlib.pyplot as plt

plt.clf()

data = {'name': ['Site A', 'Site B', 'Site C'], 'finds': [12, 45, 22], 
        'lat': [10, 20, 15], 'lon': [10, 20, 25]}
df = pd.DataFrame(data)
gdf = gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df.lon, df.lat), crs="EPSG:4326")

# Plotting the data
gdf.plot(column='finds', legend=True)
plt.title("Archaeological Finds by Site")
plt.show()
```

### Challenge: Calculating Area in Meters

- id: geospatial-03-c2
- language: python
- difficulty: intermediate

#### Starter Code

```python
import geopandas as gpd
from shapely.geometry import Polygon

# A square polygon in degrees (approx 1 degree lat/lon)
poly = Polygon([(0, 0), (1, 0), (1, 1), (0, 1)])
gdf = gpd.GeoDataFrame({'id': [1]}, geometry=[poly], crs="EPSG:4326")

# Goal: Calculate the area in square meters
# 1. Convert gdf to EPSG:3395 (World Mercator) using ???
# 2. Access the .area property of the projected GeoDataFrame
# 3. Store the result of the first row in 'area_val'

# Your code here
gdf_projected = gdf.???("EPSG:3395")
area_val = gdf_projected.area.iloc[0]

print(f"{area_val:.2e}")
```

#### Expected Output

```
1.24e+10
```

#### Hints

1. The method to change coordinate systems is .to_crs()
2. Remember: EPSG:4326 uses degrees, which are useless for area calculations. EPSG:3395 uses meters.

#### Solution

```python
import geopandas as gpd
from shapely.geometry import Polygon

poly = Polygon([(0, 0), (1, 0), (1, 1), (0, 1)])
gdf = gpd.GeoDataFrame({'id': [1]}, geometry=[poly], crs="EPSG:4326")

# Convert to a system that uses meters
gdf_projected = gdf.to_crs("EPSG:3395")

# Calculate area
area_val = gdf_projected.area.iloc[0]

print(f"{area_val:.2e}")
```

### Challenge: Layering Points on Polygons

- id: geospatial-03-c3
- language: python
- difficulty: intermediate

#### Starter Code

```python
import geopandas as gpd
import matplotlib.pyplot as plt
from shapely.geometry import Polygon, Point

plt.clf()

# Base layer: A "Country"
country = gpd.GeoDataFrame({'name': ['DH Land']}, 
                            geometry=[Polygon([(0,0), (10,0), (10,10), (0,10)])])

# Top layer: A "City" 
city = gpd.GeoDataFrame({'name': ['Code Town']}, 
                         geometry=[Point(5, 5)])

# Goal: Plot the city on top of the country
# 1. Create the base axis (ax) by plotting 'country' with color='lightgrey'
# 2. Plot 'city' on the same axis (ax=ax) with color='red'

# Your code here
ax = country.plot(???)
city.plot(???, color='red')

plt.title("City within Country")
plt.show()
```

#### Expected Output

```
plt.show() called
```

#### Hints

1. In the first plot, just set the color.
2. In the second plot, you must pass ax=ax so it draws on top of the first map.
3. Final step is always plt.show()

#### Solution

```python
import geopandas as gpd
import matplotlib.pyplot as plt
from shapely.geometry import Polygon, Point

plt.clf()

country = gpd.GeoDataFrame({'name': ['DH Land']}, 
                            geometry=[Polygon([(0,0), (10,0), (10,10), (0,10)])])

city = gpd.GeoDataFrame({'name': ['Code Town']}, 
                         geometry=[Point(5, 5)])

# Layering the plots
ax = country.plot(color='lightgrey')
city.plot(ax=ax, color='red')

plt.title("City within Country")
plt.show()
```

