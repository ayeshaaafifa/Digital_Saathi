import type { TutorialLesson, VolunteerProfile } from '../types';

export const TUTORIAL_LESSONS: TutorialLesson[] = [
  {
    id: 'lesson-smartphone-text',
    category: 'smartphone',
    durationMinutes: 4,
    image: '/src/assets/images/learning_smartphone_basics_1794919207696.jpg',
    level: {
      en: 'Beginner',
      ur: 'ابتدائی',
      'roman-ur': 'Shuruati',
    },
    title: {
      en: 'Make Text Larger & Screen Easier to Read',
      ur: 'فون کی لکھائی بڑا اور واضح بنانا',
      'roman-ur': 'Phone Ki Likhai Bari aur Saaf Karna',
    },
    summary: {
      en: 'Adjust your phone font size and brightness so messages and buttons are comfortable for your eyes.',
      ur: 'اپنے فون کے حروف کا سائز اور روشنی بہتر بنائیں تاکہ پیغامات اور بٹن آسانی سے پڑھے جا سکیں۔',
      'roman-ur': 'Apne phone ke text ka size aur brightness theek karen taake har lafz aasani se parha ja sake.',
    },
    steps: [
      {
        title: {
          en: 'Open Settings',
          ur: 'سیٹنگز (Settings) کھولیں',
          'roman-ur': 'Settings Kholen',
        },
        instruction: {
          en: 'Tap the grey gear icon called Settings on your phone home screen.',
          ur: 'اپنی ہوم اسکرین پر گرے رنگ کے پہیے والے آئیکن (Settings) کو دبائیں۔',
          'roman-ur': 'Apni home screen par gear wale icon (Settings) ko tap karen.',
        },
      },
      {
        title: {
          en: 'Choose Display',
          ur: 'ڈسپلے (Display) منتخب کریں',
          'roman-ur': 'Display Chunen',
        },
        instruction: {
          en: 'Scroll down gently and tap Display or Display & Brightness.',
          ur: 'نیچے اسکرول کریں اور Display یا Display & Brightness پر ٹیپ کریں۔',
          'roman-ur': 'Neeche scroll karen aur Display ya Display & Brightness par tap karen.',
        },
      },
      {
        title: {
          en: 'Slide Font Size Right',
          ur: 'فونٹ سائز دائیں طرف بڑھائیں',
          'roman-ur': 'Font Size Aage Barhayen',
        },
        instruction: {
          en: 'Tap Font size, then slide the circle to Large or Largest until the preview text looks comfortable.',
          ur: 'Font size پر ٹیپ کریں اور دائرے کو Large کی طرف کھسکائیں جب تک تحریر آرام دہ نظر نہ آئے۔',
          'roman-ur': 'Font size par tap karen aur slider ko Large ki taraf barhayen jab tak parhna aasan ho jaye.',
        },
      },
    ],
    quizQuestion: {
      en: 'Where do you go first to make phone text larger?',
      ur: 'فون کی لکھائی بڑا کرنے کے لیے سب سے پہلے کہاں جائیں؟',
      'roman-ur': 'Phone ka text bara karne ke liye sab se pehle kahan jayen?',
    },
    quizOptions: [
      { en: 'Settings → Display → Font Size', ur: 'Settings ← Display ← Font Size', 'roman-ur': 'Settings → Display → Font Size' },
      { en: 'Camera → Flash', ur: 'Camera ← Flash', 'roman-ur': 'Camera → Flash' },
      { en: 'Calculator', ur: 'کیلکولیٹر', 'roman-ur': 'Calculator' },
    ],
    quizCorrectIndex: 0,
  },
  {
    id: 'lesson-whatsapp-voice',
    category: 'messaging',
    durationMinutes: 5,
    level: {
      en: 'Beginner',
      ur: 'ابتدائی',
      'roman-ur': 'Shuruati',
    },
    title: {
      en: 'Sending Voice Notes & Photos to Family',
      ur: 'خاندان کو وائس میسج اور تصویر بھیجنا',
      'roman-ur': 'Ghar Walon Ko Voice Note aur Photo Bhejna',
    },
    summary: {
      en: 'Speak instead of typing small letters by holding the microphone button in your messaging app.',
      ur: 'چھوٹے حروف ٹائپ کرنے کے بجائے مائیکروفون بٹن دبا کر اپنی آواز میں پیغام بھیجیں۔',
      'roman-ur': 'Chhote lafz type karne ke bajaye mic button daba kar apni awaz mein paigham bhejen.',
    },
    steps: [
      {
        title: {
          en: 'Open a Family Chat',
          ur: 'خاندان کی چیٹ کھولیں',
          'roman-ur': 'Family Chat Kholen',
        },
        instruction: {
          en: 'Open your messaging app and tap the name of the person you want to talk to.',
          ur: 'اپنی میسجنگ ایپ کھولیں اور اس فرد کے نام پر ٹیپ کریں جس سے بات کرنی ہے۔',
          'roman-ur': 'Messaging app kholen aur us shakhs ke naam par tap karen jis se baat karni hai.',
        },
      },
      {
        title: {
          en: 'Hold the Microphone',
          ur: 'مائیکروفون دبائے رکھیں',
          'roman-ur': 'Microphone Dabaye Rakhen',
        },
        instruction: {
          en: 'Press and hold the green microphone icon at the bottom corner while speaking clearly.',
          ur: 'نیچے کونے میں موجود سبز مائیکروفون بٹن کو دبائے رکھیں اور صاف آواز میں بولیں۔',
          'roman-ur': 'Neeche kone mein sabz microphone icon ko dabaye rakhen aur saaf bolen.',
        },
      },
      {
        title: {
          en: 'Release to Send',
          ur: 'بھیجنے کے لیے چھوڑ دیں',
          'roman-ur': 'Bhejne Ke Liye Chhor Den',
        },
        instruction: {
          en: 'Lift your finger when you finish speaking and your voice message sends automatically.',
          ur: 'بات مکمل ہونے پر انگلی ہٹا لیں، آپ کا وائس پیغام خود بخود چلا جائے گا۔',
          'roman-ur': 'Baat poori hone par ungli hata len, voice note khud chala jayega.',
        },
      },
    ],
    quizQuestion: {
      en: 'What happens if you lift your finger after recording a voice note?',
      ur: 'وائس نوٹ ریکارڈ کرنے کے بعد انگلی ہٹانے سے کیا ہوتا ہے؟',
      'roman-ur': 'Voice note record karne ke baad ungli hatane se kya hota hai?',
    },
    quizOptions: [
      { en: 'The voice message is sent', ur: 'آواز کا پیغام بھیج دیا جاتا ہے', 'roman-ur': 'Voice message bhej diya jata hai' },
      { en: 'The phone turns off', ur: 'فون بند ہو جاتا ہے', 'roman-ur': 'Phone band ho jata hai' },
      { en: 'All contacts are deleted', ur: 'تمام نمبر مٹ جاتے ہیں', 'roman-ur': 'Sab contacts delete ho jate hain' },
    ],
    quizCorrectIndex: 0,
  },
  {
    id: 'lesson-email-account',
    category: 'messaging',
    durationMinutes: 6,
    level: {
      en: 'Essential',
      ur: 'لازمی',
      'roman-ur': 'Zaroori',
    },
    title: {
      en: 'Using Email for Jobs, Bills & School Updates',
      ur: 'ملازمت، بل اور تعلیمی اطلاعات کے لیے ای میل',
      'roman-ur': 'Naukri, Bills aur Taleem Ke Liye Email Istemal',
    },
    summary: {
      en: 'Learn how to read your inbox, reply politely, and keep your email password safe on paper.',
      ur: 'اپنا ان باکس پڑھنا، جواب دینا اور ای میل پاس ورڈ محفوظ طریقے سے یاد رکھنا سیکھیں۔',
      'roman-ur': 'Inbox parhna, jawab dena aur apna email password mehfooz rakhna seekhen.',
    },
    steps: [
      {
        title: {
          en: 'Check Your Inbox',
          ur: 'ان باکس (Inbox) دیکھیں',
          'roman-ur': 'Inbox Check Karen',
        },
        instruction: {
          en: 'Open your email app. Bold lines at the top are new unread messages.',
          ur: 'ای میل ایپ کھولیں۔ اوپر موٹی لکھائی والے پیغامات نئے اور غیر پڑھے ہوئے ہیں۔',
          'roman-ur': 'Email app kholen. Upar gehri likhai wale paighamat naye hain jo abhi parhe nahi gaye.',
        },
      },
      {
        title: {
          en: 'Compose a New Message',
          ur: 'نیا پیغام لکھیں',
          'roman-ur': 'Naya Paigham Likhen',
        },
        instruction: {
          en: 'Tap Compose, type the recipient email in "To", write a short "Subject", then write your message.',
          ur: 'Compose دبائیں، "To" میں ای میل لکھیں، مختصر عنوان (Subject) ڈالیں اور پیغام لکھیں۔',
          'roman-ur': 'Compose dabayen, "To" mein email address likhen, chhota Subject likhen, phir paigham likhen.',
        },
      },
      {
        title: {
          en: 'Never Share Passwords',
          ur: 'پاس ورڈ کبھی شیئر نہ کریں',
          'roman-ur': 'Password Kabhi Share Na Karen',
        },
        instruction: {
          en: 'Write your password in a private notebook kept safely at home — never in a chat message.',
          ur: 'اپنا پاس ورڈ گھر میں رکھی ذاتی ڈائری میں لکھیں — کبھی کسی چیٹ یا ایس ایم ایس میں نہ بھیجیں۔',
          'roman-ur': 'Apna password ghar ki private diary mein likhen — kabhi chat ya SMS mein na bhejen.',
        },
      },
    ],
    quizQuestion: {
      en: 'Where should you keep your email password?',
      ur: 'اپنا ای میل پاس ورڈ کہاں محفوظ رکھنا چاہیے؟',
      'roman-ur': 'Apna email password kahan mehfooz rakhna chahiye?',
    },
    quizOptions: [
      { en: 'In a private notebook at home', ur: 'گھر کی ذاتی ڈائری میں', 'roman-ur': 'Ghar ki private diary mein' },
      { en: 'In a public social media post', ur: 'سوشل میڈیا پوسٹ پر', 'roman-ur': 'Social media post par' },
      { en: 'Send it to unknown callers', ur: 'اجنبی کالر کو بتا کر', 'roman-ur': 'Anjaan caller ko bata kar' },
    ],
    quizCorrectIndex: 0,
  },
  {
    id: 'lesson-online-forms',
    category: 'forms',
    durationMinutes: 7,
    image: '/src/assets/images/rural_student_digital_1794919207739.jpg',
    level: {
      en: 'Students & Citizens',
      ur: 'طلبہ و شہری',
      'roman-ur': 'Students aur Shehri',
    },
    title: {
      en: 'Filling Online Scholarship & Government Forms',
      ur: 'آن لائن اسکالرشپ اور سرکاری فارم بھرنا',
      'roman-ur': 'Online Scholarship aur Sarkari Forms Bharna',
    },
    summary: {
      en: 'Prepare your documents first, check the official website address, and avoid paying fake agents.',
      ur: 'پہلے دستاویزات تیار کریں، سرکاری ویب سائٹ کا پتہ چیک کریں اور جعلی ایجنٹوں سے بچیں۔',
      'roman-ur': 'Pehle kaghzat tayyar karen, asli website address check karen aur jali agents se bachen.',
    },
    steps: [
      {
        title: {
          en: 'Prepare Clear Photos',
          ur: 'واضح تصاویر تیار رکھیں',
          'roman-ur': 'Saaf Tasveeren Tayyar Karen',
        },
        instruction: {
          en: 'Place your ID or certificate flat in daylight and take a clear, straight photo before opening the form.',
          ur: 'فارم کھولنے سے پہلے دن کی روشنی میں اپنے شناختی کارڈ یا سند کی سیدھی اور صاف تصویر کھینچ لیں۔',
          'roman-ur': 'Form kholne se pehle din ki roshni mein apne card ya sanad ki saaf aur seedhi tasveer bana len.',
        },
      },
      {
        title: {
          en: 'Verify Official Address',
          ur: 'سرکاری ویب سائٹ کی تصدیق کریں',
          'roman-ur': 'Asli Website Check Karen',
        },
        instruction: {
          en: 'Check that the website begins with https:// and matches the official university or government domain (.gov.pk / .edu.pk).',
          ur: 'چیک کریں کہ ویب سائٹ https:// سے شروع ہوتی ہو اور مستند سرکاری یا تعلیمی ڈومین (.gov.pk / .edu.pk) ہو۔',
          'roman-ur': 'Check karen ke website https:// se shuru ho aur asli sarkari ya taleemi domain (.gov.pk / .edu.pk) ho.',
        },
      },
      {
        title: {
          en: 'Save Confirmation Receipt',
          ur: 'رسید کا اسکرین شاٹ محفوظ کریں',
          'roman-ur': 'Receipt Save Karen',
        },
        instruction: {
          en: 'After tapping Submit, save a screenshot of your application tracking number immediately.',
          ur: 'Submit دبانے کے بعد فوراً اپنے درخواست نمبر (Tracking ID) کا اسکرین شاٹ محفوظ کر لیں۔',
          'roman-ur': 'Submit dabane ke baad foran apne application number ka screenshot save kar len.',
        },
      },
    ],
    quizQuestion: {
      en: 'What should you save right after submitting an online form?',
      ur: 'آن لائن فارم جمع کرانے کے فوراً بعد کیا محفوظ کرنا چاہیے؟',
      'roman-ur': 'Online form jama karne ke foran baad kya save karna chahiye?',
    },
    quizOptions: [
      { en: 'A screenshot of the confirmation & tracking ID', ur: 'تصدیقی پیغام اور ٹریکنگ نمبر کا اسکرین شاٹ', 'roman-ur': 'Confirmation aur tracking ID ka screenshot' },
      { en: 'Nothing at all', ur: 'کچھ بھی نہیں', 'roman-ur': 'Kuch bhi nahi' },
      { en: 'Your friend’s password', ur: 'دوست کا پاس ورڈ', 'roman-ur': 'Dost ka password' },
    ],
    quizCorrectIndex: 0,
  },
  {
    id: 'lesson-scam-safety',
    category: 'safety',
    durationMinutes: 6,
    level: {
      en: 'Critical Safety',
      ur: 'انتہائی ضروری حفاظت',
      'roman-ur': 'Behad Zaroori Hifazat',
    },
    title: {
      en: 'Spotting Fake OTP Calls, Prize SMS & Scam Links',
      ur: 'جعلی او ٹی پی کالز، انعامی پیغامات اور دھوکہ دہی کی پہچان',
      'roman-ur': 'Jali OTP Calls, Inaami SMS aur Scam Links Ki Pehchan',
    },
    summary: {
      en: 'Real banks and government offices NEVER ask for your 4-digit or 6-digit OTP code over phone or WhatsApp.',
      ur: 'اصلی بینک اور سرکاری ادارے کبھی بھی فون یا واٹس ایپ پر آپ کا او ٹی پی (OTP) یا پن کوڈ نہیں مانگتے۔',
      'roman-ur': 'Asli banks aur sarkari idare kabhi bhi phone ya WhatsApp par aap ka OTP ya PIN nahi mangte.',
    },
    steps: [
      {
        title: {
          en: 'Guard Your OTP Code',
          ur: 'او ٹی پی (OTP) ہرگز نہ بتائیں',
          'roman-ur': 'OTP Kabhi Na Batayen',
        },
        instruction: {
          en: 'An OTP is like the key to your house. Even if a caller claims to be from a bank, hang up immediately if they ask for it.',
          ur: 'او ٹی پی آپ کے گھر کی چابی کی طرح ہے۔ اگر کوئی بینک افسر بن کر بھی مانگے تو فوراً کال بند کر دیں۔',
          'roman-ur': 'OTP aap ke ghar ki chabi hai. Agar koi bank officer ban kar bhi maange to foran call kaat den.',
        },
      },
      {
        title: {
          en: 'Pause Before Clicking Links',
          ur: 'مشتبہ لنکس پر کلک نہ کریں',
          'roman-ur': 'Mashkook Links Par Click Na Karen',
        },
        instruction: {
          en: 'Messages saying "You won a prize" or "Your account will close in 1 hour" are traps. Use Screenshot Helper to check them first.',
          ur: '"آپ نے انعام جیتا ہے" یا "اکاؤنٹ بند ہو جائے گا" جیسے پیغامات جال ہوتے ہیں۔ پہلے اسکرین شاٹ مددگار سے جانچیں۔',
          'roman-ur': '"Aap ne inaam jeeta hai" ya "account band ho jayega" jaise messages jaal hote hain. Pehle Screenshot Helper se check karen.',
        },
      },
      {
        title: {
          en: 'Verify Through Official Numbers',
          ur: 'اصل نمبر پر تصدیق کریں',
          'roman-ur': 'Asli Number Par Tasdeeq Karen',
        },
        instruction: {
          en: 'Call the official helpline printed on the back of your bank card instead of the number inside an SMS.',
          ur: 'ایس ایم ایس میں دیے گئے نمبر کے بجائے اپنے بینک کارڈ کے پیچھے لکھے سرکاری ہیلپ لائن نمبر پر کال کریں۔',
          'roman-ur': 'SMS wale number ke bajaye apne bank card ke peeche likhi asli helpline par call karen.',
        },
      },
    ],
    quizQuestion: {
      en: 'Someone calls claiming to be from your bank and asks for your 6-digit OTP. What should you do?',
      ur: 'کوئی شخص بینک کا نمائندہ بن کر آپ سے 6 ہندسوں کا او ٹی پی مانگے تو کیا کریں؟',
      'roman-ur': 'Koi bank ka numainda ban kar aap se 6-digit OTP maange to kya karen?',
    },
    quizOptions: [
      { en: 'Refuse and hang up immediately', ur: 'انکار کریں اور فوراً کال بند کر دیں', 'roman-ur': 'Inkaar karen aur foran call kaat den' },
      { en: 'Read the OTP quickly', ur: 'فوراً او ٹی پی بتا دیں', 'roman-ur': 'Foran OTP bata den' },
      { en: 'Send a screenshot of the OTP', ur: 'او ٹی پی کا اسکرین شاٹ بھیج دیں', 'roman-ur': 'OTP ka screenshot bhej den' },
    ],
    quizCorrectIndex: 0,
  },
  {
    id: 'lesson-digital-services',
    category: 'services',
    durationMinutes: 5,
    level: {
      en: 'Everyday Life',
      ur: 'روزمرہ زندگی',
      'roman-ur': 'Rozmarra Zindagi',
    },
    title: {
      en: 'Checking Utility Bills & Clinic Appointments Online',
      ur: 'بجلی گیس کے بل اور ڈاکٹر کی اپائنٹمنٹ آن لائن دیکھنا',
      'roman-ur': 'Bijli Bills aur Doctor Appointment Online Dekhna',
    },
    summary: {
      en: 'Save hours of waiting in queues by checking reference numbers and booking visits safely from home.',
      ur: 'قطاروں میں انتظار کے بجائے گھر بیٹھے ریفرنس نمبر سے بل دیکھیں اور محفوظ طریقے سے وقت طے کریں۔',
      'roman-ur': 'Lainon mein kharay hone ke bajaye ghar baithe reference number se bill check karen aur appointment len.',
    },
    steps: [
      {
        title: {
          en: 'Find Your Reference Number',
          ur: 'ریفرنس نمبر تلاش کریں',
          'roman-ur': 'Reference Number Dhoonden',
        },
        instruction: {
          en: 'Look at the top corner of an old paper electricity or gas bill to find your 14-digit Reference Number.',
          ur: 'اپنے پرانے کاغذی بجلی یا گیس بل کے اوپری کونے میں موجود 14 ہندسوں کا ریفرنس نمبر نوٹ کریں۔',
          'roman-ur': 'Purane kagazi bill ke upri kone par likha 14-digit Reference Number note karen.',
        },
      },
      {
        title: {
          en: 'Bookmark Trusted Portals',
          ur: 'معتبر ویب سائٹ محفوظ کریں',
          'roman-ur': 'Bharosemand Website Save Karen',
        },
        instruction: {
          en: 'Ask a trusted family member or volunteer to save the official bill or clinic portal as a home-screen shortcut.',
          ur: 'کسی قابلِ اعتماد فرد یا رضاکار کی مدد سے سرکاری بل یا کلینک ویب سائٹ کو ہوم اسکرین پر محفوظ کر لیں۔',
          'roman-ur': 'Kisi bharosemand shakhs ki madad se asli bill ya clinic website ka shortcut home screen par save kar len.',
        },
      },
      {
        title: {
          en: 'Double Check Before Paying',
          ur: 'ادائیگی سے پہلے نام تصدیق کریں',
          'roman-ur': 'Payment Se Pehle Naam Check Karen',
        },
        instruction: {
          en: 'When paying a bill through a mobile wallet, confirm your household name and bill month match before tapping Pay.',
          ur: 'موبائل والیٹ سے بل ادا کرتے وقت ادائیگی سے پہلے صارف کا نام اور مہینہ ضرور چیک کریں۔',
          'roman-ur': 'Mobile wallet se bill ada karne se pehle naam aur mahina zaroor tasdeeq karen.',
        },
      },
    ],
    quizQuestion: {
      en: 'What should you verify right before paying a utility bill in a mobile app?',
      ur: 'موبائل ایپ سے بل ادا کرنے سے ٹھیک پہلے کیا چیک کرنا چاہیے؟',
      'roman-ur': 'Mobile app se bill ada karne se theek pehle kya check karna chahiye?',
    },
    quizOptions: [
      { en: 'Consumer name, bill month, and amount', ur: 'صارف کا نام، بل کا مہینہ اور رقم', 'roman-ur': 'Consumer naam, mahina aur raqam' },
      { en: 'Your phone wallpaper', ur: 'فون کا وال پیپر', 'roman-ur': 'Phone ka wallpaper' },
      { en: 'Battery percentage only', ur: 'صرف بیٹری فیصد', 'roman-ur': 'Sirf battery percentage' },
    ],
    quizCorrectIndex: 0,
  },
];

