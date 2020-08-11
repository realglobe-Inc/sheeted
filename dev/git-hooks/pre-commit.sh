#!/bin/sh
#
## Apply prettier ( https://prettier.io/docs/en/precommit.html#option-5-bash-script )

FILES=$(git diff --cached --name-only --diff-filter=ACM "*.ts" "*.tsx" | sed 's| |\\ |g')

test -z "${FILES}" && exit 0

# Prettify all selected files
echo "${FILES}" | xargs npx prettier --write --ignore-path .eslintignore

# Add back the modified/prettified files to staging
echo "${FILES}" | xargs git add

exit 0
