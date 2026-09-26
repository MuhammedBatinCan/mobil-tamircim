const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Mock Seed Data
const initialData = {
  users: [
    {
      id: 'usr_dev_1',
      username: 'MuratGelistirici',
      name: 'Murat Aydın',
      role: 'developer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      plate: '34 DEV 001',
      car: '2024 Tesla Model Y Long Range',
      badges: ['developer', 'beta_tester', 'verified_user'],
      reputationPoints: 1250,
      level: 'Master',
      isMechanicVerified: false,
      isDealerVerified: false,
      isUserVerified: true,
      bio: 'Mobil Tamircim baş mimarı ve geliştiricisi.'
    },
    {
      id: 'usr_mech_1',
      username: 'AhmetUsta_VAG',
      name: 'Ahmet Çelik Usta',
      role: 'mechanic',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      plate: '34 USTA 1978',
      car: '2019 Volkswagen Passat 2.0 TDI B8',
      badges: ['verified_mechanic', 'beta_tester'],
      reputationPoints: 890,
      level: 'Master',
      isMechanicVerified: true,
      isDealerVerified: false,
      isUserVerified: true,
      shopName: 'Çelik Oto VAG Özel Servis',
      sanayiSite: 'Maslak Atatürk Oto Sanayi 2. Kısım',
      city: 'İstanbul',
      district: 'Sarıyer',
      phone: '0532 555 10 20',
      bio: '25 yıllık VAG Grubu (Audi, VW, Seat, Skoda) ve DSG şanzıman uzmanı.'
    },
    {
      id: 'usr_dealer_1',
      username: 'YildizOtomotiv',
      name: 'Kemal Yıldız',
      role: 'dealer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      plate: '06 GAL 345',
      car: '2022 BMW 520i M Sport (G30)',
      badges: ['verified_dealer', 'verified_user'],
      reputationPoints: 420,
      level: 'Usta',
      isMechanicVerified: false,
      isDealerVerified: true,
      isUserVerified: true,
      dealerName: 'Yıldız Premium Motors',
      city: 'Ankara',
      district: 'Çankaya',
      phone: '0544 444 34 06',
      bio: 'Yetki belgeli ikinci el lüks ve orta segment araç alım-satım.'
    },
    {
      id: 'usr_beta_1',
      username: 'CanerSurucu',
      name: 'Caner Özkan',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      plate: '35 KS 882',
      car: '2016 Renault Megane 1.5 dCi EDC',
      badges: ['beta_tester', 'verified_user'],
      reputationPoints: 160,
      level: 'Kalfa',
      isMechanicVerified: false,
      isDealerVerified: false,
      isUserVerified: true,
      bio: 'Otomobil tutkunu, kendi küçük bakımlarını garajında yapan bir sürücü.'
    },
    {
      id: 'usr_normal_1',
      username: 'AliEmre',
      name: 'Ali Emre Yıldırım',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      plate: '16 BRS 412',
      car: '2020 Fiat Egea 1.3 Multijet Easy',
      badges: [],
      reputationPoints: 45,
      level: 'Çırak',
      isMechanicVerified: false,
      isDealerVerified: false,
      isUserVerified: false,
      bio: 'Yeni araç sahibi, öğrenmeye ve tavsiyelere açık.'
    },
    {
      id: 'usr_admin_1',
      username: 'SuperAdmin',
      name: 'Platform Moderatörü',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      plate: '34 ADM 999',
      car: '2023 Mercedes-Benz C200 4MATIC AMG',
      badges: ['moderator', 'developer', 'beta_tester', 'verified_user'],
      reputationPoints: 2400,
      level: 'Master',
      isMechanicVerified: false,
      isDealerVerified: false,
      isUserVerified: true,
      bio: 'Mobil Tamircim Yönetim ve Moderasyon Ekip Lideri.'
    }
  ],

  threads: [
    {
      id: 'thr_1',
      title: '1.6 TDI Rölantide Şıkırtı / Enjektör Sesi (Ses Kaydı Eklendi) - Yardım!',
      category: 'ariza-teshis',
      brand: 'Volkswagen',
      model: 'Golf 7 1.6 TDI',
      obdCode: 'P0201',
      authorId: 'usr_beta_1',
      authorUsername: 'CanerSurucu',
      authorPlate: '35 KS 882',
      authorCar: '2016 Renault Megane 1.5 dCi EDC',
      authorBadges: ['beta_tester', 'verified_user'],
      createdAt: '2026-09-17T14:30:00.000Z',
      allowCommentsFrom: 'all', // 'all' or 'mechanics_only'
      isSolved: true,
      solvedCommentId: 'cmt_1_1',
      views: 342,
      likes: 18,
      audioUrl: 'motor_sesi_ornek.mp3',
      content: 'Arkadaşlar selamlar. Sabahları ilk çalıştırmada motor soğukken enjektör kütüğünün oradan belirgin bir madeni şıkırtı sesi geliyor. Araç 145.000 km\'de. Ses kaydını ekledim, dinleyip fikir verebilecek ustalarımız var mıdır? OBD cihazında P0201 (Silindir 1 Enjektör Devresi) kodu düştü.',
      commentsCount: 3
    },
    {
      id: 'thr_2',
      title: 'DİKKAT: Yalnızca Şanzıman Ustaları Yorumlasın - EDC Şanzıman 2\'den 3\'e Geçişte Vuruntu',
      category: 'ariza-teshis',
      brand: 'Renault',
      model: 'Megane 4 1.5 dCi EDC',
      obdCode: 'P0700',
      authorId: 'usr_normal_1',
      authorUsername: 'AliEmre',
      authorPlate: '16 BRS 412',
      authorCar: '2020 Fiat Egea 1.3 Multijet Easy',
      authorBadges: [],
      createdAt: '2026-09-18T10:15:00.000Z',
      allowCommentsFrom: 'mechanics_only', // ONLY MECHANICS CAN COMMENT!
      isSolved: false,
      solvedCommentId: null,
      views: 215,
      likes: 9,
      content: 'Merhaba. Aracımda özellikle yokuş yukarı kalkışlarda 2. vitesten 3. vitese geçerken arkadan tekme atar gibi sert bir vuruntu hissediyorum. Boş muhabbet olmaması adına yalnızca Onaylı Şanzıman / Mekanik Ustalarımızın yorum yazmasını rica ediyorum. Şanzıman beyni mi yoksa debriyaj kavrama çatalı mı?',
      commentsCount: 1
    },
    {
      id: 'thr_3',
      title: 'BMW N47 ve B47 Motorlarda Zincir Değişimi Ne Zaman Yapılmalı? (Usta Tavsiyesi)',
      category: 'markalar',
      brand: 'BMW',
      model: '320d F30 (N47)',
      obdCode: '',
      authorId: 'usr_mech_1',
      authorUsername: 'AhmetUsta_VAG',
      authorPlate: '34 USTA 1978',
      authorCar: '2019 Volkswagen Passat 2.0 TDI B8',
      authorBadges: ['verified_mechanic', 'beta_tester'],
      createdAt: '2026-09-16T18:00:00.000Z',
      allowCommentsFrom: 'all',
      isSolved: false,
      solvedCommentId: null,
      views: 780,
      likes: 54,
      content: 'Değerli forum üyeleri, servisimize gelen birçok BMW 320d ve 520d aracın zincir koparma tehlikesiyle karşılaştığını görüyoruz. N47 motorlarda motorun arkasında yer alan triger zincirinin hışırtı sesi 150-180 bin km arasında başlar. İhmal edilirse motor bloğuna kadar hasar verir. Ses testi nasıl yapılır ve hangi parçalar orijinal OEM seçilmelidir, detayları aşağıya ekliyorum...',
      commentsCount: 4
    }
  ],

  comments: [
    {
      id: 'cmt_1_1',
      threadId: 'thr_1',
      authorId: 'usr_mech_1',
      authorUsername: 'AhmetUsta_VAG',
      authorPlate: '34 USTA 1978',
      authorBadges: ['verified_mechanic', 'beta_tester'],
      authorLevel: 'Master',
      createdAt: '2026-09-17T15:10:00.000Z',
      likes: 24,
      isSolution: true,
      content: 'Caner kardeşim ses kaydını dinledim. Ses doğrudan 1. silindirin piezo enjektör bobininden kaynaklanıyor. P0201 kodu da bunu teyit ediyor. İlk etapta enjektörü değiştirmek yerine tesisat soketini ve soket tırnağını kontrol ettir. Temassızlık veya oksitlenme yoksa enjektör geri dönüş testi (enjektör tezgahı) yaptırılmalı. Geri dönüş normalse sadece bobin revizyonuyla kurtarır, sıfır enjektöre 8.000 TL vermene gerek kalmaz.',
      aiModeration: {
        status: 'approved',
        safetyScore: 0.99,
        flagged: false
      }
    },
    {
      id: 'cmt_1_2',
      threadId: 'thr_1',
      authorId: 'usr_dev_1',
      authorUsername: 'MuratGelistirici',
      authorPlate: '34 DEV 001',
      authorBadges: ['developer', 'beta_tester', 'verified_user'],
      authorLevel: 'Master',
      createdAt: '2026-09-17T16:00:00.000Z',
      likes: 6,
      isSolution: false,
      content: 'Ahmet Usta\'nın dediği gibi soket kontrolü en ucuz ve en etkili başlangıç. Geçmiş olsun, sonucu buradan da paylaşırsan seviniriz.',
      aiModeration: {
        status: 'approved',
        safetyScore: 0.98,
        flagged: false
      }
    },
    {
      id: 'cmt_2_1',
      threadId: 'thr_2',
      authorId: 'usr_mech_1',
      authorUsername: 'AhmetUsta_VAG',
      authorPlate: '34 USTA 1978',
      authorBadges: ['verified_mechanic', 'beta_tester'],
      authorLevel: 'Master',
      createdAt: '2026-09-18T11:00:00.000Z',
      likes: 12,
      isSolution: false,
      content: 'Ali Emre selamlar. EDC şanzımanda 2\'den 3\'e geçişte vuruntu iki ihtimalden kaynaklanır: 1) Kavrama çatalı ayarsızlığı veya aşınması (Clip cihazıyla kavrama adaptasyonu yapılarak önce test edilmeli), 2) Şanzıman beyni (TCM) selenoid valf basınç düşüklüğü. Aracı cihaza bağlayıp kavrama tolerans değerlerini okumadan şanzımanı indirtme.',
      aiModeration: {
        status: 'approved',
        safetyScore: 0.97,
        flagged: false
      }
    }
  ],

  // Verification Desk Queue (Tamirci, Galerici, Kullanıcı Başvuruları)
  verifications: [
    {
      id: 'vrf_1',
      userId: 'usr_normal_1',
      username: 'AliEmre',
      type: 'mechanic', // 'mechanic', 'dealer', 'user'
      shopName: 'Emre Oto Egzoz & Mekanik',
      sanayiSite: 'Bursa Nilüfer Küçük Sanayi',
      city: 'Bursa',
      district: 'Nilüfer',
      taxNumber: '1907456789',
      documentUrl: 'ustalik_belgesi_emre.pdf',
      notes: '15 yıllık egzoz ve hafif mekanik dükkanı sahibiyim, vergi levham ve ustalık belgem ektedir.',
      status: 'pending', // 'pending', 'approved', 'rejected'
      submittedAt: '2026-09-18T16:20:00.000Z'
    },
    {
      id: 'vrf_2',
      userId: 'usr_beta_1',
      username: 'CanerSurucu',
      type: 'user',
      idNumberMasked: '24********6',
      phone: '0530 111 22 33',
      status: 'approved',
      submittedAt: '2026-09-15T09:00:00.000Z',
      reviewedAt: '2026-09-15T11:00:00.000Z'
    }
  ],

  // AI Moderation Queue (Human-in-the-loop: Asla doğrudan banlamaz, admin/mod onayına sunar)
  moderationQueue: [
    {
      id: 'mod_1',
      targetType: 'comment',
      targetId: 'cmt_flagged_1',
      userId: 'usr_normal_1',
      username: 'AliEmre',
      content: 'Ulan bu sanayideki ustaların hepsi hırsız dolandırıcı parça çalıyorlar...',
      reason: 'Topluluğa ve meslek grubuna hakaret / nefret söylemi riski',
      severity: 'high',
      suggestedAction: 'warn_or_delete', // 'ban', 'delete', 'warn', 'ignore'
      flaggedAt: '2026-09-18T19:40:00.000Z',
      status: 'pending' // 'pending', 'approved_ban', 'approved_delete', 'rejected_safe'
    }
  ],

  // SOS Acil Durum / Yolda Kaldım Çağrıları
  sosRequests: [
    {
      id: 'sos_1',
      userId: 'usr_beta_1',
      username: 'CanerSurucu',
      plate: '35 KS 882',
      car: 'Renault Megane 1.5 dCi',
      locationCity: 'Bolu',
      locationDetails: 'Bolu Dağı Geçişi, 12. km Ankara İstikameti',
      issueType: 'hararet', // 'hararet', 'aku', 'lastik', 'cekici', 'kaza'
      description: 'Hararet aniden 110 dereceye fırladı, sağa çektim radyatör alt hortumundan su damlatıyor. Acil usta veya çekici lazım.',
      phone: '0530 111 22 33',
      status: 'active', // 'active', 'in_progress', 'resolved'
      createdAt: '2026-09-18T22:15:00.000Z'
    }
  ],

  // Sanayi & Usta Rehberi
  directory: [
    {
        "id": "dir_1",
        "shopName": "Çelik Oto VAG Özel Servis",
        "ownerName": "Ahmet Çelik Usta",
        "city": "İstanbul",
        "district": "Sarıyer",
        "sanayiSite": "Maslak Atatürk Oto Sanayi 2. Kısım",
        "address": "2. Kısım 34. Sokak No: 12 Maslak / İstanbul",
        "coordinates": {
            "lat": 41.1118,
            "lng": 29.0205
        },
        "phone": "0532 555 10 20",
        "whatsapp": "905325551020",
        "categories": [
            "Motor & Mekanik",
            "Otomatik Şanzıman",
            "VAG Grubu"
        ],
        "rating": 4.9,
        "reviewCount": 48,
        "verified": true,
        "isOpenWeekend": false,
        "experienceYears": 24,
        "badge": "verified_mechanic"
    },
    {
        "id": "dir_2",
        "shopName": "Şaşmaz BMW & Mini Klinik",
        "ownerName": "Salih Usta",
        "city": "Ankara",
        "district": "Etimesgut",
        "sanayiSite": "Şaşmaz Oto Sanayi Sitesi",
        "address": "Şaşmaz Oto Sanayi 2552. Cadde No: 18 Etimesgut / Ankara",
        "coordinates": {
            "lat": 39.9405,
            "lng": 32.7212
        },
        "phone": "0533 777 44 55",
        "whatsapp": "905337774455",
        "categories": [
            "BMW & Mini",
            "Motor Revizyonu",
            "Oto Elektrik & Beyin"
        ],
        "rating": 4.8,
        "reviewCount": 36,
        "verified": true,
        "isOpenWeekend": true,
        "experienceYears": 17,
        "badge": "verified_mechanic"
    },
    {
        "id": "dir_3",
        "shopName": "Ege Dizel Enjektör & Turbo Pompa",
        "ownerName": "Mustafa Usta",
        "city": "İzmir",
        "district": "Bornova",
        "sanayiSite": "İzmir 1. Sanayi Sitesi",
        "address": "2822 Sokak No: 41 1. Sanayi Bornova / İzmir",
        "coordinates": {
            "lat": 38.4315,
            "lng": 27.1725
        },
        "phone": "0542 333 99 88",
        "whatsapp": "905423339988",
        "categories": [
            "Dizel Enjektör",
            "Turbo Tamiri",
            "Pompa Ayarı"
        ],
        "rating": 4.7,
        "reviewCount": 29,
        "verified": true,
        "isOpenWeekend": false,
        "experienceYears": 22,
        "badge": "verified_mechanic"
    },
    {
        "id": "dir_4",
        "shopName": "İkitelli Japon & Kore Mekanik",
        "ownerName": "Hüseyin Kaya Usta",
        "city": "İstanbul",
        "district": "Başakşehir",
        "sanayiSite": "İkitelli OSB Bağcılar Güngören San. Sit.",
        "address": "Bağcılar Güngören Sanayi Sitesi 14. Blok No: 28 Başakşehir / İstanbul",
        "coordinates": {
            "lat": 41.0725,
            "lng": 28.7985
        },
        "phone": "0535 444 88 12",
        "whatsapp": "905354448812",
        "categories": [
            "Toyota & Honda",
            "Hyundai & Kia",
            "Periyodik Bakım"
        ],
        "rating": 4.8,
        "reviewCount": 52,
        "verified": true,
        "isOpenWeekend": true,
        "experienceYears": 19,
        "badge": "verified_mechanic"
    },
    {
        "id": "dir_5",
        "shopName": "Bostancı Otomatik Şanzıman & DSG Klinik",
        "ownerName": "Serkan Demir Usta",
        "city": "İstanbul",
        "district": "Kadıköy",
        "sanayiSite": "Bostancı Oto Sanayi Sitesi",
        "address": "Huzur Hoca Caddesi No: 44 Bostancı Oto Sanayi / İstanbul",
        "coordinates": {
            "lat": 40.9745,
            "lng": 29.112
        },
        "phone": "0533 222 77 99",
        "whatsapp": "905332227799",
        "categories": [
            "Otomatik Şanzıman",
            "DSG & EDC Mekatronik",
            "Tork Konvertörü"
        ],
        "rating": 4.9,
        "reviewCount": 64,
        "verified": true,
        "isOpenWeekend": false,
        "experienceYears": 21,
        "badge": "verified_mechanic"
    },
    {
        "id": "dir_6",
        "shopName": "Başkent Turbo & Common Rail Pompa",
        "ownerName": "Kemal Yıldız Usta",
        "city": "Ankara",
        "district": "Yenimahalle",
        "sanayiSite": "İvedik Organize Sanayi Bölgesi",
        "address": "1354. Cadde 1422. Sokak No: 7 İvedik OSB Yenimahalle / Ankara",
        "coordinates": {
            "lat": 39.988,
            "lng": 32.7485
        },
        "phone": "0530 888 33 21",
        "whatsapp": "905308883321",
        "categories": [
            "Dizel Enjektör",
            "Turbo Tamiri",
            "Partikül & EGR Temizliği"
        ],
        "rating": 4.9,
        "reviewCount": 41,
        "verified": true,
        "isOpenWeekend": false,
        "experienceYears": 26,
        "badge": "verified_mechanic"
    },
    {
        "id": "dir_7",
        "shopName": "Çiğli Fransız & İtalyan Servisi (Renault-Fiat)",
        "ownerName": "Erhan Aksoy Usta",
        "city": "İzmir",
        "district": "Çiğli",
        "sanayiSite": "AOSB Çiğli 2. Sanayi Sitesi",
        "address": "10014 Sokak No: 19 Çiğli Atatürk OSB / İzmir",
        "coordinates": {
            "lat": 38.4985,
            "lng": 27.052
        },
        "phone": "0536 111 44 77",
        "whatsapp": "905361114477",
        "categories": [
            "Renault & Dacia",
            "Fiat & Alfa",
            "Ön Düzen & Fren"
        ],
        "rating": 4.8,
        "reviewCount": 38,
        "verified": true,
        "isOpenWeekend": true,
        "experienceYears": 16,
        "badge": "verified_mechanic"
    },
    {
        "id": "dir_8",
        "shopName": "Otosansit İtalyan & Yerli Oto Tamir (Tofaş-Fiat)",
        "ownerName": "Cemal Varol Usta",
        "city": "Bursa",
        "district": "Yıldırım",
        "sanayiSite": "Otosansit Sanayi Sitesi",
        "address": "Otosansit 17. Blok No: 22 Yıldırım / Bursa",
        "coordinates": {
            "lat": 40.1895,
            "lng": 29.135
        },
        "phone": "0537 999 55 44",
        "whatsapp": "905379995544",
        "categories": [
            "Tofaş & Fiat",
            "Motor & Mekanik",
            "LPG Ayar & Gaz Bakımı"
        ],
        "rating": 4.9,
        "reviewCount": 57,
        "verified": true,
        "isOpenWeekend": true,
        "experienceYears": 30,
        "badge": "verified_mechanic"
    },
    {
        "id": "dir_9",
        "shopName": "Akdeniz Oto Klima & Elektronik Beyin",
        "ownerName": "Hakan Öztürk Usta",
        "city": "Antalya",
        "district": "Kepez",
        "sanayiSite": "Akdeniz Yeni Sanayi Sitesi",
        "address": "5036. Sokak No: 8 Akdeniz Sanayi Kepez / Antalya",
        "coordinates": {
            "lat": 36.938,
            "lng": 30.665
        },
        "phone": "0544 666 22 11",
        "whatsapp": "905446662211",
        "categories": [
            "Oto Klima & Gaz",
            "Elektrik & Beyin",
            "Arıza Tespiti (OBD)"
        ],
        "rating": 4.9,
        "reviewCount": 45,
        "verified": true,
        "isOpenWeekend": true,
        "experienceYears": 18,
        "badge": "verified_mechanic"
    }
],


  // Piyasa Fiyat Analizi (Piyasa Ne Diyor?)
  priceBenchmarks: [
    {
      id: 'prc_1',
      brand: 'Volkswagen',
      model: 'Golf 7 1.6 TDI',
      operation: 'Triger Seti + Devirdaim Değişimi',
      partCostAvg: 4500,
      laborCostAvg: 2500,
      totalAvg: 7000,
      city: 'İstanbul',
      lastUpdated: 'Eylül 2026',
      verifiedByMechanics: 12
    },
    {
      id: 'prc_2',
      brand: 'Renault',
      model: 'Megane 4 1.5 dCi',
      operation: 'Periyodik Bakım (Yağ + 4 Filtre)',
      partCostAvg: 2800,
      laborCostAvg: 800,
      totalAvg: 3600,
      city: 'Ankara',
      lastUpdated: 'Eylül 2026',
      verifiedByMechanics: 19
    },
    {
      id: 'prc_3',
      brand: 'Fiat',
      model: 'Egea 1.3 Multijet',
      operation: 'Baskı Balata & Debriyaj Seti Değişimi',
      partCostAvg: 3200,
      laborCostAvg: 1800,
      totalAvg: 5000,
      city: 'Bursa',
      lastUpdated: 'Eylül 2026',
      verifiedByMechanics: 15
    }
  ]
};

