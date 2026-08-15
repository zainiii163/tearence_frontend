/**
 * Patch Filament resources: TextInput country → CountrySelect with flags.
 * Run: node scripts/patch-filament-countries.js
 */
const fs = require('fs');
const path = require('path');

const root = 'd:/live/WWA-backend-New_main/app/Filament/Resources';

const files = [
  'BuySellAdvertResource.php',
  'BuySellItemResource.php',
  'JobResource.php',
  'JobSeekerResource.php',
  'JobListingResource.php',
  'PropertyResource.php',
  'SponsoredAdvertResource.php',
  'FeaturedAdvertResource.php',
  'BannerAdResource.php',
  'BannerResource.php',
  'ResortsTravelResource.php',
  'EventResource.php',
  'VenueResource.php',
  'VenueServiceResource.php',
  'FundingProjectResource.php',
  'DonationResource.php',
  'VehicleResource.php',
  'CustomerBusinessResource.php',
  'UserResource.php',
  'BusinessAffiliateOfferResource.php',
  'UserAffiliatePostResource.php',
];

const importLine = 'use App\\Filament\\Forms\\Components\\CountrySelect;';

function ensureImport(src) {
  if (src.includes(importLine)) return src;
  // After namespace / first use block
  const m = src.match(/^((?:<\?php\s*)?(?:namespace [^;]+;\s*)?(?:use [^;]+;\s*)*)/m);
  if (!m) {
    return src.replace(/^(<\?php\s*)/, `$1\n${importLine}\n`);
  }
  // Insert after last use statement near top
  const lines = src.split('\n');
  let lastUse = -1;
  for (let i = 0; i < Math.min(lines.length, 40); i++) {
    if (lines[i].startsWith('use ')) lastUse = i;
  }
  if (lastUse >= 0) {
    lines.splice(lastUse + 1, 0, importLine);
    return lines.join('\n');
  }
  return importLine + '\n' + src;
}

let patched = 0;
for (const file of files) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) {
    console.log('skip missing', file);
    continue;
  }
  let src = fs.readFileSync(full, 'utf8');
  const before = src;

  // Forms\Components\TextInput::make('country')
  src = src.replace(
    /Forms\\Components\\TextInput::make\('country'\)/g,
    "CountrySelect::make('country')"
  );
  // TextInput::make('country') when imported as TextInput
  src = src.replace(
    /(?<![\w\\])TextInput::make\('country'\)/g,
    "CountrySelect::make('country')"
  );
  // Remove leftover ->maxLength(100) immediately after CountrySelect country (optional cleanup - leave it, Filament Select ignores unknown? Actually Select doesn't have maxLength - would error)
  src = src.replace(
    /CountrySelect::make\('country'\)(\s*)->label\('Country'\)/g,
    "CountrySelect::make('country')$1"
  );

  if (src !== before) {
    src = ensureImport(src);
    // Strip ->maxLength(...) chained right after CountrySelect::make('country') chains that TextInput had
    // Safer: remove maxLength only when it appears in a chain that starts with CountrySelect::make('country')
    src = src.replace(
      /(CountrySelect::make\('country'\)(?:\s*->\w+\([^)]*\))*)\s*->maxLength\(\d+\)/g,
      '$1'
    );
    fs.writeFileSync(full, src);
    patched++;
    console.log('patched', file);
  } else {
    console.log('no change', file);
  }
}

// Dedicated option replacements
const optionPatches = [
  {
    file: 'PromotedAdvertResource.php',
    replace: [
      [
        "->options(fn () => \\App\\Models\\Country::pluck('name', 'name'))",
        "->options(fn () => \\App\\Support\\CountrySelectOptions::byNameWithFallback())",
      ],
    ],
  },
  {
    file: 'ServiceResource.php',
    replace: [
      [
        "->options(fn () => \\App\\Models\\Country::pluck('name', 'name'))",
        "->options(fn () => \\App\\Support\\CountrySelectOptions::byNameWithFallback())",
      ],
    ],
  },
  {
    file: 'ZoneResource.php',
    replace: [
      [
        "->options(Country::all()->pluck('name', 'country_id'))",
        "->options(fn () => \\App\\Support\\CountrySelectOptions::byId())",
      ],
    ],
  },
  {
    file: 'CustomerResource.php',
    replace: [
      [
        "->options(Country::all()->pluck('name', 'country_id'))",
        "->options(fn () => \\App\\Support\\CountrySelectOptions::byId())",
      ],
    ],
  },
  {
    file: 'ListingResource.php',
    replace: [
      [
        "->options(Country::all()->pluck('name', 'country_id'))",
        "->options(fn () => \\App\\Support\\CountrySelectOptions::byId())",
      ],
    ],
  },
  {
    file: 'ResortsTravelResource.php',
    replace: [
      [
        `->options(fn () => collect([
                        'United Kingdom' => 'United Kingdom',
                        'United States' => 'United States',
                        'France' => 'France',
                        'Germany' => 'Germany',
                        'Italy' => 'Italy',
                        'Spain' => 'Spain',
                        'Netherlands' => 'Netherlands',
                        'Belgium' => 'Belgium',
                        'Switzerland' => 'Switzerland',
                        'Austria' => 'Austria',
                    ]))`,
        "->options(fn () => \\App\\Support\\CountrySelectOptions::byNameWithFallback())",
      ],
    ],
  },
];

for (const p of optionPatches) {
  const full = path.join(root, p.file);
  if (!fs.existsSync(full)) continue;
  let src = fs.readFileSync(full, 'utf8');
  let changed = false;
  for (const [a, b] of p.replace) {
    if (src.includes(a)) {
      src = src.split(a).join(b);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(full, src);
    console.log('options patched', p.file);
    patched++;
  }
}

// BookAdvertResource — replace hardcoded ISO list
{
  const full = path.join(root, 'BookAdvertResource.php');
  let src = fs.readFileSync(full, 'utf8');
  const re =
    /Forms\\Components\\Select::make\('country'\)\s*->required\(\)\s*->searchable\(\)\s*->options\(\[[\s\S]*?\]\)/;
  if (re.test(src)) {
    src = ensureImport(src);
    src = src.replace(
      re,
      "CountrySelect::makeIso('country')\n                            ->required()"
    );
    fs.writeFileSync(full, src);
    console.log('patched BookAdvertResource.php');
    patched++;
  }
}

// BannerAd target_countries — TagsInput or Select multiple
{
  const full = path.join(root, 'BannerAdResource.php');
  let src = fs.readFileSync(full, 'utf8');
  if (src.includes("Textarea::make('target_countries')")) {
    src = ensureImport(src);
    src = src.replace(
      /Forms\\Components\\Textarea::make\('target_countries'\)[\s\S]*?->rows\(2\)/,
      `Forms\\Components\\Select::make('target_countries')
                            ->label('Target Countries')
                            ->multiple()
                            ->searchable()
                            ->preload()
                            ->options(fn () => \\App\\Support\\CountrySelectOptions::byNameWithFallback())
                            ->helperText('Select one or more countries worldwide')`
    );
    fs.writeFileSync(full, src);
    console.log('patched BannerAd target_countries');
  }
}

console.log('done, files touched ~', patched);
