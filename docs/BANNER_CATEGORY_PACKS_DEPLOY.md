# Banner Adverts — category paid packs (Clive)

## Frontend
Pull latest. Assets under `public/img/banners/marketplace/` (12 AI PNG heroes + 36 SVG size packs).

## Backend
```bash
php artisan db:seed --class=CategoryPaidBannersSeeder
```
Requires `BannerCategorySeeder` already run. Optional `FRONTEND_URL` in `.env` (defaults to https://worldwideadverts.info).

## Behaviour
- `/banner-adverts` — categories open `/banner-adverts/category/{slug}`
- Trending (left) + Live (right) under hero
- Titles show clearly; paid Buy & download