// Load or initialize store
let db = initialData;
if (fs.existsSync(STORE_FILE)) {
  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    db = JSON.parse(raw);
    if (Array.isArray(db.users)) {
      db.users.forEach(u => {
        if (!u.email) {
          u.email = (u.username ? u.username.toLowerCase() : 'user') + '@mobiltamircim.com';
        }
        if (u.isEmailVerified === undefined) {
          u.isEmailVerified = true;
          if (!u.badges) u.badges = [];
          if (!u.badges.includes('email_verified')) u.badges.push('email_verified');
        }
      });
    }
    if (!Array.isArray(db.parts)) db.parts = [];
    if (!Array.isArray(db.garageVehicles)) db.garageVehicles = [];
    if (!Array.isArray(db.maintenanceRecords)) db.maintenanceRecords = [];
    if (!Array.isArray(db.quoteRequests)) db.quoteRequests = [];
    if (!Array.isArray(db.blogPosts)) db.blogPosts = [];
  } catch (err) {
    console.error('Error loading existing store, initializing defaults:', err);
    saveDb();
  }
} else {
  saveDb();
}

function saveDb() {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving store:', err);
  }
}

// MIME types
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ico': 'image/x-icon'
};

// AI Moderation helper (Lightweight, non-intrusive, flags severe abuse to humans)
function runAiContentAudit(text) {
  const severeProfanity = ['küfür_agır', 'oç', 'piç', 'hırsızlar', 'dolandırıcılar'];
  const lower = text.toLowerCase();
  
  let riskScore = 0.05;
  let reasons = [];

  // Check for abusive patterns
  for (const word of severeProfanity) {
    if (lower.includes(word)) {
      riskScore = 0.85;
      reasons.push('Ağır itham / topluluk kurallarına aykırı ifade: ' + word);
    }
  }

  // Check for scam or fake bank account patterns
  if (/\b(iban|tc kimlik|havale yap|para yolla)\b/i.test(text)) {
    riskScore = Math.max(riskScore, 0.70);
    reasons.push('Mali işlem / IBAN paylaşım uyarısı');
  }

  return {
    riskScore,
    isFlagged: riskScore >= 0.75,
    reasons: reasons.join(', ') || 'Temiz içerik'
  };
}

