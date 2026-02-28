---
id: repro-03
title: 'Checksums and Integrity: Proving Nothing Changed'
moduleId: reproducibility
prerequisites:
  - repro-02
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Explain what a checksum is and why data integrity matters in research
  - Use Python's hashlib module to compute SHA-256 hashes of text content
  - Demonstrate how even minimal changes produce completely different hashes
  - Verify data integrity by comparing computed hashes against expected values
keywords:
  - checksum
  - hash
  - SHA-256
  - data integrity
  - hashlib
  - verification
  - digital preservation
---

# Checksums and Integrity: Proving Nothing Changed

## Analogy

When a notary public stamps a document, they create a seal that proves the document has not been altered since the moment of notarization. If someone changes even a single word, the seal no longer matches. Archives use similar techniques: accession records note the exact page count, physical condition, and contents of a collection at the time of deposit, so any later alteration can be detected.

A **checksum** is the digital equivalent of a notary's seal. It is a short, fixed-length string computed from the contents of a file. If even one character changes, the checksum changes completely. This gives you a mathematical guarantee that your data is exactly what it was when you first recorded it.

## Key Concepts

### What Is a Hash?

A **hash function** takes input of any length and produces a fixed-length output called a **digest** or **checksum**. The same input always produces the same output, but even a tiny change in the input produces a completely different output.

:::definition
**Checksum (Hash Digest)**: A fixed-length string of characters computed from data content. It acts as a digital fingerprint -- if the data changes, the fingerprint changes. Common algorithms include MD5 (older, less secure) and SHA-256 (current standard).
:::

### Computing Hashes with hashlib

Python's `hashlib` module provides hash functions in the standard library. Here is how to compute a SHA-256 hash of a string:

```python
import hashlib

text = "Even though I was very shy, I found I could get onstage if I had a new identity."
hash_digest = hashlib.sha256(text.encode()).hexdigest()
print(f"Text:   {text}")
print(f"SHA-256: {hash_digest}")
```

Output:
```
Text:   Even though I was very shy, I found I could get onstage if I had a new identity.
SHA-256: 4a4218a22ca8ca80783bcb9e5eca93670923feea6cd60bb8d52c9d0a58a3876e
```

The `.encode()` converts the string to bytes (which hashlib requires), and `.hexdigest()` returns the hash as a readable hexadecimal string.

### The Avalanche Effect

One of the most important properties of a good hash function is the **avalanche effect**: changing even one character produces a completely different hash. Watch what happens when we lowercase a single letter:

```python
import hashlib

original = "When in the Course of human events"
altered  = "When in the course of human events"  # 'C' -> 'c'

hash1 = hashlib.sha256(original.encode()).hexdigest()
hash2 = hashlib.sha256(altered.encode()).hexdigest()

print(f"Original: {hash1}")
print(f"Altered:  {hash2}")
print(f"Match:    {hash1 == hash2}")
```

Output:
```
Original: 0844a2e2097c3f9e4b9c08693a99b256de7e073b3cadaad09e4905dd201840af
Altered:  2234d0d61033ecb4bdc866ff67551f6474fe7517c114a1c5f1cb178b6206c89d
Match:    False
```

The two hashes share almost nothing in common, even though the inputs differ by just one letter. This is what makes checksums so powerful for detecting accidental modifications.

:::definition
**Avalanche Effect**: The property of a hash function where a small change in the input produces a drastically different output. This ensures that even subtle data corruption or tampering is immediately detectable.
:::

### Integrity Verification in Practice

The standard workflow for integrity verification has two phases:

1. **Record phase**: When you first create or receive data, compute and store its hash
2. **Verify phase**: Later, recompute the hash and compare it to the stored value

```python
import hashlib

# Phase 1: Record the hash when you first receive the text
original_text = "To be or not to be, that is the question"
recorded_hash = hashlib.sha256(original_text.encode()).hexdigest()
print(f"Recorded hash: {recorded_hash[:16]}...")

# Phase 2: Later, verify the text is unchanged
current_text = "To be or not to be, that is the question"
current_hash = hashlib.sha256(current_text.encode()).hexdigest()

if current_hash == recorded_hash:
    print("Integrity check: PASSED")
else:
    print("Integrity check: FAILED -- data has been modified!")
```

Output:
```
Recorded hash: 543263ca078a4526...
Integrity check: PASSED
```

### Why This Matters for DH

In digital humanities research, data integrity is critical in several contexts:

