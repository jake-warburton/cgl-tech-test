#Context
Our system produces prescriptions for our service users. Generally, they are issued with a
prescription for 14 days, for which they will have to go to the pharmacy 2 or 3 times a
week to pick up medication. These are controlled drugs, so for safety reasons, we
cannot simply issue a 14 day prescription and give out two weeks worth of medication,
so the medication must be picked up in instalments. We need to calculate how much
medication a service user picks up each day.
All measurements are in milliliters (ml), and can be between 0 and 60ml.
The approach
You are free to write this in any language you like, and to decide whether you want
visual input and output, or console based output.
The challenge
You should set up a git repository that you can share with us. We should see separate
commits for each stage.

##Stage 1
We need you to write a program that asks the user the following questions:

1. What days of the week is the service user generally available?
2. What type of prescription is it (Reducing, Increasing, Stabilisation)
3. If it is a stabilisation prescription, you should ask what the dosage is (0-60ml)
4. If it is a titration or reducing prescription, you should ask a further three questions:

- Initial Daily Dose: This is the dose that they will be on at the start of the prescription.
- Increase/Decrease: How much the prescription changes by (e.g. 4 ml)
- Every: How often the increase or decrease occurs (e.g. 3 days)

##Stage 2
You now need to write a routine that processes these answers and creates some output

Write a function that displays what the dosages will be for the next two weeks,
dependent on the previously selected options. Some conditions:

- If someone is not available on a day, then their daily dosage should be added
  to the previous day, and the unavailable day should be set as '0ml'
- You should account for UK bank holidays
