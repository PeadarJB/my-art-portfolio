# Artflow pilot inventory

Inventory date: 19 July 2026. Source verified through the connected Google
Drive account as `Backup/Peadar/edits` (folder ID
`1-5XfEn7v71F08t1EoN4ynuDnE75qQP_V`). The similarly named `edits` folder under
`paintings` was inspected at the metadata level and deliberately rejected.

## Drive-level inventory

| Folder | Items | Image files | Other files | Bytes |
| --- | ---: | ---: | ---: | ---: |
| 2019 | 77 | 76 (75 JPEG, 1 PNG) | 1 XCF | 298,908,146 |
| 2020 | 51 | 51 JPEG | 0 | 177,326,402 |
| 2021 | 57 | 56 JPEG | 1 Krita/ZIP | 304,365,436 |
| **Total** | **185** | **183** | **2** | **780,599,984** |

The source root also contains an `archive` folder. It is not part of the
20-image pilot. A local recursive ingest may include supported images under it,
but all Upland Folk path/filename exclusions still run before hashing.

No 2022 folder is present at the source root. One known Upland Folk filename,
`EscapeFromTheCave.jpeg`, is present under 2021 and is explicitly covered by
the default filename exclusion terms. Other verified Upland Folk filename
stems from the website content are excluded as a second guard in addition to
the path rule.

## Representative pilot

The exact 20 Drive references are stored in `config/pilot-selection.json`:
seven from 2019, six from 2020, and seven from 2021. The set includes named
portfolio sources, alternate/small captures, generic camera filenames,
contextual 2021 photographs, possible objects, likely perspective cases, and
likely re-photography cases.

Candidate coverage labels are selection hypotheses based on folder, filename,
file size, and existing portfolio context. They are not asserted artwork
titles, media, dimensions, classifications, or approval decisions. Visual
classification and the final recipe remain pending until the images are
available through the configured Drive for Desktop path and assessed in the
review application.

## Website export convention verified

- Files: `<existing-basename>-small.webp`, `-medium.webp`, `-large.webp`
- Target widths: 640, 1280, 2200 pixels, without enlargement
- WebP qualities: 78, 78, 82, with effort 6
- Grid uses `medium`; detail contexts reserve `large`
- Content shape remains `{ small, medium, large, alt, width, height }`

Artflow requires a reviewer-entered website basename, verified year, and alt
text before planning these outputs. It will not derive those values from a
filename or AI response.

