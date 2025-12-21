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
        rootRedirect: null,
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

  // Nitro configuration
  nitro: {
    port: 4000,
    experimental: {
      websocket: true
    },
    // Timezone
    timing: {
      timezone: 'Asia/Bangkok'
    },
    // Alias for Nitro build - resolve at build time
    alias: {
      '#shared': resolve(__dirname, 'shared'),
      '#server': resolve(__dirname, 'server')
    },
    // Inline shared directory to fix build resolution
    externals: {
      inline: ['#shared']
    },
    // Use Vite resolve for proper alias resolution
    vite: {
      resolve: {
        alias: {
          '#shared': resolve(__dirname, 'shared'),
          '#server': resolve(__dirname, 'server')
        }
      }
    },
    // Configure Rollup to properly resolve shared imports
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
        }
      ]
    },
    // Copy shared directory to output before Nitro build
    hooks: {
      'nitro:build:before': async (nitro) => {
        const { existsSync, mkdirSync } = await import('fs')
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

