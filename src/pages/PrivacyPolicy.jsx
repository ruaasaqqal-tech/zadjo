export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background px-4 py-10 max-w-2xl mx-auto" dir="rtl">
      <h1 className="text-2xl font-black text-primary mb-2">سياسة الخصوصية</h1>
      <p className="text-xs text-muted-foreground mb-8">آخر تحديث: مايو 2026</p>

      <Section title="مقدمة">
        تطبيق <strong>Zad JO - زاد جو</strong> ملتزم بحماية خصوصيتك. توضح هذه السياسة كيفية جمع بياناتك واستخدامها وحمايتها.
      </Section>

      <Section title="المعلومات التي نجمعها">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>الاسم ورقم الهاتف عند تقديم الطلبات</li>
          <li>موقعك الجغرافي لحساب رسوم التوصيل وتحديد المسافة</li>
          <li>صور الملف الشخصي (اختياري) عبر الكاميرا أو معرض الصور</li>
          <li>بيانات الطلبات وسجل الاستخدام</li>
        </ul>
      </Section>

      <Section title="استخدام الكاميرا">
        يطلب التطبيق إذن الوصول إلى الكاميرا (<code className="bg-muted px-1 rounded text-xs">android.permission.CAMERA</code>) لغرض واحد فقط: تحميل صورة الملف الشخصي. لا يتم تسجيل أي مقاطع فيديو أو التقاط صور دون علمك وموافقتك الصريحة. يمكنك رفض هذا الإذن وسيظل التطبيق يعمل بشكل كامل.
      </Section>

      <Section title="الموقع الجغرافي">
        نستخدم موقعك فقط لحساب مسافة التوصيل وتقدير الرسوم. لا يُشارك موقعك مع أي طرف ثالث ولا يُخزَّن بصورة دائمة.
      </Section>

      <Section title="مشاركة البيانات">
        لا نبيع بياناتك ولا نشاركها مع أطراف خارجية إلا عند الضرورة القانونية أو لتقديم الخدمة (مثل توصيل الطلب للمطبخ).
      </Section>

      <Section title="أمان البيانات">
        نستخدم بروتوكولات تشفير معيارية لحماية بياناتك أثناء النقل والتخزين.
      </Section>

      <Section title="حذف الحساب">
        يمكنك طلب حذف حسابك وجميع بياناتك في أي وقت من إعدادات التطبيق أو بالتواصل معنا عبر واتساب.
      </Section>

      <Section title="التواصل معنا">
        لأي استفسار حول الخصوصية، تواصل معنا على:{" "}
        <a href="https://wa.me/962776241441" className="text-primary underline">واتساب</a>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-bold text-foreground mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}