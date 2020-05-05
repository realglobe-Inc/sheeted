#!/bin/bash -eux
#
# Generate documentations

# FIXME: --inputFiles は typedoc.js で指定しているので不要なはずだが、https://github.com/TypeStrong/typedoc/issues/1263 が修正されるまで引数で指定しないといけない
# npx typedoc --readme packages/core/README.doc.md packages/core/src
PACKAGE=server   npx typedoc 'packages/server/src/index.ts' 'packages/server/src/types/ApplicationConfig.type.ts' 'packages/server/src/typings'
PACKAGE=mongoose npx typedoc 'packages/mongoose/src'
