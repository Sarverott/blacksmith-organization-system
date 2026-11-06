# ORDERS: answers to the open questions

The owner's answers to `Q<n>` of [BRAINSTORM.md](BRAINSTORM.md), written below
the line. Agents move them word for word into the changelog and leave this
file with its header only.

---

## Q16
1. do not compare a12y with A11Y - I invent a12y algorithm when i met that whole idea of A11Y. a12y is authentic supported by logic method to replace A11Y how it should actually be implemented instead of heterogeneous, conventional, and flawed due to the absence of clear, universal, and simple operating principles. a12y simply takes any sort of char arrayed string word, grabs first letter, gets length and grabs last letter - simple yet usefull. it even can be used in compression dictionaries building with 4 byte words and variation around low level coding implementations.
2. we should be able to change allocator algorithm used in hashcoords of entries that are 3 methods for each keyname and valuedata
3. yes, ".omnis.toml" should be in ".bos/". each model has ".omnis.toml" that describes only that model, not submodels - they have own ".omnis.toml" and area of work
4. when it meet some defined BOS model item (e.g. it see ".bos/" that is other than own one) it stops look further and deeper. also all dirs ignored skips consider the content if it was not explicitly excluded from ignoring. we do not want to dig into .venv or node_modules - waste of time, package lock and uv lock makes that already, we can identify them as finality checksum
5. that's right. one way to use that information is fast compare if changes were been made while project was closed. other benefits are checks of security to monitor possible injections. there are many stuff when this file will prove to be very useful.