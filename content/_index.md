---
title: ''
summary: ''
date: 2022-10-24
type: landing

sections:
  - block: hero
    content:
      title: |-
        <span class="text-white">MAXIME BORRY, PHD.<br>BIOINFORMATICS SCIENTIST</span>
      text: |-
        <span class="text-white">Developing Bioinformatics statistical tools and workflows for scalable and reproducible, and actionable results.</span>
    design:
      alignment: left
      background:
        image:
          filename: climbing.jpg
          filters:
            brightness: 0.5

  - block: resume-biography-3
    content:
      username: maxime
      text: ''
    design:
      background:
        gradient_mesh:
          enable: true
      name:
        size: md
      avatar:
        size: medium
        shape: circle

  - block: resume-experience
    id: experience
    content:
      username: maxime


  - block: collection
    id: papers
    content:
      title: Publications
      count: 20
      archive:
        text: "Next"
      filters:
        folders:
          - publication
    design:
      view: citation
      columns: 1
  - block: collection
    id: projects
    content:
      title: Projects
      filters:
        folders:
          - project
    design:
      view: article-grid
      columns: 2
  - block: collection
    id: posts
    content:
      title: Recent Posts
      filters:
        folders:
          - post
    design:
      view: article-grid
      columns: 2

---
