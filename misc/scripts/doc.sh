#!/bin/bash -eux
#
# Generate documentations

cd `dirname $0`/../..

mkdir -p doc-dist
cp misc/doc/index.html doc-dist/
cp misc/doc/.nojekyll doc-dist/

# FIXME: --inputFiles は typedoc.js で指定しているので不要なはずだが、https://github.com/TypeStrong/typedoc/issues/1263 が修正されるまで引数で指定しないといけない
PACKAGE=core     npx typedoc 'packages/core/src'
PACKAGE=server   npx typedoc 'packages/server/src/index.ts' 'packages/server/src/types/ApplicationConfig.type.ts' 'packages/server/src/typings'
PACKAGE=mongoose npx typedoc 'packages/mongoose/src'
