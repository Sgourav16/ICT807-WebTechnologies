# CareerCompass AU — Shared Data Conventions

## Source
Jobs and Skills Australia — Australian Jobs 2026 Occupation Matrix.

## Common interpretation rules
- Keep negative growth values as negative.
- Treat missing `-` values as unavailable, not zero.
- Skill Level 1 is the highest skill level in the source classification.
- Earnings symbols are bands, not guaranteed salaries.
- Projected employment growth is not the same as guaranteed job vacancies.
- Do not alter official occupation names unless required for display formatting.

## Display rules
Where a source value is missing, display:
`Not available`

Employment values expressed in thousands may be formatted for users as workers where useful, while preserving the source meaning.

## Security/privacy
The occupation dataset is public labour-market information. Personal feedback information should not be written into a public CSV/JSON file in the static website.
