#!/bin/bash
#
# publish packages

yarn workspace @sheeted/ui deploy
yarn workspace @sheeted/core release
yarn workspace @sheeted/server release
