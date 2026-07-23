# Prescription Pick-up Schedule Calculator

This program is an 'instalment pick-up calculator' for controlled drug prescriptions.
The intention is to ask the service user a questionnaire about their prescription, determine their general availability and then calculate the dosages and pick-up quantities for the two-week prescription length.

## Business Logic

- There are three prescription types:
  1. **Stabilisation**: A fixed daily dose
  2. **Increasing**: Starting dose plus a fixed step every N days (first increase on day N)
  3. **Reducing**: Starting dose minus a fixed step every N days (first decrease on day N)
- Doses clamp at 0ml and 60ml
- Non-collection days show 0ml; their dose is added to the previous collectable day
- Consecutive non-collection days cascade into the last collectable day before them
- Medication must be in hand before a non-collection day, so doses roll backward, never forward: consumption never pauses
- The start date must be a collectable day (the date picker enforces this)

## Caveats

- The 0–60ml limit applies to a single day's dose; a pick-up covering several days can total more
- Whole ml only: fractional doses are rejected to avoid floating-point rounding errors
- Bank holidays are treated as unavailable days (pharmacy closed), so the same 0ml + roll-back rule applies
- Bank holiday data is for England & Wales, bundled from [gov.uk](https://www.gov.uk/bank-holidays.json); coverage currently ends in 2028, and the program warns if a schedule falls beyond it
- In a real-world system I would not bundle this data: a daily server-side CRON job would re-fetch the gov.uk JSON (bank holidays can be announced at short notice: the Queen's funeral in 2022 had ~10 days' notice, and there was a chance for another English bank holiday if England won the World Cup), keeping a last-known-good copy locally and raising an alert if fetching failed after some retries. For this test's scope, bundled data with a documented retrieval date keeps the program deterministic and offline-runnable
- "Generally available" is read as one weekly pattern; I'm treating availability as a repeating weekly schedule, but in the real world it might be good to allow them to select their availability for the entire two weeks
- Pharmacy opening hours are out of scope; bank holidays are the only closures modelled
- No cap is enforced on pick-up size or frequency (no statutory limit exists; service policy _pending confirmation_); unusually large pick-ups produce a warning instead

## Planned Approach

- TypeScript: Type safe language which I am comfortable with
- React (Vite) and Vitest: Vite is a lightweight build tool and dev server and Vitest is its natively integrated test runner
- All scheduling rules live purely in TypeScript separately from the UI so it could easily be swapped out to be API driven
- TDD approach to ensure it is not over-engineered and keeps to the requirements without regression in future
- Bank holiday data sits behind a small provider so that tests can inject fixed dates

## Roadmap

- Commits will follow a Red, Green, Refactor cycle when it benefits implementation and clarity for reviewers to see my step-by-step process
- Scaffold first, then Stage 1 and then Stage 2 as per the user story formatting.

## Open Questions

I will be asking these questions to stakeholders and possibly more if I uncover any in early implementation

1. Collection frequency: The story mentions 2–3 pharmacy visits a week. I plan to treat this as descriptive rather than a validation rule: I'll allow any availability pattern and show a warning when a selection produces fewer collections or larger amounts than typical. My reasoning: a maximum of 3 would block daily collection, which is the safest pattern for a new prescription, and a minimum of 2 can't be truly guaranteed through day selection anyway, since a bank holiday can reduce a two-day week to one. Should I instead enforce it as a rule, requiring 2 to 3 selected days per week? (Even then, a bank holiday week could still yield a single collection, so I'd treat that case as a warning rather than a rejection.)
2. Start date: I plan to add a start-date input, defaulting to today. Prescriptions are usually written before they begin, and without real dates the bank-holiday handling can't be demonstrated or tested. I also plan to only offer start dates on which a collection can actually happen, since a prescription starting on a non-collection day would leave the service user without medication from day one. Any concerns?
3. Schedule display: Where several days are collected in one visit, I plan to show the collection total alongside a per-day breakdown. My concern is that a bare '120ml' against a Monday could be misread as a single day's dose, which feels unsafe in a controlled-drug context. Does that presentation work for you?
