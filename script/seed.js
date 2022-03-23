'use strict';

const {
  db,
  models: { User, Lobby, Question, Solution },
} = require('../server/db');

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log('db synced!');
  const lobbies = [{ name: 'test' }, { name: 'test2' }];
  const users = [
    { username: 'cody', lobbyId: 1 },
    { username: 'murphy', lobbyId: 1 },
  ];
  const questions = [
    {
      title: 'Only Odds',
      question: `Define a function, "onlyOdds", that accepts a number as an argument. onlyOdds should should return the sum of all the odd numbers between the given number and 1. If "onlyOdds" receives an argument less than 1, it should return 0.

      //example
      onlyOdds(6); /* => 9 (5 + 3 + 1)*/

      Specs to consider:
      1. It is a function
      2. It returns a number
      3. It returns the sum of all odd nums between the provided argument and 0
      4. It returns 0 if inputted argument is less than 1`,
      testSpecs: `describe('onlyOdds', () => {

  it('is a function', () => {
    expect(typeof onlyOdds).toEqual('function');
  });

  it('returns a number', () => {
    let returnedValue = onlyOdds(6);
    expect(typeof returnedValue).toEqual('number');
  });

  it('returns the sum of all odd nums between the provided argument and 0', () => {
    let returnedValue = onlyOdds(10);
    expect(returnedValue).toEqual(9 + 7 + 5 + 3 + 1);
  });

  it('returns 0 if inputted argument is less than 1', () => {
    let returnedValue = onlyOdds(-5);
    expect(returnedValue).toEqual(0);
  });

});`,
      difficulty: 'easy',
    },
    {
      title: 'Crazy Caps',
      question: `Define a function, "crazyCaps", that accepts a string as an argument.
"crazyCaps" should return a string in which every other character is
capitalized. The first letter should be lower-cased.

crazyCaps('fullstack is amazing'); // => fUlLsTaCk iS AmAzInG!`,
      testSpecs: `describe('crazyCaps', () => {

  it('is a function', () => {
    expect(typeof crazyCaps).toEqual('function');
  });

  it('returns a string', () => {
    let returnedValue = crazyCaps('any value');
    expect(typeof returnedValue).toEqual('string');
  });

  it('returns a string with alternating lower-case and upper-case letters', () => {
    let returnedValue = crazyCaps('this is crazy');
    expect(returnedValue).toEqual('tHiS Is cRaZy');
  });

});
`,
      difficulty: 'easy',
    },
    {
      title: 'Bacteria Time',
      question: `Define a function, "bacteriaTime", that accepts two arguments:
  1. currentNum (num) - number of starting bacteria
  2. targetNum (num) - desired number of bacteria

Assuming that the number of bacteria double every 20 minutes, "bacteriaTime" should
return the number of minutes required for the number of bacteria to grow from
the currentNum to a number equal to or larger than the targetNum.

You can assume the currentNum will be a positive integer. If the targetNum is
smaller than the currentNum, return the string 'targetNum must be larger than currentNum'.

bacteriaTime(1, 8); // => 60`,
      testSpecs: `describe('bacteriaTime', () => {

  it('is a function', () => {
    expect(typeof bacteriaTime).toEqual('function');
  });

  it('returns the number of minutes required to reach the target', () => {
    let returnedValue = bacteriaTime(1, 8);
    expect(returnedValue).toEqual(60);
  });

  it('returns the number of minutes required to reach a large target', () => {
    let returnedValue = bacteriaTime(3, 6000);
    expect(returnedValue).toEqual(220);
  });

});`,
      difficulty: 'medium',
    },
    {
      title: 'Exponentiate',
      question: `Write a function "exponentiate" that accepts two arguments:
1. base (number)
2. power (number)

"exponentiate" should return the result of raising the base by the power.
Assume the power argument will always be an integer greater than or equal to zero.
Don't forget that any number raised to the 0th power is equal to 1!

Do not use the built-in [Math.pow() method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow), but feel free to use it moving forward!

exponentiate(2, 2)    // => 4
exponentiate(3, 4)    // => 81`,
      testSpecs: `describe('exponentiate', () => {

  it('is a function', () => {
    expect(typeof exponentiate).toEqual('function');
  });

  it('returns a number', () => {
    let returnedValue = exponentiate(1, 1);
    expect(typeof returnedValue).toEqual('number');
  });

  it('returns the value of the first num raised to the second', () => {
    let returnedValue = exponentiate(3, 6);
    expect(returnedValue).toEqual(Math.pow(3, 6));
  });

  it('returns 1 if the power is 0', () => {
    let returnedValue = exponentiate(20, 0);
    expect(returnedValue).toEqual(1);
  });

});`,
      difficulty: 'easy',
    },
    {
      title: 'My Slice',
      question: `Write a function "mySlice" that accepts up to three arguments:
1. originalString (string)
2. startIdx (number, optional)
3. endIdx (number, optional)

"mySlice" should return a string. The returned string should be a copy of the
original string. If the user defines a startIdx, the returned string should
start at that index:

mySlice('slice and dice', 2)    // => ice and dice

If the user defined an endIdx, the returned string should end at the last index
before the endIdx:

mySlice('slice and dice', 2, 5)    // => ice

If the user doesn't define either the startIdx or the endIdx, return the entire
originalString:

"""javascript
mySlice('slice and dice')    // => slice and dice
"""

You can assume the startIdx will always be less than or equal to the endIdx.

Do not use the built in [.slice string method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice). Feel free to use it in all future
workshop problems, though!
`,
      testSpecs: `describe('mySlice', () => {

  it('is a function', () => {
    expect(typeof mySlice).toEqual('function');
  });

  it('returns a string', () => {
    let returnedValue = mySlice('a piece of pie');
    expect(typeof returnedValue).toEqual('string');
  });

  it('returns a new string starting at the startIdx', () => {
    let returnedValue = mySlice('a piece of pie', 2);
    expect(returnedValue).toEqual('piece of pie');
  });

  it('returns a new string with the correct starting and ending indices', () => {
    let returnedValue = mySlice('a piece of pie', 2, 7);
    expect(returnedValue).toEqual('piece');
  });

  it('returns the original string if no indices are inputted', () => {
    let returnedValue = mySlice('a piece of pie');
    expect(returnedValue).toEqual('a piece of pie');
  });

});`,
      difficulty: 'medium',
    },
    {
      title: `My Index Of`,
      question: `Define a function, "myIndexOf", that accepts three arguments:
  1. source (string)
  2. searchValue (string)
  3. startIdx (number) - optional

If the "source" contains the "searchValue", return the index at which the
"searchValue" starts. If the "searchValue" appears more than once in the
"source", return the index from the first occurance of the "searchValue".
If the "searchValue" doesn't exist in the "source", return -1.

If a startIdx is passed into the function, ignore any instances of the
"searchValue" that occur before that index. If no "startIdx" is provided,
start searching from the beginning of the "source".

Do not use the built-in [".indexOf" string method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf) in your answer. Feel free to
use it in all future workshop problems though!


myIndexOf('hello', 'h'); // => 0
myIndexOf('hello', 'e'); // => 1
myIndexOf('hello', 'l'); // => 2
myIndexOf('hello', 'l'); // => 2
myIndexOf('hello', 'o'); // => 4

myIndexOf('twice twice', 'ice'); => 2

// find the index of the first instance of 'ice' starting at index 5.
myIndexOf('twice twice', 'ice', 5); => 8

myIndexOf('happy string', 'sad'); => -1`,
      testSpecs: `function myIndexOf(source, searchValue, startIdx) {
  if (startIdx === undefined) {
    startIdx = 0;
  }

  for (let i = startIdx; i <= source.length - searchValue.length; i++) {
    let substring = source.slice(i, i + searchValue.length);

    if (substring === searchValue) {
      // ...return the current index
      return i;
    }
  }

  return -1;
}

function myIndexOf2(source, searchValue, startIdx = 0) {
  for (let i = startIdx; i <= source.length - searchValue.length; i++) {
    let substring = source.slice(i, i + searchValue.length);

    if (substring === searchValue) {
      return i;
    }
  }

  return -1;
}
`,
      difficulty: `medium`,
    },
    {
      title: `Most Vowels`,
      question: `Define a function, "mostVowels", that accepts one argument, a string of words.

"mostVowels" should return the word that has the most vowels.


mostVowels('I am a keeper with some real rhythms'); // => keeper


If none of the words have any vowels, return an empty string.


mostVowels('try my gym'); // => ''`,
      testSpecs: `describe('mostVowels', () => {

  it('is a function', () => {
    expect(typeof mostVowels).toEqual('function');
  });

  it('returns a string', () => {
    let returnedValue = mostVowels('Wit beyond measure is man\'s greatest treasure.');
    expect(typeof returnedValue).toEqual('string');
  });

  it('returns the word with the most vowels', () => {
    let returnedValue = mostVowels('Wit beyond measure is man\'s greatest treasure.');
    expect(returnedValue).toEqual('measure');
  });

  it('returns the word with the most vowels even if it\'s the last string in the sentence', () => {
    let returnedValue = mostVowels('Give her hell from us, Peeves.');
    expect(returnedValue).toEqual('Peeves');
  });

  it('returns an empty string if none of the inputted words have vowels', () => {
    let returnedValue = mostVowels('why dry my sly lynx?');
    expect(returnedValue).toEqual('');
  });

});
`,
      difficulty: `hard`,
    },
    // {
    //   title: ``,
    //   question: ``,
    //   testSpecs: ``,
    //   difficulty: ``,
    // }
  ];

  const solutions = [
    {
      solution: `//Option 1
function onlyOdds(num) {
  let sum = 0;
  for (let i = num; i >= 1; i--) {
    if (i % 2 === 1) {
      sum += i;
    }
  }
  return sum;
}

//Option 2
function onlyOdds2(num) {
  let sum = 0;
  while (num >= 1) {
    if (isOdd(num)) {
      sum += num;
    }
    num--;
  }
  return sum;

  function isOdd(num) {
    return num % 2 === 1;
  }
}`,
      questionId: 1,
    },
    {
      solution: `function crazyCaps(originalString) {
  let crazyString = '';

  for (let i = 0; i < originalString.length; i++) {
    let char = originalString[i];
    if (i % 2 === 0) {
      crazyString += char;
    } else {
      char = char.toUpperCase();
      crazyString += char;
    }
  }
  return crazyString;`,
      questionId: 2,
    },
    {
      solution: `function bacteriaTime(currentNum, targetNum) {
  if (targetNum < currentNum) {
    return 'targetNum must be larger than currentNum';
  }

  let numMinutes = 0;
  while (currentNum < targetNum) {
    currentNum *= 2;
    numMinutes += 20;
  }
  return numMinutes;
}`,
      questionId: 3,
    },
    {
      solution: `// Option 1
function exponentiate(base, power) {
  let result = 1;

  for (let i = 0; i < power; i++) {
    result *= base;
  }

  return result;
}
// Option 2
function exponentiate2(base, power) {
  if (power === 0) {
    return 1;
  }

  let result = base;

  while (power > 1) {
    result *= base;
    power--;
  }

  return result;
}`,
      questionId: 4,
    },
    {
      solution: `function mySlice(originalString, startIdx, endIdx) {
  if (startIdx === undefined && endIdx === undefined) {
    return originalString;
  }

  if (startIdx === undefined) {
    startIdx = 0;
  }

  if (endIdx === undefined) {
    endIdx = originalString.length;
  }

  let slicedString = '';

  for (let i = startIdx; i < endIdx; i++) {
    let char = originalString[i];
    slicedString += char;
  }

  return slicedString;
}
`,
      questionId: 5,
    },
    {
      solution: `// Option 1
function myIndexOf(source, searchValue, startIdx) {
  if (startIdx === undefined) {
    startIdx = 0;
  }

  for (let i = startIdx; i <= source.length - searchValue.length; i++) {
    let substring = source.slice(i, i + searchValue.length);

    if (substring === searchValue) {
      // ...return the current index
      return i;
    }
  }

  return -1;
}
// Option 2
function myIndexOf2(source, searchValue, startIdx = 0) {
  for (let i = startIdx; i <= source.length - searchValue.length; i++) {
    let substring = source.slice(i, i + searchValue.length);

    if (substring === searchValue) {
      return i;
    }
  }

  return -1;
}`,
      questionId: 6,
    },
    {
      solution: `function mostVowels(sentence) {
  let currentWord = '';
  let currentVowelCount = 0;

  let maxWord = '';
  let maxVowelCount = 0;

  for (let i = 0; i < sentence.length; i++) {
    let char = sentence[i];
    if (char !== ' ' && i !== sentence.length - 1) {
      currentWord += char;
      if (isVowel(char)) {
        currentVowelCount += 1;
      }
    } else {
      if (currentVowelCount > maxVowelCount) {
        maxVowelCount = currentVowelCount;
        maxWord = currentWord;
      }
      currentWord = '';
      currentVowelCount = 0;
    }
  }
  return maxWord;
  function isVowel(char) {
    let vowels = 'aeiouAEIOU';

    if (vowels.indexOf(char) >= 0) {
      return true;
    } else {
      return false;
    }
  }
}
`,
      questionId: 7,
    },
    // {
    //   solution: ``,
    //   questionId: 0,
    // }
  ];

  await Promise.all(
    lobbies.map((lobby) => {
      return Lobby.create(lobby);
    })
  );

  await Promise.all(
    users.map((user) => {
      return User.create(user);
    })
  );

  await Promise.all(
    questions.map((question) => {
      return Question.create(question);
    })
  );

  await Promise.all(
    solutions.map((solution) => {
      return Solution.create(solution);
    })
  );

  // console.log(`seeded ${users.length} users`);
  // console.log(`seeded successfully`);
  // return {
  //   users: {
  //     cody: users[0],
  //     murphy: users[1],
  //   },
  // };
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
