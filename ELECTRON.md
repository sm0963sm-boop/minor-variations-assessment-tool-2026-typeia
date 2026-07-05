# MVAT — نسخة سطح المكتب (Electron) بدون نت

## المتطلبات (على جهازك)
- Node.js 20+
- npm أو bun

## خطوات البناء

1) ثبّت الاعتماديات:
```
npm install
```

2) ابنِ نسخة Electron:
```
npm run build:electron
```

3) شغّل التطبيق للتجربة:
```
npm run electron:dev
```

4) اصنع ملف تثبيت لنظامك:
- ماك (Apple Silicon):  `npm run package:mac`
- ماك (Intel):          `npm run package:mac-intel`
- ويندوز:               `npm run package:win`
- لينكس:                `npm run package:linux`

الناتج داخل مجلد `electron-release/`.

## كيف يعمل بدون نت؟
- التطبيق يحمل نسخة محلية من الموقع + سيرفر Node مدمج داخل الحزمة.
- عند فتح التطبيق، يشغّل السيرفر على `127.0.0.1:43117` ثم يفتح نافذة تعرضه.
- كل الخطوط والأصول مضمّنة داخلياً (لا يحتاج Google Fonts أو أي CDN).

## ملاحظة مهمة
البناء يجب أن يتم على جهازك المحلي (خارج بيئة Lovable) لأن Lovable يجبر ناتج البناء على استهداف Cloudflare. الملفات جاهزة في المشروع، فقط اتبع الخطوات أعلاه.
