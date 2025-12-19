// Simple i18n composable (temporary replacement for @nuxtjs/i18n)
// This is a lightweight i18n solution until @nuxtjs/i18n fully supports Nuxt 4

// Default translations (embedded to avoid import issues)
const translations = {
  th: {
    app: { name: 'KDC Tutor School' },
    nav: { courses: 'คอร์สเรียน', login: 'เข้าสู่ระบบ', register: 'สมัครสมาชิก', dashboard: 'แดชบอร์ด' },
    home: {
      hero: {
        title: 'เรียนออนไลน์ได้ทุกที่ ทุกเวลา',
        subtitle: 'พร้อมทั้ง Live e-Learning และ Video on Demand',
        viewCourses: 'ดูคอร์สทั้งหมด',
        register: 'ลงทะเบียน'
      },
      features: {
        title: 'ทำไมต้องเลือกเรา',
        live: 'Live e-Learning',
        liveDesc: 'เรียนสดออนไลน์กับอาจารย์',
        vod: 'Video on Demand',
        vodDesc: 'เรียนย้อนหลังได้ 24 ชั่วโมง',
        materials: 'ส่งเอกสาร',
        materialsDesc: 'ส่งเอกสารผ่าน Kerry Express'
      }
    },
    error: { goHome: 'กลับหน้าหลัก' },
    footer: { allRightsReserved: 'สงวนลิขสิทธิ์' }
  },
  en: {
    app: { name: 'KDC Tutor School' },
    nav: { courses: 'Courses', login: 'Login', register: 'Register', dashboard: 'Dashboard' },
    home: {
      hero: {
        title: 'Learn Online Anytime, Anywhere',
        subtitle: 'With Live e-Learning and Video on Demand',
        viewCourses: 'View All Courses',
        register: 'Register'
      },
      features: {
        title: 'Why Choose Us',
        live: 'Live e-Learning',
        liveDesc: 'Learn live online with teachers',
        vod: 'Video on Demand',
        vodDesc: 'Watch recordings for 24 hours',
        materials: 'Material Delivery',
        materialsDesc: 'Materials delivered via Kerry Express'
      }
    },
    error: { goHome: 'Go Home' },
    footer: { allRightsReserved: 'All Rights Reserved' }
  }
}

export const useI18n = () => {
  const locale = useState<string>('i18n.locale', () => 'th')
  
  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.')
    let value: any = translations[locale.value as keyof typeof translations] || translations.th
    
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) {
        console.warn(`Translation key "${key}" not found for locale "${locale.value}"`)
        return key
      }
    }
    
    if (typeof value !== 'string') {
      return key
    }
    
    // Simple parameter replacement
    if (params) {
      return Object.entries(params).reduce(
        (str, [param, val]) => str.replace(`{${param}}`, val),
        value
      )
    }
    
    return value
  }
  
  const setLocale = (newLocale: string) => {
    if (translations[newLocale as keyof typeof translations]) {
      locale.value = newLocale
      // Update HTML lang attribute
      if (process.client) {
        document.documentElement.lang = newLocale
      }
    }
  }
  
  return {
    locale: readonly(locale),
    t,
    setLocale
  }
}
