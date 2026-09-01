# CareerCompass AU — Shared Site Architecture

## Project purpose
CareerCompass AU is a responsive, data-driven Australian career and labour-market exploration website using the Jobs and Skills Australia Australian Jobs 2026 Occupation Matrix.

## Planned site map

- Home — `index.html`
- Explore
  - Career Explorer — `explorer.html`
  - Career Comparison — `compare.html`
  - Employment & Earnings — `employment.html`
  - Future Outlook — `outlook.html`
  - Skills & Pathways — `skills.html`
- Insights
  - Labour Market Insights — `insights.html`
  - Data & Methodology — `data.html`
- About — `about.html`
- Feedback & Contact — `contact.html`

## Shared information architecture rules
- Home introduces the application and routes users into exploration.
- Explore pages focus on occupation-level interaction.
- Insights pages explain patterns and dataset interpretation.
- Data & Methodology explains source, definitions and limitations.
- About explains project purpose and team.
- Feedback & Contact demonstrates an accessible HTML5 form.

## Common folders
```text
CareerCompassAU/
├── index.html
├── explorer.html
├── compare.html
├── employment.html
├── outlook.html
├── skills.html
├── insights.html
├── data.html
├── about.html
├── contact.html
├── css/
├── js/
├── data/
└── images/
```

## Shared navigation labels
`Home | Explore | Insights | About | Feedback`

The Explore and Insights items may contain grouped links on larger screens and a compact responsive menu on smaller screens.

## Shared data convention
Primary source:
`aus_jobs_2026_-_occupation_matrix_0.csv`

The same official occupation dataset should be used across all data-driven pages so values remain consistent.
