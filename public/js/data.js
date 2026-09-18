// OTO SANAYİ FORUMU - STATİK & YARDIMCI VERİLER

const APP_DATA = {
  brands: [
    { id: 'volkswagen', name: 'Volkswagen', logo: '🚗', popularModels: ['Golf', 'Passat', 'Polo', 'Tiguan', 'Jetta'] },
    { id: 'renault', name: 'Renault', logo: '🚗', popularModels: ['Clio', 'Megane', 'Fluence', 'Captur', 'Talisman'] },
    { id: 'fiat', name: 'Fiat', logo: '🚗', popularModels: ['Egea', 'Linea', 'Punto', 'Doblo', 'Fiorino'] },
    { id: 'bmw', name: 'BMW', logo: '🚗', popularModels: ['3 Serisi (F30/G20)', '5 Serisi (F10/G30)', '1 Serisi', 'X5'] },
    { id: 'mercedes', name: 'Mercedes-Benz', logo: '🚗', popularModels: ['C Serisi (W205)', 'E Serisi (W213)', 'A Serisi', 'CLA'] },
    { id: 'ford', name: 'Ford', logo: '🚗', popularModels: ['Focus', 'Fiesta', 'Mondeo', 'Transit', 'Kuga'] },
    { id: 'toyota', name: 'Toyota', logo: '🚗', popularModels: ['Corolla', 'Yaris', 'C-HR', 'Auris', 'RAV4'] },
    { id: 'honda', name: 'Honda', logo: '🚗', popularModels: ['Civic', 'City', 'CR-V', 'Accord'] },
    { id: 'hyundai', name: 'Hyundai', logo: '🚗', popularModels: ['i20', 'i30', 'Tucson', 'Elantra', 'Accent Blue'] },
    { id: 'peugeot', name: 'Peugeot', logo: '🚗', popularModels: ['208', '308', '3008', '508', '2008'] },
    { id: 'audi', name: 'Audi', logo: '🚗', popularModels: ['A3', 'A4', 'A6', 'Q3', 'Q5'] },
    { id: 'opel', name: 'Opel', logo: '🚗', popularModels: ['Astra', 'Corsa', 'Insignia', 'Mokka'] }
  ],

  obdCodes: [
    // 1. Motor, Hava & Yakıt Sistemi (P00xx - P02xx)
    { code: 'P0010', category: 'Motor, Hava & Yakıt', title: 'Eksantrik Mili Konum Aktüatörü Devresi (Sıra 1)', desc: 'VVT / Vanos selenoid valfi arızası veya yağ kanalı tıkanıklığı.' },
    { code: 'P0011', category: 'Motor, Hava & Yakıt', title: 'Eksantrik Mili Zamanlama Aşırı İleri (Sıra 1)', desc: 'Eksantrik mil ayar mekanizması veya düşük motor yağ basıncı.' },
    { code: 'P0016', category: 'Motor, Hava & Yakıt', title: 'Krank Mili - Eksantrik Mili Senkronizasyon Hatası', desc: 'Triger zinciri uzaması, senteden atlama veya sensör arızası.' },
    { code: 'P0030', category: 'Motor, Hava & Yakıt', title: 'Oksijen (O2) Sensörü Isıtıcı Devresi (Sıra 1 Sensör 1)', desc: 'Katalizör öncesi lambda sensörü ısıtıcı rezistans arızası.' },
    { code: 'P0087', category: 'Motor, Hava & Yakıt', title: 'Yakıt Dağıtım Yolu (Rail) Basıncı Çok Düşük', desc: 'Yüksek basınç pompası (CP4 vb.), tıkalı mazot filtresi veya rail müşürü.' },
    { code: 'P0088', category: 'Motor, Hava & Yakıt', title: 'Yakıt Dağıtım Yolu (Rail) Basıncı Çok Yüksek', desc: 'Rail basınç regülatörü sıkışması veya geri dönüş hattı tıkanıklığı.' },
    { code: 'P0100', category: 'Motor, Hava & Yakıt', title: 'Hava Akış (MAF) Sensörü Devre Arızası', desc: 'Kütle hava akış metre soketi temassızlığı veya sensör bozulması.' },
    { code: 'P0101', category: 'Motor, Hava & Yakıt', title: 'Hava Akış (MAF) Sensörü Performans Sorunu', desc: 'Hava filtresi aşırı kirli, emme hortumunda yırtık/kaçak veya kirli MAF.' },
    { code: 'P0102', category: 'Motor, Hava & Yakıt', title: 'Hava Akış (MAF) Sensörü Düşük Sinyal', desc: 'Kablo kopukluğu veya sensör iç elemanı hasarı.' },
    { code: 'P0110', category: 'Motor, Hava & Yakıt', title: 'Emme Havası Sıcaklık Sensörü (IAT) Devresi', desc: 'Emme manifold hava sıcaklık sensörü arızalı.' },
    { code: 'P0115', category: 'Motor, Hava & Yakıt', title: 'Motor Soğutma Suyu Hararet Sensörü Devresi (ECT)', desc: 'Hararet müşürü arızası, kablo kopukluğu veya termostat açık kalması.' },
    { code: 'P0120', category: 'Motor, Hava & Yakıt', title: 'Gaz Kelebeği / Pedal Konum Sensörü A Devresi', desc: 'Potansiyometre aşınması veya kelebek boğazı karbon birikimi.' },
    { code: 'P0128', category: 'Motor, Hava & Yakıt', title: 'Termostat Arızası (Motor Geç Isınıyor)', desc: 'Termostat açık konumda kilitli kalmış, motor ideal çalışma ısısına ulaşamıyor.' },
    { code: 'P0130', category: 'Motor, Hava & Yakıt', title: 'Oksijen (Lambda) Sensörü Devre Arızası (Sıra 1 Sensör 1)', desc: 'Egzoz manifoldu kaçakları veya sensör elemanı bozulması.' },
    { code: 'P0171', category: 'Motor, Hava & Yakıt', title: 'Sistem Çok Fakir (Sıra 1 - System Too Lean)', desc: 'Vakum hortumu kaçağı, MAF sensörü kirliliği veya yakıt basıncı düşüklüğü.' },
    { code: 'P0172', category: 'Motor, Hava & Yakıt', title: 'Sistem Çok Zengin (Sıra 1 - System Too Rich)', desc: 'Damlatan enjektör, tıkalı hava filtresi veya yüksek yakıt basıncı.' },
    { code: 'P0201', category: 'Motor, Hava & Yakıt', title: '1. Silindir Enjektör Devresi Açık / Arızalı', desc: 'Enjektör kablo soket temassızlığı veya piezo bobin arızası.' },
    { code: 'P0202', category: 'Motor, Hava & Yakıt', title: '2. Silindir Enjektör Devresi Açık / Arızalı', desc: '2. silindir enjektör kablo veya bobin arızası.' },
    { code: 'P0203', category: 'Motor, Hava & Yakıt', title: '3. Silindir Enjektör Devresi Açık / Arızalı', desc: '3. silindir enjektör kablo veya bobin arızası.' },
    { code: 'P0204', category: 'Motor, Hava & Yakıt', title: '4. Silindir Enjektör Devresi Açık / Arızalı', desc: '4. silindir enjektör kablo veya bobin arızası.' },
    { code: 'P0234', category: 'Motor, Hava & Yakıt', title: 'Turboşarj Aşırı Basınç Durumu (Overboost)', desc: 'Turbo georadyal kanatçık (VNT) sıkışması, N75 valfi arızası veya wastegate.' },
    { code: 'P0299', category: 'Motor, Hava & Yakıt', title: 'Turboşarj Düşük Basınç (Underboost)', desc: 'Turbo wastegate kaçırma, intercooler hortum yırtığı veya vakum tüpü arızası.' },

    // 2. Ateşleme & Yanma Kaçırma (P03xx)
    { code: 'P0300', category: 'Ateşleme & Silindir Kaçırma', title: 'Çoklu / Rastgele Silindir Ateşleme Kaçırma (Misfire)', desc: 'Ateşleme bobini, bujiler, sübap kaçağı veya enjektör arızası kaynaklı.' },
    { code: 'P0301', category: 'Ateşleme & Silindir Kaçırma', title: '1. Silindirde Ateşleme Kaçırma Algılandı', desc: '1. silindir buji/bobin veya kompresyon düşüklüğü.' },
    { code: 'P0302', category: 'Ateşleme & Silindir Kaçırma', title: '2. Silindirde Ateşleme Kaçırma Algılandı', desc: '2. silindir buji/bobin veya kompresyon düşüklüğü.' },
    { code: 'P0303', category: 'Ateşleme & Silindir Kaçırma', title: '3. Silindirde Ateşleme Kaçırma Algılandı', desc: '3. silindir buji/bobin veya kompresyon düşüklüğü.' },
    { code: 'P0304', category: 'Ateşleme & Silindir Kaçırma', title: '4. Silindirde Ateşleme Kaçırma Algılandı', desc: '4. silindir buji/bobin veya kompresyon düşüklüğü.' },
    { code: 'P0325', category: 'Ateşleme & Silindir Kaçırma', title: 'Vuruntu Sensörü 1 Devre Arızası (Knock Sensor)', desc: 'Sensör gevşemesi, kablo aşınması veya iç devre kopukluğu.' },
    { code: 'P0335', category: 'Ateşleme & Silindir Kaçırma', title: 'Krank Mili Konum Sensörü (CKP) Devresi', desc: 'Motor marş basıp çalışmıyor veya ani stop ediyor; volan dişli okuyucu arızası.' },
    { code: 'P0340', category: 'Ateşleme & Silindir Kaçırma', title: 'Eksantrik Mili Konum Sensörü (CMP) Devresi', desc: 'Eksantrik mil okuyucu sensör arızası veya tesisat kopukluğu.' },

    // 3. Emisyon, Egzoz, EGR & DPF (P04xx, P20xx - P24xx)
    { code: 'P0400', category: 'Egzoz, EGR & DPF Filtresi', title: 'EGR Egzoz Gazı Geri Çevrim Akış Arızası', desc: 'EGR valfi karbon ve kurum birikimi sebebiyle tıkanmış.' },
    { code: 'P0401', category: 'Egzoz, EGR & DPF Filtresi', title: 'EGR Valfi Yetersiz Akış Algılandı', desc: 'EGR borusu veya soğutucusu kurum bağlamış, temizlik gerekir.' },
    { code: 'P0403', category: 'Egzoz, EGR & DPF Filtresi', title: 'EGR Kontrol Devresi Arızası', desc: 'EGR selenoid veya elektrikli motor bobini yanmış/kopuk.' },
    { code: 'P0420', category: 'Egzoz, EGR & DPF Filtresi', title: 'Katalitik Konvertör Verim Eşiği Altında (Sıra 1)', desc: 'Katalizör petek erimesi/tıkanıklığı veya arka oksijen sensörü yanılsaması.' },
    { code: 'P0430', category: 'Egzoz, EGR & DPF Filtresi', title: 'Katalitik Konvertör Verim Eşiği Altında (Sıra 2)', desc: 'V6/V8 motorlarda 2. sıra katalizör performans kaybı.' },
    { code: 'P0442', category: 'Egzoz, EGR & DPF Filtresi', title: 'EVAP Depo Havalandırma Küçük Gaz Kaçağı', desc: 'Depo kapağı contası yırtık veya kanister havalandırma valfi sızdırıyor.' },
    { code: 'P2002', category: 'Egzoz, EGR & DPF Filtresi', title: 'Dizel Partikül Filtresi (DPF) Verim Eşiği Altında', desc: 'DPF petek çatlağı, aşırı kurum veya rejenerasyon yetersizliği.' },
    { code: 'P20EE', category: 'Egzoz, EGR & DPF Filtresi', title: 'SCR AdBlue NOx Katalizör Verim Hatası', desc: 'AdBlue enjektörü kristalleşmiş veya NOx sensörü arızalı.' },
    { code: 'P2452', category: 'Egzoz, EGR & DPF Filtresi', title: 'DPF Diferansiyel Basınç Sensörü Devresi', desc: 'DPF giriş-çıkış silikon hortumları erimiş veya sensör bozulmuş.' },
    { code: 'P2463', category: 'Egzoz, EGR & DPF Filtresi', title: 'DPF Kurum Birikimi - Filtre Aşırı Dolu', desc: 'Acil DPF rejenerasyonu veya profesyonel partikül temizliği gereklidir.' },

    // 4. Rölanti, Hız Sensörleri & Beyin/ECU (P05xx - P06xx)
    { code: 'P0500', category: 'Rölanti, Hız & Beyin (ECU)', title: 'Araç Hız Sensörü (VSS) Arızası', desc: 'Hız göstergesi çalışmıyor, ABS modülü veya şanzıman hız sensörü hatası.' },
    { code: 'P0505', category: 'Rölanti, Hız & Beyin (ECU)', title: 'Rölanti Kontrol Sistemi Arızası (IAC)', desc: 'Rölanti motoru arızalı veya boğaz kelebeğinde hava kaçağı.' },
    { code: 'P0520', category: 'Rölanti, Hız & Beyin (ECU)', title: 'Motor Yağ Basınç Sensörü / Şalteri Devresi', desc: 'Yağ basınç müşürü bozuk veya motor yağ pompası aşınmış.' },
    { code: 'P0562', category: 'Rölanti, Hız & Beyin (ECU)', title: 'Sistem Voltajı Düşük', desc: 'Alternatör (şarj dinamosu) şarj etmiyor veya akü ömrü tükenmiş.' },
    { code: 'P0606', category: 'Rölanti, Hız & Beyin (ECU)', title: 'ECM / PCM Motor Kontrol Beyin İşlemci Hatası', desc: 'Motor beyni iç mikroişlemci iletişim veya besleme arızası.' },

    // 5. Şanzıman & Aktarma (P07xx - P09xx)
    { code: 'P0700', category: 'Şanzıman & Aktarma Organları', title: 'Otomatik Şanzıman Kontrol Sistemi Arızası', desc: 'Şanzıman beyni (TCM) hata kaydetti, vites koruma moduna geçti.' },
    { code: 'P0705', category: 'Şanzıman & Aktarma Organları', title: 'Şanzıman Vites Konum Şalteri (PRNDL Girişi)', desc: 'Vites kolu şalteri ayarsız veya vites konumu algılanamıyor.' },
    { code: 'P0715', category: 'Şanzıman & Aktarma Organları', title: 'Şanzıman Giriş / Türbin Hız Sensörü Devresi', desc: 'Tork konvertör veya giriş mili devir sensörü okumuyor.' },
    { code: 'P0730', category: 'Şanzıman & Aktarma Organları', title: 'Yanlış Vites Oranı (Vites Geçiş Uyumsuzluğu)', desc: 'Otomatik şanzıman balataları kaçırıyor veya selenoid takılı kalmış.' },
    { code: 'P0740', category: 'Şanzıman & Aktarma Organları', title: 'Tork Konvertör Debriyaj (TCC) Selenoid Devresi', desc: 'Tork konvertör kilitlenemiyor, aşırı şanzıman ısınması.' },
    { code: 'P0841', category: 'Şanzıman & Aktarma Organları', title: 'Şanzıman Yağ Basınç Sensörü / Anahtarı Aralığı', desc: 'Mekatronik gövde yağ basıncı düşük veya selenoid kaçırıyor.' },

    // 6. Şasi, Fren & ABS / ESP (C0xxx - C1xxx)
    { code: 'C0035', category: 'Şasi, Fren & ABS/ESP', title: 'Sol Ön Tekerlek Hız Sensörü Devresi (ABS)', desc: 'ABS tekerlek sensörü kablosu sürtmüş veya porya rulman manyetiği bozuk.' },
    { code: 'C0040', category: 'Şasi, Fren & ABS/ESP', title: 'Sağ Ön Tekerlek Hız Sensörü Devresi (ABS)', desc: 'Sağ ön ABS sensör arızası veya soket korozyonu.' },
    { code: 'C0045', category: 'Şasi, Fren & ABS/ESP', title: 'Sol Arka Tekerlek Hız Sensörü Devresi (ABS)', desc: 'Sol arka ABS sensör arızası.' },
    { code: 'C0050', category: 'Şasi, Fren & ABS/ESP', title: 'Sağ Arka Tekerlek Hız Sensörü Devresi (ABS)', desc: 'Sağ arka ABS sensör arızası.' },
    { code: 'C1201', category: 'Şasi, Fren & ABS/ESP', title: 'Motor Kontrol Sistemi Hatası Nedeniyle ABS İptali', desc: 'Motor arıza lambası yandığı için ABS/ESP kendini emniyete aldı.' },
    { code: 'C1288', category: 'Şasi, Fren & ABS/ESP', title: 'Fren Basınç Sensörü Ana Devre Arızası', desc: 'ABS hidrolik blok iç basınç sensörü arızalı (ESP devre dışı).' },

    // 7. Gövde, Airbag & Konfor (B0xxx - B1xxx)
    { code: 'B0001', category: 'Gövde, Airbag & Güvenlik', title: 'Sürücü Ön Hava Yastığı Dağıtım Kontrolü', desc: 'Direksiyon zembereği (airbag sargısı) kopuk veya soket gevşek.' },
    { code: 'B0028', category: 'Gövde, Airbag & Güvenlik', title: 'Sağ Yan Hava Yastığı Dağıtım Kontrolü', desc: 'Koltuk altı airbag sarı soketi temassızlığı (kronik sanayi arızası).' },
    { code: 'B1000', category: 'Gövde, Airbag & Güvenlik', title: 'Gövde Kontrol Modülü (BCM) Donanım Arızası', desc: 'Konfor beyni / sigorta kutusu dahili elektronik arızası.' },
    { code: 'B1318', category: 'Gövde, Airbag & Güvenlik', title: 'Gövde Modülü Akü Voltajı Çok Düşük', desc: 'Merkezi kilit, camlar veya aydınlatma modülü düşük voltaj hatası.' },

    // 8. Ağ, CAN-Bus & Haberleşme (U0xxx - U1xxx)
    { code: 'U0001', category: 'Ağ & CAN-Bus İletişim', title: 'Yüksek Hızlı CAN İletişim Veri Yolu Hatası (Bus-Off)', desc: 'CAN-H veya CAN-L hatlarında şaseye kısa devre veya hat kopukluğu.' },
    { code: 'U0100', category: 'Ağ & CAN-Bus İletişim', title: 'Motor Kontrol Modülü (ECM) ile İletişim Kaybı', desc: 'Motor beyni ana besleme rölesi, sigortası veya CAN tesisatı kopuk.' },
    { code: 'U0101', category: 'Ağ & CAN-Bus İletişim', title: 'Şanzıman Kontrol Modülü (TCM) ile İletişim Kaybı', desc: 'Şanzıman mekatronik beynine elektrik gitmiyor veya haberleşme kesik.' },
    { code: 'U0121', category: 'Ağ & CAN-Bus İletişim', title: 'Fren / ABS Kontrol Modülü ile İletişim Kaybı', desc: 'ABS beyni soketi oksitlenmiş veya besleme hattı kesilmiş.' },
    { code: 'U0140', category: 'Ağ & CAN-Bus İletişim', title: 'Gövde Kontrol Modülü (BCM) ile İletişim Kaybı', desc: 'İç konfor beyni ile gösterge/motor arasındaki ağ kopukluğu.' },
    { code: 'U0401', category: 'Ağ & CAN-Bus İletişim', title: 'Motor Kontrol Modülünden Geçersiz Veri Alındı', desc: 'Şanzıman veya ABS beyni motordan gelen tork/devir verisini doğrulayamıyor.' }
  ],

  cities: [
    { name: 'İstanbul', sanayiler: ['Maslak Atatürk Oto Sanayi', 'İkitelli Bağcılar-Güngören', 'Bostancı Oto Sanayi', 'Ümraniye Kadosan', 'Kartal Oto Sanayi'] },
    { name: 'Ankara', sanayiler: ['Şaşmaz Oto Sanayi', 'İvedik Organize Sanayi', 'Ostim Sanayi Sitesi', 'Erciyes Oto Sanayi'] },
    { name: 'İzmir', sanayiler: ['1. Sanayi Sitesi', '2. Sanayi Sitesi', '3. Sanayi Sitesi', '6. Sanayi Sitesi', 'Çiğli Ata Sanayi'] },
    { name: 'Bursa', sanayiler: ['Nilüfer Küçük Sanayi', 'Otosansit Sanayi Sitesi', 'Beşevler Sanayi'] },
    { name: 'Antalya', sanayiler: ['Akdeniz Sanayi Sitesi', 'Yeşil Sanayi Sitesi'] },
    { name: 'Kocaeli', sanayiler: ['İzmit Sanayi Sitesi', 'Gebze Küçük Sanayi'] }
  ],

  levelThresholds: {
    cirak: { min: 0, max: 99, title: 'Çırak', badgeClass: 'badge-level-cirak' },
    kalfa: { min: 100, max: 299, title: 'Kalfa', badgeClass: 'badge-level-kalfa' },
    usta: { min: 300, max: 699, title: 'Usta', badgeClass: 'badge-level-usta' },
    master: { min: 700, max: 99999, title: 'Master', badgeClass: 'badge-level-master' }
  }
};
