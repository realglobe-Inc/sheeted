#!/bin/bash -eux
#
# publish packages

yarn workspace @sheeted/ui deploy
(cd packages/core && npx publish-if-needed)
(cd packages/server && npx publish-if-needed)