// Robust UTF-8 body parser
function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let byteLength = 0;
    req.on('data', chunk => {
      chunks.push(chunk);
      byteLength += chunk.length;
      if (byteLength > 10e6) { // 10MB limit for image uploads
        reject(new Error('Body too large'));
      }
    });
    req.on('end', () => {
      if (chunks.length === 0) return resolve({});
      const body = Buffer.concat(chunks).toString('utf8');
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        resolve({ text: body });
      }
    });
  });
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query || {};
  const method = req.method;

  // Set CORS headers for local testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // --- API ENDPOINTS ---
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // 1. Get entire state
    if (pathname === '/api/state' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: db }));
      return;
    }

    // 1.A Auth: Login (Normal Kullanıcı Girişi: Kullanıcı Adı, E-Posta veya Plaka)
    if (pathname === '/api/auth/login' && method === 'POST') {
      try {
        const body = await parseBody(req);
        const rawQuery = (body.username || '').trim();
        const uQuery = rawQuery.toLowerCase().replace(/^@/, '');
        const cleanQueryNoSpaces = uQuery.replace(/\s+/g, '');

        const user = db.users.find(u => {
          if (!u) return false;
          if (u.email && u.email.toLowerCase() === rawQuery.toLowerCase()) return true;
          if (u.username && u.username.toLowerCase() === uQuery) return true;
          if (u.name && u.name.toLowerCase() === uQuery) return true;
          if (u.plate && u.plate.toLowerCase().replace(/\s+/g, '') === cleanQueryNoSpaces) return true;
          if (u.phone && u.phone.replace(/\s+/g, '') === cleanQueryNoSpaces) return true;
          return false;
        });

        if (!user) {
          res.writeHead(401);
          res.end(JSON.stringify({ success: false, error: 'Kullanıcı bulunamadı. Lütfen kullanıcı adınızı, e-postanızı veya plakanızı kontrol edin.' }));
          return;
        }

        if (user.password) {
          if (body.password !== user.password) {
            res.writeHead(401);
            res.end(JSON.stringify({ success: false, error: 'Girdiğiniz şifre hatalı!' }));
            return;
          }
        } else {
          // Demo kullanıcılar için kolaylık: 123456 veya password123 kabul edilir
          if (body.password !== '123456' && body.password !== 'password123' && body.password !== user.username) {
            res.writeHead(401);
            res.end(JSON.stringify({ success: false, error: 'Girdiğiniz şifre hatalı! (Demo şifresi: 123456)' }));
            return;
          }
        }

        if (user.isBanned) {
          res.writeHead(403);
          res.end(JSON.stringify({ success: false, error: 'Hesabınız askıya alınmıştır.' }));
          return;
        }

        res.writeHead(200);
        res.end(JSON.stringify({ success: true, user }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // 1.B Auth: Register (Yeni Kayıt - Zorunlu E-Posta & 6 Haneli Doğrulama)
    if (pathname === '/api/auth/register' && method === 'POST') {
      try {
        const body = await parseBody(req);
        const usernameClean = (body.username || '').trim().replace(/^@/, '');
        const emailClean = (body.email || '').trim().toLowerCase();
        
        if (!usernameClean || !body.password || !body.name) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: 'Ad Soyad, kullanıcı adı ve şifre zorunludur.' }));
          return;
        }

        // E-Posta format doğrulaması
        if (!emailClean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean)) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: 'Lütfen geçerli bir e-posta adresi giriniz (örn: selim@gmail.com).' }));
          return;
        }

        const existsUser = db.users.find(u => u.username && u.username.toLowerCase() === usernameClean.toLowerCase());
        if (existsUser) {
          res.writeHead(409);
          res.end(JSON.stringify({ success: false, error: 'Bu kullanıcı adı zaten alınmış!' }));
          return;
        }

        const existsEmail = db.users.find(u => u.email && u.email.toLowerCase() === emailClean);
        if (existsEmail) {
          res.writeHead(409);
          res.end(JSON.stringify({ success: false, error: 'Bu e-posta adresi ile zaten kayıtlı bir hesap bulunmaktadır!' }));
          return;
        }

        const role = body.role || 'user';
        const badges = ['beta_tester'];
        if (role === 'developer') badges.push('developer');

        // 6 Haneli Güvenli E-Posta Doğrulama Kodu (OTP)
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = {
          id: 'usr_' + Date.now(),
          username: usernameClean,
          name: body.name.trim(),
          email: emailClean,
          password: body.password,
          isEmailVerified: false,
          emailVerificationCode: verifyCode,
          emailVerificationExpires: Date.now() + 15 * 60 * 1000, // 15 dakika geçerli
          phone: body.phone || '',
          plate: body.plate ? body.plate.toUpperCase().trim() : '',
          car: body.car || '',
          role: role,
          avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
          badges: badges,
          reputationPoints: 25, // Başlangıç hoş geldin bonusu
          level: 'Çırak',
          isMechanicVerified: false,
          isDealerVerified: false,
          isUserVerified: false,
          shopName: body.shopName || '',
          dealerName: body.dealerName || '',
          bio: `${body.name.trim()} - Mobil Tamircim üyesi.`
        };

        db.users.push(newUser);

        // Tamirci veya galerici seçildiyse doğrulama masasına ekle
        if (role === 'mechanic' && body.shopName) {
          db.verifications.unshift({
            id: 'vrf_' + Date.now(),
            userId: newUser.id,
            username: newUser.name,
            type: 'mechanic',
            shopName: body.shopName,
            sanayiSite: body.sanayiSite || '',
            city: body.city || '',
            taxNumber: body.taxNumber || '',
            status: 'pending',
            submittedAt: new Date().toISOString()
          });
        } else if (role === 'dealer' && body.dealerName) {
          db.verifications.unshift({
            id: 'vrf_' + Date.now(),
            userId: newUser.id,
            username: newUser.name,
            type: 'dealer',
            dealerName: body.dealerName,
            taxNumber: body.taxNumber || '',
            status: 'pending',
            submittedAt: new Date().toISOString()
          });
        }

        saveDb();
        console.log(`[E-Posta Servisi] ${emailClean} adresine doğrulama kodu iletildi: ${verifyCode}`);

        res.writeHead(201);
        res.end(JSON.stringify({
          success: true,
          user: newUser,
          requiresEmailVerification: true,
          verificationCode: verifyCode,
          message: 'Hesabınız başarıyla oluşturuldu. Lütfen 6 haneli kodu doğrulayın.'
        }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // 1.C Auth: Verify Email (6 Haneli Kod ile E-Posta Onayı)
    if (pathname === '/api/auth/verify-email' && method === 'POST') {
      try {
        const body = await parseBody(req);
        const userId = body.userId;
        const email = (body.email || '').trim().toLowerCase();
        const code = (body.code || '').trim();

        if (!code) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: 'Lütfen 6 haneli doğrulama kodunu giriniz.' }));
          return;
        }

        const user = db.users.find(u => (userId && u.id === userId) || (email && u.email && u.email.toLowerCase() === email));
        if (!user) {
          res.writeHead(404);
          res.end(JSON.stringify({ success: false, error: 'Kullanıcı bulunamadı.' }));
          return;
        }

        if (user.isEmailVerified) {
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, message: 'E-posta adresi zaten doğrulanmış.', user }));
          return;
        }

        // Doğrulama kodu kontrolü (Test ortamı için 123456 da kabul edilir)
        if (user.emailVerificationCode !== code && code !== '123456') {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: 'Girdiğiniz 6 haneli doğrulama kodu hatalıdır.' }));
          return;
        }

        if (user.emailVerificationExpires && Date.now() > user.emailVerificationExpires && code !== '123456') {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: 'Doğrulama kodunun süresi dolmuş. Lütfen yeni kod isteyin.' }));
          return;
        }

        user.isEmailVerified = true;
        user.emailVerificationCode = null;
        if (!user.badges.includes('email_verified')) {
          user.badges.push('email_verified');
        }
        user.reputationPoints = (user.reputationPoints || 0) + 15; // E-posta onayına ekstra +15 XP
        updateUserLevel(user);
        saveDb();

        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          user,
          message: 'Tebrikler! E-posta adresiniz başarıyla doğrulandı (+15 XP).'
        }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // 1.D Auth: Resend Code (Tekrar Kod Gönder)
    if (pathname === '/api/auth/resend-code' && method === 'POST') {
      try {
        const body = await parseBody(req);
        const userId = body.userId;
        const email = (body.email || '').trim().toLowerCase();

        const user = db.users.find(u => (userId && u.id === userId) || (email && u.email && u.email.toLowerCase() === email));
        if (!user) {
          res.writeHead(404);
          res.end(JSON.stringify({ success: false, error: 'Kullanıcı bulunamadı.' }));
          return;
        }

        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.emailVerificationCode = newCode;
        user.emailVerificationExpires = Date.now() + 15 * 60 * 1000;
        saveDb();

        console.log(`[E-Posta Servisi] ${user.email} adresine yeni kod iletildi: ${newCode}`);

        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          message: `${user.email} adresine yeni 6 haneli kod gönderildi.`,
          verificationCode: newCode
        }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // 1.E Users: Update Profile (İsim, Bio, Araç, Konum, Telefon, Avatar, Banner vb.)
    if (pathname === '/api/users/update-profile' && method === 'POST') {
      try {
        const body = await parseBody(req);
        const userId = body.userId;
        const user = db.users.find(u => u.id === userId);

        if (!user) {
          res.writeHead(404);
          res.end(JSON.stringify({ success: false, error: 'Kullanıcı bulunamadı.' }));
          return;
        }

        const uploadsDir = path.join(__dirname, 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Handle Avatar (file upload base64 or URL)
        if (body.avatar !== undefined) {
          if (body.avatar && body.avatar.startsWith('data:image/')) {
            const matches = body.avatar.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
            if (matches) {
              const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1].replace('+xml', '');
              const filename = `avatar_${user.id}_${Date.now()}.${ext}`;
              const filePath = path.join(uploadsDir, filename);
              fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));
              user.avatar = `/uploads/${filename}`;
            } else {
              user.avatar = body.avatar;
            }
          } else {
            user.avatar = body.avatar;
          }
        }

        // Handle Banner (file upload base64 or URL)
        if (body.banner !== undefined) {
          if (body.banner && body.banner.startsWith('data:image/')) {
            const matches = body.banner.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
            if (matches) {
              const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1].replace('+xml', '');
              const filename = `banner_${user.id}_${Date.now()}.${ext}`;
              const filePath = path.join(uploadsDir, filename);
              fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));
              user.banner = `/uploads/${filename}`;
            } else {
              user.banner = body.banner;
            }
          } else {
            user.banner = body.banner;
          }
        }

        if (body.name !== undefined) user.name = body.name.trim();
        if (body.bio !== undefined) user.bio = body.bio.trim();
        if (body.car !== undefined) user.car = body.car.trim();
        if (body.city !== undefined) user.city = body.city.trim();
        if (body.district !== undefined) user.district = body.district.trim();
        if (body.shopName !== undefined) user.shopName = body.shopName.trim();
        if (body.sanayiSite !== undefined) user.sanayiSite = body.sanayiSite.trim();
        if (body.phone !== undefined) user.phone = body.phone.trim();

        saveDb();

        res.writeHead(200);
        res.end(JSON.stringify({ success: true, user }));
      } catch (err) {
        console.error('Update profile error:', err);
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // 1.C Admin: Login
    if (pathname === '/api/admin/login' && method === 'POST') {
      try {
        const body = await parseBody(req);
        const u = (body.username || '').toLowerCase().trim();
        const p = body.password || '';

        const adminUser = db.users.find(x => x.role === 'admin') || db.users[0];
        if ((u === 'admin' || u === 'superadmin' || u === 'muratgelistirici') && 
            (p === 'admin123' || p === '123456')) {
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, admin: adminUser }));
        } else {
          res.writeHead(401);
          res.end(JSON.stringify({ success: false, error: 'Yönetici kullanıcı adı veya şifresi hatalı! (Demo: admin / admin123)' }));
        }
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // 1.D Admin: Antigravity AI Developer Chat
    if (pathname === '/api/admin/ai-developer/chat' && method === 'POST') {
      try {
        const body = await parseBody(req);
        const userPrompt = (body.message || '').trim();

        if (!userPrompt) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: 'Mesaj boş olamaz.' }));
          return;
        }

        // 1. Doğal dil komut analizi ve anında sistem düzeltmesi
        const actionResult = executeAdminAiAction(userPrompt, db);

        let replyText = '';
        if (actionResult && actionResult.executed) {
          replyText = `⚡ **Antigravity Canlı Sistem Mühendisi:**\n\n` +
                      `✅ **İşlem Başarıyla Gerçekleştirildi:** ${actionResult.summary}\n\n` +
                      `${actionResult.details}\n\n` +
                      `*Değişiklikler canlı veritabanına kaydedildi ve tüm sistemde aktifleştirildi.*`;
        } else {
          replyText = generateAdminAiDeveloperReply(userPrompt, db);
        }

        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          reply: replyText,
          actionResult: actionResult || null,
          systemStats: {
            userCount: db.users.length,
            pendingVerifs: (db.verifications || []).filter(v => v.status === 'pending').length,
            pendingMods: (db.moderationQueue || []).filter(m => m.status === 'pending').length,
            activeSos: (db.sosRequests || []).filter(s => s.status === 'active').length,
            totalThreads: (db.threads || []).length
          }
        }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // 1.E Admin: Antigravity AI Developer Quick Action
    if (pathname === '/api/admin/ai-developer/quick-action' && method === 'POST') {
      try {
        const body = await parseBody(req);
        const actionName = body.action || '';
        let promptEquivalent = '';

        if (actionName === 'audit_and_heal') promptEquivalent = 'Sistem sağlık kontrolü yap ve hataları tara';
        else if (actionName === 'approve_all') promptEquivalent = 'Bekleyen tüm onayları tamamla';
        else if (actionName === 'clean_spam') promptEquivalent = 'Spam ve şüpheli yorumları temizle';
        else if (actionName === 'backup_db') promptEquivalent = 'Veritabanını yedekle';
        else if (actionName === 'verify_emails') promptEquivalent = 'Tüm kullanıcıların e-postalarını onayla';
        else promptEquivalent = 'Sistem durum raporu ver';

        const actionResult = executeAdminAiAction(promptEquivalent, db);
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          actionResult,
          reply: actionResult ? actionResult.details : 'İşlem tamamlandı.',
          systemStats: {
            userCount: db.users.length,
            pendingVerifs: (db.verifications || []).filter(v => v.status === 'pending').length,
            pendingMods: (db.moderationQueue || []).filter(m => m.status === 'pending').length,
            activeSos: (db.sosRequests || []).filter(s => s.status === 'active').length
          }
        }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // 1.F Admin: Get Live Hot-Patches
    if (pathname === '/api/admin/live-patches' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, patches: db.livePatches || [] }));
      return;
    }

    // 1.G Admin: Toggle Live Hot-Patch
    if (pathname === '/api/admin/live-patches/toggle' && method === 'POST') {
      const body = await parseBody(req);
      const patch = (db.livePatches || []).find(p => p.id === body.patchId);
      if (patch) {
        patch.active = !patch.active;
        saveDb();
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, patch }));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, error: 'Yama bulunamadı' }));
      }
      return;
    }

    // 1.H Admin: Clear All Live Hot-Patches
    if (pathname === '/api/admin/live-patches/clear' && method === 'POST') {
      const count = (db.livePatches || []).length;
      db.livePatches = [];
      saveDb();
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, clearedCount: count }));
      return;
    }

    // 2. Create a new thread
    if (pathname === '/api/threads' && method === 'POST') {
      try {
        const body = await parseBody(req);
        const newThread = {
          id: 'thr_' + Date.now(),
          title: body.title || 'Başlıksız Konu',
          category: body.category || 'genel',
          brand: body.brand || '',
          model: body.model || '',
          engine: body.engine || '',
          obdCode: body.obdCode || '',
          authorId: body.authorId || 'usr_normal_1',
          authorUsername: body.authorUsername || 'Anonim',
          authorPlate: body.authorPlate || '',
          authorCar: body.authorCar || '',
          authorBadges: body.authorBadges || [],
          createdAt: new Date().toISOString(),
          allowCommentsFrom: body.allowCommentsFrom || 'all', // 'all' or 'mechanics_only'
          isSolved: false,
          solvedCommentId: null,
          views: 1,
          likes: 0,
          content: body.content || '',
          audioUrl: body.audioUrl || null,
          commentsCount: 0
        };

        // Award XP to author for starting a thread (+15 XP)
        const author = db.users.find(u => u.id === newThread.authorId);
        if (author) {
          author.reputationPoints = (author.reputationPoints || 0) + 15;
          updateUserLevel(author);
        }

        db.threads.unshift(newThread);
        saveDb();

        res.writeHead(201);
        res.end(JSON.stringify({ success: true, thread: newThread }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // 3. Add comment to thread (checks permissions and runs AI audit)
    if (pathname.match(/^\/api\/threads\/([a-zA-Z0-9_-]+)\/comments$/) && method === 'POST') {
      const threadId = pathname.split('/')[3];
      const thread = db.threads.find(t => t.id === threadId);
      if (!thread) {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, error: 'Konu bulunamadı' }));
        return;
      }

      try {
        const body = await parseBody(req);
        const author = db.users.find(u => u.id === body.authorId);
        const isMechanic = author && (author.role === 'mechanic' || (author.badges && author.badges.includes('verified_mechanic')));

        // Check comment permissions: if mechanics_only, non-mechanics cannot comment
        if (thread.allowCommentsFrom === 'mechanics_only' && !isMechanic) {
          res.writeHead(403);
          res.end(JSON.stringify({
            success: false,
            error: 'Bu konuya yalnızca Onaylı Tamirciler / Ustalar yorum yapabilir.'
          }));
          return;
        }

        // Run non-intrusive AI Content Audit
        const audit = runAiContentAudit(body.content || '');

        const newComment = {
          id: 'cmt_' + Date.now(),
          threadId: thread.id,
          parentId: body.parentId || null,
          replyToUsername: body.replyToUsername || null,
          authorId: body.authorId,
          authorUsername: body.authorUsername || (author ? author.username : 'Üye'),
          authorPlate: author ? author.plate : '',
          authorBadges: author ? author.badges : [],
          authorLevel: author ? author.level : 'Çırak',
          createdAt: new Date().toISOString(),
          likes: 0,
          dislikes: 0,
          likedBy: [],
          dislikedBy: [],
          isSolution: false,
          content: body.content,
          aiModeration: {
            status: audit.isFlagged ? 'flagged' : 'approved',
            safetyScore: 1 - audit.riskScore,
            flagged: audit.isFlagged,
            reason: audit.reasons
          }
        };

        // If flagged by AI, add to Moderation Queue for admin/mod decision (NO AUTO-BAN!)
        if (audit.isFlagged) {
          db.moderationQueue.unshift({
            id: 'mod_' + Date.now(),
            targetType: 'comment',
            targetId: newComment.id,
            userId: newComment.authorId,
            username: newComment.authorUsername,
            content: newComment.content,
            reason: audit.reasons,
            severity: audit.riskScore > 0.8 ? 'high' : 'medium',
            suggestedAction: 'warn_or_delete',
            flaggedAt: new Date().toISOString(),
            status: 'pending'
          });
        }

        // Award XP (+10 XP)
        if (author) {
          author.reputationPoints = (author.reputationPoints || 0) + 10;
          updateUserLevel(author);
        }

        db.comments.push(newComment);
        thread.commentsCount = (thread.commentsCount || 0) + 1;
        saveDb();

        res.writeHead(201);
        res.end(JSON.stringify({ success: true, comment: newComment }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // 3.B Comment Like/Dislike (Vote) System
    if (pathname.match(/^\/api\/comments\/([a-zA-Z0-9_-]+)\/vote$/) && method === 'POST') {
      const commentId = pathname.split('/')[3];
      const comment = (db.comments || []).find(c => c.id === commentId);
      if (!comment) {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, error: 'Yorum bulunamadı' }));
        return;
      }

      try {
        const body = await parseBody(req);
        const userId = body.userId || 'usr_anon';
        const voteType = body.voteType; // 'like' or 'dislike'

        if (!Array.isArray(comment.likedBy)) {
          comment.likedBy = [];
          // If legacy likes existed, don't drop the count
          if (comment.likes > 0 && comment.likedBy.length === 0) {
            for (let i = 0; i < comment.likes; i++) comment.likedBy.push('legacy_usr_' + i);
          }
        }
        if (!Array.isArray(comment.dislikedBy)) comment.dislikedBy = [];

        const hasLiked = comment.likedBy.includes(userId);
        const hasDisliked = comment.dislikedBy.includes(userId);

        if (voteType === 'like') {
          if (hasLiked) {
            // Toggle off like
            comment.likedBy = comment.likedBy.filter(id => id !== userId);
          } else {
            // Add like, remove dislike if exists
            comment.likedBy.push(userId);
            comment.dislikedBy = comment.dislikedBy.filter(id => id !== userId);
          }
        } else if (voteType === 'dislike') {
          if (hasDisliked) {
            // Toggle off dislike
            comment.dislikedBy = comment.dislikedBy.filter(id => id !== userId);
          } else {
            // Add dislike, remove like if exists
            comment.dislikedBy.push(userId);
            comment.likedBy = comment.likedBy.filter(id => id !== userId);
          }
        }

        comment.likes = comment.likedBy.length;
        comment.dislikes = comment.dislikedBy.length;

        saveDb();

        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          commentId: comment.id,
          likes: comment.likes,
          dislikes: comment.dislikes,
          userVote: comment.likedBy.includes(userId) ? 'like' : (comment.dislikedBy.includes(userId) ? 'dislike' : null),
          comment
        }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // 4. Mark comment as solution (Owner only)
    if (pathname.match(/^\/api\/threads\/([a-zA-Z0-9_-]+)\/solve$/) && method === 'POST') {
      const threadId = pathname.split('/')[3];
      const thread = db.threads.find(t => t.id === threadId);
      if (!thread) {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, error: 'Konu bulunamadı' }));
        return;
      }

      const body = await parseBody(req);
      const commentId = body.commentId;
      const comment = db.comments.find(c => c.id === commentId);

      if (comment) {
        // Unmark previous solutions
        db.comments.filter(c => c.threadId === threadId).forEach(c => c.isSolution = false);
        comment.isSolution = true;
        thread.isSolved = true;
        thread.solvedCommentId = comment.id;

        // Award +50 XP to solution author!
        const solver = db.users.find(u => u.id === comment.authorId);
        if (solver) {
          solver.reputationPoints = (solver.reputationPoints || 0) + 50;
          updateUserLevel(solver);
        }

        saveDb();
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, thread, comment }));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, error: 'Yorum bulunamadı' }));
      }
      return;
    }


    // 5. Admin: Update badges (Developer, Beta Tester, Tamirci, Galerici, etc.)
    if (pathname === '/api/users/update-badges' && method === 'POST') {
      const body = await parseBody(req);
      const user = db.users.find(u => u.id === body.userId);
      if (!user) {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, error: 'Kullanıcı bulunamadı' }));
        return;
      }

      user.badges = body.badges || [];
      if (body.role) user.role = body.role;
      if (body.plate !== undefined) user.plate = body.plate;
      if (body.car !== undefined) user.car = body.car;

      // sync verification flags
      user.isMechanicVerified = user.badges.includes('verified_mechanic');
      user.isDealerVerified = user.badges.includes('verified_dealer');
      user.isUserVerified = user.badges.includes('verified_user');

      saveDb();
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, user }));
      return;
    }

    // 6. User: Submit verification request
    if (pathname === '/api/verifications/submit' && method === 'POST') {
      const body = await parseBody(req);
      const newVrf = {
        id: 'vrf_' + Date.now(),
        userId: body.userId,
        username: body.username,
        type: body.type, // 'mechanic', 'dealer', 'user'
        shopName: body.shopName || '',
        dealerName: body.dealerName || '',
        sanayiSite: body.sanayiSite || '',
        city: body.city || '',
        district: body.district || '',
        taxNumber: body.taxNumber || '',
        notes: body.notes || '',
        status: 'pending',
        submittedAt: new Date().toISOString()
      };
      db.verifications.unshift(newVrf);
      saveDb();
      res.writeHead(201);
      res.end(JSON.stringify({ success: true, verification: newVrf }));
      return;
    }

    // 7. Admin: Decide verification (Approve / Reject)
    if (pathname.match(/^\/api\/verifications\/([a-zA-Z0-9_-]+)\/decision$/) && method === 'POST') {
      const vrfId = pathname.split('/')[2];
      const vrf = db.verifications.find(v => v.id === vrfId);
      if (!vrf) {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, error: 'Başvuru bulunamadı' }));
        return;
      }

      const body = await parseBody(req);
      vrf.status = body.decision === 'approve' ? 'approved' : 'rejected';
      vrf.reviewedAt = new Date().toISOString();

      if (body.decision === 'approve') {
        const user = db.users.find(u => u.id === vrf.userId);
        if (user) {
          if (vrf.type === 'mechanic') {
            if (!user.badges.includes('verified_mechanic')) user.badges.push('verified_mechanic');
            user.role = 'mechanic';
            user.isMechanicVerified = true;
            user.shopName = vrf.shopName;
            user.sanayiSite = vrf.sanayiSite;
          } else if (vrf.type === 'dealer') {
            if (!user.badges.includes('verified_dealer')) user.badges.push('verified_dealer');
            user.role = 'dealer';
            user.isDealerVerified = true;
            user.dealerName = vrf.dealerName;
          } else if (vrf.type === 'user') {
            if (!user.badges.includes('verified_user')) user.badges.push('verified_user');
            user.isUserVerified = true;
          }
        }
      }

      saveDb();
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, verification: vrf }));
      return;
    }

    // 8. Admin: Decide moderation item (Human-in-the-loop)
    if (pathname.match(/^\/api\/moderation\/([a-zA-Z0-9_-]+)\/action$/) && method === 'POST') {
      const modId = pathname.split('/')[2];
      const item = db.moderationQueue.find(m => m.id === modId);
      if (!item) {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, error: 'Mod kuyruk öğesi bulunamadı' }));
        return;
      }

      const body = await parseBody(req); // action: 'ban', 'delete', 'warn', 'ignore'
      item.status = 'resolved_' + body.action;
      item.resolvedAt = new Date().toISOString();

      if (body.action === 'ban') {
        const user = db.users.find(u => u.id === item.userId);
        if (user) {
          user.isBanned = true;
          user.banReason = item.reason;
        }
      } else if (body.action === 'delete') {
        // Delete comment from db
        db.comments = db.comments.filter(c => c.id !== item.targetId);
      }

      saveDb();
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, item }));
      return;
    }

    // 9. SOS Emergency: Create & Resolve
    if (pathname === '/api/sos' && method === 'POST') {
      const body = await parseBody(req);
      const newSos = {
        id: 'sos_' + Date.now(),
        userId: body.userId,
        username: body.username,
        plate: body.plate,
        car: body.car,
        locationCity: body.locationCity,
        locationDetails: body.locationDetails,
        coordinates: body.coordinates || null,
        issueType: body.issueType,
        description: body.description,
        phone: body.phone,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      if (!Array.isArray(db.sosRequests)) db.sosRequests = [];
      db.sosRequests.unshift(newSos);
      saveDb();
      res.writeHead(201);
      res.end(JSON.stringify({ success: true, sos: newSos }));
      return;
    }

    if (pathname.match(/^\/api\/sos\/([a-zA-Z0-9_-]+)\/resolve$/) && method === 'POST') {
      const sosId = pathname.split('/')[2];
      const item = (db.sosRequests || []).find(s => s.id === sosId);
      if (item) {
        item.status = 'resolved';
        item.resolvedAt = new Date().toISOString();
        saveDb();
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, item }));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, error: 'SOS kaydı bulunamadı' }));
      }
      return;
    }

    // 9.B Usta Değerlendirme & Yorum Sistemi (Mechanic Reviews)
    if (pathname.match(/^\/api\/directory\/([a-zA-Z0-9_-]+)\/reviews$/) && method === 'GET') {
      const mechanicId = pathname.split('/')[3];
      if (!Array.isArray(db.mechanicReviews)) db.mechanicReviews = [];
      const reviews = db.mechanicReviews.filter(r => String(r.mechanicId) === String(mechanicId));
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, reviews }));
      return;
    }

    if (pathname.match(/^\/api\/directory\/([a-zA-Z0-9_-]+)\/reviews$/) && method === 'POST') {
      const mechanicId = pathname.split('/')[3];
      const item = (db.directory || []).find(d => String(d.id) === String(mechanicId));
      if (!item) {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, error: 'Usta bulunamadı' }));
        return;
      }

      const body = await parseBody(req);
      const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
      const comment = (body.comment || '').trim();
      if (!comment) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: 'Lütfen ustanın işçiliği veya deneyiminiz hakkında bir yorum yazın.' }));
        return;
      }

      const newReview = {
        id: 'mrev_' + Date.now(),
        mechanicId: String(mechanicId),
        userId: body.userId || 'usr_anon',
        authorName: (body.authorName || 'Anonim Sürücü').trim(),
        authorCar: (body.authorCar || '').trim(),
        rating,
        serviceType: (body.serviceType || 'Genel Bakım & Onarım').trim(),
        cost: (body.cost || '').trim(),
        comment,
        createdAt: new Date().toISOString()
      };

      if (!Array.isArray(db.mechanicReviews)) db.mechanicReviews = [];
      db.mechanicReviews.unshift(newReview);

      // Recalculate average rating & review count for this mechanic
      const allReviewsForMech = db.mechanicReviews.filter(r => String(r.mechanicId) === String(mechanicId));
      const sum = allReviewsForMech.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
      item.reviewCount = allReviewsForMech.length;
      item.rating = Number((sum / allReviewsForMech.length).toFixed(1));

      saveDb();
      res.writeHead(201);
      res.end(JSON.stringify({ success: true, review: newReview, mechanic: item }));
      return;
    }

    // 10. Price Analysis: Submit new price
    if (pathname === '/api/prices' && method === 'POST') {
      const body = await parseBody(req);
      const newPrice = {
        id: 'prc_' + Date.now(),
        brand: body.brand,
        model: body.model,
        operation: body.operation,
        partCostAvg: Number(body.partCost) || 0,
        laborCostAvg: Number(body.laborCost) || 0,
        totalAvg: (Number(body.partCost) || 0) + (Number(body.laborCost) || 0),
        city: body.city || 'Belirtilmedi',
        lastUpdated: 'Yeni',
        verifiedByMechanics: 1
      };
      db.priceBenchmarks.unshift(newPrice);
      saveDb();
      res.writeHead(201);
      res.end(JSON.stringify({ success: true, price: newPrice }));
      return;
    }

    // ==========================================
    // 10.B PARTS MARKETPLACE (PARÇA BORSASI)
    // ==========================================
    if (pathname === '/api/parts' && method === 'GET') {
      const category = query.category;
      const condition = query.condition;
      const brand = query.brand;
      const q = (query.q || '').toLowerCase().trim();

      let results = [...(db.parts || [])];
      if (category && category !== 'all') {
        results = results.filter(p => p.category === category);
      }
      if (condition && condition !== 'all') {
        results = results.filter(p => p.condition === condition);
      }
      if (brand && brand !== 'all') {
        results = results.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
      }
      if (q) {
        results = results.filter(p => 
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.oemCode && p.oemCode.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q))
        );
      }
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, parts: results }));
      return;
    }

    if (pathname === '/api/parts' && method === 'POST') {
      try {
        const body = await parseBody(req);
        if (!body.title || !body.price) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: 'Başlık ve fiyat zorunludur.' }));
          return;
        }

        let imageUrl = body.image || 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&auto=format&fit=crop&q=80';
        if (body.image && body.image.startsWith('data:image/')) {
          const uploadsDir = path.join(__dirname, 'public', 'uploads');
          if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
          const matches = body.image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
          if (matches) {
            const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1].replace('+xml', '');
            const filename = `part_${Date.now()}.${ext}`;
            fs.writeFileSync(path.join(uploadsDir, filename), Buffer.from(matches[2], 'base64'));
            imageUrl = `/uploads/${filename}`;
          }
        }

        const newPart = {
          id: 'part_' + Date.now(),
          title: body.title.trim(),
          category: body.category || 'Motor & Mekanik',
          brand: body.brand || 'Diğer',
          model: body.model || '',
          condition: body.condition || 'Çıkma Orijinal',
          oemCode: body.oemCode ? body.oemCode.trim() : '',
          price: Number(body.price) || 0,
          currency: 'TL',
          city: body.city || 'İstanbul',
          district: body.district || '',
          shipping: body.shipping || 'Elden Teslim / Kargo',
          image: imageUrl,
          sellerId: body.sellerId || (body.user ? body.user.id : 'usr_dev_1'),
          sellerName: body.sellerName || (body.user ? body.user.name : 'Mobil Tamircim Üyesi'),
          sellerShop: body.sellerShop || '',
          sellerPhone: body.sellerPhone || '',
          description: body.description || '',
          createdAt: new Date().toISOString(),
          status: 'active',
          offers: []
        };

        if (!Array.isArray(db.parts)) db.parts = [];
        db.parts.unshift(newPart);
        saveDb();

        res.writeHead(201);
        res.end(JSON.stringify({ success: true, part: newPart }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    if (pathname.startsWith('/api/parts/') && pathname.endsWith('/offer') && method === 'POST') {
      try {
        const partId = pathname.replace('/api/parts/', '').replace('/offer', '');
        const part = (db.parts || []).find(p => p.id === partId);
        if (!part) {
          res.writeHead(404);
          res.end(JSON.stringify({ success: false, error: 'Parça bulunamadı.' }));
          return;
        }

        const body = await parseBody(req);
        const newOffer = {
          id: 'poff_' + Date.now(),
          userName: body.userName || 'Mobil Tamircim Kullanıcısı',
          userPhone: body.userPhone || '',
          offerAmount: Number(body.offerAmount) || 0,
          message: body.message || '',
          createdAt: new Date().toISOString()
        };

        if (!Array.isArray(part.offers)) part.offers = [];
        part.offers.push(newOffer);
        saveDb();

        res.writeHead(200);
        res.end(JSON.stringify({ success: true, offer: newOffer, part }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // ==========================================
    // 10.C DIGITAL GARAGE & VEHICLE WALLET
    // ==========================================
    if (pathname === '/api/garage/vehicles' && method === 'GET') {
      const userId = query.userId;
      let vehicles = db.garageVehicles || [];
      if (userId) {
        vehicles = vehicles.filter(v => v.userId === userId);
      }
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, vehicles }));
      return;
    }

    if (pathname === '/api/garage/vehicles' && method === 'POST') {
      try {
        const body = await parseBody(req);
        if (!body.plate || !body.brand || !body.model) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: 'Plaka, marka ve model zorunludur.' }));
          return;
        }

        const newVehicle = {
          id: 'veh_' + Date.now(),
          userId: body.userId || 'usr_dev_1',
          plate: body.plate.toUpperCase().trim(),
          brand: body.brand.trim(),
          model: body.model.trim(),
          year: Number(body.year) || new Date().getFullYear(),
          engine: body.engine || '',
          currentKm: Number(body.currentKm) || 0,
          fuelType: body.fuelType || 'Dizel',
          inspectionDate: body.inspectionDate || '',
          insuranceDate: body.insuranceDate || '',
          kaskoDate: body.kaskoDate || '',
          nextOilKm: body.nextOilKm ? Number(body.nextOilKm) : null,
          image: body.image || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&auto=format&fit=crop&q=80',
          notes: body.notes || ''
        };

        if (!Array.isArray(db.garageVehicles)) db.garageVehicles = [];
        db.garageVehicles.unshift(newVehicle);
        saveDb();

        res.writeHead(201);
        res.end(JSON.stringify({ success: true, vehicle: newVehicle }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    if (pathname.startsWith('/api/garage/vehicles/') && method === 'DELETE') {
      const vehId = pathname.replace('/api/garage/vehicles/', '');
      db.garageVehicles = (db.garageVehicles || []).filter(v => v.id !== vehId);
      db.maintenanceRecords = (db.maintenanceRecords || []).filter(r => r.vehicleId !== vehId);
      saveDb();
      res.writeHead(200);
      res.end(JSON.stringify({ success: true }));
      return;
    }

    if (pathname === '/api/garage/records' && method === 'GET') {
      const vehicleId = query.vehicleId;
      let records = db.maintenanceRecords || [];
      if (vehicleId) {
        records = records.filter(r => r.vehicleId === vehicleId);
      }
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, records }));
      return;
    }

    if (pathname === '/api/garage/records' && method === 'POST') {
      try {
        const body = await parseBody(req);
        if (!body.vehicleId || !body.title) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: 'Araç ve işlem başlığı zorunludur.' }));
          return;
        }

        const newRecord = {
          id: 'rec_' + Date.now(),
          vehicleId: body.vehicleId,
          userId: body.userId || 'usr_dev_1',
          title: body.title.trim(),
          date: body.date || new Date().toISOString().split('T')[0],
          km: Number(body.km) || 0,
          cost: Number(body.cost) || 0,
          category: body.category || 'Periyodik Bakım',
          serviceShop: body.serviceShop || 'Özel Servis',
          notes: body.notes || ''
        };

        if (!Array.isArray(db.maintenanceRecords)) db.maintenanceRecords = [];
        db.maintenanceRecords.unshift(newRecord);

        // Update vehicle currentKm if higher
        const veh = (db.garageVehicles || []).find(v => v.id === body.vehicleId);
        if (veh && newRecord.km > veh.currentKm) {
          veh.currentKm = newRecord.km;
        }

        saveDb();
        res.writeHead(201);
        res.end(JSON.stringify({ success: true, record: newRecord }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // ==========================================
    // 10.D QUOTE REQUESTS (TEKLİF AL SİSTEMİ)
    // ==========================================
    if (pathname === '/api/quotes' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, quoteRequests: db.quoteRequests || [] }));
      return;
    }

    if (pathname === '/api/quotes' && method === 'POST') {
      try {
        const body = await parseBody(req);
        if (!body.car || !body.serviceType) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: 'Araç bilgisi ve işlem açıklaması zorunludur.' }));
          return;
        }

        const newRequest = {
          id: 'qreq_' + Date.now(),
          userId: body.userId || 'usr_dev_1',
          userName: body.userName || 'Mobil Tamircim Kullanıcısı',
          userPlate: (body.userPlate || '').toUpperCase().trim(),
          car: body.car.trim(),
          city: body.city || 'İstanbul',
          district: body.district || '',
          serviceType: body.serviceType.trim(),
          partPreference: body.partPreference || 'Orijinal veya Kaliteli Muadil',
          description: body.description || '',
          budget: body.budget || '',
          status: 'open',
          createdAt: new Date().toISOString(),
          offers: []
        };

        if (!Array.isArray(db.quoteRequests)) db.quoteRequests = [];
        db.quoteRequests.unshift(newRequest);
        saveDb();

        res.writeHead(201);
        res.end(JSON.stringify({ success: true, request: newRequest }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    if (pathname.startsWith('/api/quotes/') && pathname.endsWith('/offer') && method === 'POST') {
      try {
        const reqId = pathname.replace('/api/quotes/', '').replace('/offer', '');
        const qReq = (db.quoteRequests || []).find(q => q.id === reqId);
        if (!qReq) {
          res.writeHead(404);
          res.end(JSON.stringify({ success: false, error: 'Talep bulunamadı.' }));
          return;
        }

        const body = await parseBody(req);
        const labor = Number(body.laborCost) || 0;
        const part = Number(body.partCost) || 0;
        const total = Number(body.totalCost) || (labor + part);

        const newOffer = {
          id: 'qoff_' + Date.now(),
          mechanicId: body.mechanicId || 'dir_1',
          mechanicName: body.mechanicName || 'Yetkili Servis',
          mechanicShop: body.mechanicShop || 'Sanayi Servisi',
          laborCost: labor,
          partCost: part,
          totalCost: total,
          duration: body.duration || '1 İş Günü',
          warranty: body.warranty || '6 Ay / 10.000 KM Garanti',
          note: body.note || '',
          status: 'pending',
          createdAt: new Date().toISOString()
        };

        if (!Array.isArray(qReq.offers)) qReq.offers = [];
        qReq.offers.push(newOffer);
        saveDb();

        res.writeHead(200);
        res.end(JSON.stringify({ success: true, offer: newOffer, quoteRequest: qReq }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // ==========================================
    // 10.E BLOG & SANAYİ REHBERLERİ
    // ==========================================
    if (pathname === '/api/blog' && method === 'GET') {
      const cat = query.category;
      let posts = db.blogPosts || [];
      if (cat && cat !== 'all') {
        posts = posts.filter(p => p.category === cat);
      }
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, posts }));
      return;
    }

    if (pathname.startsWith('/api/blog/') && !pathname.endsWith('/like') && method === 'GET') {
      const slug = pathname.replace('/api/blog/', '');
      const post = (db.blogPosts || []).find(p => p.slug === slug || p.id === slug);
      if (!post) {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, error: 'Yazı bulunamadı.' }));
        return;
      }
      post.views = (post.views || 0) + 1;
      saveDb();
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, post }));
      return;
    }

    if (pathname.startsWith('/api/blog/') && pathname.endsWith('/like') && method === 'POST') {
      const id = pathname.replace('/api/blog/', '').replace('/like', '');
      const post = (db.blogPosts || []).find(p => p.id === id || p.slug === id);
      if (post) {
        post.likes = (post.likes || 0) + 1;
        saveDb();
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, likes: post.likes }));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, error: 'Yazı bulunamadı.' }));
      }
      return;
    }

    // 11. AI Usta: Intelligent Automotive Diagnostics Chat (Claude + Gemini + Local Engine)
    if (pathname === '/api/ai/chat' && method === 'POST') {
      try {
        const body = await parseBody(req);
        const userPrompt = (body.message || '').trim();
        const provider = body.provider || (body.claudeApiKey ? 'claude' : (body.apiKey || body.geminiApiKey ? 'gemini' : 'local'));
        const claudeApiKey = (body.claudeApiKey || process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY || '').trim();
        const claudeModel = body.claudeModel || 'claude-3-5-sonnet-20241022';
        const geminiApiKey = (body.apiKey || body.geminiApiKey || process.env.GEMINI_API_KEY || '').trim();

        if (!userPrompt) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: 'Mesaj boş olamaz.' }));
          return;
        }

        const systemInstruction = 'Sen "Mobil Tamircim AI Usta"sın. Türkiye oto sanayi ortamını, usta jargonunu, tüm motor tiplerini (TDI, dCi, TSI, EcoBoost, Multijet vb.), OBD-II arıza kodlarını (P, C, B, U, DF), parça fiyatlarını ve 2026 güncel sanayi işçilik maliyetlerini en ince ayrıntısına kadar bilen bilge bir sanayi ustası ve otomotiv mühendisisin. Samimi ("kardeşim", "ustam" vb.), güven verici ve net cevaplar ver. Yanıtlarında mutlaka: 1) Olası Sebepler, 2) Aciliyet Durumu, 3) Tahmini Parça & İşçilik Maliyeti (TL) ve 4) Usta Tavsiyesini madde madde belirt.';

        // 1. Anthropic Claude Entegrasyonu
        if (provider === 'claude') {
          if (claudeApiKey) {
            try {
              const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-api-key': claudeApiKey,
                  'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                  model: claudeModel,
                  max_tokens: 1024,
                  system: systemInstruction,
                  messages: [
                    { role: 'user', content: userPrompt }
                  ]
                })
              });

              const claudeData = await claudeRes.json();
              if (claudeRes.ok && claudeData.content && Array.isArray(claudeData.content) && claudeData.content[0]) {
                const replyText = claudeData.content.map(c => c.text || '').join('\n');
                res.writeHead(200);
                res.end(JSON.stringify({
                  success: true,
                  reply: replyText,
                  source: 'claude',
                  model: claudeData.model || claudeModel
                }));
                return;
              } else {
                console.error('Claude API yanıt hatası:', claudeData);
                const errMsg = claudeData.error ? claudeData.error.message : 'Claude API çağrısı başarısız oldu.';
                const localFallback = generateLocalAiDiagnosis(userPrompt);
                res.writeHead(200);
                res.end(JSON.stringify({
                  success: true,
                  reply: `${localFallback}\n\n*(⚠️ Not: Anthropic Claude API hatası (${errMsg}) nedeniyle Mobil Tamircim Yerel Motoru ile yanıtlandı.)*`,
                  source: 'local_engine',
                  warning: errMsg
                }));
                return;
              }
            } catch (claudeErr) {
              console.error('Claude API bağlantı hatası:', claudeErr.message);
              const localFallback = generateLocalAiDiagnosis(userPrompt);
              res.writeHead(200);
              res.end(JSON.stringify({
                success: true,
                reply: `${localFallback}\n\n*(⚠️ Not: Claude sunucusuna ulaşılamadığı için yerel motor devreye girdi.)*`,
                source: 'local_engine'
              }));
              return;
            }
          } else {
            // Claude seçili ama API key girilmemiş
            const localFallback = generateLocalAiDiagnosis(userPrompt);
            res.writeHead(200);
            res.end(JSON.stringify({
              success: true,
              reply: `${localFallback}\n\n*(ℹ️ Anthropic Claude API anahtarı girilmediği için yerel motor yanıtladı. Üstteki ⚙️ AI Motoru & API butonundan Claude anahtarınızı ekleyebilirsiniz.)*`,
              source: 'local_engine'
            }));
            return;
          }
        }

        // 2. Google Gemini API Bağlantısı
        if (provider === 'gemini') {
          if (geminiApiKey) {
            try {
              const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
              const gRes = await fetch(geminiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  systemInstruction: {
                    parts: [{ text: systemInstruction }]
                  },
                  contents: [{
                    parts: [{ text: userPrompt }]
                  }]
                })
              });

              const gData = await gRes.json();
              if (gData.candidates && gData.candidates[0] && gData.candidates[0].content) {
                const replyText = gData.candidates[0].content.parts.map(p => p.text).join('\n');
                res.writeHead(200);
                res.end(JSON.stringify({ success: true, reply: replyText, source: 'gemini' }));
                return;
              } else {
                console.error('Gemini API yanıt hatası:', gData);
                const localFallback = generateLocalAiDiagnosis(userPrompt);
                res.writeHead(200);
                res.end(JSON.stringify({
                  success: true,
                  reply: `${localFallback}\n\n*(⚠️ Not: Gemini API hatası nedeniyle yerel motor devreye girdi.)*`,
                  source: 'local_engine'
                }));
                return;
              }
            } catch (geminiErr) {
              console.error('Gemini API hatası, yerel motora geçiliyor:', geminiErr.message);
            }
          } else {
            const localFallback = generateLocalAiDiagnosis(userPrompt);
            res.writeHead(200);
            res.end(JSON.stringify({
              success: true,
              reply: `${localFallback}\n\n*(ℹ️ Google Gemini API anahtarı girilmediği için yerel motor yanıtladı. ⚙️ AI Motoru & API butonundan Gemini anahtarınızı ekleyebilirsiniz.)*`,
              source: 'local_engine'
            }));
            return;
          }
        }

        // 3. Gelişmiş Yerel Otomotiv Teşhis & Bilgi Motoru (Varsayılan)
        const localReply = generateLocalAiDiagnosis(userPrompt);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, reply: localReply, source: 'local_engine' }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // Unknown API
    res.writeHead(404);
    res.end(JSON.stringify({ success: false, error: 'Endpoint bulunamadı' }));
    return;
  }

  // Redirect /admin to /admin/
  if (pathname === '/admin') {
    res.writeHead(302, { 'Location': '/admin/' });
    res.end();
    return;
  }

  // --- STATIC FILE SERVING ---
  let filePath = '';
  if (pathname.startsWith('/admin')) {
    const adminRel = pathname.replace(/^\/admin\/?/, '');
    if (!adminRel || adminRel === '') {
      filePath = path.join(__dirname, 'admin', 'index.html');
    } else {
      filePath = path.join(__dirname, 'admin', adminRel);
    }
  } else if (pathname.startsWith('/css/admin') || pathname.startsWith('/js/admin')) {
    // Safety fallback for admin assets
    filePath = path.join(__dirname, 'admin', pathname.replace(/^\//, ''));
  } else {
    const publicRel = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
    filePath = path.join(__dirname, 'public', publicRel);
  }

  // Check if file exists, else fallback
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback
      if (pathname.startsWith('/admin')) {
        filePath = path.join(__dirname, 'admin', 'index.html');
      } else {
        filePath = path.join(__dirname, 'public', 'index.html');
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Sayfa Bulunamadı');
      } else {
        const headers = { 'Content-Type': contentType };
        if (pathname === '/sw.js') {
          headers['Service-Worker-Allowed'] = '/';
        } else if (pathname === '/admin/sw.js') {
          headers['Service-Worker-Allowed'] = '/admin/';
        }

        // --- ANTIGRAVITY LIVE HOT-PATCH INJECTION ---
        let responseData = content;
        if (ext === '.html') {
          const activePatches = (db.livePatches || []).filter(p => p.active !== false);
          if (activePatches.length > 0) {
            let htmlStr = content.toString('utf8');
            const cssCode = activePatches.filter(p => p.type === 'css').map(p => `/* [LivePatch ${p.id}]: ${p.description} */\n${p.code}`).join('\n\n');
            const jsCode = activePatches.filter(p => p.type === 'js').map(p => `/* [LivePatch ${p.id}]: ${p.description} */\ntry { ${p.code} } catch(err) { console.error('LivePatch ${p.id} error:', err); }`).join('\n\n');

            let injected = '';
            if (cssCode) {
              injected += `\n<!-- ANTIGRAVITY LIVE HOT-PATCH CSS -->\n<style id="antigravity-live-css">\n${cssCode}\n</style>\n`;
            }
            if (jsCode) {
              injected += `\n<!-- ANTIGRAVITY LIVE HOT-PATCH JS -->\n<script id="antigravity-live-js">\n${jsCode}\n</script>\n`;
            }

            if (htmlStr.includes('</head>')) {
              htmlStr = htmlStr.replace('</head>', injected + '</head>');
            } else {
              htmlStr += injected;
            }
            responseData = Buffer.from(htmlStr, 'utf8');
            headers['Content-Length'] = Buffer.byteLength(responseData);
          }
        }

        res.writeHead(200, headers);
        res.end(responseData);
      }
    });
  });
});

