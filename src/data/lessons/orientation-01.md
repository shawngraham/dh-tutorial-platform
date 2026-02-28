---
id: orientation-01
title: Orientation
moduleId: orientation
prerequisites:
  - 
estimatedTimeMinutes: 1
difficulty: beginner
learningObjectives:
  - Become familiar with this platform
  - Make a research note
  - Try some code out, then reset the sandbox
keywords:
  - orientation
  - getting-started

---

# Orientation

## How does this all work?

On the first day of class, the instructor goes through the syllabus and explains how everything works. That's what we're doing here!

Oh, just so you know: the 'estimated times' for all of these lessons? We haven't had a chance to test out with a class yet, so every lesson is listed as '10 minutes' by default. We'll change that to something more realistic, in due course. It might be that some lessons are very quick, while others take a bit more energy. Just take things at your own pace, dip in and out of anything that takes your fancy.

## The layout

When you visit this site via a desktop or laptop computer, the left hand side will contain the tutorial materials, and the right hand side will contain the code sandbox where you can try things out, a window where the results of your code will be displayed, and a button for opening a notepad where you can make observations tied to the particular lesson. Across the top are links to the overall dashboard recording your progress, a reminder of your customized pathway through the materials, a library showing _all_ of the materials available (so you don't _have to_ follow the suggested route!), your progress, and a way to export your notes and all of the tutorial materials.

Everything is saved in your browser's memory; nothing you do here is visible to anyone else; nothing leaves your machine.

## The Sandbox

It's one thing to read about a concept, even when you have worked-out examples, its quite another to try to do it yourself. For each lesson then there is a sandbox for you to experiment and trying things out, without having to install anything. 

For each lesson, there will be some 'starter' code that is _almost_ complete. The sandbox will sometimes have more than one challenge. When this is the case, there will be tabs across the top of the sandbox with the challenge labels. For any given challenge, the expected outcomes are printed at the top so you know what you're aiming for. If things get messy, you can always hit the `reset` button. 

The concepts and explanations are in the text, and by reading and studying the material, you should be able to complete the sandbox code - if you hit the 'run code' button, the sandbox will duly run through your code. If something is wrong, an error will appear in the bottom window. If it all goes right, you'll see the output of your code. If your code runs, hit the 'check' button to see if you've gotten the solution. The system will keep track of when you pass the challenges, but not to grade you: DH is simply a matter of practice, and the more you try, the more you pass, the more you'll get the hang of this. 

And of course, it's entirely possible to pass these challenges via solutions that we didn't think of: that's part of the fun of coding.

There is always a 'hints' button at the bottom of each sandbox, and you can always hit the 'show solution' button if you really get stuck.

## Key Concepts

The idea is that each lesson follows the same format, using the ADEPT framework:

| Section | Purpose | Approximate time |
|---|---|---|
| **A — Analogy** | Connect to a familiar concept | 2 min |
| **D — Diagram** | We give a diagram or describe in text, or show some code  | 2 min |
| **E — Example** | Concrete case from DH research with real, working code | 5 min |
| **P — Practice** | Guided coding exercise | 10 min |
| **T — Transfer** | Connect to a new situation or the learner's own research | 5 min |

:::definition
**digital humanities**: The use of digital research methods to explore humanistic questions while at the same time deploying humanistic methods and perspectives to understand our digital infosphere
:::

See that floating 'notes' button over to the bottom right? Click that now. It will open a notepad where you can jot down observations and thoughts as you go. Once you give a note a title, you can save it. Make a new note, copy the definition of DH into it with your initial thoughts. Add some appropriate keywords.

### Documenting Your Process

DH isn't about what you accomplish; very often, it's about the process of how you've done it. The lessons here put an emphasis on thinking through the consequences of those procedural choices. See the `export` button in the menu bar? That will allow you **to export your notes _and_ all of the lessons, as an interlinked stack of markdown text files using wikilink conventions**. That means, you can open the entire folder of materials on your own machine using personal knowledge management software like **[obsidian \[link\]](https://obsidian.md)** for future reference and exploration. Because it's all wikilinked, your tags also become pathways through the materials reflecting the way you think.

## Practice

In many lessons, there will be a 'try-it' section with code examples. You can copy that code, and then click into the sandbox. Delete everything in the sandbox and then paste the try-it code. You can always hit the `reset` button to clear things and reload the starter code.

:::try-it

Copy and paste this into the sandbox window

```python
message = "Digital Humanities Rocks"
print(message)
```
:::

Make a research note with pointers on things to remember when using this sandbox

## Transfer

These tutorials will not necessarily make you into a 'coder'. Rather, we are aiming to help you understand the concepts and issues that confront DH research so that you have the necessary digital literacy to appraise what you read and indeed, to know what you do not know so that you can move forward. 

Maybe, after doing the text analysis lessons here, you realize that text analysis is exactly what your project wants. Now you have the knowledge to ask the right questions and to understand the tacit assumptions of materials like **[The Programming Historian\[link\]](https://programminghistorian.org)** or Melanie Walsh's **[Introduction to Cultural Analytics \[link\]](https://melaniewalsh.github.io/Intro-Cultural-Analytics/welcome.html)** 

## Python on your own machine

Because we are using a sandbox environment, we are using a version of python that can safely exist within a browser environment. On the other hand, this means that not every Python package (bundle of pre-made code that solves a particular problem) is available to us here. When that is an issue, the lesson will explicitly flag the issue and explain it. Eventually, you might chafe at that restriction! 

For instance, if you wrote code in the sandbox that saved data to a file, that file exists in your browser's storage, not on your machine. Normally, if you were using Python installed on your computer, if you saved the data to file, it'd appear there in the folder you're working in. In our sandbox, that doesn't happen.

When you are ready and have outgrown this sandbox, you'll want to install Python on your own machine; we suggest following [these instructions from the Programming Historian](https://programminghistorian.org/en/lessons/introduction-and-installation).

For now, here are two code snippets that might be handy later on. Don't worry about remembering these; just know that you can always return to this lesson via the `library` link at top and you can copy and modify this example should you ever need it. Of course, if you were working with Python on your own machine, you wouldn't need this work-around.

### Code Example: Getting a file _out_ of the sandbox

Here is some code for making a file you save in the sandbox appear in your browser downloads; you don't need this right away (perhaps never) but this seemed like a good time to make it available, just in case.

```python

import js
from js import document, URL, Blob

# Part 1: Python - Create content (directly or read from virtual FS)
content = 'First Line of Analysis\nSecond Line of Analysis'
filename = 'analysis_results.txt'

# Part 2: JavaScript Bridge - Trigger browser download
# 1. Create a JavaScript Blob from the string
blob = Blob.new([content], {type: 'text/plain'})

# 2. Create a temporary URL for the Blob
url = URL.createObjectURL(blob)

# 3. Create a hidden <a> element and trigger click
link = document.createElement('a')
link.href = url
link.download = filename
document.body.appendChild(link)
link.click()

# 4. Cleanup
document.body.removeChild(link)
URL.revokeObjectURL(url)

```

### Code Example: Installing a Python Package with Micropip

Because we are in the Pyodide sandbox environment when we code, not every Python package is available. The lessons are designed accordingly, but you might like to know how to see if other packages you might encounter through googling or reading other tutorials could be used here. The solution is `micropip`:

```python
import micropip
await micropip.install("name-of-package")
```

In a full Python environment, you can use the `pip` command at your terminal or command prompt:

```bash
pip install name-of-package
```

## Ready? Let's go!



:::challenge
Try out the code sandbox! Make some errors, reset the sandbox.

After you run your code, hit the `check` button to see if you're right.

In the second challenge, we show you one more feature of the sandbox: its ability to make charts. When you run the starter code, a simple chart will be created. This will be displayed in a pop-up. You can save the chart to your machine, or copy it to your notes.
:::

---challenges---

### Challenge: Mess around with the sandbox

- id: orientation-01-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
# Modify the code below, 
# then hit 'run code'.
# The goal is to have the machine print out your name as output
# Remember you can hit the `reset` button to clear out any changes and bring this back to the beginning.

my_name = "put your name here"

# Your code here;
# What might go between the ( )
print()
```

#### Expected Output

```
Your name!
```

#### Hints

1. `my_name` is a variable; `print` will print out whatever goes between the ( and )


#### Solution

```python
# Complete working code that produces the expected output
my_name = "Bart Simpson"
print(my_name)
```

### Challenge: Second challenge title

- id: orientation-02-c2
- language: python
- difficulty: beginner

#### Starter Code

```python
# There's nothing for you to complete here;
# We just want to show you what happens when
# the sandbox plots our data for us.
# It'll take a moment to run, and then you'll
# get the pop-up. You can close the plot, but a new button will
# appear 'View Plot' for when you want to see it again.

import matplotlib.pyplot as plt
plt.clf() # this clears the canvas

# 1. Prepare Data (List A must match List B in length)
decades = ["1810s", "1820s", "1830s"]
counts = [5, 12, 18]

# 2. Choose the Chart Type
plt.bar(decades, counts, color='skyblue')
plt.show()

```

#### Expected Output

```
Matplotlib is building the font cache; this may take a moment.
```

#### Hints

1. No hints for this one!


#### Solution

```python
# Second challenge starter code
import matplotlib.pyplot as plt
plt.clf() # this clears the canvas

# 1. Prepare Data (List A must match List B in length)
decades = ["1810s", "1820s", "1830s"]
counts = [5, 12, 18]

# 2. Choose the Chart Type
plt.bar(decades, counts, color='skyblue')
plt.show()
```
