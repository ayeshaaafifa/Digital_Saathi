import type { Language } from '../types';

export interface UiStrings {
  brand: string;
  nav: {
    chat: string;
    screenshot: string;
    learn: string;
    volunteers: string;
    impact: string;
  };
  auth: {
    signIn: string;
    signOut: string;
    signingIn: string;
    guestMode: string;
    signedInAs: string;
    syncSavedNote: string;
    guestSaveNote: string;
  };
  controls: {
    languageLabel: string;
    textSizeLabel: string;
    textStandard: string;
    textLarge: string;
    textXLarge: string;
    highContrast: string;
    highContrastOn: string;
    highContrastOff: string;
    backToHome: string;
    homeLabel: string;
    largeText: string;
    normalText: string;
    readAloud: string;
    stopAudio: string;
    loadingAudio: string;
  };
  hero: {
    kicker: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    trustLine: string;
    imageAlt: string;
  };
  chat: {
    heading: string;
    subheading: string;
    inputPlaceholder: string;
    sendButton: string;
    thinking: string;
    micStart: string;
    micListening: string;
    micUnsupported: string;
    quickPromptsTitle: string;
    quickPrompts: string[];
    stepsHeading: string;
    safetyTipHeading: string;
    credentialWarningTitle: string;
    credentialWarningSubtitle: string;
    followUpsHeading: string;
    saveGuide: string;
    savedGuide: string;
    savedPanelTitle: string;
    noSavedYet: string;
    privacyNote: string;
  };
  screenshot: {
    heading: string;
    subheading: string;
    uploadTitle: string;
    uploadHint: string;
    chooseFile: string;
    clearButton: string;
    noteLabel: string;
    notePlaceholder: string;
    analyzeButton: string;
    analyzing: string;
    sampleTitle: string;
    sampleSubtitle: string;
    detectedErrorLabel: string;
    unsupportedFileError: string;
    fileTooLargeError: string;
    readError: string;
    riskLabels: {
      safe: string;
      caution: string;
      danger: string;
    };
    stepsTitle: string;
    doNotDoTitle: string;
    privacyBanner: string;
  };
  learn: {
    heading: string;
    subheading: string;
    categories: {
      all: string;
      smartphone: string;
      messaging: string;
      forms: string;
      safety: string;
      services: string;
    };
    completedLabel: string;
    startLesson: string;
    reviewLesson: string;
    markComplete: string;
    completedBadge: string;
    quickCheck: string;
    correctFeedback: string;
    tryAgainFeedback: string;
    closeLesson: string;
  };
  volunteers: {
    heading: string;
    subheading: string;
    demoBannerTitle: string;
    demoBannerBody: string;
    demoProfileLabel: string;
    speaksLabel: string;
    selectVolunteer: string;
    selectedVolunteer: string;
    formTitle: string;
    topicLabel: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    submitButton: string;
    submitting: string;
    myRequestsTitle: string;
    noRequestsYet: string;
    markResolved: string;
    cancelRequest: string;
    statusLabels: {
      submitted: string;
      resolved: string;
      cancelled: string;
    };
  };
  impact: {
    heading: string;
    subheading: string;
    realSectionTitle: string;
    realSectionSubtitle: string;
    demoSectionTitle: string;
    demoSectionSubtitle: string;
    questionsLabel: string;
    screenshotsLabel: string;
    lessonsLabel: string;
    requestsLabel: string;
    architectureTitle: string;
    privacyTitle: string;
    privacyPoints: string[];
  };
  footer: {
    mission: string;
    gdgNote: string;
  };
}

