# Template packs — fillable documents (Clive standard)

## Clive’s rule

> Each page should be detailed with options to fill details.  
> A template is a document you can fill in or copy and add your details.  
> We want good templates that people will be happy to pay for.

**Not good enough:** page titles only, empty dashed boxes, one-sentence pages.  
**Good enough:** real fields (inputs/textareas/checkboxes/tables), guidance text, examples.

## Gold standard for Vikas & Shihab

Open these first and copy the pattern:

| File | Purpose |
|------|---------|
| `/templates/startup-business-plan.html` | Full fillable business plan (print / Save PDF) |
| `/templates/packs/startup-business-plan/pages/*.html` | One fillable page per section (preview teasers) |
| `/templates/packs/VIKAS_SHIHAB_GUIDE.md` | Written brief |
| `/templates/packs/_PAGE_TEMPLATE.html` | Copy this for every new page |

Benchmarks Clive shared: HubSpot sample plans, LawDepot business plan, Electric Bike Showroom PDF.

## Who does what

| Role | Job |
|------|-----|
| **Clive** | Approves quality bar |
| **Vikas / Shihab** | AI → one **fillable** HTML page per section title |
| **Zain** | Drop into pack folder + `ready: true` in `templatePackRegistry.js` |

## Folder layout

```
public/templates/
  startup-business-plan.html          ← full download (fillable)
  professional-invoice.html
  monthly-calendar-planner.html
  weekly-planner.html
  marketing-flyer.html
  event-banner.html
  wedding-invitation.html
  birthday-invitation.html
  packs/
    _PAGE_TEMPLATE.html
    VIKAS_SHIHAB_GUIDE.md
    startup-business-plan/pages/01-….html
```

## Regenerating fillable masters

```bash
node scripts/generate-fillable-templates.js
```

## Preview behaviour

- Shop shows **page titles**
- If `ready: true` → tiny teaser of that page (not the full doc)
- After purchase → customer opens the **full fillable** HTML and types into blue fields