- **Archival deposits**: When you submit a digital corpus to a repository, checksums prove the files arrived intact
- **Longitudinal studies**: If you return to a corpus years later, checksums confirm nothing was accidentally altered
- **Collaborative projects**: When multiple researchers share files, checksums verify everyone has identical copies
- **Publication**: Providing checksums with your published dataset lets other scholars verify they have your exact data

## Practice

:::try-it
Compute the SHA-256 hash of the string `"digital humanities"`. Then compute the hash of `"Digital humanities"` (capital D). Print both hashes and verify they are different. What does this tell you about case sensitivity in your data?
:::

## Transfer

The Library of Congress, HathiTrust, and other major digital preservation initiatives use checksums as a core part of their preservation workflows. Every file in their collections has a recorded checksum, and automated systems regularly recompute and compare these values to detect bit rot (gradual data degradation on storage media).

When you publish a DH dataset or submit one to a repository, including a manifest of checksums (sometimes called a "checksum manifest" or "fixity log") is considered best practice. It transforms your data deposit from a simple file transfer into a verifiable, trustworthy scholarly artifact.

:::challenge
You are verifying the integrity of a small text corpus. You have the original checksums from when the files were first deposited. One of the files has been subtly modified since then. Compute the current checksums and identify which file has been tampered with.
:::

---challenges---

### Challenge: Verify Corpus Integrity

- id: repro-03-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
import hashlib

# Current file contents (one has been subtly modified!)
file_contents = {
    'corpus_v01.txt': 'The quick brown fox jumps over the lazy dog',
    'corpus_v02.txt': 'A systematic review of digital humanities method',
    'corpus_v03.txt': 'Encoding cultural heritage in structured data formats',
}

# Original checksums recorded at deposit time
expected_hashes = {
    'corpus_v01.txt': 'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592',
    'corpus_v02.txt': 'f968268a8e8df230d46419f5bab9e997e73bd8ffb50b9cbff63a6cfa9c8c6e78',
    'corpus_v03.txt': '69279692bfbcc87cb94acd4857437c57fd57fb52cef68f57eed3803fe5ad4558',
}

print('=== Integrity Verification ===')
for filename in sorted(file_contents.keys()):
    content = file_contents[filename]
    # TODO: Compute the SHA-256 hash of content
    # TODO: Compare against the expected hash
    # TODO: Print INTACT or MODIFIED status
    # TODO: If modified, print first 16 chars of expected and actual hash
    pass
```

#### Expected Output

```
=== Integrity Verification ===
corpus_v01.txt: INTACT
corpus_v02.txt: MODIFIED
  Expected: f968268a8e8df230...
  Got:      0c0047028f64d30d...
corpus_v03.txt: INTACT
```

#### Hints

1. Use `hashlib.sha256(content.encode()).hexdigest()` to compute the hash of each file's content.
2. Compare the computed hash to `expected_hashes[filename]` using `==`.
3. For modified files, use string slicing like `hash_value[:16]` to show the first 16 characters followed by `...`.
4. The modification is very subtle -- `corpus_v02.txt` is missing the final letter 's' in "methods" (it reads "method" instead).

#### Solution

```python
import hashlib

# Current file contents (one has been subtly modified!)
file_contents = {
    'corpus_v01.txt': 'The quick brown fox jumps over the lazy dog',
    'corpus_v02.txt': 'A systematic review of digital humanities method',
    'corpus_v03.txt': 'Encoding cultural heritage in structured data formats',
}

# Original checksums recorded at deposit time
expected_hashes = {
    'corpus_v01.txt': 'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592',
    'corpus_v02.txt': 'f968268a8e8df230d46419f5bab9e997e73bd8ffb50b9cbff63a6cfa9c8c6e78',
    'corpus_v03.txt': '69279692bfbcc87cb94acd4857437c57fd57fb52cef68f57eed3803fe5ad4558',
}

print('=== Integrity Verification ===')
for filename in sorted(file_contents.keys()):
    content = file_contents[filename]
    actual_hash = hashlib.sha256(content.encode()).hexdigest()
    expected = expected_hashes[filename]
    if actual_hash == expected:
        status = 'INTACT'
    else:
        status = 'MODIFIED'
    print(f'{filename}: {status}')
    if status == 'MODIFIED':
        print(f'  Expected: {expected[:16]}...')
        print(f'  Got:      {actual_hash[:16]}...')
```

