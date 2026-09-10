# Redline Surf Club — web sitesi

Alaçatı'daki Redline Surf Club için tek sayfalık tanıtım sitesi.
Wing foil ve windsurf dersleri, ekipman kiralama; Türkçe / İngilizce.

**Canlı:** https://majkasolutions.github.io/redline-surf-club/

## İçerik

- Tek sayfa, çerçevesiz (vanilla HTML/CSS/JS) — derleme adımı yok
- TR / EN dil değiştirici (`data-tr` / `data-en` öznitelikleri, tercih tarayıcıda saklanır)
- Kulübün kendi wing foil çekimlerinden üretilmiş hero videosu ve galeri klipleri
- Her yerde "Hemen Ara" (+90 505 941 15 21) — mobilde ekrana yapışan arama çubuğu
- Yazı tipleri siteden servis edilir (Google Fonts'a istek gitmez), sayfadaki karakterlere göre kırpılmış

## Yayına alırken

`index.html` içinde **`<meta name="robots" content="noindex">`** satırı var.
Müşteri onaylayıp alan adı bağlandığında **bu satır silinecek**, ayrıca şu üç yerde
adres güncellenecek: `<link rel="canonical">`, `og:url`, `og:image` ve JSON-LD `url`.

## Yerelde bakmak

```
python3 -m http.server 8000
```

## Varlıklar

| Yol | Not |
|---|---|
| `assets/video/hero.mp4` | 11,9 sn döngü, sessiz; ham çekimlerden ffmpeg ile |
| `assets/video/g1–g4.mp4` | Galeri, dikey döngüler; görünürken oynar |
| `assets/img/hero-{640,1000,1456}.{jpg,webp}` | Duyarlı hero kapak karesi (LCP) |
| `assets/img/jp-logo-long.svg`, `np-logo-white.png` | JP Australia / NeilPryde marka logoları |
| `assets/fonts/` | Barlow Condensed 600/800, Inter 400–600 (alt küme) |

Ham çekimler ve logonun kaynağı repoda değil: `~/Desktop/Majka/02-Musteriler/Redline-Surf-Club/`

---
Majka Solutions
