#!/bin/sh

temp=$(mktemp -d)
(
  cd "$temp"
  echo Working on "$temp" >&2
  git clone https://github.com/okTurtles/group-income.git >&2
  git clone https://github.com/okTurtles/chel.git >&2
  ( cd chel; git checkout feat/chel-serve >&2 )

  (
      cp -Ra group-income/backend gi && \
      find gi -type f -name '*.test.js' -delete
      rm -f gi/dashboard/common/functions.js
  ) || exit 1

  # Why these new files? dashboard-server.js,...
  (
      cp -Ra chel/src/serve cs && \
      find cs -type f '(' -name '*.test.ts' -o -name '*.d.ts' ')' -delete && \
      rm -f cs/dashboard/deps.ts && \
      rm -f cs/dashboard-server.ts cs/dashboard/views/utils/validators.ts && \
      rm -rf cs/shared && \
      rm -rf chel
  ) || exit 1

  X=$(cd gi; find . -type f|sort)
  Y=$(cd cs; find . -type f|sed -e 's/.ts$/.js/g'|sort)
  if [ x"$X" = x"$Y" ]; then
    echo "File list matches" >&2
  else
    echo "File list does not match" >&2
    echo "$X" > a
    echo "$Y" > b
    diff -up a b >&2
    exit 1
  fi

  mkdir -p 'dist'

  yes '' | npm init >&2

  npm install --save-dev 'esbuild' 'eslint@8' 'eslint-config-standard' 'flow-remove-types' >&2
  cat >index.mjs <<EOF
  import * as esbuild from 'esbuild'
  import { loadESLint } from 'eslint'
  import flowRemoveTypes from 'flow-remove-types'

  const EslintConstructor = await loadESLint()
  const eslint = new EslintConstructor({ fix: true })

  const extractSource = async (source, isFlow) => {
    const elideTypes = isFlow ? flowRemoveTypes : (v) => v
    return (await eslint.lintText(esbuild.transformSync(elideTypes(source, { all: true }).toString(), { loader: 'ts' }).code
    ))[0].output
  }

  (() => {
    const data = []
    process.stdin.on('readable', () => {
      let chunk

      while ((chunk = process.stdin.read()) !== null) {
        data.push(chunk)
      }
    })

    process.stdin.on('end', () => {
      extractSource(Buffer.concat(data).toString(), process.argv[2] === 'flow').then((v) => {
        v && process.stdout.write(v)
      })
    })
  })()
EOF

  cat >.eslintrc.json <<-EOF
  {"extends":"standard"}
EOF

  for i in gi cs; do
      flow=''
      [ x"$i" = x'gi' ] && flow='flow'
      find $i -type f '(' -name '*.js' -o -name '*.ts' ')' | while read line; do
          mkdir -p 'dist/'"$(dirname "$line")"
          node index.mjs "$flow" < "$line" > 'dist/'"${line%.*}.js"
      done
  done

  (
      ( cd gi && find . -type f '(' -name '*.js' -o -name '*.ts' ')' ) | while read i; do diff -up "dist/gi/$i" "dist/cs/$i"; done
  )

  rm -rf "$temp"
)
