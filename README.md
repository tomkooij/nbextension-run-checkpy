# nbextension-run-checkpy

Jupyter notebook nbextension to run [checkPy](https://www.github.com/JelleAs/checkpy/) on the current notebook.

This adds a button "checkPy" to the toolbar. When pressed, it launches checkPy by executing `!checkpy` through the active Jupyter kernel. Output is read from `stdout` and shown in a modal dialog:

![Screenshot](run-checkpy.apng "screenshot")

## Installation

Install via pip:

```
pip install nbextension-run-checkpy
```

## Acknowledgment and license

[3-clause BSD License](COPYING.md)

Based on the [nbgrader](https://github.com/jupyter/nbgrader) validate extension.
nbgrader: Copyright (c) 2014, Jupyter Development Team.