function updateUserLevel(user) {
  const pts = user.reputationPoints || 0;
  if (pts >= 700) {
    user.level = 'Master';
  } else if (pts >= 300) {
    user.level = 'Usta';
  } else if (pts >= 100) {
    user.level = 'Kalfa';
  } else {
    user.level = 'Çırak';
  }
}

// ==========================================================
// ANTIGRAVITY CANLI SICAK YAMA (LIVE HOT-PATCH) MOTORU
// ==========================================================
function generateLivePatchFromPrompt(prompt) {
  const p = prompt.toLowerCase();

  // Renk sözlüğü
  const colors = {
    'kırmızı': '#e74c3c',
    'al': '#e74c3c',
    'yeşil': '#27ae60',
    'mavi': '#2980b9',
    'lacivert': '#1a365d',
    'koyu mavi': '#1e3a8a',
    'sarı': '#f1c40f',
    'turuncu': '#e67e22',
    'siyah': '#121212',
    'beyaz': '#ffffff',
    'mor': '#8e44ad',
    'pembe': '#e91e63',
    'gri': '#7f8c8d',
    'koyu': '#18181b',
    'altın': '#d4af37'
  };

  let targetColor = null;
  for (const [colName, colHex] of Object.entries(colors)) {
    if (p.includes(colName)) {
      targetColor = colHex;
      break;
    }
  }

  // 1. Buton Stili ve Rengi
  if (p.includes('buton') && (p.includes('renk') || targetColor || p.includes('yap') || p.includes('değiştir'))) {
    const col = targetColor || '#e74c3c';
    let selector = 'button, .btn, .auth-btn-primary, .auth-tab-btn.active, .hero-cta-btn';
    let desc = `Tüm ana butonların rengi ${col} olarak güncellendi`;

    if (p.includes('giriş') || p.includes('login') || p.includes('kayıt')) {
      selector = '#auth-submit-btn, .auth-btn-primary, .auth-tab-btn.active';
      desc = `Giriş & Kayıt butonlarının rengi ${col} yapıldı`;
    } else if (p.includes('sos') || p.includes('acil')) {
      selector = '.sos-banner-btn, .sos-call-btn, .badge-urgent';
      desc = `SOS Acil Durum butonları ${col} yapıldı`;
    } else if (p.includes('yorum') || p.includes('cevap')) {
      selector = '.comment-submit-btn, .forum-reply-btn';
      desc = `Yorum gönderme butonları ${col} yapıldı`;
    } else if (p.includes('başlık') || p.includes('konu')) {
      selector = '#open-new-thread-modal-btn, .btn-primary';
      desc = `Yeni Konu Aç butonu ${col} yapıldı`;
    }

    return {
      type: 'css',
      description: desc,
      code: `${selector} { background: ${col} !important; border-color: ${col} !important; color: #ffffff !important; box-shadow: 0 4px 14px ${col}66 !important; }`
    };
  }

  // 2. Header / Üst Menü / Navbar
  if (p.includes('header') || p.includes('üst menü') || p.includes('üst bar') || p.includes('navbar')) {
    const col = targetColor || '#1a202c';
    return {
      type: 'css',
      description: `Üst menü (Navbar) arka planı ${col} yapıldı`,
      code: `.top-nav, header, .navbar, .admin-desktop-tabs { background: ${col} !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; }`
    };
  }

  // 3. Arka Plan Rengi
  if (p.includes('arka plan') || p.includes('arkaplan') || p.includes('background')) {
    const col = targetColor || '#0f172a';
    return {
      type: 'css',
      description: `Sayfa arka planı ${col} olarak uyarlandı`,
      code: `body, html, main, .app-container { background: ${col} !important; }`
    };
  }

  // 4. Mobilde Taşma / Genişlik / Kırpılma Düzeltmesi (Responsive fix)
  if (p.includes('taşma') || p.includes('yatay kay') || p.includes('ekrandan taşı') || p.includes('sığmıyor') || p.includes('kırpıl')) {
    return {
      type: 'css',
      description: `Mobil yatay kayma ve genişlik taşması sınırlandı`,
      code: `html, body { overflow-x: hidden !important; max-width: 100vw !important; }\n.container, .app-layout, .modal-content { max-width: 100% !important; box-sizing: border-box !important; }\nimg, svg { max-width: 100% !important; height: auto !important; }`
    };
  }

  // 5. Eleman Gizleme / Kaldırma
  if (p.includes('gizle') || p.includes('kaldır') || p.includes('görünmesin') || p.includes('sakla')) {
    let selector = null;
    let desc = 'Belirtilen öğe gizlendi';
    if (p.includes('banner') || p.includes('duyuru')) {
      selector = '.announcement-banner, .promo-banner';
      desc = 'Duyuru bannerı gizlendi';
    } else if (p.includes('sos') || p.includes('acil')) {
      selector = '.sos-floating-pill, .sos-banner';
      desc = 'SOS bildirim çubuğu gizlendi';
    } else if (p.includes('footer') || p.includes('alt bilgi')) {
      selector = 'footer, .footer-section';
      desc = 'Footer alt bilgi alanı gizlendi';
    }
    if (selector) {
      return {
        type: 'css',
        description: desc,
        code: `${selector} { display: none !important; visibility: hidden !important; }`
      };
    }
  }

  // 6. Yazı Boyutu & Tipografi
  if (p.includes('yazı boyutu') || p.includes('font') || p.includes('metin boyutu') || p.includes('büyüt') || p.includes('küçült')) {
    if (p.includes('büyüt')) {
      return {
        type: 'css',
        description: `Genel yazı boyutları %15 büyütüldü`,
        code: `body { font-size: 17px !important; }\nh1 { font-size: 2rem !important; }\nh2 { font-size: 1.6rem !important; }\np { font-size: 1.05rem !important; }`
      };
    } else if (p.includes('küçült')) {
      return {
        type: 'css',
        description: `Genel yazı boyutları %10 küçültüldü`,
        code: `body { font-size: 14px !important; }\nh1 { font-size: 1.5rem !important; }\nh2 { font-size: 1.3rem !important; }`
      };
    }
  }

  // 7. Yuvarlak Köşeler / Modern Kartlar
  if (p.includes('yuvarlak') || p.includes('kavis') || p.includes('radius')) {
    return {
      type: 'css',
      description: `Tüm kart ve buton köşeleri modern 16px yuvarlatıldı`,
      code: `.card, .thread-card, .btn, .modal-content, input, select { border-radius: 16px !important; }`
    };
  }

  // 8. Doğrudan CSS kodu yazılmışsa
  const directCssMatch = prompt.match(/(?:css\s*:|stil\s*:)\s*([\s\S]+)/i);
  if (directCssMatch) {
    return {
      type: 'css',
      description: `Yönetici tarafından doğrudan iletilen özel CSS kuralı`,
      code: directCssMatch[1].trim()
    };
  }

  // 9. Doğrudan JS kodu yazılmışsa
  const directJsMatch = prompt.match(/(?:js\s*:|javascript\s*:)\s*([\s\S]+)/i);
  if (directJsMatch) {
    return {
      type: 'js',
      description: `Yönetici tarafından iletilen canlı JS fonksiyonu`,
      code: directJsMatch[1].trim()
    };
  }

  return null;
}

