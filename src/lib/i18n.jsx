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
    freshFood: 'توصيل طعام موثوق',
    // Footer
    quickLinks: 'روابط سريعة',
    contactUs: 'تواصل معنا',
    allRightsReserved: 'جميع الحقوق محفوظة',
    madeIn: 'الأردن 🇯🇴',
    trackYourOrder: 'تتبع طلبك',
    delivery24: 'الطلب والتوصيل متاحان على مدار الساعة',
    footerDesc: 'منصة موثوقة لتوصيل الطعام المنزلي الطازج من أفضل المطابخ مباشرة إلى باب منزلك.',
    // Hero
    heroTag: '🕐 الطلب والتوصيل متاحان على مدار الساعة',
    heroTitle1: 'طعام منزلي',
    heroTitle2: 'طازج وموثوق',
    heroSub: 'وجبات لذيذة محضّرة بحب وعناية من أفضل المطابخ، توصلك لباب بيتك',
    orderNow: 'اطلب الآن',
    whatsapp: 'واتساب',
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
    searchResults: 'نتائج البحث',
    todayDeals: '🔥 عرض اليوم',
    mostOrdered: '⭐ الأكثر طلباً',
    topRated: '💎 الأعلى تقييماً',
    // Kitchen
    browseKitchenMenu: 'تصفح القائمة',
    addToCart: 'أضف',
    addedToCart: 'تمت الإضافة إلى السلة',
    // Meal modal
    optionalAddons: 'إضافات اختيارية',
    totalAmount: 'المجموع',
    addToCartBtn: 'أضف للسلة',
    minutes: 'دقيقة',
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
    // Categories
    catAll: 'الكل',
    catMansaf: 'منسف',
    catMaqluba: 'مقلوبة',
    catPastries: 'معجنات',
    catDailyFood: 'أكل يومي',
    catSweets: 'حلويات',
    catDrinks: 'مشروبات',
    // Trust section
    trust1Title: 'طعام محلي أصيل',
    trust1Desc: 'وجبات محضّرة بأيدي أمهات وطباخين ماهرين',
    trust2Title: 'جودة عالية',
    trust2Desc: 'مكونات طازجة ومعايير نظافة عالية',
    trust3Title: 'توصيل سريع',
    trust3Desc: 'نوصل طلبك في أسرع وقت ممكن',
    trust4Title: 'آمن وموثوق',
    trust4Desc: 'ادفع عند الاستلام، بدون مخاطر',
  },
  en: {
    // Nav
    home: 'Home',
    menu: 'Menu',
    cart: 'Cart',
    trackOrder: 'Track',
    myAccount: 'My Account',
    // Header
    freshFood: 'Reliable food delivery',
    // Footer
    quickLinks: 'Quick Links',
    contactUs: 'Contact Us',
    allRightsReserved: 'All Rights Reserved',
    madeIn: 'Jordan 🇯🇴',
    trackYourOrder: 'Track Order',
    delivery24: 'Orders & delivery available 24/7',
    footerDesc: 'A reliable platform delivering fresh home-cooked food from the best kitchens right to your door.',
    // Hero
    heroTag: '🕐 Orders & delivery available 24/7',
    heroTitle1: 'Fresh Home-Made',
    heroTitle2: 'Food, Delivered Fast',
    heroSub: 'Delicious meals prepared with love and care from local kitchens, straight to your door.',
    orderNow: 'Order Now',
    whatsapp: 'WhatsApp',
    // Cart
    cartTitle: 'Shopping Cart',
    cartEmpty: 'Your cart is empty',
    cartEmptyDesc: 'Start adding your favorite meals',
    browseMenu: 'Browse Menu',
    continueShopping: 'Continue Shopping',
    discountCode: 'Discount Code',
    enterCoupon: 'Enter coupon code',
    apply: 'Apply',
    deliveryInfo: 'Delivery Information',
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
    searchResults: 'Search Results',
    todayDeals: '🔥 Today\'s Deals',
    mostOrdered: '⭐ Most Ordered',
    topRated: '💎 Top Rated',
    // Kitchen
    browseKitchenMenu: 'Browse Menu',
    addToCart: 'Add',
    addedToCart: 'Added to cart',
    // Meal modal
    optionalAddons: 'Optional Add-ons',
    totalAmount: 'Total',
    addToCartBtn: 'Add to Cart',
    minutes: 'min',
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
    orderPlaced: 'Order Placed',
    preparing: 'Preparing',
    onTheWay: 'On the Way',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    // Categories
    catAll: 'All',
    catMansaf: 'Mansaf',
    catMaqluba: 'Maqluba',
    catPastries: 'Pastries',
    catDailyFood: 'Daily Food',
    catSweets: 'Sweets',
    catDrinks: 'Drinks',
    // Trust section
    trust1Title: 'Local Authentic Cooking',
    trust1Desc: 'Meals prepared by skilled home cooks and mothers',
    trust2Title: 'Premium Quality',
    trust2Desc: 'Fresh ingredients and high hygiene standards',
    trust3Title: 'Quick Delivery',
    trust3Desc: 'We deliver your order as quickly as possible',
    trust4Title: 'Safe & Secure',
    trust4Desc: 'Pay when your order arrives — no risk at all',
  },
};

// Helper: get meal display name based on current lang
export function getMealName(meal, lang) {
  if (lang === 'en' && meal.meal_name_en) return meal.meal_name_en;
  return meal.meal_name || '';
}

// Helper: get meal description based on current lang
export function getMealDescription(meal, lang) {
  if (lang === 'en' && meal.description_en) return meal.description_en;
  return meal.description || '';
}

// Helper: get kitchen name based on current lang
export function getKitchenName(kitchen, lang) {
  if (lang === 'en' && kitchen.cook_name_en) return kitchen.cook_name_en;
  return kitchen.cook_name || '';
}

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