---
# Documentation: https://wowchemy.com/docs/managing-content/

title: "noSQL: when it's too big for a dictionary"
subtitle: "How to use and optimize RocksDB for very large files"
summary: ""
authors: [Maxime]
tags: [noSQL, database, big data]
categories: []
date: 2021-02-10T10:40:21+01:00
lastmod: 2021-02-10T10:53:21+01:00
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: true

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---

Recently, I've been working on a project where I need to store a key-value pairs for very large files.
In Python, the first idea would be to use a [dictionary](https://docs.python.org/3/tutorial/datastructures.html#dictionaries).  
However, I had more than 800 millions key-value pairs to store, so a dictonary just wouldn't cut it.  
Enters the world of noSQL databases, and more specifically [RocksDB](https://rocksdb.org).  
Described by its creators, originally at Facebook, as a "high performance persistant key-value store", it behaves pretty much like a dictonary, but can scale very well.

Written in C++, there is fortunately a python binding, in the name of [python-rocksdb](https://github.com/twmht/python-rocksdb), even available as a [conda package](https://anaconda.org/conda-forge/python-rocksdb).

It's relatively simple to use:

```python
import rocksdb
# Create or open database
db = rocksdb.DB("test.db", rocksdb.Options(create_if_missing=True))

key = "Hello"
value = "World"

# Store key-value pair
db.put(key.encode(), value.decode())

# Get value for a given key
print(db.get(key.encode()).decode())
# prints "World"

# Delete a key value-pair
db.delete(key.encode())
```

Because RocksDB stores all data as byte strings, one need to use `.encode()` and `.decode()` to store and get data.

### Batch operation

One way to speed up RockDB, is to perform operations in batch, instead of performing them one by one.

```python
import rocksdb
db = rocksdb.DB("test.db", rocksdb.Options(create_if_missing=True))

batch = rocksdb.WriteBatch()
batch.put(b"key", b"v1")
batch.delete(b"key")
batch.put(b"key", b"v2")
batch.put(b"key", b"v3")

db.write(batch)
```

### Batch limits and solutions

**But beware !** For very large files, the batch can become too big for the memory of your computer, and you end up [swapping](https://www.enterprisestorageforum.com/storage-hardware/memory-swapping.html) like crazy !

{{< figure  src="https://media1.tenor.com/images/09e8655db8859a953eb58c64a9fc7d7e/tenor.gif?itemid=11213683" title="When memory overflows to swap" >}}

To prevent this, we have to restrict ourselves to batches of reasonable sizes, meaning making more batches, but smaller.

**But beware !** RocksDB storage system relies on many indivual `.sst` files, that RocksDB opens in parallel to make queries and store data. The larger the database, the more files are open. And this can lead to this kind of error:

```bash
IO error: While open a file for appending: xxxxxxx.sst: Too many open files
```

Indeed, there is maximum number of files that can be open at any give time by a single process.   
For example, it's [256 by default on macOS](https://stackoverflow.com/questions/6624077/max-open-files-per-process)

Luckily, to overcome this hurdle, RocksDB has the `max_open_files` option.

Putting it all together, this gives us the following script:

```python
import rocksdb
from subprocess import check_output
from tqdm import tqdm

def get_nb_lines(filename):
  """A function for getting the number of lines in a file
  Args:
    filename(str): The path to a file
  Returns:
    int: Number of lines in file
  """
  cmd = f"wc -l {filename}"
  return int(check_output(cmd, shell=True).split()[0])

OPTS = rocksdb.Options()
OPTS.create_if_missing = False
OPTS.max_open_files = 250

# Instantiating the database
db = rocksdb.DB("mybigdata.db", OPTS)

# The big file we want to store in RocksDB
key_value_file = "very_large_file.tsv"

# We get the number of key-value pairs in the file
nb_key_value_pairs = get_nb_lines(key_value_file)

# Starting our first batch
batch = rocksdb.WriteBatch()

# Key-value pair counter
i = 0

# Number of batches, the more, the less memory used
max_batches = 100

# Setting the batch size: how many key-value pairs go in each batch
batch_size = min(nlines-1, int(nlines/max_batches))

with open(key_value_file) as bigfile:
  for line in tqdm(bigfile, total=nlines):
    # Each line looks like: key [tab] value
    linesplit = line.split()
    key = linesplit[0]
    value = linesplit[1]
    batch.put(bytes(key, encoding='utf8'), bytes(value, encoding='utf8'))
    # If we reached the batch size, store it in RocksDB, and create a new batch
    if i % batch_size == 0:
        db.write(batch)
        batch = rocksdb.WriteBatch()
# Store the remaining key-value pairs
db.write(batch)
```