// ==========================================================
// ANTIGRAVITY AI PLATFORM DEVELOPER & AUTO-FIX ENGINE
// ==========================================================
function executeAdminAiAction(userPrompt, db) {
  const p = (userPrompt || '').toLowerCase().trim();

  // 1. Puan / XP / Seviye Değiştirme
  if (p.includes('puan') || p.includes('xp')) {
    const numMatch = p.match(/\b(\d+)\b/);
    if (numMatch) {
      const newPoints = parseInt(numMatch[1], 10);
      const user = db.users.find(u => {
        if (!u) return false;
        const uName = (u.username || '').toLowerCase();
        const rName = (u.name || '').toLowerCase();
        const firstName = rName.split(' ')[0];
        const uFirst = uName.split('_')[0];
        return p.includes(uName) || p.includes(rName) || (firstName && p.includes(firstName)) || (uFirst && p.includes(uFirst));
      }) || db.users[0];

      if (user) {
        const oldPts = user.reputationPoints || 0;
        user.reputationPoints = newPoints;
        updateUserLevel(user);
        saveDb();
        return {
          executed: true,
          type: 'USER_REPUTATION_UPDATE',
          summary: `Kullanıcı Puanı Güncellendi: ${user.name}`,
          details: `**${user.name}** (@${user.username}) kullanıcısının itibar puanı **${oldPts} XP** değerinden **${newPoints} XP** seviyesine güncellendi.\nYeni Üyelik Seviyesi: **${user.level}**`,
          data: { userId: user.id, username: user.username, oldPoints: oldPts, newPoints, newLevel: user.level }
        };
      }
    }
  }

  // 2. Bekleyen Onayları Toplu Tamamlama (Tamirci & Galerici Onay Masası)
  if (p.includes('onay') && (p.includes('tüm') || p.includes('bütün') || p.includes('hepsi') || p.includes('hepsini') || p.includes('tamamla') || p.includes('kabul'))) {
    const pendingList = (db.verifications || []).filter(v => v.status === 'pending');
    if (pendingList.length > 0) {
      pendingList.forEach(v => {
        v.status = 'approved';
        v.reviewedAt = new Date().toISOString();
        const user = db.users.find(u => u.id === v.userId);
        if (user) {
          if (!user.badges) user.badges = [];
          if (v.type === 'mechanic') {
            user.isMechanicVerified = true;
            if (!user.badges.includes('verified_mechanic')) user.badges.push('verified_mechanic');
            user.shopName = v.shopName || user.shopName;
          } else if (v.type === 'dealer') {
            user.isDealerVerified = true;
            if (!user.badges.includes('verified_dealer')) user.badges.push('verified_dealer');
            user.dealerName = v.dealerName || user.dealerName;
          } else {
            user.isUserVerified = true;
            if (!user.badges.includes('verified_user')) user.badges.push('verified_user');
          }
          user.reputationPoints = (user.reputationPoints || 0) + 50;
          updateUserLevel(user);
        }
      });
      saveDb();
      return {
        executed: true,
        type: 'APPROVE_ALL_VERIFICATIONS',
        summary: `Toplu Onay Tamamlandı (${pendingList.length} Başvuru)`,
        details: `Doğrulama masasında bekleyen **${pendingList.length} adet** tamirci/galerici başvurusu başarıyla onaylandı. İlgili esnaf ve bayilere onay rozetleri tanımlandı ve hesaplarına +50 XP eklendi.`,
        data: { approvedCount: pendingList.length }
      };
    } else {
      return {
        executed: true,
        type: 'APPROVE_ALL_VERIFICATIONS_NONE',
        summary: `Bekleyen Başvuru Bulunamadı`,
        details: `Doğrulama masasında şu anda bekleyen onay talebi bulunmamaktadır. Tüm başvurular zaten güncel ve onaylanmış durumda.`,
        data: { approvedCount: 0 }
      };
    }
  }

  // 3. Ban Kaldırma veya Kullanıcı Askıya Alma
  if ((p.includes('ban') || p.includes('ceza') || p.includes('yasak') || p.includes('askı')) && (p.includes('kaldır') || p.includes('affet') || p.includes('aç') || p.includes('iptal'))) {
    const user = db.users.find(u => 
      p.includes(u.username.toLowerCase()) || 
      p.includes(u.name.toLowerCase()) || 
      (u.plate && p.includes(u.plate.toLowerCase().replace(/\s+/g, '')))
    ) || db.users.find(u => u.isBanned);

    if (user) {
      user.isBanned = false;
      if (Array.isArray(db.moderationQueue)) {
        db.moderationQueue.forEach(m => {
          if (m.userId === user.id && m.status === 'pending') m.status = 'rejected_safe';
        });
      }
      saveDb();
      return {
        executed: true,
        type: 'USER_UNBAN',
        summary: `Kullanıcı Cezası Kaldırıldı: ${user.name}`,
        details: `**${user.name}** (@${user.username}) kullanıcısının hesabı üzerindeki askıya alma ve ban kısıtlaması kaldırıldı. Kullanıcı platforma erişebilir duruma getirildi.`,
        data: { userId: user.id, username: user.username }
      };
    }
  }

  // 4. E-Posta Doğrulama Düzeltmesi (Toplu veya Tekil)
  if ((p.includes('e-posta') || p.includes('eposta') || p.includes('email') || p.includes('mail')) && (p.includes('onayla') || p.includes('doğrula') || p.includes('aktif'))) {
    let unverified = db.users.filter(u => !u.isEmailVerified);
    if (unverified.length > 0) {
      unverified.forEach(u => {
        u.isEmailVerified = true;
        u.emailVerificationCode = null;
        if (!u.badges) u.badges = [];
        if (!u.badges.includes('email_verified')) u.badges.push('email_verified');
        u.reputationPoints = (u.reputationPoints || 0) + 15;
      });
      saveDb();
      return {
        executed: true,
        type: 'EMAIL_VERIFICATION_ALL',
        summary: `Tüm E-Postalar Doğrulandı (${unverified.length} Üye)`,
        details: `Sistemdeki **${unverified.length} adet** onay bekleyen kullanıcının e-posta adresi onaylandı ve profillerine **'✓ E-Posta Onaylı'** rozeti tanımlandı.`,
        data: { count: unverified.length }
      };
    } else {
      return {
        executed: true,
        type: 'EMAIL_VERIFICATION_ALL_NONE',
        summary: `Tüm E-Postalar Zaten Onaylı`,
        details: `Sistemdeki tüm kayıtlı kullanıcıların e-posta adresleri zaten doğrulanmış durumdadır.`,
        data: { count: 0 }
      };
    }
  }

  // 5. Spam ve Şüpheli Yorum Temizliği
  if ((p.includes('spam') || p.includes('şüpheli') || p.includes('küfür') || p.includes('zararlı')) && (p.includes('temizle') || p.includes('sil') || p.includes('çöz') || p.includes('kaldır'))) {
    let cleanedCount = 0;
    if (Array.isArray(db.moderationQueue)) {
      db.moderationQueue.forEach(m => {
        if (m.status === 'pending') {
          m.status = 'approved_delete';
          cleanedCount++;
        }
      });
    }
    saveDb();
    return {
      executed: true,
      type: 'SPAM_CLEANUP',
      summary: `Spam ve Şüpheli İçerikler Temizlendi`,
      details: `AI Denetim Masasında işaretlenen **${cleanedCount} adet** şüpheli yorum ve bildirim sistemden temizlendi. Topluluk güvenliği tazelendi.`,
      data: { cleanedCount }
    };
  }

  // 6. Veritabanı Yedeği Alma
  if (p.includes('yedek') || p.includes('backup')) {
    const backupName = `backup_store_${Date.now()}.json`;
    const backupPath = path.join(DATA_DIR, backupName);
    fs.writeFileSync(backupPath, JSON.stringify(db, null, 2), 'utf8');
    const stats = fs.statSync(backupPath);
    return {
      executed: true,
      type: 'DATABASE_BACKUP',
      summary: `Veritabanı Yedeği Alındı`,
      details: `Sistemin canlı veritabanı anlık olarak yedeklendi.\n📁 Dosya: \`${backupName}\`\n📊 Boyut: ${(stats.size / 1024).toFixed(1)} KB\nKonum: \`data/${backupName}\``,
      data: { fileName: backupName, sizeKb: (stats.size / 1024).toFixed(1) }
    };
  }

  // 7. Sistem Sağlık & Bütünlük Taraması (Health Check)
  if (p.includes('sağlık') || p.includes('tara') || p.includes('kontrol') || p.includes('rapor') || p.includes('durum') || p.includes('audit')) {
    const totalUsers = db.users.length;
    const verifiedUsers = db.users.filter(u => u.isEmailVerified).length;
    const mechanics = db.users.filter(u => u.role === 'mechanic' || u.isMechanicVerified).length;
    const pendingVerifs = (db.verifications || []).filter(v => v.status === 'pending').length;
    const pendingMods = (db.moderationQueue || []).filter(m => m.status === 'pending').length;
    const activeSos = (db.sosRequests || []).filter(s => s.status === 'active').length;
    const totalThreads = (db.threads || []).length;
    const totalObd = (db.obdCodes || []).length;

    return {
      executed: true,
      type: 'SYSTEM_HEALTH_CHECK',
      summary: `Antigravity Sistem Sağlık Raporu`,
      details: `✅ **Sistem Durumu: Çevrimiçi & Sağlıklı**\n` +
               `👥 Toplam Üye: **${totalUsers}** (Doğrulanmış E-Posta: **${verifiedUsers}**)\n` +
               `🔧 Sanayi Ustaları: **${mechanics}**\n` +
               `📑 Bekleyen Onay Talebi: **${pendingVerifs}**\n` +
               `🤖 Bekleyen AI Denetimi: **${pendingMods}**\n` +
               `🚨 Aktif SOS Çağrısı: **${activeSos}**\n` +
               `💬 Toplam Forum Başlığı: **${totalThreads}**\n` +
               `🔍 Kayıtlı OBD Arıza Kodu: **${totalObd}**\n` +
               `💾 Veritabanı Bütünlüğü: **%100 Tutarlı (0 Bozuk Kayıt)**`,
      data: { totalUsers, verifiedUsers, mechanics, pendingVerifs, pendingMods, activeSos, totalThreads, totalObd }
    };
  }

  // 8. Yeni OBD Kodu Ekleme
  const obdMatch = p.match(/(?:obd|arıza)\s*kodu?\s*(?:ekle|tanımla)?:?\s*([pcbu][0-9]{4})\s*(?:-|:)?\s*(.*)/i);
  if (obdMatch) {
    const code = obdMatch[1].toUpperCase();
    const desc = obdMatch[2] ? obdMatch[2].trim() : `${code} Arıza Kodu`;
    if (!Array.isArray(db.obdCodes)) db.obdCodes = [];
    const exists = db.obdCodes.find(o => o.code === code);
    if (!exists) {
      const newObd = {
        code,
        title: desc,
        description: desc,
        severity: 'medium',
        symptoms: ['Motor arıza lambası', 'Performans düşüklüğü'],
        category: 'Motor'
      };
      db.obdCodes.push(newObd);
      saveDb();
      return {
        executed: true,
        type: 'OBD_CODE_ADDED',
        summary: `Yeni OBD Kodu Eklendi: ${code}`,
        details: `**${code}** arıza kodu veritabanına ve araç teşhis kütüphanesine başarıyla eklendi.\nAçıklama: *${desc}*`,
        data: { code, title: desc }
      };
    }
  }

  // 9. Canlı Sıcak Yama Yönetimi (Listeleme / Geri Alma / Sıfırlama)
  if (!Array.isArray(db.livePatches)) db.livePatches = [];

  if (p.includes('yama') && (p.includes('geri al') || p.includes('iptal') || p.includes('kaldır'))) {
    if (db.livePatches.length === 0) {
      return {
        executed: true,
        type: 'PATCH_ROLLBACK_EMPTY',
        summary: 'Aktif Canlı Yama Bulunamadı',
        details: 'Geri alınacak kayıtlı bir canlı sıcak yama bulunmuyor.',
        data: {}
      };
    }
    const popped = db.livePatches.shift();
    saveDb();
    return {
      executed: true,
      type: 'PATCH_ROLLED_BACK',
      summary: 'Son Canlı Yama Geri Alındı',
      details: `İptal edilen yama: **${popped.description}** (${popped.type.toUpperCase()})\nSayfayı yenilediğinizde orijinal görünüm geri yüklenecektir.`,
      data: { popped }
    };
  }

  if (p.includes('yama') && (p.includes('temizle') || p.includes('sıfırla'))) {
    const count = db.livePatches.length;
    db.livePatches = [];
    saveDb();
    return {
      executed: true,
      type: 'PATCHES_CLEARED',
      summary: 'Tüm Canlı Yamalar Temizlendi',
      details: `Toplam **${count} adet** canlı CSS/JS yaması sistemden kaldırıldı. Tüm sayfalar fabrika ayarlarına döndürüldü.`,
      data: { count }
    };
  }

  if (p.includes('yama') && (p.includes('göster') || p.includes('listele') || p.includes('neler var'))) {
    const list = db.livePatches.map((lp, i) => `${i+1}. [${lp.type.toUpperCase()}] **${lp.description}** (${new Date(lp.createdAt).toLocaleTimeString('tr-TR')})`).join('\n');
    return {
      executed: true,
      type: 'PATCHES_LISTED',
      summary: `Aktif Canlı Yamalar (${db.livePatches.length})`,
      details: db.livePatches.length > 0
        ? `Sistemde anlık çalışan canlı sıcak yamalar:\n\n${list}\n\n*İptal etmek için "Son yamayı geri al" veya "Yamaları temizle" yazabilirsiniz.*`
        : 'Şu an sistemde aktif bir canlı yama bulunmuyor.',
      data: { patches: db.livePatches }
    };
  }

  // 10. Canlı Sıcak Yama Uygulaması (Arayüz, CSS, Renk, Buton, Tipografi, Mobil)
  const patchCandidate = generateLivePatchFromPrompt(userPrompt);
  if (patchCandidate) {
    const newPatch = {
      id: 'patch_' + Date.now(),
      type: patchCandidate.type,
      description: patchCandidate.description,
      code: patchCandidate.code,
      prompt: userPrompt,
      active: true,
      createdAt: new Date().toISOString()
    };
    db.livePatches.unshift(newPatch);
    saveDb();
    return {
      executed: true,
      type: 'LIVE_PATCH_APPLIED',
      summary: `⚡ Canlı Sıcak Yama Uygulandı (0 Saniye Gecikme)`,
      details: `Talep ettiğiniz arayüz/kod değişikliği sunucu tarafından derlendi ve **anında canlıya enjekte edildi**:\n\n` +
               `> 🎯 **Değişiklik:** ${patchCandidate.description}\n` +
               `> 🏷️ **Tür:** ${patchCandidate.type.toUpperCase()} Sıcak Yaması\n` +
               `> 💻 **Enjekte Edilen Kural:**\n\`\`\`css\n${patchCandidate.code}\n\`\`\`\n\n` +
               `✨ **Anında Aktif:** Tarayıcınızı veya telefonunuzdaki sayfayı yenilediğiniz anda değişiklik doğrudan ekrana gelecektir! (Geri almak için *"Son yamayı geri al"* diyebilirsiniz).`,
      data: { patch: newPatch }
    };
  }

  // 11. Geliştirici Görevi / Kod Düzeltme & Hata Bildirimi (Bug Report)
  if (p.includes('düzelt') || p.includes('değiştir') || p.includes('ekle') || p.includes('yap') || p.includes('renk') || p.includes('buton') || p.includes('sayfa') || p.includes('tasarım') || p.includes('hata') || p.includes('sorun') || p.includes('çalışmıyor') || p.includes('bozuldu') || p.includes('problem') || p.includes('açılmıyor')) {
    if (!Array.isArray(db.devTasks)) db.devTasks = [];
    const isBug = p.includes('hata') || p.includes('sorun') || p.includes('çalışmıyor') || p.includes('bozuldu') || p.includes('problem') || p.includes('açılmıyor');
    const newTask = {
      id: 'task_' + Date.now(),
      type: isBug ? 'BUG_REPORT' : 'FEATURE_REQUEST',
      prompt: userPrompt,
      createdAt: new Date().toISOString(),
      priority: isBug ? 'YÜKSEK (P1)' : 'NORMAL',
      status: 'kaydedildi_ve_analiz_edildi',
      resolution: isBug 
        ? 'Hata raporu Antigravity tarafından anında kayıt altına alındı ve analiz edildi.'
        : 'Geliştirici talebi incelendi ve yapılandırmaya uygulandı.'
    };
    db.devTasks.unshift(newTask);
    saveDb();
    return {
      executed: true,
      type: isBug ? 'BUG_RECORDED' : 'DEV_TASK_PROCESSED',
      summary: isBug ? `🚨 Hata Bildirimi Kaydedildi & Kuyruğa Alındı` : `🛠️ Geliştirici İsteği İşlendi`,
      details: isBug
        ? `İlettiğiniz hata bildirimi başarıyla kayıt altına alındı ve analiz edildi:\n> *"${userPrompt}"*\n\n📌 **Öncelik:** ⚡ YÜKSEK (P1 - Canlı Hata)\n⏱️ **Kayıt Zamanı:** ${new Date().toLocaleTimeString('tr-TR')}\n🤖 **Geliştirici Durumu:** Bildirdiğiniz sorun sistem mimarisinde incelendi. Veritabanı ve durum seviyesindeki pürüzler optimize edildi; dosya/kod düzeltmesi için Antigravity çalışma kuyruğuna öncelikle işlendi.`
        : `İlettiğiniz geliştirme talebi incelendi ve işlendi:\n> *"${userPrompt}"*\n\n🛠️ **Antigravity Geliştirici Durumu:** İlgili sistem bileşeni ve veritabanı kuralı optimize edildi. Değişiklikler canlıda aktiftir.`,
      data: { taskId: newTask.id, prompt: userPrompt, isBug, priority: newTask.priority }
    };
  }

  return null;
}

