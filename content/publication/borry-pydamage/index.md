---
# Documentation: https://wowchemy.com/docs/managing-content/

title: 'PyDamage: automated ancient damage identification and estimation for contigs
  in ancient DNA de novo assembly'
subtitle: ''
summary: ''
authors:
- Maxime Borry
- Alexander Huebner
- Adam B Rohrlach
- Christina G Warinner
tags: []
categories: []
date: '2021-03-25'
lastmod: 2021-03-25T11:01:02+01:00
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ''
  focal_point: ''
  preview_only: false

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
publishDate: '2021-03-25T10:01:01.847380Z'
publication_types:
- '2'
abstract: DNA de novo assembly can be used to reconstruct longer stretches of DNA
  (contigs), including genes and even genomes, from short DNA sequencing reads. Applying
  this technique to metagenomic data derived from archaeological remains, such as
  paleofeces and dental calculus, we can investigate past microbiome functional diversity
  that may be absent or underrepresented in the modern microbiome gene catalogue.
  However, compared to modern samples, ancient samples are often burdened with environmental
  contamination, resulting in metagenomic datasets that represent mixtures of ancient
  and modern DNA. The ability to rapidly and reliably establish the authenticity and
  integrity of ancient samples is essential for ancient DNA studies, and the ability
  to distinguish between ancient and modern sequences is particularly important for
  ancient microbiome studies. Characteristic patterns of ancient DNA damage, namely
  DNA fragmentation and cytosine deamination (observed as C-to-T transitions) are
  typically used to authenticate ancient samples and sequences. However, existing
  tools for inspecting and filtering aDNA damage either compute it at the read level,
  which leads to high data loss and lower quality when used in combination with de
  novo assembly, or require manual inspection, which is impractical for ancient assemblies
  that typically contain tens to hundreds of thousands of contigs. To address these
  challenges, we designed PyDamage, a robust, automated approach for aDNA damage estimation
  and authentication of de novo assembled aDNA. PyDamage uses a likelihood ratio based
  approach to discriminate between truly ancient contigs and contigs originating from
  modern contamination. We test PyDamage on both simulated, and empirical aDNA data
  from archaeological paleofeces, and we demonstrate its ability to reliably and automatically
  identify contigs bearing DNA damage characteristic of aDNA. Coupled with aDNA de
  novo assembly, PyDamage opens up new doors to explore functional diversity in ancient
  metagenomic datasets.
publication: '*bioRxiv*'
url_pdf: https://www.biorxiv.org/content/early/2021/03/24/2021.03.24.436838.pdf
doi: 10.1101/2021.03.24.436838
---
