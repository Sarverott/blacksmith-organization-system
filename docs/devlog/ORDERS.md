# ORDERS: answers to the open questions

The owner's answers to `Q<n>` of [BRAINSTORM.md](BRAINSTORM.md), written below
the line. Agents move them word for word into the changelog and leave this
file with its header only.

---

## Q15

i think that i am wrong - let's keep ".bos/" instead of new one ".craft/"
so ".bos/" replaces ".craft/" idea

.omnis.toml should contain entries of several weak hashes of file content labeled with even weaker checksuming 3 or more pseudohashes 
this allows us to make broken hashes and reduced tables of indexing symbol strings with collidings at diffrent input had same output to work as triangulum - linking between cryptographic coordinates similarly to using triangulation
for example
```js
// a12y makes from word input "authenticity" returned output "a12y"
// ` a12y("authenticity") == "a12y" ` is true
// we ignore all files begins and ends with non-letter char
// we also ignore all mentioned by every .gitignore inside this model
// directories does not counts, other variations in fs like pipelines, blockdevices and link types also
// only files
key = [
    crc32(relative_filepath),
    a12y(filename),
    adler32(relative_filepath)
]
// only hashes that has confirmed rainbow tables collisions proof of vurnability 
value = [
    sha1(rawfile),
    md5(rawfile),
    weakhashalgorithm(rawfile)
]
// example content of  
console.log(`
[moriatur]
UNIXUSAT = ${Date.now()}
[hallows]
${base32encode(key.join(""))} = "${base32encode(value.join(""))}"
`)

```

rest files there can be reconsidered

for example if dir have ".bos/scope.json" and is top layer inside forge it can have vscode workspace file that is lounched when we open scope. inside scope repositories are default threated as projects

this concepts should be drafted and later on it can be redefined in future updates