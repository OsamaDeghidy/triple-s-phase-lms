# Local Development Setup

## إعداد التطوير المحلي / Local Development Setup

### كيفية ضبط الاتصال بالـ Backend المحلي

#### الطريقة الأولى: استخدام متغيرات البيئة (مستحسن)

1. أنشئ ملف `.env.local` في مجلد `frontend/`:
```bash
# في مجلد frontend
touch .env.local
```

2. أضف المحتوى التالي في ملف `.env.local`:
```env
# API Base URL for local development
VITE_API_BASE_URL=http://localhost:8000

# Alternative URLs (اختر واحداً)
# VITE_API_BASE_URL=http://127.0.0.1:8000
# VITE_API_BASE_URL=http://0.0.0.0:8000

# Development mode flag
VITE_DEV_MODE=true

# Enable debug logging
VITE_DEBUG=true
```

3. أعد تشغيل خادم التطوير:
```bash
npm run dev
```

#### الطريقة الثانية: التعديل المباشر في الكود

إذا كنت لا تريد استخدام ملفات البيئة، يمكنك تعديل ملف `src/config/api.config.js` مباشرة:

```javascript
const getBaseURL = () => {
  if (import.meta.env.DEV) {
    // غيّر هذا الرابط حسب إعدادك المحلي
    return 'http://localhost:8000';
  }
  return import.meta.env.VITE_API_BASE_URL || 'https://www.triplesacademy.com';
};
```

### التحقق من الإعداد

1. تأكد من أن الـ backend يعمل على البورت 8000:
```bash
# في مجلد backend
python manage.py runserver
```

2. تأكد من أن الـ frontend يعمل على البورت 5173:
```bash
# في مجلد frontend
npm run dev
```

3. افتح Developer Tools في المتصفح وتحقق من Console لرؤية رسائل التصحيح.

### استكشاف الأخطاء

- **خطأ CORS**: تأكد من أن الـ backend يدعم CORS للـ localhost:5173
- **خطأ الاتصال**: تأكد من أن الـ backend يعمل على البورت الصحيح
- **خطأ 404**: تأكد من أن المسارات في الـ API صحيحة

### ملاحظات مهمة

- ملف `.env.local` لا يتم رفعه على GitHub (مُستبعد في .gitignore)
- يمكنك تغيير البورت في أي وقت عبر متغير `VITE_API_BASE_URL`
- الإعداد الحالي يدعم التبديل التلقائي بين المحلي والإنتاج
