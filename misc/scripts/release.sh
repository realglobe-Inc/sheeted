#!/bin/bash
#
# publish packages

yarn workspace @sheeted/ui deploy
yarn workspace @sheeted/core publish --non-interactive
yarn workspace @sheeted/server publish --non-interactive