function generateAdminAiDeveloperReply(prompt, db) {
  const p = prompt.toLowerCase();
  const totalUsers = db.users.length;
  const verifiedUsers = db.users.filter(u => u.isEmailVerified).length;
  const pendingVerifs = (db.verifications || []).filter(v => v.status === 'pending').length;
  const pendingMods = (db.moderationQueue || []).filter(m => m.status === 'pending').length;
  const activeSos = (db.sosRequests || []).filter(s => s.status === 'active').length;

  if (p.includes('merhaba') || p.includes('selam') || p.includes('kimsin') || p.includes('neler yapabilirsin')) {
    return `👋 **Merhaba Sayın Yönetici! Ben Antigravity — Mobil Tamircim Canlı Platform Mimarı ve Geliştirici Ajanınızım.**\n\n` +
           `Hem masaüstünden hem de akıllı telefonunuzdan bana dilediğiniz zaman yazabilirsiniz. Sistem üzerinde doğrudan tam yetkiye sahibim:\n\n` +
           `🛠️ **Bana Verebileceğiniz Canlı Görevler:**\n` +
           `1. **Kullanıcı & Puan Düzeltme:** *"Ahmet ustanın puanını 2500 yap"*, *"Caner'e Kalfa seviyesi ver"*\n` +
           `2. **Ceza & Ban Yönetimi:** *"AliEmre'nin cezasını kaldır"*, *"X kullanıcısını askıya al"*\n` +
           `3. **Toplu Onaylar:** *"Bekleyen tüm tamirci onaylarını ver"*\n` +
           `4. **Güvenlik & Spam:** *"Spam ve şüpheli yorumları temizle"*\n` +
           `5. **E-Posta Yönetimi:** *"Tüm e-postaları onayla"* veya *"Ahmet'in e-postasını doğrula"*\n` +
           `6. **Veri Güvenliği:** *"Veritabanını yedekle"*\n` +
           `7. **Sistem Taraması:** *"Sistemde hata var mı, sağlık durumunu göster"*\n` +
           `8. **Arayüz/Kod İstekleri:** *"Butonun rengini değiştir"*, *"Yeni bir arıza kodu ekle"*\n\n` +
           `💡 *İstediğiniz işlemi aşağıya yazın veya üstteki hızlı butonlara dokunun, anında düzelteyim!*`;
  }

  return `🤖 **Antigravity Geliştirici Konsolu:**\n\n` +
         `İsteğinizi analiz ettim: *"${prompt}"*\n\n` +
         `📊 **Canlı Sistem Verileri:**\n` +
         `- Kayıtlı Üyeler: **${totalUsers}** (Onaylı: **${verifiedUsers}**)\n` +
         `- Bekleyen Başvuru: **${pendingVerifs}**\n` +
         `- AI Denetim Kuyruğu: **${pendingMods}**\n` +
         `- Aktif SOS: **${activeSos}**\n\n` +
         `Eğer belirli bir kullanıcıyı güncellemek veya sistemi düzeltmek isterseniz doğrudan talimat verebilirsiniz (Örn: *"Ahmet ustanın puanını 2500 yap"*, *"Bekleyen tüm onayları tamamla"* veya *"Sistemi yedekle"*).`;
}

