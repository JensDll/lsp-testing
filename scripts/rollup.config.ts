import path from 'path'

import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import { OutputOptions, RollupOptions } from 'rollup'
import esbuild, { minify } from 'rollup-plugin-esbuild'

type PackageName = 'client' | 'server' | 'utils'

const rootDir = path.resolve(__dirname, '..')

const plugin = {
  esbuild: esbuild(),
  typescript: typescript()
}

const input = (name: PackageName) => `packages/${name}/src/index.ts`

type OutputReturn = {
  readonly esm: OutputOptions | OutputOptions[]
  readonly cjs: OutputOptions | OutputOptions[]
  readonly prod: OutputOptions | OutputOptions[]
}

const output = (name: PackageName): OutputReturn => ({
  esm: {
    file: `packages/${name}/dist/index.mjs`,
    format: 'esm'
  },
  cjs: [
    {
      file: `packages/${name}/dist/index.js`,
      sourcemap: true,
      sourcemapExcludeSources: true,
      format: 'cjs'
    }
  ],
  prod: [
    {
      file: `packages/${name}/dist/index.prod.js`,
      format: 'cjs',
      plugins: [minify()]
    }
  ]
})

const configs: RollupOptions[] = [
  // {
  //   input: input('utils'),
  //   output: output('utils').cjs,
  //   plugins: [typescript()]
  // },
  {
    input: input('client'),
    output: output('client').cjs,
    plugins: [typescript()],
    external: ['vscode', /^vscode-languageclient.*/]
  },
  {
    input: input('server'),
    output: output('server').cjs,
    plugins: [typescript()],
    external: [
      'lsp-sample-utils',
      'vscode-languageserver-textdocument',
      /^vscode-languageserver.*/
    ]
  }
]

export default configs
