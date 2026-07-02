# Cascaid Medical Intervention Review

Static browser app for structured medical intervention review.

Open `index.html` directly, or publish the folder with GitHub Pages.

## Airtable sync

The public app does not store an Airtable token. Enter a secure proxy or automation webhook URL in the Airtable Sync endpoint field. On `Save review`, the app sends a JSON copy of the active review to that endpoint.

The request body includes:

- `fields`: flat Airtable-friendly summary fields, including intervention, classification, target population, framework decision, scores, expert agreement, board discussion flag, and review status.
- `review`: the full saved review object.
- `pillarScores`: one object per framework pillar with expert scores and rationales.
