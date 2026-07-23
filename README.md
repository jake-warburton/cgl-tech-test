# Prescription Pick-up Schedule Calculator

This program is an 'instalment pick-up calculator' for controlled drug prescriptions.
The intention is to ask the service user a questionnaire about their prescription, determine their general availability and then calculate the dosages and pick-up quantities for the two-week prescription length.

The tool is staff-facing: the story's wording ("asks the user... is the service user generally available") suggests the operator and the service user are different people, so a staff member fills in the questionnaire while talking with the service user, and all questions are phrased in the third person.

## Business Logic

- There are three prescription types:
  1. **Stabilisation**: A fixed daily dose
  2. **Increasing**: Starting dose plus a fixed step every N days (days 1 to N use the starting dose; the first increase occurs on day N+1)
  3. **Reducing**: Starting dose minus a fixed step every N days (days 1 to N use the starting dose; the first decrease occurs on day N+1)
- Doses are bounded at 0ml and 60ml. A reducing prescription that reaches 0ml has simply completed its taper; an increasing prescription that would pass 60ml is capped and produces a warning to refer back to the prescriber, rather than being changed silently
- Non-collection days show 0ml; their dose is added to the previous collectable day
- Consecutive non-collection days cascade into the last collectable day before them
- Medication must be in hand before a non-collection day, so doses roll backward, never forward: consumption never pauses
- The start date must be a collectable day; the date picker enforces this and defaults to the next collectable date

## Assumptions

These are deliberate decisions where the story is ambiguous or silent. Each one can be revisited if a stakeholder answer says otherwise.

- Bank holidays are treated as pharmacy closure days, so the same 0ml + roll-back rule applies. The [Home Office approved wording](https://www.gov.uk/government/publications/circular-0272015-approved-mandatory-requisition-form-and-home-office-approved-wording/circular-0272015-approved-mandatory-requisition-form-and-home-office-approved-wording) for instalment prescriptions supports supplying instalments due on a closed day on a prior suitable day
- "UK bank holidays" is not a single calendar: gov.uk publishes separate lists for England & Wales, Scotland and Northern Ireland. The first question in the UI is therefore a jurisdiction selector, populated from whatever divisions are present in the data and defaulting to England & Wales. In a real system this would more likely come from the service's own location records than be asked each time (for context, CGL operates in England, Wales and Scotland)
- "Generally available" is read as one repeating weekly pattern; in the real world it might be good to allow availability to be selected across the entire two weeks
- Whole ml only: fractional doses are rejected to avoid floating-point rounding errors. If finer doses were needed I would store tenths of a millilitre as integers
- The 0–60ml limit applies to a single day's dose; a pick-up covering several days can total more, as each day is dispensed as its own labelled amount
- No cap is enforced on pick-up size or frequency; unusually large or infrequent pick-ups produce a warning instead. I could find no statutory per-collection limit ([NHSBSA guidance](https://faq.nhsbsa.nhs.uk/knowledgebase/article/KA-01574/en-us) confirms a maximum 14-day supply on instalment prescriptions, but no per-collection cap); service policy _pending confirmation_

## Caveats

- Bank holiday data is bundled from [gov.uk](https://www.gov.uk/bank-holidays.json); coverage currently ends in 2028, and the program warns if a schedule falls beyond it
- In a real-world system I would not bundle this data: a daily server-side CRON job would re-fetch the gov.uk JSON (bank holidays can be announced at short notice: the Queen's funeral in 2022 had ~10 days' notice, and there was a chance for another English bank holiday if England won the World Cup), keeping a last-known-good copy locally and raising an alert if fetching failed after some retries. For this test's scope, bundled data with a documented retrieval date keeps the program deterministic and offline-runnable
- Pharmacy opening hours are out of scope; bank holidays are the only closures modelled

## Security Considerations

- The app is fully client-side: no service-user data is transmitted, stored or logged, and everything lives in memory for the session only
- No personal information is collected at all; the form deliberately never asks who the service user is, only the schedule parameters
- Input is validated at the boundary: doses and dates are checked before the scheduling logic ever sees them, and whole-ml integers avoid floating-point errors
- Bank holiday data is bundled at build time, so the app makes no runtime network requests and there are no third-party calls to audit
- In a real deployment this data would sit alongside clinical records, so authentication, audit logging of issued schedules and server-side validation would all be required before persisting anything

## Real-world Persistence

This test needs no database, but in a real system issued schedules would be persisted so they can be reviewed and reconciled later. I would model this relationally:

- A `schedules` table holding one row per issued schedule (prescription type, doses, start date, jurisdiction, issued timestamp)
- A `schedule_days` table holding one row per day (date, dose, pick-up amount, any warning flags), keyed to its schedule
- This supports the reconciliation case from the caveats above: if a new bank holiday is announced mid-schedule, the affected future rows can be recomputed and diffed against what was issued, while past rows remain immutable

## Planned Approach

- TypeScript: Type safe language which I am comfortable with
- React (Vite) and Vitest: Vite is a lightweight build tool and dev server and Vitest is its natively integrated test runner
- All scheduling rules live purely in TypeScript separately from the UI so it could easily be swapped out to be API driven
- TDD approach to ensure it is not over-engineered and keeps to the requirements without regression in future
- MUI (and its icons package) for the UI: a staff-facing tool benefits from a familiar, accessible component library, and it keeps my effort focused on the scheduling logic where the complexity lives
- Bank holiday data sits behind a small provider so that tests can inject fixed dates
- Form order: the jurisdiction selector first, then the story's questions in their original order, then the start date (whose selectable days depend on the earlier answers)

## Roadmap

- Commits will follow a Red, Green, Refactor cycle when it benefits implementation and clarity for reviewers to see my step-by-step process
- Scaffold first, then Stage 1 and then Stage 2 as per the user story formatting.

## Open Questions

I will be asking these questions to stakeholders and possibly more if I uncover any in early implementation

1. Collection frequency: The story mentions 2–3 pharmacy visits a week. I plan to treat this as descriptive rather than a validation rule: I'll allow any availability pattern and show a warning when a selection produces fewer collections or larger amounts than typical. My reasoning: a maximum of 3 would block daily collection, which is the safest pattern for a new prescription, and a minimum of 2 can't be truly guaranteed through day selection anyway, since a bank holiday can reduce a two-day week to one. Should I instead enforce it as a rule, requiring 2 to 3 selected days per week? (Even then, a bank holiday week could still yield a single collection, so I'd treat that case as a warning rather than a rejection.)
2. Start date: I plan to add a start-date input, defaulting to the next collectable date. Prescriptions are usually written before they begin, and without real dates the bank-holiday handling can't be demonstrated or tested. I also plan to only offer start dates on which a collection can actually happen, since a prescription starting on a non-collection day would leave the service user without medication from day one. Any concerns?
3. Schedule display: Where several days are collected in one visit, I plan to show the collection total alongside a per-day breakdown. My concern is that a bare '120ml' against a Monday could be misread as a single day's dose, which feels unsafe in a controlled-drug context. Does that presentation work for you?
