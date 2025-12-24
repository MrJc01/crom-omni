import re

path = 'dist/core/parser.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern: ((condition && p.cur_token.kind) !== TOKEN_EOF)
# Fix to: (condition && p.cur_token.kind !== TOKEN_EOF)
# Regex needs to capture the first condition part.

# Example: while ((p.cur_token.kind !== TOKEN_RBRACE && p.cur_token.kind) !== TOKEN_EOF)
# We match: \(\((.*?) && p\.cur_token\.kind\) !== TOKEN_EOF\)
# Replace: ($1 && p.cur_token.kind !== TOKEN_EOF)

regex = r"\(\((.*?) && p\.cur_token\.kind\) !== TOKEN\_EOF\)"
replacement = r"(\1 && p.cur_token.kind !== TOKEN_EOF)"

new_content = re.sub(regex, replacement, content)

# Check if changes happened
if content != new_content:
    print("Fixed malformed loop conditions.")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
else:
    print("No matches found to fix.")
