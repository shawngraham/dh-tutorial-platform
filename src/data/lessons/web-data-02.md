---
id: web-data-02
title: Web Scraping Ethics and Best Practices
moduleId: web-data-collection
prerequisites:
  - web-data-01
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Locate and interpret a robots.txt file
  - Understand "Rate Limiting" and the impact of scraping on small archives
  - Differentiate between public data and copyrighted or sensitive data
  - Implement "polite" scraping practices using Python
keywords:
  - ethics
  - robots.txt
  - copyright
  - politeness
  - rate limiting
---

# The Ethical Scraper: Citizenship in the Digital Archive

  ## Just because you can, doesn't mean you should.
  Web scraping is a powerful tool, but in Digital Humanities, we often work with the websites of libraries, small museums, and university archives. Unlike Google or Amazon, these sites may run on limited budgets and small servers. If you send 10,000 requests per second, you could accidentally perform a "Denial of Service" (DoS) attack, crashing the very archive you are trying to study. And AI companies have created much damage through aggressive web-scraping. 

  ---

  ## 1. The `robots.txt` Protocol
  Before scraping, always check `website.com/robots.txt`. This is a plain text file where site owners define their rules for automated bots.

  **Common Terms:**
  - **User-agent**: Who the rule applies to (`*` means everyone).
  - **Disallow**: Paths that bots are **not** allowed to visit.
  - **Allow**: Specific paths bots **are** allowed to visit within a disallowed folder.

  ---

  ## 2. Being a "Polite" Guest
  A polite scraper "acts like a human." Humans take a few seconds to read a page before clicking the next one. You can mimic this using the `time` library.

  ```python
  import time

  pages = ["/page1", "/page2", "/page3"]

  for page in pages:
      # [Your scraping code here]
      print(f"Scraped {page}")
      
      # Wait for 2 seconds before the next request
      time.sleep(2) 
  ```

  ---

  ## 3. Identify Yourself (The User-Agent)
  When your script visits a site, it sends a "User-Agent" string. By default, this says "Python-requests." It is best practice to change this to include your email address. This way, if your script causes trouble, the web admin can email you instead of simply blocking your IP address.

  ---

  ## 4. Copyright and "Data Sovereignty"
  - **Public vs. Private**: Just because data is visible doesn't mean it's "Public Domain." 
  - **Fair Use**: In many regions, scraping for non-commercial scholarly research is "Fair Use," but re-publishing that data (e.g., putting the full text of a copyrighted novel on your own site) is a violation.
  - **Indigenous Data**: Be extra cautious with archives of Indigenous materials. Do you have permission? Are you in good relationship? Are you a member of a particular Nation or community? Stop, and before going any further consider guidance like [The First Nations Principles of OCAP [link]](https://fnigc.ca/ocap-training/).

  :::tip
  **The Golden Rule of Scraping**: Always look for a "Download Data" button or an API (Application Programming Interface) first. Scraping should be your last resort!
  :::

  :::challenge
  Your research script wants to scrape several pages from a small archive. A snippet of the archive's `robots.txt` is provided. Parse it to find which paths are off-limits, then write a polite scraper that skips disallowed pages and waits between every request it does make.
  :::

---challenges---

### Challenge: Write a Polite Scraper

- id: web-data-02-c1
- language: python
- difficulty: beginner

#### Starter Code
```python
import time

robots_txt = """User-agent: *
Disallow: /private-collections/
Disallow: /admin/
Allow: /catalog/
Allow: /exhibits/"""

# Pages your research script wants to visit
pages_to_scrape = [
    "/catalog/manuscripts",
    "/exhibits/1920s",
    "/private-collections/letters",
    "/admin/index",
    "/catalog/photographs",
]

# A mock function simulating a real page fetch
def fetch_page(path):
    return f"<html>Content of {path}</html>"

# Step 1: Parse robots_txt to build a list of disallowed paths.
#         Loop through the lines; collect the path from any line
#         that starts with "Disallow".
disallowed = []
# Your code here

# Step 2: Loop through pages_to_scrape. For each page:
#         a. Check whether it STARTS WITH any path in disallowed.
#            If so, print a "Skipping" message and move on.
#         b. Otherwise, call fetch_page(), print a "Scraped" confirmation.
#         c. Wait 1 second before the next iteration using time.sleep(1).
# Your code here
```

#### Expected Output
```
Scraped /catalog/manuscripts
Scraped /exhibits/1920s
Skipping /private-collections/letters — disallowed by robots.txt
Skipping /admin/index — disallowed by robots.txt
Scraped /catalog/photographs
```

#### Hints

1. Split `robots_txt` into lines with `.splitlines()`. For each line that starts with `"Disallow"`, split on `": "` and take index `[1]` to get the path.
2. To check whether a page is forbidden, use `any(page.startswith(path) for path in disallowed)`.
3. `time.sleep(1)` pauses execution for one second — put it at the end of your loop so it runs after every page, whether scraped or skipped.

#### Solution
```python
import time

robots_txt = """User-agent: *
Disallow: /private-collections/
Disallow: /admin/
Allow: /catalog/
Allow: /exhibits/"""

pages_to_scrape = [
    "/catalog/manuscripts",
    "/exhibits/1920s",
    "/private-collections/letters",
    "/admin/index",
    "/catalog/photographs",
]

def fetch_page(path):
    return f"<html>Content of {path}</html>"

# Step 1: Build the disallowed list from robots.txt
disallowed = []
for line in robots_txt.splitlines():
    if line.startswith("Disallow"):
        path = line.split(": ")[1]
        disallowed.append(path)

# Step 2: Politely scrape only what is allowed
for page in pages_to_scrape:
    if any(page.startswith(path) for path in disallowed):
        print(f"Skipping {page} — disallowed by robots.txt")
    else:
        fetch_page(page)
        print(f"Scraped {page}")
    time.sleep(1)
```