export const DEMO_VOLUNTEERS: VolunteerProfile[] = [
  {
    id: 'vol-amna-lahore',
    name: 'Amna Tariq',
    city: 'Lahore (Demo)',
    languages: ['Urdu', 'Punjabi', 'English'],
    image: '/src/assets/images/volunteer_mentor_portrait_1794919208830.jpg',
    specialty: {
      en: 'Elder Smartphone Setup & WhatsApp Basics',
      ur: 'بزرگوں کے لیے اسمارٹ فون اور واٹس ایپ رہنمائی',
      'roman-ur': 'Buzurgon Ke Liye Smartphone aur WhatsApp Madad',
    },
    availability: {
      en: 'Demo Schedule: Tue & Thu evenings',
      ur: 'ڈیمو شیڈول: منگل اور جمعرات شام',
      'roman-ur': 'Demo Schedule: Mangal aur Jumerat shaam',
    },
    bio: {
      en: 'GDG community mentor helping senior citizens adjust accessibility settings, video call family, and stay safe from scam calls.',
      ur: 'جی ڈی جی کمیونٹی رضاکار جو بزرگ شہریوں کو فون کی آسان سیٹنگز، ویڈیو کال اور فراڈ کالز سے بچاؤ میں مدد دیتی ہیں۔',
      'roman-ur': 'GDG community mentor jo buzurgon ko phone settings, video calls aur scam calls se bachne mein madad karti hain.',
    },
    isDemoProfile: true,
  },
  {
    id: 'vol-bilal-multan',
    name: 'Bilal Raza',
    city: 'Multan (Demo)',
    languages: ['Urdu', 'Saraiki', 'English'],
    specialty: {
      en: 'Student Scholarships & Online Forms',
      ur: 'طلبہ اسکالرشپ اور آن لائن فارم',
      'roman-ur': 'Student Scholarships aur Online Forms',
    },
    availability: {
      en: 'Demo Schedule: Weekends 10 AM – 2 PM',
      ur: 'ڈیمو شیڈول: ہفتہ و اتوار صبح 10 تا دوپہر 2',
      'roman-ur': 'Demo Schedule: Hafta aur Itwar subah 10 se 2',
    },
    bio: {
      en: 'Computer science graduate guiding first-generation rural students through university portals, PDF uploads, and email accounts.',
      ur: 'کمپیوٹر سائنس گریجویٹ جو دیہی علاقوں کے طلبہ کو یونیورسٹی پورٹل، پی ڈی ایف اور ای میل بنانے میں مدد دیتے ہیں۔',
      'roman-ur': 'CS graduate jo rural students ko university portals, PDF uploads aur email accounts mein guide karte hain.',
    },
    isDemoProfile: true,
  },
  {
    id: 'vol-sana-hyderabad',
    name: 'Sana Memon',
    city: 'Hyderabad (Demo)',
    languages: ['Sindhi', 'Urdu', 'English'],
    specialty: {
      en: 'Digital Banking & Scam Prevention',
      ur: 'ڈیجیٹل بینکنگ اور فراڈ سے بچاؤ',
      'roman-ur': 'Digital Banking aur Scam Protection',
    },
    availability: {
      en: 'Demo Schedule: Mon & Wed afternoons',
      ur: 'ڈیمو شیڈول: پیر اور بدھ سہ پہر',
      'roman-ur': 'Demo Schedule: Peer aur Budh dopehar',
    },
    bio: {
      en: 'Tech educator teaching families how to check official utility bills, guard OTPs, and spot fake SMS links.',
      ur: 'ٹیک معلمہ جو خاندانوں کو سرکاری بل دیکھنے، او ٹی پی محفوظ رکھنے اور جعلی لنکس پہچاننے کی تربیت دیتی ہیں۔',
      'roman-ur': 'Tech teacher jo families ko bills check karne, OTP bachane aur fake links pehchanne ki training deti hain.',
    },
    isDemoProfile: true,
  },
  {
    id: 'vol-hamza-peshawar',
    name: 'Hamza Khan',
    city: 'Peshawar (Demo)',
    languages: ['Pashto', 'Urdu', 'English'],
    specialty: {
      en: 'First-Time Phone Users & Voice Tools',
      ur: 'نئے فون صارفین اور وائس ٹولز',
      'roman-ur': 'Naye Phone Users aur Voice Tools',
    },
    availability: {
      en: 'Demo Schedule: Fri & Sat afternoons',
      ur: 'ڈیمو شیڈول: جمعہ اور ہفتہ سہ پہر',
      'roman-ur': 'Demo Schedule: Jumma aur Hafta dopehar',
    },
    bio: {
      en: 'Community volunteer focused on voice-first tools and Roman Urdu tutorials for learners with limited reading comfort.',
      ur: 'کمیونٹی رضاکار جو آواز کے ذریعے سیکھنے اور سادہ رومن اردو اسباق پر توجہ دیتے ہیں۔',
      'roman-ur': 'Community volunteer jo voice tools aur aasan Roman Urdu tutorials ke zariye naye users ki madad karte hain.',
    },
    isDemoProfile: true,
  },
];

export const DEMO_PILOT_METRICS = {
  demoUsersHelped: 420,
  demoQuestionsAnswered: 1280,
  demoLessonsCompleted: 690,
  demoVolunteerMatches: 145,
};
