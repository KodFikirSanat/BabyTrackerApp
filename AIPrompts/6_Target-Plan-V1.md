BabyTrackerApp - Hedef Plan (v1)
Bu döküman, BabyTrackerApp uygulamasının ilk kararlı sürümü (v1) için geliştirilecek temel özellikleri ve kullanıcı arayüzü yaklaşımlarını içermektedir.

Geliştirme Stratejisi ve Yapay Zeka için Talimatlar
Bu projenin gluestack-ui ekosistemine geçişi, bir yapay zeka asistanı tarafından, bu dökümanda belirtilen plana göre yapılacaktır.

Ana Kaynak: Yapay zeka, geliştirme yaparken birincil kaynak olarak bu dökümanı kullanmalıdır.

Referans Proje: Bu planda detaylandırılmamış konular (örneğin, bir butonun gölge efekti, yazı tiplerinin tam karşılıkları vb.) için, AIPrompts klasöründe bulunan projenin yedek kopyası referans alınmalıdır. Yapay zeka, mevcut tasarıma en yakın görsel tutarlılığı hedeflemelidir.

Konfigürasyon Dosyaları: Firebase bağlantı bilgileri gibi konfigürasyonlar, referans projeden alınmalıdır.

1. Genel Navigasyon Yapısı
Header (Üst Bilgi Çubuğu):

Sol Taraf: Uygulama logosu (src/assets/babywise/head_logo.jpg).

Sağ Taraf: Üç nokta (...) menüsü ("Hakkında", "Hata Bildir").

Swipeable Tab Navigator (Kaydırılabilir Sekme Menüsü): Ekranlar arası kaydırarak geçiş yapılacak.

Sıralama: HomeScreen, TrackingScreen, AIScreen, GuidesScreen, ProfileScreen.

2. Ekran Davranışları ve Hiyerarşisi
Tam Ekran: SplashScreen, EntryScreen.

Ana Arayüz İçinde: Diğer tüm ekranlar (AddBabyScreen, GuideDetailScreen dahil) Header ve Tab Navigator ile birlikte görünecektir. 

3. Geri Navigasyon Prensibi
Platform Jestleri: Android geri tuşu ve iOS kenardan kaydırma aktif olacaktır.

Uygulama İçi Buton: Bir alt ekrana geçildiğinde, içerik alanının sol üst köşesinde, ihtiyaç halinde bir "Geri" butonu belirecektir.

4. Birincil Ekran Eylemleri: Floating Action Button (FAB)
Kapsam: Sadece Takip ekranında, "Yeni Kayıt Ekle" işlevi için kullanılacak.

5. Temalandırma (Theming)
Varsayılan Tema: Standart bir Açık Tema (Light Mode) kullanılacak.

Kullanıcı Seçenekleri: Kullanıcıya seçebileceği, pastel tonlarda 3 farklı renk paleti sunulacaktır.

Bu ayarlar Profil ekranından ayarlar olacak

6. Tasarım Sistemi ve Bileşen Kuralları (gluestack-ui için)
Değerlerin Kaynağı: Renkler, yazı tipleri, boşluklar gibi temel tasarım sistemi değerleri, referans projedeki mevcut StyleSheet kullanımlarından türetilerek gluestack-ui.config.ts dosyasına aktarılacaktır.

Görsel Tutarlılık: Yeni gluestack-ui bileşenlerinin (Kartlar, Butonlar vb.) köşe yuvarlaklığı, gölge gibi stilleri, referans projedeki görünüme sadık kalarak oluşturulacaktır.

Boş/Yüklenme Durumları: HomeScreen'de bebek olmadığında AddBabyCard gösterilecektir. Diğer ekranlarda basit bir metin uyarısı ("Kayıt Yok") yeterlidir.