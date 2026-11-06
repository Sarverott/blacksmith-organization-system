# PROPOSALS

Ideas put up for debate by anyone working here: the owner, Cleo, other
agents. A question to answer goes to [BRAINSTORM.md](BRAINSTORM.md); a
proposal is an idea worked out far enough to argue about. Each is `PP<n>`,
numbered once and never reused, in the owner's form (from Amoorion's PP0):

```md
### PP<n> beg
> from: full name, e.g. `Sett Sarverott A.A.B. <sett@sarverott.com>`
> addressing to: ALL, or names
> related to: what it is about
> label/topic/name/title: the name of its context
> taggings: tags

###### DEFINE
what is needed to understand the proposal; may answer a `Q<n>` or refer to an inquiry

###### COMBINE
drafting, refining the idea, examples; pros and cons, the idea against reality

###### CONCLUDE
conclusions; questions for someone else to settle further (`Q<n>`), inquiries called for

> `UNIXUSAT=<ms since epoch>`
### PP<n> end
```

Agents only add proposals and never decide one in code.

---

### PP1 beg
> from: full name, e.g. `Sett Sarverott A.A.B. <sett@sarverott.com>`
> addressing to: ALL
> related to: what it is about
> topic: about rulesets and idea how to do it
> taggings: rulesets, docs

###### DEFINE
depending on where, when and with what conditions there can be described several rules of what and when is happend where
these can be grouped into sets of rules with shared scope like local usage, development of BOS, CI/CD flows and actions etc. - grouped by dir and shared "setting.yml" 


###### COMBINE
- draft example of rule:
```md
    ---
    tasks: 
        - <locallabel>: <{taskfiles_ref}>
    ---

    # RULENAME

    description of what, when and why

    > detailed description

    ### if
    - step
    - step

    ### else
    - step
    - step

```
###### CONCLUDE
that draft remains rough and as raw idea. it can help in future but for now we do not need it as required in my opinion

### PP1 end

> Rejected by the owner (Q18, `docs/changelog/phase-2.md`): rulesets stay JSON,
> Markdown is generated from them.