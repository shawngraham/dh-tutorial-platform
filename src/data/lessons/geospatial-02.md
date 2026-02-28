---
id: geospatial-02
title: Intro to GeoPandas
moduleId: geospatial-analysis
prerequisites:
  - geospatial-01
  - structured-data-02
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Understand the structure of a GeoDataFrame
  - Identify the special "geometry" column that enables mapping
  - Filter spatial data based on attributes (e.g., selecting a specific country)
  - Convert a standard list of coordinates into a spatial dataset
keywords:
  - geopandas
  - geodataframe
  - spatial data
  - metadata
  - filtering
---

# Intro to GeoPandas: Spreadsheets with a Sense of Place

  ## Analogy
  You already know **Pandas**, which gives you a super-powered spreadsheet (a DataFrame). **GeoPandas** is that exact same tool, but it adds a "magic column" at the end: **the geometry column**.

  While normal columns hold text (Authors) or numbers (Year), the `geometry` column holds shapes—**Points** for cities, **Lines** for trade routes, or **Polygons** for empires.

  ---

  ## 1. The GeoDataFrame
  A GeoDataFrame looks like a standard spreadsheet, but it is "geographically aware." It knows its own **CRS** (Coordinate Reference System) and can calculate spatial properties like area or distance automatically.

  ```python
  import geopandas as gpd

  # In a standard environment, we read files like this:
  # gdf = gpd.read_file("monasteries.geojson")

  # In our sandbox, we can check the metadata just like Pandas:
  print(gdf.columns) 
  print(gdf.head())
  ```

  ---

  ## 2. The Geometry Column
  This column is the heart of GeoPandas. It stores the **Shapely** objects (Points, Polygons) we learned about in the last lesson. Even if you have 100 columns of historical metadata, GeoPandas only needs this one `geometry` column to draw a map.

  ```python
  # You can isolate the shapes themselves
  all_shapes = gdf.geometry
  ```

  ---

  ## 3. Filtering: The DH Power Move
  Because GeoPandas is built on top of Pandas, you can filter your map using the same logic you use for a spreadsheet. 

  If you have a map of the whole world, but you only want to study the **Ottoman Empire**, you simply filter the rows:

  ```python
  # Select only rows where the 'empire' column is 'Ottoman'
  ottoman_map = gdf[gdf['empire'] == 'Ottoman']
  ```

  ---

  ## 4. Converting CSV to Map
  Most DH researchers don't start with a "Shapefile"; they start with an Excel sheet containing "Latitude" and "Longitude" columns. To make this a map, you must "zip" those coordinates into the geometry column.

  ```python
  # Logic for converting a DataFrame (df) to a GeoDataFrame (gdf)
  gdf = gpd.GeoDataFrame(
      df, 
      geometry=gpd.points_from_xy(df.Longitude, df.Latitude),
      crs="EPSG:4326"
  )
  ```

  :::tip
  **DH Use Case**: Load a dataset of 19th-century cholera outbreaks. Filter the data to show only the first week of the outbreak. By calculating the "Centroid" (the geometric center) of those points, you can identify the epicenter of the epidemic.
  :::

  :::challenge
  In the first challenge, you will load a built-in dataset of the world. In the second, you will use your Pandas skills to "extract" a single country from that map.
  :::

---challenges---

### Challenge: Loading a GeoDataFrame

- id: geospatial-02-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
import geopandas as gpd
  import pandas as pd
  from shapely.geometry import Point

  # Since we are in a sandbox, we will build a tiny 'world' from a dictionary
  data = {
      'name': ['Egypt', 'France', 'China'],
      'pop': [100, 67, 1400],
      'lat': [26.8, 46.2, 35.8],
      'lon': [30.8, 2.2, 104.1]
  }
  df = pd.DataFrame(data)

  # Goal: Convert this DataFrame into a GeoDataFrame named 'world'
  # 1. Use gpd.GeoDataFrame()
  # 2. Use gpd.points_from_xy(df.lon, df.lat) for the geometry
  # 3. Set the crs to "EPSG:4326"

  world = 

  # Verify
  print(type(world).__name__)
  print(world.geometry.iloc[0])
  
```

#### Expected Output

```
GeoDataFrame
POINT (30.8 26.8)
```

#### Hints

1. The syntax is: gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df.lon, df.lat), crs="EPSG:4326")
2. Make sure Lon (x) comes before Lat (y) in the points_from_xy function.

#### Solution

```python
import geopandas as gpd
  import pandas as pd

  data = {
      'name': ['Egypt', 'France', 'China'],
      'pop': [100, 67, 1400],
      'lat': [26.8, 46.2, 35.8],
      'lon': [30.8, 2.2, 104.1]
  }
  df = pd.DataFrame(data)

  # Convert to GeoDataFrame
  world = gpd.GeoDataFrame(
      df, 
      geometry=gpd.points_from_xy(df.lon, df.lat), 
      crs="EPSG:4326"
  )

  print(type(world).__name__)
  print(world.geometry.iloc[0])
```

### Challenge: Filtering by Attribute

- id: geospatial-02-c2
- language: python
- difficulty: intermediate

#### Starter Code

```python
import geopandas as gpd
  import pandas as pd

  # Creating our world GeoDataFrame
  data = {'name': ['Egypt', 'France', 'China'], 'lat': [26.8, 46.2, 35.8], 'lon': [30.8, 2.2, 104.1]}
  df = pd.DataFrame(data)
  world = gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df.lon, df.lat), crs="EPSG:4326")

  # Goal: Filter the 'world' GeoDataFrame to select only the row where 'name' is "Egypt"
  # Store this in a new variable called 'egypt'

  # Your code here

  # Verify
  print(egypt['name'].values[0])
  
```

#### Expected Output

```
Egypt
```

#### Hints

1. Use the square bracket notation: world[world["column"] == "Value"]
2. This is the exact same syntax you used in the Pandas module!

#### Solution

```python
import geopandas as gpd
  import pandas as pd

  data = {'name': ['Egypt', 'France', 'China'], 'lat': [26.8, 46.2, 35.8], 'lon': [30.8, 2.2, 104.1]}
  df = pd.DataFrame(data)
  world = gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df.lon, df.lat), crs="EPSG:4326")

  # Filter for Egypt
  egypt = world[world['name'] == 'Egypt']

  print(egypt['name'].values[0])
```

