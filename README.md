# GitHub harvester

A simple command download GitHub repositories from cli

---

This tool has been developed to be combined with [moss](https://theory.stanford.edu/~aiken/moss/), [dolos](https://www.npmjs.com/package/@dodona/dolos) and more to detect plagiarism in the code provided by students for their projects.
## Usage

```sh
> npx github-harvester --help

usage: index.mjs [-h] [--page PAGE] projectName
Simple tool to harvest GitHub repositories

positional arguments:
  projectName           Keyword to search for

optional arguments:
  -h, --help            show this help message and exit
  --page PAGE, -p PAGE  number of pages to download (10 per page)
```

