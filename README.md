# GuncelBot (Microsoft Teams)

Bu proje, Teams'te `/guncel`, `/ekle`, `/sil`, `/yardim` komutlarına cevap veren basit bir Node.js bottur.

## Gereksinimler
- Node.js 18+
- Azure Bot (Microsoft App ID & Client Secret)
- (Test için) ngrok

## Kurulum
```bash
npm install
cp .env.example .env
# .env dosyasini acip asagidakileri doldurun:
# MICROSOFT_APP_ID=a738eb99-8d2c-49a7-a947-2f585ba93c3d
# MICROSOFT_APP_PASSWORD=<CLIENT_SECRET>
# MICROSOFT_APP_TENANT_ID=02ec02c9-2bac-48f2-81c6-6cb84f52a6a5
```

## Calistirma
```bash
npm start
# veya
node index.js
```

## ngrok ile test
```bash
ngrok http 3978
```
Azure Portal > Bot'un "Yapilandirma" (Configuration) ekraninda **Messaging endpoint** degerini su sekilde ayarlayin:
```
https://<NGROK_ID>.ngrok.io/api/messages
```

## Teams'e ekleme
- Daha once paylasilan `guncelbot-teams-app.zip` manifest paketini Teams'e yukleyin.
- Uygulamayi kanala ekleyin ve `/guncel` yazarak test edin.

## Notlar
- Domain listesi `bot.js` icerisinde **in-memory** saklanir (uygulama yeniden baslayinca sifirlanir).
- Kalici depo isterseniz Azure Table/SharePoint baglantisi eklenebilir.
