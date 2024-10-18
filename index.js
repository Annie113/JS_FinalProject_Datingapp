'use strict';

const mockData = require('./mockData.js').data;
const prompt = require('prompt-sync')();

const questions = [
  "What is your first name? ",
  "What is your last name? ",
  "What is your age? ",
  "What is your gender (M, F, X)? ",
  "Which genders are you interested in dating? ",
  "Where do you live (rural or city)? ",
  "What is your minimum dating age? ",
  "What is your maximum dating age? "
];

// Empty object to store the user's answers
let emptyProfile = {}

// Custom key names for the myProfile object
let answerKeys = ["first_name", "last_name", "age", "gender", "gender_interest", "location", "min_age_of_interest", "max_age_of_interest"];

let continueQuestions = true;  // Control outer loop to restart the entire process if needed

// Outer loop to control restarting the questions
while (continueQuestions) {
  let validGenders = ["M", "F", "X"];
  let validLocations = ["rural", "city"];

  // Loop through the questions
  for (let i = 0; i < questions.length; i++) {
    let answer = "";  // Initialize an empty string for the user's answer

    // Inner while loop to ensure the user answers the question
    while (answer === "" || answer === null) {
      answer = prompt(questions[i]);

      // Convert answer to number if dealing with ages
      let age = Number(answer);

      // Store the answer in the object with the corresponding key
      emptyProfile[answerKeys[i]] = answer; 

      // If the answer is empty or null, ask the user to answer again
      if (answer === "" || answer === null) {
        console.log("Answer is not valid. Please try again.");
        allAnswered = false; // Mark that not all questions have been answered
      } 

      // Check if the third answer is a number and 18 or higher
      if (i === 2) {  
        if (!isNaN(age) && age >= 18) {
          emptyProfile[answerKeys[i]] = age;  // Store the age as a number
          break;  
        } else {
          console.log("Please provide a valid number!");
          answer = "";  
        } 
      } 

      // Check if the fourth and fifth answers are M, F, or X for gender
      if (i === 3 || i === 4) {
        if (validGenders.includes(answer)) {
          emptyProfile[answerKeys[i]] = answer;
          break;  
        } else {
          console.log("Please enter either 'M', 'F', or 'X'.");
          answer = "";  
        }
      }

      // Check if the sixth answer is 'rural' or 'city' for location
      if (i === 5) {
        if (validLocations.includes(answer)) {
          emptyProfile[answerKeys[i]] = answer;
          break;  
        } else {
          console.log("Please enter either 'rural' or 'city'.");
          answer = "";  
        }
      }

      // Check if the seventh and eighth answers are numbers and the max age is higher than the min age
      let minAge = null, maxAge = null;

      if (i === 6) {  // Minimum age
        minAge = Number(answer);
        if (!isNaN(minAge) && minAge >= 18) {
          emptyProfile[answerKeys[i]] = minAge;
        } else {
          console.log("Please enter a valid minimum age.");
          answer = "";
        }
      } 
      if (i === 7) {  // Maximum age
        maxAge = Number(answer);
        if (!isNaN(maxAge) && maxAge >= 18 && maxAge > minAge) {
          emptyProfile[answerKeys[i]] = maxAge;
          break;  // Exit inner loop if valid
        } else {
          console.log("Please enter a valid maximum age.");
          answer = "";
        }
      }
    }
  }
  break;  // Exit outer loop when all questions are answered correctly
}

console.log("My Profile:", emptyProfile);

// Find dating matches based on my profile
const myAge = emptyProfile.age;
const myMinAge = emptyProfile.min_age_of_interest;
const myMaxAge = emptyProfile.max_age_of_interest;
const myGender = emptyProfile.gender;
const myGenderInterest = emptyProfile.gender_interest;
const myLocation = emptyProfile.location;

// Initialize an array to store matches
let matches = [];
let matchCount = 0; // Initialize a counter for matches

// Loop through each person in mockData
for (let person of mockData) {
  const theirAge = person.age;
  const theirGender = person.gender;
  const theirGenderInterest = person.gender_interest;
  const theirLocation = person.location;

  // Check if age matches
  const ageMatch = (myAge >= person.min_age_of_interest && myAge <= person.max_age_of_interest) ||
                   (theirAge >= myMinAge && theirAge <= myMaxAge);

  // Check if gender matches
  const genderMatch = (myGenderInterest.includes(theirGender) && theirGenderInterest.includes(myGender));

  // Check if locations match
  const locationMatch = (myLocation === theirLocation);

  // If all criteria are met, add to matches
  if (ageMatch && genderMatch && locationMatch) {
    matches.push({
      name: `${person.first_name} ${person.last_name}`,
      age: person.age,
      location: person.location
    });
    matchCount++; // Increment match count
  }
}

// Print matches in a readable format
if (matches.length > 0) {
  console.log("Possible Matches:");
  console.table(matches); 
  console.log(`Total matches found: ${matchCount}`); 
} else {
  console.log("No matches found.");
}