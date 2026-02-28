---
id: web-data-01
title: Understanding HTML Structure
moduleId: web-data-collection
prerequisites:
  - python-basics-05
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Identify HTML tags, attributes, and text content
  - Understand the hierarchical "Parent-Child" nature of the DOM
  - Use browser Inspector tools to locate research data
  - Distinguish between structural tags and metadata attributes
keywords:
  - html
  - dom
  - elements
  - scraping
  - tags
  - attributes
---

# The Anatomy of a Webpage

  ## HTML as a Hierarchical Map
  Most Digital Humanities data is "trapped" inside webpages—think of online archives, newspaper sites, or digital libraries. To "scrape" this data, we have to stop seeing the webpage as a visual design and start seeing it as a **structured document** called the **DOM (Document Object Model)**.

  ---

  ## 1. Elements, Tags, and Attributes
  An HTML **element** usually consists of a start tag, some content, and an end tag.

  - **Tags**: The "labels" that tell the browser what the data is (e.g., `<h1>`, `<p>`, `<a>`).
  - **Attributes**: Extra information tucked inside the start tag. These are vital for DH because they often contain the data we want (like links) or help us identify specific sections.

  ```html
  <a href="https://archive.org" class="source-link">Visit the Archive</a>
  <!-- ^Tag   ^Attribute          ^Class Name      ^Content          ^End Tag -->
  ```

  ---

  ## 2. The Tree Structure (Nesting)
  HTML is built like a set of nesting dolls. One tag "wraps" around others, creating a **Parent-Child** relationship.

  - **Parent**: An element that contains other elements (e.g., a `<div>` containing several paragraphs).
  - **Child**: An element contained within another.

  ```html
  <div id="project-description">
      <h1>The Mary Shelley Project</h1>
      <p>This is a <em>digital</em> edition.</p>
  </div>
  ```
  In the example above, `<div>` is the parent. `<h1>` and `<p>` are siblings. The word "digital" is a child of the `<em>` (emphasis) tag.

  ---

  ## 3. Common Tags in DH Projects
  | Tag | Name | DH Use Case |
  | :--- | :--- | :--- |
  | **`<a>`** | Anchor | Finding links to PDF documents or other archive pages. |
  | **`<table>`** | Table | Storing structured census data or casualty lists. |
  | **`<ul> / <li>`** | List / Item | Navigating menus or catalogs of works. |
  | **`<span> / <div>`** | Container | Generic boxes often labeled with "class" names for styling. |

  ---

  ## 4. The Researcher's Secret Tool: The Inspector
  You don't need to read the entire source code of a website. In your browser (Chrome, Firefox, or Safari), you can **right-click** on any piece of text or any image and select **"Inspect"**. 

  This opens a side window that shows you exactly where that item lives in the HTML tree. Finding the "class" or "id" of an element using the Inspector is the very first step of every web scraping project.

  :::tip
  **Why does this matter?** 
  If you want to download 1,000 poems from a website, you don't want to copy-paste each one. You want to tell Python: "Find the `<div>` with the class `poem-body` and give me the text inside it."
  :::

  :::challenge
  While we usually use libraries to "strip" HTML, it is important to remember that HTML is ultimately just a string of text. In the challenge in the sandbox, use your string manipulation skills to extract the human-readable text from a raw HTML tag.
  :::
  

---challenges---

### Challenge: Manual HTML Tag Removal

- id: web-data-01-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
# A researcher has scraped a heading, but it still has HTML tags attached.
  html_string = "<h1>Digital Humanities</h1>"

  # Goal: Extract only the text "Digital Humanities" 
  # by removing the opening <h1> and closing </h1> tags.

  # Your code here
  # 1. Use .replace() to remove the opening tag
  # 2. Use .replace() to remove the closing tag (nb outside of this environment, you'd use an appropriate _parser_ to do this step.)
  # 3. Assign to a variable 'clean_text' and print it
  
```

#### Expected Output

```
Digital Humanities
```

#### Hints

1. You can chain the .replace() methods together.
2. Remember that the closing tag has a forward slash: </h1>
3. Make sure your strings in .replace() exactly match the tags in the variable.

#### Solution

```python
html_string = "<h1>Digital Humanities</h1>"
  clean_text = html_string.replace("<h1>", "").replace("</h1>", "")
  print(clean_text)
```

