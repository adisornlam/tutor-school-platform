// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  // Alias configuration for server and shared files
  alias: {
    '#server': resolve(__dirname, 'server'),
    '#shared': resolve(__dirname, 'shared')
  },
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    // '@nuxtjs/i18n', // Temporarily disabled - unhead v1/v2 compatibility issue
    '@vueuse/nuxt'
    // @nuxt/ui temporarily disabled due to compatibility issues with Nuxt 4
    // '@nuxt/ui',
  ],

  // CSS
  css: ['~/assets/css/main.css'],

  // Runtime config
  runtimeConfig: {
    // Private (server-only)
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: parseInt(process.env.DB_PORT || '3306'),
    dbName: process.env.DB_NAME || 'webthdsw_tutordb',
    dbUser: process.env.DB_USER || 'webthdsw_tutor',
    dbPassword: process.env.DB_PASSWORD || '57*0yZiKMmDyThXx',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    redisHost: process.env.REDIS_HOST || '127.0.0.1',
    redisPort: parseInt(process.env.REDIS_PORT || '46961'),
    redisPassword: process.env.REDIS_PASSWORD || 'nd3Y4TDNrDLfCTs6iM2',
    redisDb: parseInt(process.env.REDIS_DB || '0'),
    
    // Public (exposed to client)
    public: {
      apiBase: process.env.API_BASE || '/api',
      appName: 'KDC Tutor School',
      appVersion: '1.0.0',
      // Dummy i18n config to prevent errors from @nuxtjs/i18n plugins
      // (even though the module is disabled, some plugins may still try to access it)
      i18n: {
        configLocales: [],
        defaultLocale: 'th',
        strategy: 'prefix_except_default',
        differentDomains: false,
        multiDomainLocales: [],
        skipSettingLocaleOnNavigate: false,
        // rootRedirect: undefined, // Commented out to avoid type error
        routesNameSeparator: '___',
        defaultLocaleRouteNameSuffix: 'default',
        defaultDirection: 'ltr',
        experimental: {
          switchLocalePathLinkSSR: false
        }
      }
    }
  },

  // i18n configuration (temporarily disabled)
  // i18n: {
  //   locales: [
  //     { code: 'th', language: 'th-TH', name: 'ไทย', file: 'th.json' },
  //     { code: 'en', language: 'en-US', name: 'English', file: 'en.json' }
  //   ],
  //   defaultLocale: 'th',
  //   strategy: 'prefix_except_default',
  //   langDir: 'locales',
  //   detectBrowserLanguage: {
  //     useCookie: true,
  //     cookieKey: 'i18n_redirected',
  //     redirectOn: 'root'
  //   }
  // },

  // Vite configuration for HMR WebSocket port (avoid port conflicts)
  // If PORT_VITE_HMR is set, use that port. Otherwise, Vite will auto-select an available port
  vite: {
    server: {
      strictPort: false, // Allow Vite to use a different port if the specified one is in use
      hmr: process.env.PORT_VITE_HMR 
        ? {
            // Use specific port from environment variable
            port: parseInt(process.env.PORT_VITE_HMR),
            clientPort: parseInt(process.env.PORT_VITE_HMR),
          }
        : true // true = use default behavior (auto-select available port)
    }
  },

  // Nitro configuration
  nitro: {
    experimental: {
      websocket: true
    },
    // Route rules for API endpoints
    routeRules: {
      '/api/testdb': { cors: true, headers: { 'Cache-Control': 'no-cache' } },
      '/testdb': { redirect: '/api/testdb' } // Redirect /testdb to /api/testdb
    },
    // Inline all dependencies that are needed on server without node_modules
    // Since server has no node_modules, we need to bundle everything
    externals: {
      inline: [
        '#shared',
        // Node.js built-in modules that should not be bundled
        // Note: events is a built-in module and should not be bundled
        // 'events', // Don't bundle events - it's a Node.js built-in
        // Socket.IO and related packages
        'socket.io',
        'socket.io-client',
        '@socket.io/component-emitter', // dependency of socket.io
        'engine.io',
        'engine.io-client',
        'ws', // WebSocket library used by engine.io
        'base64id', // dependency of socket.io/engine.io
        'debug', // debug utility used by socket.io (must be inlined)
        // Core HTTP packages that may not be available
        'accepts',
        'negotiator', // dependency of accepts
        'mime-types', // dependency of accepts
        'mime-db', // dependency of mime-types
        'vary', // dependency of accepts/cors
        'h3',
        'cookie', // dependency of h3
        'cors', // CORS handling (used by socket.io or h3)
        'ofetch',
        // Authentication packages
        'jsonwebtoken', // JWT token generation/verification (used in server/utils/jwt.ts)
        'jws', // dependency of jsonwebtoken
        'jwa', // dependency of jws
        'ecdsa-sig-formatter', // dependency of jwa
        'buffer-equal-constant-time', // dependency of jwa
        'safe-buffer', // dependency of jws/jsonwebtoken
        'ms', // dependency of jsonwebtoken
        'bcryptjs', // password hashing (used in server/services/auth.service.ts)
        // Database packages
        'mysql2', // MySQL client (used in server/utils/db.ts)
        'mysql2/promise', // MySQL promise wrapper
        // Redis packages
        'ioredis', // Redis client (used in server/utils/redis.ts)
        '@ioredis/commands', // dependency of ioredis
        'cluster-key-slot', // dependency of ioredis
        'lodash.defaults', // dependency of ioredis
        'lodash.isarguments', // dependency of ioredis
        'redis-errors', // dependency of ioredis
        'redis-parser', // dependency of ioredis
        'standard-as-callback', // dependency of ioredis
        // Dependencies of mysql2
        'sqlstring', // SQL string formatting
        'named-placeholders', // Named placeholders for SQL
        'iconv-lite', // Character encoding conversion
        'long', // Long integer support
        'denque', // Double-ended queue
        'bluebird', // Promise library
        'generate-function', // Function generation
        'seq-queue', // Sequential queue
        'lru.min', // LRU cache
        'aws-ssl-profiles', // AWS SSL profiles
        // Additional dependencies
        'is-property', // Property checking
        'safer-buffer', // dependency of iconv-lite
        'string_decoder', // dependency of iconv-lite
        // Additional dependencies found in build
        'semver', // version comparison (used by various packages)
        'helmet', // security headers (used by various packages)
        'lodash.includes', // lodash utilities
        'lodash.isboolean',
        'lodash.isinteger',
        'lodash.isnumber',
        'lodash.isplainobject',
        'lodash.isstring',
        'lodash.once',
        // Vue packages
        '@vue/shared', // Vue shared utilities
        '@vue/reactivity', // Vue reactivity system
        '@vue/compiler-dom', // Vue compiler for DOM
        '@vue/compiler-ssr', // Vue compiler for SSR
        '@vue/runtime-core', // Vue runtime core
        '@vue/runtime-dom', // Vue runtime for DOM
        '@vue/server-renderer', // Vue server renderer
        'vue', // Vue core
        'vue/server-renderer', // Vue server renderer (alias)
        'vue-bundle-renderer', // Vue bundle renderer (used by Nuxt)
        'vue-bundle-renderer/runtime', // Vue bundle renderer runtime
        'vue-router', // Vue Router
        // Unhead packages (used by Nuxt)
        'unhead', // Unhead core
        'unhead/server',
        'unhead/utils',
        // TipTap packages (used in RichTextEditor)
        '@tiptap/vue-3',
        '@tiptap/core',
        '@tiptap/starter-kit',
        '@tiptap/extensions',
        '@tiptap/extension-image',
        '@tiptap/extension-link',
        '@tiptap/extension-text-align',
        '@tiptap/extension-blockquote',
        '@tiptap/extension-bold',
        '@tiptap/extension-code',
        '@tiptap/extension-code-block',
        '@tiptap/extension-document',
        '@tiptap/extension-hard-break',
        '@tiptap/extension-heading',
        '@tiptap/extension-horizontal-rule',
        '@tiptap/extension-italic',
        '@tiptap/extension-list',
        '@tiptap/extension-paragraph',
        '@tiptap/extension-strike',
        '@tiptap/extension-text',
        '@tiptap/extension-underline',
        '@tiptap/pm', // TipTap ProseMirror core
        '@tiptap/pm/state',
        // ProseMirror packages (dependencies of @tiptap/pm)
        'prosemirror-model',
        'prosemirror-state',
        'prosemirror-view',
        'prosemirror-commands',
        'prosemirror-dropcursor',
        'prosemirror-transform',
        'prosemirror-gapcursor',
        'prosemirror-history',
        'prosemirror-keymap',
        'prosemirror-schema-list',
        // Dependencies of ProseMirror
        'orderedmap', // dependency of prosemirror-model
        'rope-sequence', // dependency of prosemirror-transform
        'w3c-keyname', // dependency of prosemirror-keymap
        '@tiptap/pm/commands',
        '@tiptap/pm/dropcursor',
        '@tiptap/pm/gapcursor',
        '@tiptap/pm/history',
        '@tiptap/pm/keymap',
        '@tiptap/pm/model',
        '@tiptap/pm/schema-list',
        '@tiptap/pm/transform',
        '@tiptap/pm/view',
        // Icon packages
        '@heroicons/vue',
        // Date utilities
        'date-fns',
        'date-fns/locale',
        'date-fns/locale/eo', // Esperanto locale
        // Link utilities
        'linkifyjs', // Link detection and parsing
        // Build utilities
        'entities/decode', // HTML entity decoding
        'estree-walker', // ESTree AST walker
        'source-map-js', // Source map support
        // Serialization
        'devalue',
        // Utility packages
        'defu',
        'scule',
        'ufo',
        'pathe',
        'object-assign' // utility package used by various dependencies
        // Note: utf-8-validate and bufferutil are stubbed via rollupConfig plugin
        // They are optional dependencies that ws will fallback to pure JS if not available
        // Note: We don't inline large packages like mysql2, ioredis, etc. as they should be available on server
      ]
    },
    // Note: timezone is set via runtimeConfig or environment variables
    // Alias for Nitro build - resolve at build time
    alias: {
      '#shared': resolve(__dirname, 'shared'),
      '#server': resolve(__dirname, 'server')
    },
    // Configure Rollup to properly resolve shared imports and inline dynamic imports
    // Since server has no node_modules, we need to inline all dynamic imports
    rollupConfig: {
      output: {
        inlineDynamicImports: true
      },
      external: (id) => {
        // Don't bundle Node.js built-in modules
        if (id === 'events' || id === 'node:events') {
          return true
        }
        return false
      },
      plugins: [
        {
          name: 'resolve-shared-relative',
          resolveId(source, importer) {
            // Only fix paths that explicitly reference shared/types
            if (source && (source.startsWith('../shared/types/') || source.startsWith('./shared/types/'))) {
              const { existsSync } = require('fs')
              const fixedPath = resolve(__dirname, 'shared', 'types', source.split('shared/types/')[1] || source.replace(/^.*shared\/types\//, ''))
              if (existsSync(fixedPath)) {
                return fixedPath
              }
            }
            return null
          }
        },
        {
          name: 'stub-optional-dependencies',
          resolveId(source) {
            // Stub optional dependencies that may not be installed
            // These are optional performance enhancements for ws package
            // ws will fallback to pure JavaScript implementation if not available
            if (source === 'utf-8-validate' || source === 'bufferutil') {
              // Return a virtual module ID
              return '\0' + source
            }
            return null
          },
          load(id) {
            // Return empty module for stubbed optional dependencies
            // ws package will handle the fallback gracefully
            if (id === '\0utf-8-validate' || id === '\0bufferutil') {
              return 'export default {};'
            }
            return null
          }
        },
        {
          name: 'fix-events-import',
          resolveId(source, importer) {
            // Ensure events module is treated as external (Node.js built-in)
            // This prevents bundling events module which causes EventEmitter to be a Module object
            if (source === 'events') {
              // Return external to prevent bundling
              return { id: 'events', external: true }
            }
            if (source === 'node:events') {
              // Return external to prevent bundling
              return { id: 'node:events', external: true }
            }
            return null
          },
          load(id) {
            // If events is somehow still being bundled, provide a proper EventEmitter
            if (id === 'events' || id === 'node:events') {
              return null // Let Node.js handle it
            }
            return null
          }
        },
        {
          name: 'resolve-subpath-imports',
          resolveId(source, importer) {
            // Handle subpath imports like mysql2/promise
            if (source === 'mysql2/promise') {
              // Resolve to the actual file path
              const { existsSync } = require('fs')
              const { join } = require('path')
              const promisePath = join(process.cwd(), 'node_modules', 'mysql2', 'promise.js')
              if (existsSync(promisePath)) {
                return promisePath
              }
              // If not found, let Rollup handle it (it should be inlined via externals.inline)
              return null
            }
            return null
          }
        }
      ]
    },
    // Copy shared directory to output before Nitro build
    hooks: {
      'build:before': async (nitro: any) => {
        const { existsSync, mkdirSync } = await import('fs')
        // @ts-ignore - fs-extra types may not be available
        const { copy } = await import('fs-extra')
        const sharedSrc = resolve(__dirname, 'shared')
        const sharedDest = resolve(__dirname, '.output', 'shared')
        
        try {
          if (existsSync(sharedSrc)) {
            mkdirSync(resolve(__dirname, '.output'), { recursive: true })
            await copy(sharedSrc, sharedDest)
            console.log('✅ Copied shared directory to .output/shared')
          }
        } catch (error) {
          console.warn('⚠️ Could not copy shared directory:', error)
        }
      },
    }
  },

  // Unhead configuration (no longer needed since @nuxtjs/i18n is disabled)
  // unhead: {
  //   compatibility: {
  //     // Enable compatibility mode for modules using unhead v1
  //   }
  // },

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: false // Disable typeCheck to avoid vue-tsc dependency
  }
})

