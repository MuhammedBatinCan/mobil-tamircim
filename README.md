# 🚗 Mobil Tamircim & Mobil Yönetici Paneli

Türkiye'nin ilk ve tek; araç sahipleri, sanayi esnafları, ustalar ve galericiler için özel olarak geliştirilmiş **Yeni Nesil Otomotiv & Mobil Tamirci Ekosistemi**.

---

## 🌟 Öne Çıkan Özellikler

### 1. 🎖️ Gelişmiş Rol & Rozet Sistemi
* 🔧 **Onaylı Tamirci Rozeti (`verified_mechanic`):** Sanayi esnafı ve ustalığı tescillenmiş üyelere özel altın anahtar rozeti.
* 💻 **Developer Rozeti (`developer`):** Platform geliştiricisine özel siber mavi/mor parıltılı rozet.
* 🧪 **Beta Tester Rozeti (`beta_tester`):** Erken aşama test kullanıcılarına özel yeşil/amber rozet.
* 🏢 **Onaylı Galerici Rozeti (`verified_dealer`):** Ticaret Bakanlığı yetki belgeli otomotiv galericilerine özel kurumsal rozet.
* 🛡️ **Doğrulanmış Kullanıcı Rozeti (`verified_user`):** Kimlik ve araç ruhsatı doğrulanmış güvenli kullanıcı rozeti.
* ⭐ **Rütbe & Seviye Sistemi (Gamification):**
  - 🔩 **Çırak:** 0 - 99 XP
  - ⚙️ **Kalfa:** 100 - 299 XP
  - 🛠️ **Usta:** 300 - 699 XP
  - 🏆 **Master:** 700+ XP
  *(Yorum yaptıkça +10 XP, konu açtıkça +15 XP, en iyi çözüm seçildikçe +50 XP)*

### 2. 🚘 Profilde Türk Araç Plakası & Araç Garajı
* Kullanıcı profillerinde ve paylaştıkları konularda mavi TR şeritli orijinal kabartmalı araç plakası (Örn: `34 USTA 1978`) ve araç modeli gösterimi.

### 3. 🔒 Gönderi Yorum İzni Kısıtlaması (Bilgi Kirliliğine Son!)
* Konu açan kişi **"Yalnızca Onaylı Tamirciler Yorumlayabilir"** seçeneğini seçebilir.
* Bu durumda normal üyeler yorum yazamaz, yalnızca sistemde kayıtlı onaylı ustalar teşhis ve çözüm sunabilir.

### 4. 🤖 Akıllı & İnsan Odaklı Yapay Zeka Denetimi (Human-in-the-Loop)
* Kullanıcıyı yormaz, samimi sanayi jargonunu anlayışla karşılar.
* **Asla otomatik ban atmaz!** Ağır hakaret, dolandırıcılık veya spam sezdiğinde içeriği işaretleyip yöneticinin cep telefonundaki **Admin Onay Kuyruğu**na gönderir.
* Yönetici: `[Banla]`, `[Yorumu Sil]`, `[Uyarı Ver]`, `[Yoksay]` butonlarıyla tek dokunuşla karar verir.

### 5. 🤖 "Mobil Tamircim AI Usta" (Yapay Zeka Arıza & Masraf Danışmanı)
* Kullanıcı kaputun altından gelen sesi veya OBD kodunu (P0300, P0420, P0700 vb.) yazdığında anında en olası 3 sebebi, aciliyet derecesini ve tahmini parça/işçilik masrafını döker.

### 6. 🎙️ Sesli Arıza & Teşhis & "Çözüldü" Rozeti
* Kaput altı motor ses kayıtları dinlenebilir.
* Konu sahibi en doğru cevabı **"Doğrulanmış Çözüm Olarak Onayla"** butonuyla konunun en tepesine sabitler (+50 XP).

### 7. 📍 İl / İlçe Sanayi & Usta Rehberi
* İstanbul (Maslak, İkitelli), Ankara (Şaşmaz, Ostim), İzmir (1. Sanayi), Bursa (Nilüfer) vb. sanayi siteleri bazlı usta arama, tek tıkla arama ve WhatsApp iletişim butonları.

### 8. 💰 Piyasa Fiyat Analizi ("Piyasa Ne Diyor?")
* Triger seti, baskı balata, periyodik bakım gibi işlemlerin ortalama parça ve işçilik fiyatları, kullanıcı fiyat paylaşımları.

### 9. 🚨 SOS Modülü (Yolda Kaldım Acil Yardım Radarı)
* Yolda kalan sürücüler için konumlu acil durum çağrısı ve nöbetçi esnaf ağı.

### 10. 📱 Bağımsız Mobil Yönetici Paneli (`/admin`)
* Cep telefonundan başparmakla tek dokunuşla tüm sistemi yönetme:
  - Üye listesi, plaka arama, tek tıkla rozet verme/alma.
  - Tamirci ve galerici başvuru belgelerini inceleme, onaylama/reddetme.
  - AI denetim masasında bayraklanan yorumları yönetme.
  - Canlı SOS yardım çağrılarını izleme.

---

## 🚀 Projeyi Başlatma ve Çalıştırma

Proje sıfır bağımlılıkla (harici indirme gerektirmeden) doğrudan Node.js ile çalışır:

```powershell
# Proje dizininde:
node server.js
# Veya Antigravity Node ile:
& "C:\Users\muham\AppData\Roaming\Antigravity\bin\agy-node.cmd" server.js
```

Tarayıcınızdan açın:
* 🌐 **Ana Uygulama (Mobil Tamircim):** `http://localhost:3000`
* 🛡️ **Mobil Admin Paneli:** `http://localhost:3000/admin`
