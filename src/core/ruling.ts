// Rulesets of the almanac (glossary: almanac): rules written for people (statement) and
// matched by code (when / unless), so a described case can be judged against them.
//   judgeCase(rulesets, { role: "agent", action: "push", target: "master" }).verdict → "ask"

export type Verdict = "allowed" | "ask" | "violation";

// a case: what happened or is about to happen; every field a word or a list of words
export type Case = Record<string, string | string[]>;

// field → patterns ("*" is any run of characters: "dev/*")
export type Conditions = Record<string, string | string[]>;

export type Rule = {
  id: string;
  statement: string;
  when: Conditions;
  unless?: Conditions;
  verdict: Verdict;
  source?: string;
};

// roles: who is who (role → name patterns), so a case with an actor gets its role
export type Ruleset = { ruleset: string; roles?: Record<string, string[]>; rules: Rule[] };

export function roleOf(rulesets: Ruleset[], actor: string): string | null {
  for (const { roles = {} } of rulesets) {
    for (const [role, names] of Object.entries(roles)) {
      if (names.some((name) => globMatches(name, actor))) {
        return role;
      }
    }
  }
  return null;
}

export type Judgement = {
  verdict: Verdict | "unknown";
  case: Case;
  // the rule that decided (the first that applies), and every other that applies after it
  rule: (Rule & { ruleset: string }) | null;
  also: (Rule & { ruleset: string })[];
};

const words = (value: string | string[] | undefined): string[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

const literal = (text: string) => text.replace(/[.+?^${}()|[\]\\]/g, "\\$&");

export function globMatches(pattern: string, value: string): boolean {
  const regex = new RegExp(`^${pattern.split("*").map(literal).join(".*")}$`, "i");
  return regex.test(value);
}

// every field of the conditions matches one value of the case's same field
export function matches(conditions: Conditions, subject: Case): boolean {
  return Object.entries(conditions).every(([field, patterns]) => {
    const values = words(subject[field]);
    return words(patterns).some((pattern) => values.some((value) => globMatches(pattern, value)));
  });
}

export function applies(rule: Rule, subject: Case): boolean {
  return matches(rule.when, subject) && !(rule.unless && matches(rule.unless, subject));
}

// the first rule that applies decides; no rule: unknown (ask)
export function judgeCase(rulesets: Ruleset[], subject: Case): Judgement {
  const applying = rulesets.flatMap(({ ruleset, rules }) =>
    rules.filter((rule) => applies(rule, subject)).map((rule) => ({ ...rule, ruleset })),
  );
  const [rule = null, ...also] = applying;
  return { verdict: rule?.verdict ?? "unknown", case: subject, rule, also };
}

// The categorizer of the core: a case in words → fields, by the words the rulesets use.
// "Cleo pushes development and master" → { actor: "Cleo", action: "push",
// target: ["development", "master"] }. (A language-model categorizer: Q17.)
export type Vocabulary = Map<string, Map<string, string>>; // field → (word → its pattern)

export function vocabulary(rulesets: Ruleset[]): Vocabulary {
  const known: Vocabulary = new Map();
  for (const { rules } of rulesets) {
    for (const rule of rules) {
      for (const conditions of [rule.when, rule.unless ?? {}]) {
        for (const [field, patterns] of Object.entries(conditions)) {
          const entries = known.get(field) ?? new Map<string, string>();
          for (const pattern of words(patterns)) {
            entries.set(pattern.toLowerCase(), pattern);
          }
          known.set(field, entries);
        }
      }
    }
  }
  return known;
}

// a word of the text stands for a known one: the same, an inflection of it (push → pushes,
// pushed, pushing; publish → publishing), or a value its glob pattern covers (dev/* → dev/Cleo)
function standsFor(token: string, known: string): boolean {
  const word = token.toLowerCase();
  if (known.includes("*")) {
    return known.replace(/\*/g, "").length > 0 && globMatches(known, token);
  }
  if (word === known) {
    return true;
  }
  const stem = known.replace(/e$/, "");
  return (
    stem.length >= 3 && /^(s|es|ed|d|ing)$/.test(word.slice(stem.length)) && word.startsWith(stem)
  );
}

export function categorize(text: string, rulesets: Ruleset[], extra: Case = {}): Case {
  const tokens = text.match(/[\p{L}\p{N}_.\-/~=]+/gu) ?? [];
  const subject: Case = {};
  for (const [field, known] of vocabulary(rulesets)) {
    const found = new Set<string>();
    for (const token of tokens) {
      for (const [lower, pattern] of known) {
        if (standsFor(token, lower)) {
          found.add(pattern.includes("*") ? token : pattern);
        }
      }
    }
    if (found.size) {
      subject[field] = found.size === 1 ? ([...found][0] ?? "") : [...found];
    }
  }
  // a first word with a capital, not known as anything else, is the actor ("Cleo pushes…")
  const [first] = tokens;
  if (
    !subject.actor &&
    first &&
    /^\p{Lu}/u.test(first) &&
    !Object.values(subject).flat().includes(first)
  ) {
    subject.actor = first;
  }
  const actor = words(extra.actor ?? subject.actor)[0];
  const role = actor ? roleOf(rulesets, actor) : null;
  if (role && !subject.role) {
    subject.role = role;
  }
  return { ...subject, ...extra };
}