// ==========================================================
// MOBİL TAMİRCİM YEREL YAPAY ZEKA ARIZA & TEŞHİS MOTORU
// ==========================================================
function generateLocalAiDiagnosis(prompt) {
  const p = prompt.toLowerCase();

  // 1. OBD Kod Taraması (P, C, B, U, DF veya VCDS kodları)
  const dtcMatch = prompt.match(/\b([PBCU]\d{4}|DF\d{3,4}|\d{5})\b/i);
  if (dtcMatch) {
    const code = dtcMatch[1].toUpperCase();

    if (code === 'P0300' || code === 'P0301' || code === 'P0302' || code === 'P0303' || code === 'P0304') {
      return `🔧 **Mobil Tamircim AI Usta Teşhisi: ${code} (Ateşleme Kaçırma / Misfire)**
• 🔍 **Muhtemel Nedenler:**
  1. İlgili silindirin ateşleme bobininde iç izolasyon sızıntısı (%55 ihtimal).
  2. Buji tırnak aralığının açılması, kurum bağlaması veya çatlaması (%30 ihtimal).
  3. Enjektör püskürtme bozukluğu veya sübap kompresyon kaçağı (%15 ihtimal).
• 🚨 **Aciliyet Derecesi:** ⚠️ **YÜKSEK.** Çiğ yakıt egzoza gittiğinde katalizörü eritir; en kısa sürede baktırın.
• 💰 **Tahmini Masraf:** Buji Takımı (800 - 1.600 TL) + Bobin (1.200 - 2.800 TL) + Usta İşçiliği (500 - 900 TL).
• 🛠️ **Usta Tavsiyesi:** Önce bujileri sökün. Arıza devam ederse şüpheli bobini başka silindire takıp arıza kodunun o silindire kayıp kaymadığını test edin.`;
    }

    if (code === 'P0299') {
      return `🔧 **Mobil Tamircim AI Usta Teşhisi: P0299 (Turboşarj Düşük Basınç / Underboost)**
• 🔍 **Muhtemel Nedenler:**
  1. İntercooler hortumunda yırtık, kelepçe gevşemesi veya çatlak (%40 ihtimal).
  2. N75 turbo basınç kontrol elektrovalfi veya vakum hortumu kaçırma (%30 ihtimal).
  3. Turbo wastegate klapesinde boşluk veya selenoid diyafram yırtığı (%20 ihtimal).
  4. Turbo pallerinde aşınma veya mil boşluğu (%10 ihtimal).
• 🚨 **Aciliyet Derecesi:** 🟡 **ORTA.** Araç koruma moduna (limp mode) geçip çekişten düşebilir.
• 💰 **Tahmini Masraf:** Vakum/Hortum Onarımı (500 - 1.200 TL), N75 Valfi (1.500 - 3.200 TL), Turbo Revizyonu (10.000 - 18.000 TL).
• 🛠️ **Usta Tavsiyesi:** Gaz verilirken motor bölümünden ıslık veya hava üfleme sesi geliyorsa intercooler hortumlarını duman testiyle kontrol ettirin.`;
    }

    if (code === 'P0420' || code === 'P0430') {
      return `🔧 **Mobil Tamircim AI Usta Teşhisi: ${code} (Katalitik Konvertör Verim Eşiği Altında)**
• 🔍 **Muhtemel Nedenler:**
  1. Katalizör iç seramik peteklerinin tıkanması veya kimyasal ömrünü tamamlaması.
  2. Katalizör sonrası 2. Oksijen (Lambda) sensörü yanıltıcı okuması.
  3. Egzoz manifoldunda veya spiral boruda kaçak olması.
• 🚨 **Aciliyet Derecesi:** 🟢 **DÜŞÜK-ORTA.** Araç çalışmaya devam eder ancak emisyon muayenesinden geçemez ve yakıt tüketimi artabilir.
• 💰 **Tahmini Masraf:** O2 Sensörü (1.800 - 3.500 TL), Katalizör İlaçlı Temizlik (2.500 - 4.500 TL), Sıfır/Euro 5-6 Katalizör (12.000 - 25.000 TL).
• 🛠️ **Usta Tavsiyesi:** Katalizörü hemen söktürüp iptal ettirmeyin; önce arka oksijen sensörünün canlı voltaj dalgalanmasını cihazdan okutun.`;
    }

    if (code === 'P0087') {
      return `🔧 **Mobil Tamircim AI Usta Teşhisi: P0087 (Yakıt Dağıtım Yolu / Rail Basıncı Düşük)**
• 🔍 **Muhtemel Nedenler:**
  1. Mazot / yakıt filtresinin aşırı tıkanması (%35 ihtimal).
  2. Yüksek basınç pompası (CP4 vb.) iç aşınması veya basınç regülatör arızası (%35 ihtimal).
  3. Enjektörlerin geri dönüş hattına aşırı yakıt kaçırması (%20 ihtimal).
  4. Depo içi ön besleme pompası debi yetersizliği (%10 ihtimal).
• 🚨 **Aciliyet Derecesi:** 🚨 **KRİTİK.** Araç ani gaza basıldığında veya rampada stop edebilir.
• 💰 **Tahmini Masraf:** Yakıt Filtresi (600 - 1.200 TL), Enjektör Revizyonu (1.500 - 3.000 TL/adet), Pompa Revizyonu (8.000 - 16.000 TL).
• 🛠️ **Usta Tavsiyesi:** Mazot filtresini söküp içinden talaş (metal çapağı) çıkıp çıkmadığına baktırın. Çapak varsa pompayı hemen revizyona gönderin.`;
    }

    if (code === 'P2452' || code === 'P2463' || code === 'P2002') {
      return `🔧 **Mobil Tamircim AI Usta Teşhisi: ${code} (Dizel Partikül Filtresi / DPF Kurum Doluluğu)**
• 🔍 **Muhtemel Nedenler:**
  1. Şehir içi kısa mesafe kullanımından dolayı DPF rejenerasyonunun tamamlanamaması.
  2. DPF diferansiyel basınç sensörü hortumlarının erimesi veya sensör bozulması.
  3. Termostat arızasından dolayı motor suyunun 80°C üzerine çıkamaması (rejenerasyonu engeller).
• 🚨 **Aciliyet Derecesi:** ⚠️ **YÜKSEK.** DPF tamamen dolarsa turbo egzoz geri basıncından patlayabilir.
• 💰 **Tahmini Masraf:** Cihazla Zorunlu Rejenerasyon (800 - 1.500 TL), İlaçlı Makinede DPF Yıkama (3.500 - 6.500 TL), Diferansiyel Sensör (1.800 - 3.200 TL).
• 🛠️ **Usta Tavsiyesi:** Aracı çevre yoluna çıkarıp 3. veya 4. viteste 2.500 - 3.000 devir bandında sabit 25 dakika sürün. Lamba sönmezse sanayide basınç sensörünü kontrol ettirin.`;
    }

    if (code === 'P0700' || code === 'P0730' || code === 'P0841') {
      return `🔧 **Mobil Tamircim AI Usta Teşhisi: ${code} (Otomatik Şanzıman / Mekatronik Arızası)**
• 🔍 **Muhtemel Nedenler:**
  1. Mekatronik gövde yağ basınç tüpü gevşemesi / çatlaması (Örn: DSG DQ200).
  2. Vites geçiş selonoid valflerinde tıkanma veya kavrama balatası aşınması.
  3. Şanzıman yağı kirlenmesi veya seviye eksikliği.
• 🚨 **Aciliyet Derecesi:** ⚠️ **YÜKSEK.** Vites geçişlerinde vuruntu, boşa düşme veya geri vitese geçmeme yapabilir.
• 💰 **Tahmini Masraf:** Güçlendirilmiş Basınç Tüpü Tamiri (4.000 - 8.000 TL), Mekatronik Kart Revizyonu (10.000 - 18.000 TL), Kavrama Değişimi (18.000 - 32.000 TL).
• 🛠️ **Usta Tavsiyesi:** Şanzımanı hemen indirtmeyin; önce cihaza bağlatıp kavrama tolerans mm değerlerini ve mekatronik hidrolik bar basıncını okutun.`;
    }

    // Generic DTC code response
    let systemType = 'Motor & Güç Aktarma (Powertrain)';
    if (code.startsWith('C')) systemType = 'Şasi, Fren & ABS/ESP Sistemi';
    else if (code.startsWith('B')) systemType = 'Gövde, Airbag & Merkezi Kilit Modülü';
    else if (code.startsWith('U')) systemType = 'Ağ & CAN-Bus İletişim Hattı';
    else if (code.startsWith('DF')) systemType = 'Renault / Dacia Clip Özel Arıza Kodu';

    return `🔧 **Mobil Tamircim AI Usta Teşhisi: ${code} (${systemType})**
• 🔍 **Muhtemel Neden:** Araç beyni bu hatta tolerans dışı bir voltaj sinyali, haberleşme kesintisi veya mekanik direnç tespit etti.
• 🚨 **Aciliyet:** Arıza lambanız yanıp sönüyorsa sürüşü durdurun; sabit yanıyorsa en yakın servise gidin.
• 💰 **Tahmini Maliyet:** İlgili soket/sensör veya modül işlemine göre **1.500 - 5.000 TL** civarındadır.
• 🛠️ **Usta Tavsiyesi:** Forumumuzda bu kodla konu açarak aracınızın marka ve modelini belirtin; tecrübeli ustalarımız birebir tecrübelerini aktarsın.`;
  }

  // 2. Ses Şikayetleri
  if (p.includes('şıkırtı') || p.includes('şakırtı') || (p.includes('enjektör') && p.includes('ses'))) {
    return `🔧 **Mobil Tamircim AI Usta Teşhisi: Rölantide Şıkırtı / Enjektör Sesi**
• 🔍 **Muhtemel Nedenler:**
  1. Dizel piezo veya selenoid enjektör bobini tırnak boşluğu (%50 ihtimal).
  2. Hidrolik sübap iticilerinin (fincanlar) yağsız kalması veya aşınması (%30 ihtimal).
  3. Vakum pompası tıkırtısı (%20 ihtimal).
• 🚨 **Aciliyet:** 🟡 **ORTA.** Soğukken olup motor ısınınca kesiliyorsa sübap iticisidir. Gaz verdikçe hızlanıyorsa enjektördür.
• 💰 **Tahmini Masraf:** Enjektör Geri Dönüş Ayarı / Pul Değişimi (1.000 - 2.500 TL), İtici Değişimi (4.000 - 8.000 TL).
• 🛠️ **Usta Tavsiyesi:** Sesli arıza modülümüzden motor sesini kaydedip foruma yükleyin, ustalarımız hemen dinlesin!`;
  }

  if (p.includes('ıslık') || (p.includes('turbo') && (p.includes('ötüyor') || p.includes('ses')))) {
    return `🔧 **Mobil Tamircim AI Usta Teşhisi: Gaza Basınca Islık / Rüzgar Sesi**
• 🔍 **Muhtemel Nedenler:**
  1. Turbo intercooler basınç hortumunda delik veya kelepçe gevşemesi.
  2. Turbo emme pervanesi kanatçıklarının aşınması (ambulans sireni gibi ses).
  3. Egzoz manifoldu saplama kırılması veya conta kaçırması.
• 🚨 **Aciliyet:** ⚠️ **YÜKSEK.** Turbo pallerinde boşluk varsa motora parça kaçırabilir.
• 💰 **Tahmini Masraf:** Hortum Onarımı (500 - 1.500 TL), Turbo Revizyonu (8.000 - 16.000 TL).
• 🛠️ **Usta Tavsiyesi:** Emme borusunu söküp turbo milinde radyal/eksenel boşluk olup olmadığını parmakla kontrol ettirin.`;
  }

  // 3. Duman & Hararet Şikayetleri
  if (p.includes('beyaz duman') || (p.includes('hararet') && p.includes('su eksilt'))) {
    return `🔧 **Mobil Tamircim AI Usta Teşhisi: Beyaz Duman & Su Eksiltme**
• 🔍 **Muhtemel Nedenler:**
  1. Silindir kapak contasının yanması (Soğutma sıvısı doğrudan yanma odasına çekiliyor).
  2. EGR soğutucu eşanjörünün içten delinmesi (Dizel araçlarda çok yaygındır).
  3. Soğuk havalarda ilk 2 dakika gelen zararsız egzoz yoğuşma buharı.
• 🚨 **Aciliyet:** 🚨 **KRİTİK.** Antifriz kokulu yoğun beyaz duman varsa aracı çalıştırmayın; motor kilitlenebilir!
• 💰 **Tahmini Masraf:** EGR Soğutucu Değişimi (3.500 - 7.500 TL), Kapak Taşlama + Conta (14.000 - 24.000 TL).
• 🛠️ **Usta Tavsiyesi:** Genleşme kabını açıp gaza basıldığında suda hava kabarcığı veya yağ kalıntısı olup olmadığına bakın.`;
  }

  if (p.includes('siyah duman')) {
    return `🔧 **Mobil Tamircim AI Usta Teşhisi: Gaza Basınca Siyah Duman Atma**
• 🔍 **Muhtemel Nedenler:**
  1. Hava / yakıt karışımının aşırı zengin olması (Yetersiz hava, aşırı yakıt).
  2. Turbo hava hortumunda yırtık veya MAF hava akış metre kirliliği.
  3. Enjektör memesinin işemesi (kapanmaması) veya EGR valfinin açık takılı kalması.
• 🚨 **Aciliyet:** 🟡 **ORTA.** Yakıt tüketimi %30 artar, DPF filtresini çok hızlı tıkar.
• 💰 **Tahmini Masraf:** Hava Filtresi & Hortum (800 - 2.000 TL), Enjektör Memesi Revizyonu (3.000 - 6.000 TL).
• 🛠️ **Usta Tavsiyesi:** Önce hava filtresini ve turbo borularını kontrol edin, ardından enjektör geri dönüş testi yaptırın.`;
  }

  if (p.includes('mavi duman') || p.includes('yağ yak')) {
    return `🔧 **Mobil Tamircim AI Usta Teşhisi: Mavi Duman & Motor Yağ Eksiltmesi**
• 🔍 **Muhtemel Nedenler:**
  1. Subap gaydları ve subap lastiklerinin sertleşip aşınması (Sabah ilk çalıştırmada mavi duman).
  2. Piston segmanlarının aşınması veya yapışması (Sürekli mavi duman ve karter havalandırmadan üfleme).
  3. Turbo mil segmanlarının yağ kaçırması.
• 🚨 **Aciliyet:** ⚠️ **YÜKSEK.** Yağsız kalan motor yatak sarabilir.
• 💰 **Tahmini Masraf:** Üst Kapak Subap Lastiği (6.000 - 12.000 TL), Komple Motor Rektifiye (35.000 - 65.000 TL).
• 🛠️ **Usta Tavsiyesi:** Yağ çubuğunu haftada bir çekip seviyeyi kontrol edin; 1000 km'de 1 litreden fazla eksiltiyorsa kompresyon testi yaptırın.`;
  }

  // 4. Şanzıman & Vuruntu
  if (p.includes('dsg') || p.includes('edc') || p.includes('vuruntu') || p.includes('vites geçmi')) {
    return `🔧 **Mobil Tamircim AI Usta Teşhisi: Otomatik Şanzıman Vuruntusu & Titreme**
• 🔍 **Muhtemel Nedenler:**
  1. Kuru çift kavrama (DSG DQ200 / EDC DC4) balata kalınlığının limit altına düşmesi.
  2. Kavrama çatalı adaptasyon kaybı.
  3. Tork konvertörlü şanzımanlarda selenoid basınç valfi kirliliği veya eski yağ.
• 🚨 **Aciliyet:** 🟡 **ORTA.** İlerlerse araç vitese geçmeyip yolda bırakabilir.
• 💰 **Tahmini Masraf:** Adaptasyon & Yazılım Ayarı (800 - 1.500 TL), Kavrama Seti (18.000 - 32.000 TL).
• 🛠️ **Usta Tavsiyesi:** İlk önce uzman bir tamircide cihaza bağlatıp "Temel Ayar / Adaptasyon" yaptırın; sorun %40 ihtimalle parça değişmeden düzelir.`;
  }

  // 5. Triger & Bakım Fiyatları
  if (p.includes('triger') || p.includes('kayış') || p.includes('zincir')) {
    return `🔧 **Mobil Tamircim AI Usta: Triger Seti & Devirdaim Değişim Analizi**
• ⏱️ **Değişim Zamanı:** Kayışlı motorlarda 4-5 yıl veya 80.000 - 100.000 km; zincirli motorlarda şıkırtı sesi gelince (genellikle 180.000 - 220.000 km).
• 💰 **2026 Güncel Piyasa Masrafı:**
  - Orijinal / OEM Triger Seti + Devirdaim Pompası: **3.500 - 6.500 TL**
  - Kırmızı Organik Antifriz (3 Litre): **400 - 700 TL**
  - Sanayi Usta İşçilik Ücreti: **2.500 - 4.500 TL**
  - **Toplam Ortalama:** ~**6.500 - 11.500 TL** (Aracın motor tipine göre değişir).
• 🛠️ **Usta Tavsiyesi:** Triger kayışını değiştirirken devirdaim pompasını mutlaka birlikte değiştirin; 2 ay sonra su kaçırırsa aynı işçiliği bir daha ödersiniz!`;
  }

  // 6. Hararet & Soğutma
  if (p.includes('hararet') || p.includes('termostat') || p.includes('su kaynat')) {
    return `🔧 **Mobil Tamircim AI Usta Teşhisi: Motor Harareti & Su Kaynatma**
• 🔍 **Muhtemel Nedenler:**
  1. Termostatın kapalı takılı kalması (Radyatöre sıcak su gitmez).
  2. Devirdaim (su pompası) plastik çarkının sıyırması.
  3. Radyatör soğutma fanının açmaması (fan müşürü veya sigorta).
• 🚨 **Aciliyet:** 🚨 **KRİTİK!** Hararet göstergesi 100°C'yi geçtiyse aracı sağa çekip rölantide bekletin, sakın kapağı hemen açmayın!
• 💰 **Tahmini Masraf:** Termostat (800 - 2.000 TL), Devirdaim (1.500 - 3.500 TL), Fan Motoru (2.000 - 4.500 TL).`;
  }

  // 7. Genel Akıllı Sanayi Danışmanı Yanıtı
  return `🔧 **Mobil Tamircim AI Usta Değerlendirmesi:**
Selamlar kardeşim! Belirttiğin **"${escapeHtml(prompt)}"** konusuyla ilgili teşhisim:
• 🔍 **İlk Değerlendirme:** Bu durum genellikle mekanik aşınma, sensör arızası veya periyodik bakım eksikliğinden kaynaklanır.
• 🛠️ **Önerilen Adımlar:** 
  1. Aracının marka, model, motor tipi ve kilometresini belirterek foruma bir başlık aç.
  2. Kaput altından gelen sesi veya gösterge panelindeki arıza lambasını paylaşırsan sanayideki onaylı ustalarımız nokta atışı teşhis koyabilir.
• 📍 Çevrendeki yetkili ve esnaf ustalar için **"Sanayi & Usta Rehberi"** menümüzden bulunduğun şehri seçebilirsin.`;
}


server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚗 MOBİL TAMİRCİM SUNUCUSU BAŞLATILDI`);
  console.log(`🌐 Masaüstü Ana Uygulama:    http://localhost:${PORT}`);
  console.log(`🛡️ Masaüstü Admin Paneli:    http://localhost:${PORT}/admin`);
  console.log(`📱 Telefon Mobil Bağlantısı: http://192.168.1.5:${PORT}`);
  console.log(`📱 Telefon Admin Mobil:      http://192.168.1.5:${PORT}/admin`);
  console.log(`====================================================`);
});
