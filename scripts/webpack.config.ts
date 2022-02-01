import path from 'path'

import { Configuration, EntryObject, EntryDescription } from 'webpack'

type PackageName = 'lsp-client' | 'lsp-server'

const rootDir = path.resolve(__dirname, '..')

const entry = (names: PackageName[]): EntryObject =>
  names.reduce<Record<string, EntryDescription>>((entries, name) => {
    entries[name] = {
      import: `./packages/${name}/src/index.ts`,
      filename: `packages/${name}/dist/index.js`
    }

    return entries
  }, {})

const nodeBuiltins = new Set([
  'assert',
  'async_hooks',
  'buffer',
  'child_process',
  'cluster',
  'console',
  'constants',
  'crypto',
  'dgram',
  'diagnostics_channel',
  'dns',
  'domain',
  'events',
  'fs',
  'http',
  'http2',
  'https',
  'inspector',
  'module',
  'net',
  'os',
  'path',
  'perf_hooks',
  'process',
  'punycode',
  'querystring',
  'readline',
  'repl',
  'stream',
  'string_decoder',
  'timers',
  'tls',
  'trace_events',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'wasi',
  'worker_threads',
  'zlib'
])

export default (_: never, argv: Record<string, unknown>): Configuration => {
  const isProd = argv.mode === 'production'

  const config: Configuration = {
    devtool: isProd ? false : 'source-map',
    target: 'node',
    entry: entry(['lsp-client', 'lsp-server']),
    module: {
      rules: [
        {
          test: /.*lsp-client.*\.ts$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'packages/lsp-client/tsconfig.build.json'
            }
          },
          exclude: /node_modules/
        },
        {
          test: /.*lsp-server.*\.ts$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'packages/lsp-server/tsconfig.build.json'
            }
          },
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      mainFields: ['browser', 'module', 'main'],
      extensions: ['.ts', '.js']
    },
    output: {
      path: rootDir
    },
    externals: [
      { vscode: 'commonjs vscode' },
      {
        'lsp-client': 'commonjs lsp-client'
      },
      {
        'lsp-server': 'commonjs lsp-server'
      },
      ({ request }, transform) => {
        let execResult: RegExpExecArray

        if ((execResult = /^node:(\w+)/.exec(request))) {
          return transform(null, `commonjs ${execResult[1]}`)
        }

        if (
          /\.node$/.test(request) ||
          /^vscode.*/.test(request) ||
          nodeBuiltins.has(request)
        ) {
          return transform(null, `commonjs ${request}`)
        }

        return transform()
      }
    ]
  }

  return config
}
