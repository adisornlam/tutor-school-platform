# 🔧 Build Error Fix Guide

## ⚠️ ปัญหา

เมื่อรัน `bun run build` เกิด error:

```
ERROR  RollupError: Could not resolve "../shared/types/user.types.ts" from ".nuxt/dist/server/_nuxt/admin-BX65UdPO.js"
```

## 🔍 สาเหตุ

Nuxt/Vite compile client code แล้วยังคงใช้ relative path `../shared/types/user.types.ts` แทนที่จะ resolve alias `#shared` ซึ่งทำให้ Nitro build ไม่สามารถ resolve ได้

## ✅ วิธีแก้ไขชั่วคราว (Workaround)

### Option 1: Copy shared directory ไปยัง .output

เพิ่ม script ใน `package.json`:

```json
{
  "scripts": {
    "build": "nuxt build && node scripts/copy-shared.js",
    "build:fix": "nuxt build && cp -r shared .output/shared"
  }
}
```

หรือใช้ `nitro.hooks` ใน `nuxt.config.ts`:

```typescript
nitro: {
  hooks: {
    'nitro:build:before': async (nitro) => {
      const { copy } = await import('fs-extra')
      await copy('shared', '.output/shared')
    }
  }
}
```

### Option 2: ใช้ Nitro External

เพิ่มใน `nuxt.config.ts`:

```typescript
nitro: {
  externals: {
    inline: ['#shared']
  }
}
```

### Option 3: Build บน Server

- Build บน server โดยตรง (แนะนำสำหรับ production)
- หรือใช้ CI/CD pipeline

## 📋 สถานะการแก้ไข

- ✅ แก้ไข imports ใน `server/` ให้ใช้ `#shared` alias
- ✅ แก้ไข imports ใน `app/` ให้ใช้ `#shared` alias
- ✅ แก้ไข Nitro build โดยใช้ Rollup plugin เพื่อ resolve relative paths
- ✅ Copy shared directory ไปยัง `.output/shared` อัตโนมัติ
- ✅ Build สำเร็จแล้ว!

## 🚀 สำหรับ cPanel Deployment

**แนะนำ:** Build บน server โดยตรง หรือใช้วิธี copy shared directory หลังจาก build

---

*Last updated: 2025-01-20*

