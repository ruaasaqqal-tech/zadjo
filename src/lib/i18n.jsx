import { createContext, useContext, useState, useEffect } from 'react';

export const translations = {
  ar: {
    // Nav
    home: 'الرئيسية',
    menu: 'القائمة',
    cart: 'السلة',
    trackOrder: 'تتبع',
    myAccount: 'حسابي',
    // Header
    freshFood: 'أكل بيتي طازج',
    // Footer
    quickLinks: 'روابط سريعة',
    contactUs: 'تواصل معنا',
    allRightsReserved: 'جميع الحقوق محفوظة',
    madeIn: 'صنع في السلط',
    trackYourOrder: 'تتبع طلبك',
    delivery24: 'الطلب والتوصيل متاحان على مدار الساعة',
    // Cart
    cartTitle: 'سلة المشتريات',
    cartEmpty: 'السلة فارغة',
    cartEmptyDesc: 'ابدأ بإضافة وجباتك المفضلة',
    browseMenu: 'تصفح القائمة',
    continueShopping: 'متابعة التسوق',
    discountCode: 'كود خصم',
    enterCoupon: 'أدخل كود الخصم',
    apply: 'تطبيق',
    deliveryInfo: 'بيانات التوصيل',
    address: 'العنوان',
    addressPlaceholder: 'العنوان بالتفصيل',
    notes: 'ملاحظات',
    notesPlaceholder: 'أي ملاحظات إضافية...',
    subtotal: 'المجموع الفرعي',
    discount: 'الخصم',
    delivery: 'التوصيل',
    total: 'المجموع',
    cashOnDelivery: 'الدفع نقداً عند الاستلام',
    confirmOrder: 'تأكيد الطلب',
    sendingOrder: 'جاري إرسال الطلب...',
    addressRequired: 'يرجى إدخال العنوان',
    phoneRequired: 'يرجى إضافة رقم هاتفك في صفحة الملف الشخصي قبل تأكيد الطلب',
    orderConfirmed: 'تم تأكيد طلبك! سيتم تحويلك لواتساب...',
    couponApplied: 'تم تطبيق الخصم',
    couponInvalid: 'كود الخصم غير صالح أو منتهي الصلاحية',
    couponAlreadyApplied: 'تم تطبيق هذا الكوبون مسبقاً',
    couponMinOrder: 'الحد الأدنى للطلب',
    // Menu
    fullMenu: 'القائمة الكاملة',
    mealsAvailable: 'وجبة متاحة',
    // TrackOrder
    myOrders: 'طلباتي',
    loading: 'جاري التحميل...',
    noOrders: 'لا يوجد لديك طلبات حالياً',
    noOrdersDesc: 'اطلب وجبتك المفضلة الآن!',
    cancelOrder: 'إلغاء',
    rateOrder: 'قيّم الطلب',
    rated: 'تم التقييم',
    orderCancelled: 'تم إلغاء الطلب',
    cancelExpired: 'انتهت مدة الإلغاء (5 دقائق)',
    // Profile
    phoneNumber: 'رقم الهاتف',
    phoneWarning: '⚠️ يجب إضافة رقم هاتفك لتتمكن من تأكيد الطلبات',
    save: 'حفظ',
    phoneSaved: 'تم حفظ رقم الهاتف',
    deleteAccount: 'حذف الحساب',
    deleteDesc: 'سيتم حذف حسابك وجميع بياناتك بشكل نهائي.',
    deleteBtn: 'حذف حسابي',
    deleteConfirm: 'هل أنت متأكد؟',
    deleteConfirmBtn: 'نعم، احذف حسابي',
    deleting: 'جارٍ الحذف...',
    cancel: 'إلغاء',
    // Status
    orderPlaced: 'تم الطلب',
    preparing: 'قيد التحضير',
    onTheWay: 'في الطريق',
    delivered: 'تم التوصيل',
    cancelled: 'ملغي',
  },
  en: {
    // Nav
    home: 'Home',
    menu: 'Menu',
    cart: 'Cart',
    trackOrder: 'Track',
    myAccount: 'My Account',
    // Header
    freshFood: 'Fresh home-cooked food',
    // Footer
    quickLinks: 'Quick Links',
    contactUs: 'Contact Us',
    allRightsReserved: 'All Rights Reserved',
    madeIn: 'Made in Salt',
    trackYourOrder: 'Track Order',
    delivery24: 'Orders & delivery available 24/7',
    // Cart
    cartTitle: 'Cart',
    cartEmpty: 'Cart is empty',
    cartEmptyDesc: 'Start adding your favorite meals',
    browseMenu: 'Browse Menu',
    continueShopping: 'Continue Shopping',
    discountCode: 'Discount Code',
    enterCoupon: 'Enter coupon code',
    apply: 'Apply',
    deliveryInfo: 'Delivery Info',
    address: 'Address',
    addressPlaceholder: 'Full address details',
    notes: 'Notes',
    notesPlaceholder: 'Any additional notes...',
    subtotal: 'Subtotal',
    discount: 'Discount',
    delivery: 'Delivery',
    total: 'Total',
    cashOnDelivery: 'Cash on delivery',
    confirmOrder: 'Confirm Order',
    sendingOrder: 'Sending order...',
    addressRequired: 'Please enter your address',
    phoneRequired: 'Please add your phone number in your profile before confirming the order',
    orderConfirmed: 'Order confirmed! Redirecting to WhatsApp...',
    couponApplied: 'Discount applied',
    couponInvalid: 'Invalid or expired coupon code',
    couponAlreadyApplied: 'This coupon has already been applied',
    couponMinOrder: 'Minimum order amount',
    // Menu
    fullMenu: 'Full Menu',
    mealsAvailable: 'meals available',
    // TrackOrder
    myOrders: 'My Orders',
    loading: 'Loading...',
    noOrders: 'No orders yet',
    noOrdersDesc: 'Order your favorite meal now!',
    cancelOrder: 'Cancel',
    rateOrder: 'Rate Order',
    rated: 'Rated',
    orderCancelled: 'Order cancelled',
    cancelExpired: 'Cancellation window expired (5 min)',
    // Profile
    phoneNumber: 'Phone Number',
    phoneWarning: '⚠️ Add your phone number to confirm orders',
    save: 'Save',
    phoneSaved: 'Phone number saved',
    deleteAccount: 'Delete Account',
    deleteDesc: 'Your account and all data will be permanently deleted.',
    deleteBtn: 'Delete my account',
    deleteConfirm: 'Are you sure?',
    deleteConfirmBtn: 'Yes, delete my account',
    deleting: 'Deleting...',
    cancel: 'Cancel',
    // Status
    orderPlaced: 'Order placed',
    preparing: 'Preparing',
    onTheWay: 'On the way',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  },
};

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('app_lang') || 'ar');

  const switchLang = (l) => {
    setLang(l);
    localStorage.setItem('app_lang', l);
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = l;
  };

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => translations[lang]?.[key] ?? translations['ar'][key] ?? key;

  return (
    <LangContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}