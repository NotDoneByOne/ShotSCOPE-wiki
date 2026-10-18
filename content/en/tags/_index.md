---
title: All ShotSCOPE tags
description: The list of knowledge base tags, how to use them, and how to add a new one.
lang: en
translationKey: tags
modified: 2026-10-18
---
Tags group articles by topic, from exercises and weapon types to training levels. Pick a tag to see all articles with it.

## How to use tags

| Action                         | Result                                  |
| ------------------------------ | --------------------------------------- |
| Click a tag below or in an article | Open all materials on that topic    |
| Search (⌘+K)                   | Find materials by keywords              |
| Link to a tag page             | Format: `[[en/tags/tag-name]]`          |

The site creates a page for each tag automatically and supports nested tags, for example `weapons/rifles` or `training/mistakes`.

## Tag categories

### By discipline

- [[en/tags/rifle-shooting|#rifle-shooting]] — all materials on rifle shooting
- [[en/tags/practical-shooting|#practical-shooting]] — IPSC, practical disciplines
- [[en/tags/clay-shooting|#clay-shooting]] — trap, skeet, sporting
- [[en/tags/long-range|#long-range]] — shooting at 300+ meters, precision rifle

### By weapon type

- [[en/tags/rifles|#rifles]] — air, smallbore, full-bore
- [[en/tags/pistols|#pistols]] — sport pistols of all types
- [[en/tags/shotguns|#shotguns]] — smoothbore weapons for clay shooting
- [[en/tags/carbines|#carbines]] — rifled weapons for long range

### By equipment

- [[en/tags/optics|#optics]] — scopes, diopter sights, red dot sights
- [[en/tags/clothing|#clothing]] — shooting jackets, trousers, gloves
- [[en/tags/accessories|#accessories]] — slings, mats, cushions, rests
- [[en/tags/ammunition|#ammunition]] — cartridges, bullets, powder

### By training

- [[en/tags/training|#training]] — general materials on the training process
- [[en/tags/mistakes|#mistakes]] — analysis of typical mistakes and how to fix them
- [[en/tags/diary|#diary]] — keeping a training diary
- [[en/tags/psychology|#psychology]] — mental preparation, concentration

### By competitions

- [[en/tags/competitions|#competitions]] — preparing for and taking part in starts
- [[en/tags/evsk|#evsk]] — exercises of the Unified All-Russian Sports Classification (EVSK)
- [[en/tags/finals|#finals]] — final formats, strategies

### By rules and safety

- [[en/tags/rules|#rules]] — competition rules and regulations
- [[en/tags/anti-doping|#anti-doping]] — anti-doping rules and procedures
- [[en/tags/safety|#safety]] — range safety rules

### By manufacturer

- [[en/tags/anschutz|#anschutz]] — Anschütz rifles and pistols
- [[en/tags/walther|#walther]] — Walther products
- [[en/tags/beretta|#beretta]] — Beretta shotguns and pistols
- [[en/tags/orsis|#orsis]] — Orsis high-precision rifles
- [[en/tags/lobaev|#lobaev]] — Lobaev Arms rifles

### By training level

- [[en/tags/for-beginners|#for-beginners]] — materials for novice athletes
- [[en/tags/advanced|#advanced]] — for experienced shooters
- [[en/tags/professionals|#professionals]] — in-depth analysis and fine tuning
- [[en/tags/for-coaches|#for-coaches]] — methodological materials for coaches

### By versions and releases

- [[en/tags/spm|#spm]] — everything about the SPM version
- [[en/tags/releases|#releases]] — update history
- [[en/tags/beta|#beta]] — beta testing of new features

## Nested tags

Nested tags group materials more precisely. Each level has its own tag page.

- `weapons/rifles/air`
- `weapons/rifles/smallbore`
- `weapons/pistols/rapid-fire`
- `weapons/pistols/free`
- `training/exercises/positions`
- `training/exercises/trigger`
- `training/exercises/breathing`
- `competitions/preparation/warm-up`
- `competitions/preparation/equipment`

Example pages: [[en/tags/weapons]] — everything about weapons, [[en/tags/weapons/rifles]] — rifles only, [[en/tags/weapons/rifles/air]] — air rifles only.

## How to add a new tag

1. Add the tag to a note: `tags: [new-tag]` in the frontmatter.
2. The site creates the tag page on the next build.
3. To customize the tag page, create the file `content/tags/new-tag.md`.

For authors: [[en/Community/How to become an author|guide for authors]].
