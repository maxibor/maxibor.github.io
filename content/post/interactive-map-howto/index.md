---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "Making Interactive maps in Python using GeoJSON and GitHub"
subtitle: ""
summary: ""
authors: []
tags: []
categories: []
date: 2021-01-12T13:08:30+01:00
lastmod: 2021-01-12T13:08:30+01:00
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: "Ancient DNA metagenomic sample interactive map"
  focal_point: ""
  preview_only: false

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---

Recently, I've been involved with the [AncientMetagenomeDir](https://github.com/spaam-community/ancientMetagenomeDir) project. Briefly, with this collaborative community effort, we aimed to regroup in one single repository, all the metadata about every single published ancient DNA metagenomics article, and make them [FAIR](https://en.wikipedia.org/wiki/FAIR_data).

We ended with large `TSV` table files regrouping a standardized set of metadata, about each ancient DNA metagenomics sample. Because these are originally archeological data, one the information that is systematically collected is the geographical location of each sample.

While static maps were already generated for the [AncientMegenomeDir publication](https://doi.org/10.1101/2020.09.02.279570), we had the opportunity to play with interactive maps for the [website of the project](https://spaam-community.github.io/AncientMetagenomeDir/#/).

Usually, hosting interactive elements online require some sort of a backend framework (like [Streamlit](https://www.streamlit.io/) or [Shiny](https://shiny.rstudio.com/)) to perform the rendering, however, I wanted to have it as serverless as possible, and this is where the [`GeoJSON` rendering function of GitHub](https://docs.github.com/en/free-pro-team@latest/github/managing-files-in-a-repository/mapping-geojson-files-on-github) came to the rescue.

That meant that as long as I would push a [`GeoJSON`](https://geojson.org/) file on GitHub, it would automatically be rendered as an interactive map by GitHub, thanks to [Leaflet.js](https://leafletjs.com/).

## From TSV to GeoJSON

The question that I was left with: How to go from a `TSV` table to a `GeoJSON` file. 
Luckily for me, this is really easy to do thanks to [GeoPandas](https://geopandas.org/).  
The only things I need were to make sure there were a `latitude` and `longitude` column.


{{< figure src="coordinate-system.png" title="test" >}}

```python
import pandas as pd
import geopandas

df = pd.read_csv("table.tsv", sep="\t")
gdf = geopandas.GeoDataFrame(df, geometry=geopandas.points_from_xy(df.longitude, df.latitude))
gdf.to_file("output.geo.json", driver='GeoJSON')
```

> Instead of pushing to GitHub at every change to check the GeoJSON rendering, we can check our GeoJSON map with the [geojson.io](https://geojson.io/) website.

## Displaying more metadata on the map

So far, I only used the map to display the latitude and longitude of each sample, but we can actually display more information by changing the color, size, or the shape of each marker(point) for example.

Refering again the [Github documentation](https://docs.github.com/en/free-pro-team@latest/github/managing-files-in-a-repository/mapping-geojson-files-on-github#styling-features), this corresponds to the `marker-color`, `marker-size`, or `marker-symbol`.

The only thing that we have to do, is add as column with the property name and the desired values (here `marker-color`)

| marker-color | publication_doi                 | site_name       | latitude | longitude | sample_name            | sample_age | material                | archive | archive_accession |
| ------------ | ------------------------------- | --------------- | -------- | --------- | ---------------------- | ---------- | ----------------------- | ------- | ----------------- |
| #009C54      | 10.1016/j.quascirev.2017.11.037 | Hässeldala Port | 56.16    | 15.01     | HA1.1                  | 13900      | lake sediment           | ENA     | SRS2040659        |
| #C22026      | 10.3390/geosciences10070270     | Unknown         | 53.322   | 1.118     | ELF001A_95_S81_ELFM1D1 | 6000       | shallow marine sediment | ENA     | ERS3605424        |

{{< figure src="marker-color.png" title="test" >}}

![marker-color](marker-color.png)  

Here, markers in pink are host-associated single genomes, while markers in green are environmental metagenomes.

## Preventing overlapping points

As in this dataset, there are different samples coming from the sample archeological sites, it meant that I had to deal with exactly overlapping points because they share the exact same geographic coordinates.

This is problematic for the map, because only one will be displayed, the other ones being hidden below.

To overcome this issue, there is the clever little trick of slightly altering the coordinates of each sample to plot them as distinct points on the map. I do that with random sampling from the normal distribution using [numpy](https://numpy.org/doc/stable/reference/random/generated/numpy.random.normal.html) with a very small standard deviation.

```python
import pandas as pd
import geopandas
import numpy as np

df = pd.read_csv("table.tsv", sep="\t")


df['new_latitude'] = df['latitude'].apply(lambda x: np.random.normal(x, sigma))
df['new_longitude'] = df['longitude'].apply(lambda x: np.random.normal(x, sigma))

gdf = geopandas.GeoDataFrame(df, geometry=geopandas.points_from_xy(df.new_longitude, df.new_latitude))

gdf.to_file("output.geo.json", driver='GeoJSON')
```