# TrustAI Website

Static website content is kept in data files under `assets/js/data/`.
Visible copy should stay in those data files, while page scripts only render the data.

## Adding People

Edit `assets/js/data/people.data.js`.

Choose the section by placing the record in the right array:

- `people: [` current research team. Add `lead: true` only for the unit lead; every other record in this array is rendered in the Research team section.
- `alumni: [` former members.
- `pastStudents: [` past students.

Use only the fields rendered by the page:

```js
{
  photo: '../assets/img/people/name-surname.png',
  name: 'Name Surname',
  role: 'Research Fellow',
  affil: 'University of Molise',
  interests: ['Trustworthy AI', 'Software engineering'],
  links: [
    { type: 'email', href: 'mailto:name@example.com' },
    { type: 'scholar', href: 'https://scholar.google.com/...' },
  ],
}
```

Photos only need the `photo` path. Put the image file in `assets/img/people/` and set `photo` to the relative path used by the page, for example `../assets/img/people/name-surname.png`.

If there is no photo yet, omit `photo` and use `mono: 'N'` as the fallback initial. `bio` is rendered only for the record marked with `lead: true`; do not add it to regular cards.

Allowed link `type` values are defined in `linkIcons`: `email`, `scholar`, `orcid`, `website`, `github`, and `profile`.

## Adding Publications

Edit `assets/js/data/publications.data.js`.

If the venue is new, add it to `venues: {` first:

```js
venues: {
  NEWCONF: { full: 'New Conference on Trustworthy AI', type: 'C' },
  NEWJOURNAL: { full: 'Journal of Trustworthy Software', type: 'J', short: 'JTS' },
}
```

Then add the paper to `pubs: [`:

```js
{
  a: 'Name Surname, Name Surname',
  y: 2027,
  t: 'Paper Title',
  v: 'NEWCONF',
}
```

Use a numeric year in `y`. The `v` value must match a key in `venues` to show the full venue name and classify the item correctly as conference (`type: 'C'`) or journal (`type: 'J'`). If a venue key is missing, the page falls back to conference classification.

Publication metrics update automatically from `pubs`: total papers, year span, venue count, latest papers, filters, year groups, and the histogram are all derived at render time.
