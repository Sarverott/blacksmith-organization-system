// Every commit message is a conventional commit: <type>(<scope>): <subject>
// The core's versioning procedure reads the types; a step is one commit.
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-max-length": [2, "always", 100],
    "body-max-line-length": [0], // bodies list files, lines can be long
    "footer-max-line-length": [0],
    "subject-case": [0], // subjects may start with a name, e.g. "update README"
  },
};
