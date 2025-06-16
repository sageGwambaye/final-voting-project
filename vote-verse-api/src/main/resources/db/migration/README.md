# Voter Population Scripts

This directory contains SQL migration scripts to populate the voters database for the Vote Verse API.

## Files Structure

1. `V2__populate_voters_part1.sql` (10 voters)
   - 5 group members with confirmed registration numbers
   - 5 regular students (alternating female/male)

2. `V2__populate_voters_part2.sql` (10 voters)
   - 5 female students
   - 5 male students

3. `V2__populate_voters_part3.sql` (10 voters)
   - 5 female students
   - 5 male students

4. `V2__combine_voters.sql`
   - Main script that combines all parts
   - Handles transaction management
   - Ensures clean state by removing existing data

## Data Distribution

Total Voters: 25 students with the following characteristics:

### Programs
- BSc Software Engineering (SE)
- BSc Computer Engineering
- BSc Information Technology
- BSc Information Systems

### Dorm Blocks
- Female students: Blocks 6, 5, and 2 only
- Male students: Blocks 1, 2, 3, 4, and 5

### Other Details
- All students from CIVE college
- Registration numbers format: T21-03-XXXXX
- Years of study: 1-4
- Phone numbers: Tanzania format (+255XXXXXXXXX)
- Email format: firstname.lastname@students.cive.ac.tz
- Each record includes unique voice sample and image URLs

## Group Members (Confirmed Data)
1. REBECA SAMANDA (T21-03-04721)
2. GEHAZI GWAMBAYE (T21-03-03128)
3. GODLISTEN NANYARO (T21-03-12992)
4. ANDERSON MOLLEL (T21-03-13092)
5. MENGWA KATAMBI (T21-03-04972)

## Usage

To apply these migrations:

1. Ensure your database is running
2. Run the migrations in order:
   ```sql
   \i V2__combine_voters.sql
   ```

This will:
1. Clear existing voter data
2. Load all voter records in sequence
3. Commit the transaction

## Notes

- Total number of voters: 25 (in current files)
- Gender distribution is approximately equal
- Each student has unique:
  - Registration number
  - Email address
  - Phone number
  - Voice sample URL
  - Image URL 