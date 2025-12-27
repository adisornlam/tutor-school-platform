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
    dbPort: parseInt(process.env.DB_PORT || '3307'),
    dbName: process.env.DB_NAME || 'tutordb',
    dbUser: process.env.DB_USER || 'root',
    dbPassword: process.env.DB_PASSWORD || '',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: parseInt(process.env.REDIS_PORT || '6379'),
    redisPassword: process.env.REDIS_PASSWORD || '',
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
    // Inline only critical dependencies that are needed on server without node_modules
    // This avoids memory issues while still bundling essential packages
    externals: {
      inline: [
        '#shared',
        // Socket.IO and related packages
        'socket.io',
        'socket.io-client',
        '@socket.io/component-emitter', // dependency of socket.io
        'engine.io',
        'engine.io-client',
        'ws', // WebSocket library used by engine.io
        'base64id', // dependency of socket.io/engine.io
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
    // Configure Rollup to properly resolve shared imports
    // Note: We don't use inlineDynamicImports here to avoid memory issues
    // Only critical packages are inlined via externals.inline
    rollupConfig: {
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
      }
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