export const TRANSLATIONS: Record<Language, UiStrings> = {
  en: {
    brand: 'Digital Saathi',
    nav: {
      chat: 'AI Saathi',
      screenshot: 'Screenshot',
      learn: 'Learn',
      volunteers: 'Volunteers',
      impact: 'Impact',
    },
    auth: {
      signIn: 'Sign in',
      signOut: 'Sign out',
      signingIn: 'Signing in...',
      guestMode: 'Guest mode',
      signedInAs: 'Signed in as',
      syncSavedNote: 'Your completed lessons, saved guides, and requests sync to your account.',
      guestSaveNote: 'Browsing as guest — sign in with Google to save progress across devices.',
    },
    controls: {
      languageLabel: 'Language',
      textSizeLabel: 'Text Size',
      textStandard: 'Normal',
      textLarge: 'Large',
      textXLarge: 'Extra Large',
      highContrast: 'High Contrast',
      highContrastOn: 'High Contrast: On',
      highContrastOff: 'High Contrast: Off',
      backToHome: 'Back to Home',
      homeLabel: 'Home',
      largeText: 'Larger Text',
      normalText: 'Standard Text',
      readAloud: 'Listen',
      stopAudio: 'Stop',
      loadingAudio: 'Preparing voice...',
    },
    hero: {
      kicker: 'Digital Saathi · Technology for Everyone',
      headline: 'Friendly, step-by-step technology help in English and Urdu.',
      subheadline:
        'Designed for elders, rural communities, students, and anyone learning smartphones, online forms, and internet safety at their own pace.',
      primaryCta: 'Ask AI Saathi',
      secondaryCta: 'Check a Screenshot',
      trustLine: 'Free community tool · No technical jargon · Private by design',
      imageAlt: 'An elderly woman and a community volunteer smiling together while looking at a smartphone',
    },
    chat: {
      heading: 'Ask AI Saathi',
      subheading:
        'Type or speak any technology question. Digital Saathi answers in calm, numbered steps with zero jargon.',
      inputPlaceholder: 'Ask anything, e.g. "How do I send a voice message on WhatsApp?"',
      sendButton: 'Ask Saathi',
      thinking: 'Thinking step by step...',
      micStart: 'Speak',
      micListening: 'Listening... tap to stop',
      micUnsupported: 'Voice input is not supported in this browser. Please type your question below.',
      quickPromptsTitle: 'Common questions to try',
      quickPrompts: [
        'How do I send a voice note on WhatsApp?',
        'Someone called asking for my bank OTP — should I share it?',
        'How do I make the text bigger on my phone?',
        'How do I fill an online college scholarship form safely?',
      ],
      stepsHeading: 'Step-by-step guide',
      safetyTipHeading: 'Safety note',
      credentialWarningTitle: 'Safety Warning: Protect Your OTP, Password & Bank Details',
      credentialWarningSubtitle:
        'Never share your OTP, PIN, password, or card details with any caller, SMS link, or chat message.',
      followUpsHeading: 'Ask next',
      saveGuide: 'Save guide',
      savedGuide: 'Saved',
      savedPanelTitle: 'Saved guides',
      noSavedYet: 'Save any helpful answer to keep it handy for later.',
      privacyNote: 'Never share your OTP, bank PIN, passwords, or ID numbers in chat.',
    },
    screenshot: {
      heading: 'Screenshot Helper',
      subheading:
        'Confused by a phone error, popup, or suspicious message? Upload a screenshot and AI Saathi will explain it safely.',
      uploadTitle: 'Upload a screenshot or photo of your screen',
      uploadHint: 'Supports JPG, JPEG, or PNG images up to 5 MB',
      chooseFile: 'Choose Screenshot',
      clearButton: 'Remove',
      noteLabel: 'Optional note (what were you trying to do?)',
      notePlaceholder: 'Example: This popped up when I opened my messages...',
      analyzeButton: 'Explain This Screen',
      analyzing: 'Checking screenshot safely...',
      sampleTitle: 'Try a sample screen at the event',
      sampleSubtitle: 'These generate real test images and send them live to Gemini Vision.',
      detectedErrorLabel: 'Detected on screen',
      unsupportedFileError: 'Unsupported file type. Please choose a JPG, JPEG, or PNG image.',
      fileTooLargeError: 'This image is too large. Please choose a file under 5 MB.',
      readError: 'Could not read that file. Please try another JPG or PNG screenshot.',
      riskLabels: {
        safe: 'Routine Issue — Safe to Fix',
        caution: 'Caution — Check Before Tapping',
        danger: 'Warning — Possible Scam or Risk',
      },
      stepsTitle: 'Simple troubleshooting steps',
      doNotDoTitle: 'What NOT to do',
      privacyBanner:
        'Privacy protection: Screenshots are analyzed in memory and are never stored in any database.',
    },
    learn: {
      heading: 'Digital Learning Hub',
      subheading:
        'Short, practical lessons for everyday phone skills, online forms, and staying safe from scams.',
      categories: {
        all: 'All Lessons',
        smartphone: 'Smartphones',
        messaging: 'Email & Chat',
        forms: 'Online Forms',
        safety: 'Internet Safety',
        services: 'Digital Services',
      },
      completedLabel: 'Completed',
      startLesson: 'Open Lesson',
      reviewLesson: 'Review Lesson',
      markComplete: 'Mark Lesson Complete',
      completedBadge: 'Lesson Completed',
      quickCheck: 'Quick Practice Check',
      correctFeedback: 'Well done! That is the safest and easiest choice.',
      tryAgainFeedback: 'Not quite — try reading the steps above and pick another option.',
      closeLesson: 'Close',
    },
    volunteers: {
      heading: 'Volunteer Connect',
      subheading:
        'See how learners can request patient, one-on-one guidance from local community mentors.',
      demoBannerTitle: 'Demo Directory Notice',
      demoBannerBody:
        'The volunteer profiles below are sample showcase profiles for demonstration. Live volunteer matching is not connected yet; however, when you sign in, your help requests are saved to your private Firestore queue.',
      demoProfileLabel: 'Sample Demo Profile',
      speaksLabel: 'Languages',
      selectVolunteer: 'Select Mentor',
      selectedVolunteer: 'Selected',
      formTitle: 'Log a Help Request',
      topicLabel: 'What do you need help with?',
      descriptionLabel: 'Describe your question in simple words',
      descriptionPlaceholder: 'Example: I need help setting up an email account for my university form...',
      submitButton: 'Submit Help Request',
      submitting: 'Saving request...',
      myRequestsTitle: 'Your Help Requests',
      noRequestsYet: 'No help requests logged yet.',
      markResolved: 'Mark Resolved',
      cancelRequest: 'Cancel',
      statusLabels: {
        submitted: 'Submitted (Demo Queue)',
        resolved: 'Resolved',
        cancelled: 'Cancelled',
      },
    },
    impact: {
      heading: 'Impact & Service Transparency',
      subheading:
        'Clear separation between your real activity in this app and illustrative community pilot figures.',
      realSectionTitle: 'Your Real Activity',
      realSectionSubtitle:
        'Live counts from your actual Gemini queries, screenshot checks, lessons, and saved requests.',
      demoSectionTitle: 'Community Pilot Showcase (Sample Demo Data)',
      demoSectionSubtitle:
        'Illustrative target metrics for a GDG community rollout — clearly labeled as demo data, not live telemetry.',
      questionsLabel: 'Questions Answered',
      screenshotsLabel: 'Screenshots Explained',
      lessonsLabel: 'Lessons Completed',
      requestsLabel: 'Help Requests Logged',
      architectureTitle: 'Connected Services vs Demo Modules',
      privacyTitle: 'Built-in Privacy Protections',
      privacyPoints: [
        'Gemini API runs strictly on the Node.js server — no API keys ever reach the browser.',
        'Uploaded screenshots are analyzed in memory and never saved to storage.',
        'Signed-in user data is strictly isolated per user ID in Firestore security rules.',
        'Voice recognition runs locally in supported browsers when you tap Speak.',
      ],
    },
    footer: {
      mission: 'Digital Saathi – Technology for Everyone',
      gdgNote: 'Prepared for Google Developer Group Community Showcase',
    },
  },
  ur: {
    brand: 'ڈیجیٹل ساتھی',
    nav: {
      chat: 'اے آئی ساتھی',
      screenshot: 'اسکرین شاٹ',
      learn: 'سیکھیں',
      volunteers: 'رضاکار',
      impact: 'اثرات',
    },
    auth: {
      signIn: 'سائن ان',
      signOut: 'سائن آؤٹ',
      signingIn: 'سائن ان ہو رہا ہے...',
      guestMode: 'مہمان موڈ',
      signedInAs: 'سائن ان بطور',
      syncSavedNote: 'آپ کے مکمل اسباق، محفوظ رہنمائی اور درخواستیں آپ کے اکاؤنٹ میں محفوظ رہتی ہیں۔',
      guestSaveNote: 'آپ مہمان کے طور پر دیکھ رہے ہیں — محفوظ کرنے کے لیے گوگل سے سائن ان کریں۔',
    },
    controls: {
      languageLabel: 'زبان',
      textSizeLabel: 'متن کا سائز',
      textStandard: 'عام',
      textLarge: 'بڑا',
      textXLarge: 'بہت بڑا',
      highContrast: 'تیز کنٹراسٹ',
      highContrastOn: 'تیز کنٹراسٹ: آن',
      highContrastOff: 'تیز کنٹراسٹ: آف',
      backToHome: 'ہوم پر واپس جائیں',
      homeLabel: 'ہوم',
      largeText: 'بڑا متن',
      normalText: 'عام متن',
      readAloud: 'سنیں',
      stopAudio: 'روکیں',
      loadingAudio: 'آواز تیار ہو رہی ہے...',
    },
    hero: {
      kicker: 'ڈیجیٹل ساتھی · ٹیکنالوجی سب کے لیے',
      headline: 'انگریزی اور اردو میں ٹیکنالوجی کی آسان، مرحلہ وار رہنمائی۔',
      subheadline:
        'بزرگوں، دیہی برادریوں، طلبہ اور نئے صارفین کے لیے اسمارٹ فون، آن لائن فارم اور انٹرنیٹ حفاظت سیکھنے کا باوقار ذریعہ۔',
      primaryCta: 'اے آئی ساتھی سے پوچھیں',
      secondaryCta: 'اسکرین شاٹ چیک کریں',
      trustLine: 'مفت کمیونٹی ٹول · سادہ زبان · مکمل رازداری',
      imageAlt: 'ایک بزرگ خاتون اور کمیونٹی رضاکار خوشگوار انداز میں اسمارٹ فون دیکھتے ہوئے',
    },
    chat: {
      heading: 'اے آئی ساتھی سے پوچھیں',
      subheading:
        'کوئی بھی ٹیکنالوجی سوال لکھیں یا بول کر پوچھیں۔ ڈیجیٹل ساتھی سادہ اور آسان مراحل میں جواب دے گا۔',
      inputPlaceholder: 'یہاں سوال لکھیں، مثلاً: واٹس ایپ پر وائس میسج کیسے بھیجیں؟',
      sendButton: 'سوال بھیجیں',
      thinking: 'آسان جواب تیار ہو رہا ہے...',
      micStart: 'بول کر پوچھیں',
      micListening: 'سن رہا ہے... روکنے کے لیے دبائیں',
      micUnsupported: 'اس براؤزر میں آواز سے لکھنے کی سہولت دستیاب نہیں۔ براہِ کرم نیچے سوال ٹائپ کریں۔',
      quickPromptsTitle: 'آسان نمونہ سوالات',
      quickPrompts: [
        'واٹس ایپ پر وائس میسج کیسے بھیجیں؟',
        'کوئی فون پر میرا بینک او ٹی پی مانگ رہا ہے — کیا میں بتا دوں؟',
        'فون پر لکھائی کا سائز بڑا کیسے کریں؟',
        'آن لائن اسکالرشپ فارم محفوظ طریقے سے کیسے بھریں؟',
      ],
      stepsHeading: 'مرحلہ وار طریقہ',
      safetyTipHeading: 'حفاظتی مشورہ',
      credentialWarningTitle: 'حفاظتی انتباہ: اپنا او ٹی پی، پاس ورڈ اور بینک معلومات محفوظ رکھیں',
      credentialWarningSubtitle:
        'کسی بھی کالر، ایس ایم ایس لنک یا چیٹ میں کبھی بھی اپنا او ٹی پی، پن یا پاس ورڈ ہرگز نہ بتائیں۔',
      followUpsHeading: 'اگلا سوال پوچھیں',
      saveGuide: 'محفوظ کریں',
      savedGuide: 'محفوظ ہو گیا',
      savedPanelTitle: 'محفوظ رہنمائی',
      noSavedYet: 'بعد میں دیکھنے کے لیے کسی بھی مفید جواب کو محفوظ کریں۔',
      privacyNote: 'چیٹ میں کبھی بھی اپنا او ٹی پی، بینک پن، پاس ورڈ یا شناختی کارڈ نمبر نہ لکھیں۔',
    },
    screenshot: {
      heading: 'اسکرین شاٹ مددگار',
      subheading:
        'فون کی کسی خرابی، پاپ اپ یا مشکوک پیغام سے پریشان ہیں؟ اسکرین شاٹ اپ لوڈ کریں اور آسان وضاحت حاصل کریں۔',
      uploadTitle: 'اپنی اسکرین کا اسکرین شاٹ یا تصویر اپ لوڈ کریں',
      uploadHint: 'صرف JPG، JPEG یا PNG تصاویر (زیادہ سے زیادہ 5 MB)',
      chooseFile: 'تصویر منتخب کریں',
      clearButton: 'ہٹائیں',
      noteLabel: 'اختیاری نوٹ (آپ کیا کرنے کی کوشش کر رہے تھے؟)',
      notePlaceholder: 'مثال: جب میں نے پیغامات کھولے تو یہ سامنے آیا...',
      analyzeButton: 'اسکرین کی وضاحت کریں',
      analyzing: 'اسکرین کا محفوظ جائزہ لیا جا رہا ہے...',
      sampleTitle: 'نمونہ اسکرین آزمائیں',
      sampleSubtitle: 'یہ بٹن اصلی ٹیسٹ تصویر بنا کر براہِ راست Gemini Vision کو بھیجتے ہیں۔',
      detectedErrorLabel: 'اسکرین پر نظر آنے والا پیغام',
      unsupportedFileError: 'یہ فائل قبول نہیں کی جا سکتی۔ براہِ کرم صرف JPG، JPEG یا PNG تصویر منتخب کریں۔',
      fileTooLargeError: 'یہ تصویر بہت بڑی ہے۔ براہِ کرم 5 MB سے کم سائز کی تصویر منتخب کریں۔',
      readError: 'یہ فائل پڑھی نہیں جا سکی۔ براہِ کرم کوئی اور JPG یا PNG تصویر آزمائیں۔',
      riskLabels: {
        safe: 'عام مسئلہ — حل کرنا محفوظ ہے',
        caution: 'احتیاط — ٹیپ کرنے سے پہلے جانچ لیں',
        danger: 'انتباہ — ممکنہ فراڈ یا خطرہ',
      },
      stepsTitle: 'آسان قدم بہ قدم حل',
      doNotDoTitle: 'کیا ہرگز نہ کریں',
      privacyBanner:
        'رازداری کا تحفظ: اسکرین شاٹس صرف وقتی طور پر جانچے جاتے ہیں اور کسی ڈیٹا بیس میں محفوظ نہیں ہوتے۔',
    },
    learn: {
      heading: 'ڈیجیٹل سیکھنے کا مرکز',
      subheading:
        'روزمرہ فون کے استعمال، آن لائن فارم اور دھوکہ دہی سے بچاؤ کے مختصر اور عملی اسباق۔',
      categories: {
        all: 'تمام اسباق',
        smartphone: 'اسمارٹ فون',
        messaging: 'ای میل و پیغامات',
        forms: 'آن لائن فارم',
        safety: 'انٹرنیٹ حفاظت',
        services: 'ڈیجیٹل خدمات',
      },
      completedLabel: 'مکمل',
      startLesson: 'سبق کھولیں',
      reviewLesson: 'دوبارہ دیکھیں',
      markComplete: 'سبق مکمل قرار دیں',
      completedBadge: 'سبق مکمل ہو گیا',
      quickCheck: 'مختصر مشق',
      correctFeedback: 'شاباش! یہ بالکل درست اور محفوظ انتخاب ہے۔',
      tryAgainFeedback: 'دوبارہ کوشش کریں — اوپر دیے گئے مراحل پڑھ کر صحیح جواب چنیں۔',
      closeLesson: 'بند کریں',
    },
    volunteers: {
      heading: 'رضاکار رابطہ',
      subheading:
        'دیکھیں کہ سیکھنے والے مقامی کمیونٹی رضاکاروں سے فرداً فرداً مدد کی درخواست کیسے کر سکتے ہیں۔',
      demoBannerTitle: 'ڈیمو ڈائریکٹری کی وضاحت',
      demoBannerBody:
        'نیچے دیے گئے رضاکار پروفائلز صرف نمائش (ڈیمو) کے لیے ہیں۔ براہِ راست رضاکار میچنگ ابھی منسلک نہیں ہے؛ تاہم سائن ان ہونے پر آپ کی مدد کی درخواستیں آپ کے نجی Firestore اکاؤنٹ میں محفوظ ہوتی ہیں۔',
      demoProfileLabel: 'ڈیمو پروفائل',
      speaksLabel: 'زبانیں',
      selectVolunteer: 'منتخب کریں',
      selectedVolunteer: 'منتخب شدہ',
      formTitle: 'مدد کی درخواست درج کریں',
      topicLabel: 'آپ کو کس چیز میں مدد درکار ہے؟',
      descriptionLabel: 'اپنا مسئلہ سادہ الفاظ میں لکھیں',
      descriptionPlaceholder: 'مثال: مجھے یونیورسٹی فارم کے لیے ای میل اکاؤنٹ بنانے میں مدد چاہیے...',
      submitButton: 'درخواست بھیجیں',
      submitting: 'محفوظ ہو رہا ہے...',
      myRequestsTitle: 'آپ کی مدد کی درخواستیں',
      noRequestsYet: 'ابھی تک کوئی درخواست درج نہیں کی گئی۔',
      markResolved: 'حل ہو گیا',
      cancelRequest: 'منسوخ کریں',
      statusLabels: {
        submitted: 'درج شدہ (ڈیمو قطار)',
        resolved: 'حل شدہ',
        cancelled: 'منسوخ',
      },
    },
    impact: {
      heading: 'اثرات اور شفافیت',
      subheading:
        'اس ایپ میں آپ کی حقیقی سرگرمی اور کمیونٹی پائلٹ کے نمائشی اعداد و شمار کے درمیان واضح فرق۔',
      realSectionTitle: 'آپ کی حقیقی سرگرمی',
      realSectionSubtitle:
        'آپ کے اصلی سوالات، اسکرین شاٹ جانچ، مکمل اسباق اور محفوظ درخواستوں کی حقیقی تعداد۔',
      demoSectionTitle: 'کمیونٹی پائلٹ نمائش (ڈیمو ڈیٹا)',
      demoSectionSubtitle:
        'جی ڈی جی کمیونٹی تقریب کے لیے مثالی اعداد و شمار — واضح طور پر ڈیمو لیبل کے ساتھ۔',
      questionsLabel: 'جواب دیے گئے سوالات',
      screenshotsLabel: 'سمجھائے گئے اسکرین شاٹس',
      lessonsLabel: 'مکمل کیے گئے اسباق',
      requestsLabel: 'مدد کی درخواستیں',
      architectureTitle: 'منسلک خدمات بمقابلہ ڈیمو حصے',
      privacyTitle: 'بلٹ ان رازداری کا تحفظ',
      privacyPoints: [
        'Gemini API صرف سرور پر چلتا ہے — براؤزر میں کوئی خفیہ کلید موجود نہیں۔',
        'اپ لوڈ کردہ اسکرین شاٹس محفوظ نہیں کیے جاتے۔',
        'سائن ان صارف کا ڈیٹا Firestore میں صرف اسی صارف تک محدود رہتا ہے۔',
        'آواز کی شناخت براہِ راست آپ کے براؤزر میں کام کرتی ہے۔',
      ],
    },
    footer: {
      mission: 'ڈیجیٹل ساتھی — ٹیکنالوجی سب کے لیے',
      gdgNote: 'گوگل ڈیولپر گروپ کمیونٹی نمائش کے لیے تیار کردہ',
    },
  },
  'roman-ur': {
    brand: 'Digital Saathi',
    nav: {
      chat: 'AI Saathi',
      screenshot: 'Screenshot',
      learn: 'Seekhen',
      volunteers: 'Volunteers',
      impact: 'Asraat',
    },
    auth: {
      signIn: 'Sign in',
      signOut: 'Sign out',
      signingIn: 'Sign in ho raha hai...',
      guestMode: 'Guest mode',
      signedInAs: 'Signed in:',
      syncSavedNote: 'Aap ke mukammal lessons, saved guides aur requests account mein mehfooz hain.',
      guestSaveNote: 'Aap guest mode mein hain — save karne ke liye Google se sign in karen.',
    },
    controls: {
      languageLabel: 'Zuban',
      textSizeLabel: 'Text Size',
      textStandard: 'Aam',
      textLarge: 'Bara',
      textXLarge: 'Bohat Bara',
      highContrast: 'High Contrast',
      highContrastOn: 'High Contrast: On',
      highContrastOff: 'High Contrast: Off',
      backToHome: 'Home par Wapas Jayen',
      homeLabel: 'Home',
      largeText: 'Bara Text',
      normalText: 'Aam Text',
      readAloud: 'Sunen',
      stopAudio: 'Roken',
      loadingAudio: 'Awaz ban rahi hai...',
    },
    hero: {
      kicker: 'Digital Saathi · Technology Sab Ke Liye',
      headline: 'English aur Urdu mein technology ki aasan, step-by-step madad.',
      subheadline:
        'Buzurgon, gaaon ki communities, students aur naye users ke liye smartphone, online forms aur internet safety seekhne ka aasan zariya.',
      primaryCta: 'AI Saathi se Poochen',
      secondaryCta: 'Screenshot Check Karen',
      trustLine: 'Muft community tool · Aasan zuban · Mukammal privacy',
      imageAlt: 'Ek buzurg khatoon aur community volunteer muskurate hue smartphone dekh rahe hain',
    },
    chat: {
      heading: 'AI Saathi se Poochen',
      subheading:
        'Koi bhi technology sawal likhen ya bol kar poochen. Digital Saathi aasan aur mukhtasar steps mein jawab dega.',
      inputPlaceholder: 'Apna sawal likhen, maslan: "WhatsApp par voice message kaise bhejen?"',
      sendButton: 'Sawal Bhejen',
      thinking: 'Aasan jawab tayyar ho raha hai...',
      micStart: 'Bol Kar Poochen',
      micListening: 'Sun raha hai... rokne ke liye dabayen',
      micUnsupported: 'Is browser mein voice input support nahi hai. Meherbani kar ke neeche type karen.',
      quickPromptsTitle: 'Aasan misali sawalat',
      quickPrompts: [
        'WhatsApp par voice message kaise bhejen?',
        'Koi phone par mera bank OTP maang raha hai — kya main bata dun?',
        'Phone ki likhai bari kaise karen?',
        'Online scholarship form mehfooz tareeqe se kaise bharen?',
      ],
      stepsHeading: 'Step-by-step tareeqa',
      safetyTipHeading: 'Hifazati mashwara',
      credentialWarningTitle: 'Hifazati Intibah: Apna OTP, Password aur Bank Details Mehfooz Rakhen',
      credentialWarningSubtitle:
        'Kisi bhi caller, SMS link ya chat mein kabhi apna OTP, PIN, password ya card number share na karen.',
      followUpsHeading: 'Agla sawal poochen',
      saveGuide: 'Save karen',
      savedGuide: 'Save ho gaya',
      savedPanelTitle: 'Saved guides',
      noSavedYet: 'Baad mein dekhne ke liye kisi bhi mufeed jawab ko save karen.',
      privacyNote: 'Chat mein kabhi bhi apna OTP, bank PIN, password ya CNIC number na likhen.',
    },
    screenshot: {
      heading: 'Screenshot Madadgar',
      subheading:
        'Phone ke kisi error, popup ya mashkook message se pareshan hain? Screenshot upload karen aur aasan wazahat payen.',
      uploadTitle: 'Apni screen ka screenshot ya photo upload karen',
      uploadHint: 'Sirf JPG, JPEG, ya PNG tasveer (5 MB tak)',
      chooseFile: 'Tasveer Chunen',
      clearButton: 'Hatayen',
      noteLabel: 'Optional note (aap kya kar rahe the?)',
      notePlaceholder: 'Misal: Jab maine messages khole to yeh screen aayi...',
      analyzeButton: 'Screen Samjhayen',
      analyzing: 'Screenshot check ho raha hai...',
      sampleTitle: 'Demo sample screen try karen',
      sampleSubtitle: 'Yeh buttons asli test tasveer bana kar live Gemini Vision ko bhejte hain.',
      detectedErrorLabel: 'Screen par dikha error',
      unsupportedFileError: 'Yeh file support nahi karti. Meherbani kar ke sirf JPG, JPEG, ya PNG tasveer chunen.',
      fileTooLargeError: 'Yeh tasveer bohat bari hai. Meherbani kar ke 5 MB se chhoti file chunen.',
      readError: 'Yeh file parhi nahi ja saki. Koi doosri JPG ya PNG tasveer try karen.',
      riskLabels: {
        safe: 'Aam Masla — Hal Karna Mehfooz Hai',
        caution: 'Ehtiyat — Tap Karne Se Pehle Check Karen',
        danger: 'Khabardar — Mumkina Scam ya Khatra',
      },
      stepsTitle: 'Aasan step-by-step hal',
      doNotDoTitle: 'Kya hargiz NA karen',
      privacyBanner:
        'Privacy tahaffuz: Screenshots sirf analysis ke liye memory mein check hote hain aur kahin save nahi hote.',
    },
    learn: {
      heading: 'Digital Seekhne Ka Markaz',
      subheading:
        'Rozmarra smartphone istemal, online forms aur dhoke se bachne ke chhote aur aasan sabaq.',
      categories: {
        all: 'Sab Lessons',
        smartphone: 'Smartphones',
        messaging: 'Email & Chat',
        forms: 'Online Forms',
        safety: 'Internet Safety',
        services: 'Digital Services',
      },
      completedLabel: 'Mukammal',
      startLesson: 'Lesson Kholen',
      reviewLesson: 'Dobara Dekhen',
      markComplete: 'Lesson Mukammal Karen',
      completedBadge: 'Lesson Mukammal',
      quickCheck: 'Chhoti Mashq',
      correctFeedback: 'Shabash! Yeh bilkul sahi aur mehfooz jawab hai.',
      tryAgainFeedback: 'Dobara koshish karen — upar diye gaye steps parh kar sahi option chunen.',
      closeLesson: 'Band karen',
    },
    volunteers: {
      heading: 'Volunteer Rabta',
      subheading:
        'Dekhen ke seekhne wale maqami community volunteers se madad ki darkhwast kaise kar sakte hain.',
      demoBannerTitle: 'Demo Directory Wazahat',
      demoBannerBody:
        'Neeche diye gaye volunteer profiles sirf demo showcase ke liye hain. Live volunteer matching abhi connected nahi hai; lekin sign in karne par aap ki requests aap ke private Firestore mein save hoti hain.',
      demoProfileLabel: 'Demo Profile',
      speaksLabel: 'Zuban',
      selectVolunteer: 'Mentor Chunen',
      selectedVolunteer: 'Chuna Gaya',
      formTitle: 'Madad Ki Darkhwast Bhejen',
      topicLabel: 'Kis kaam mein madad chahiye?',
      descriptionLabel: 'Apna masla aasan alfaz mein likhen',
      descriptionPlaceholder: 'Misal: Mujhe university form ke liye email banane mein madad chahiye...',
      submitButton: 'Request Bhejen',
      submitting: 'Save ho raha hai...',
      myRequestsTitle: 'Aap Ki Requests',
      noRequestsYet: 'Abhi tak koi request nahi bheji gayi.',
      markResolved: 'Hal Ho Gaya',
      cancelRequest: 'Cancel',
      statusLabels: {
        submitted: 'Submitted (Demo Queue)',
        resolved: 'Hal Shuda',
        cancelled: 'Cancel',
      },
    },
    impact: {
      heading: 'Asraat aur Shaffafiyat',
      subheading:
        'Is app mein aap ki asli activity aur community pilot ke demo numbers ke darmiyan saaf farq.',
      realSectionTitle: 'Aap Ki Asli Activity',
      realSectionSubtitle:
        'Aap ke asli Gemini sawalat, screenshot checks, lessons aur requests ki ginti.',
      demoSectionTitle: 'Community Pilot Showcase (Demo Data)',
      demoSectionSubtitle:
        'GDG community event ke liye misali numbers — saaf taur par demo data ke taur par dikhaye gaye hain.',
      questionsLabel: 'Jawabat Diye Gaye',
      screenshotsLabel: 'Screenshots Samjhaye',
      lessonsLabel: 'Lessons Mukammal',
      requestsLabel: 'Help Requests',
      architectureTitle: 'Asli Connected Services vs Demo Hissay',
      privacyTitle: 'Buniyadi Privacy Hifazat',
      privacyPoints: [
        'Gemini API sirf Node.js server par chalta hai — browser mein koi API key nahi hoti.',
        'Upload kiye gaye screenshots kahin save nahi hote.',
        'Signed-in user ka data Firestore rules ke zariye sirf ussi user tak mehdood rehta hai.',
        'Voice input browser ke andar local chalta hai jab aap microphone dabate hain.',
      ],
    },
    footer: {
      mission: 'Digital Saathi – Technology Sab Ke Liye',
      gdgNote: 'Google Developer Group Community Event ke liye tayyar',
    },
  },
};
