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
    expect(typeof onlyOdds).to.equal('function');
  });
  it('returns a number', () => {
    let returnedValue = onlyOdds(6);
    expect(typeof returnedValue).to.equal('number');
  });
  it('returns the sum of all odd nums between the provided argument and 0', () => {
    let returnedValue = onlyOdds(10);
    expect(returnedValue).to.equal(9 + 7 + 5 + 3 + 1);
  });
  it('returns 0 if inputted argument is less than 1', () => {
    let returnedValue = onlyOdds(-5);
    expect(returnedValue).to.equal(0);
  });
});`,
      difficulty: 'medium',
      starterCode: `/* These prompts are provided to get you started,
but are not the only way to attak the problem.
Feel free to delete all of the below and start your own code. */
function onlyOdds(/* your code here*/) {
  let sum = 0;
  for (/* your code here*/) {
    if (/* your code here*/) {
    }
  }
  return;
}`,
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
    },
    {
      title: 'Crazy Caps',
      question: `Define a function, "crazyCaps", that accepts a string as an argument.
"crazyCaps" should return a string in which every other character is
capitalized. The first letter should be lower-cased.
crazyCaps('fullstack is amazing'); // => fUlLsTaCk iS AmAzInG!`,
      testSpecs: `describe('crazyCaps', () => {
  it('is a function', () => {
    expect(typeof crazyCaps).to.equal('function');
  });
  it('returns a string', () => {
    let returnedValue = crazyCaps('any value');
    expect(typeof returnedValue).to.equal('string');
  });
  it('returns a string with alternating lower-case and upper-case letters', () => {
    let returnedValue = crazyCaps('this is crazy');
    expect(returnedValue).to.equal('tHiS Is cRaZy');
  });
});
`,
      difficulty: 'medium',
      starterCode: `/* These prompts are provided to get you started,
but are not the only way to attak the problem.
Feel free to delete all of the below and start your own code. */
      function crazyCaps(/* your code here*/) {
  for (/* your code here*/) {
    if (/* your code here*/) {
    } else {
    }
  }
  return
}`,
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
  return crazyString;
}`,
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
    expect(typeof bacteriaTime).to.equal('function');
  });
  it('returns the number of minutes required to reach the target', () => {
    let returnedValue = bacteriaTime(1, 8);
    expect(returnedValue).to.equal(60);
  });
  it('returns the number of minutes required to reach a large target', () => {
    let returnedValue = bacteriaTime(3, 6000);
    expect(returnedValue).to.equal(220);
  });
});`,
      difficulty: 'medium',
      starterCode: `/* These prompts are provided to get you started,
but are not the only way to attak the problem.
Feel free to delete all of the below and start your own code. */
function bacteriaTime(currentNum, targetNum) {
  if (/* your code here*/) {
    return 'targetNum must be larger than currentNum';
  }
  while (/* your code here*/) {
    currentNum *= /* your code here*/
    numMinutes += /* your code here*/
  }
  return ;
}`,
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
    expect(typeof exponentiate).to.equal('function');
  });
  it('returns a number', () => {
    let returnedValue = exponentiate(1, 1);
    expect(typeof returnedValue).to.equal('number');
  });
  it('returns the value of the first num raised to the second', () => {
    let returnedValue = exponentiate(3, 6);
    expect(returnedValue).to.equal(Math.pow(3, 6));
  });
  it('returns 1 if the power is 0', () => {
    let returnedValue = exponentiate(20, 0);
    expect(returnedValue).to.equal(1);
  });
});`,
      difficulty: 'medium',
      starterCode: `/* These prompts are provided to get you started,
but are not the only way to attak the problem.
Feel free to delete all of the below and start your own code. */
function exponentiate(base, power) {
  let result =
  for (/* your code here*/) {
    result *= base;
  }
  return ;
}`,
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
    expect(typeof mySlice).to.equal('function');
  });
  it('returns a string', () => {
    let returnedValue = mySlice('a piece of pie');
    expect(typeof returnedValue).to.equal('string');
  });
  it('returns a new string starting at the startIdx', () => {
    let returnedValue = mySlice('a piece of pie', 2);
    expect(returnedValue).to.equal('piece of pie');
  });
  it('returns a new string with the correct starting and ending indices', () => {
    let returnedValue = mySlice('a piece of pie', 2, 7);
    expect(returnedValue).to.equal('piece');
  });
  it('returns the original string if no indices are inputted', () => {
    let returnedValue = mySlice('a piece of pie');
    expect(returnedValue).to.equal('a piece of pie');
  });
});`,
      difficulty: 'medium',
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
    expect(typeof mostVowels).to.equal('function');
  });
  it('returns a string', () => {
    let returnedValue = mostVowels('Wit beyond measure is mans greatest treasure.');
    expect(typeof returnedValue).to.equal('string');
  });
  it('returns the word with the most vowels', () => {
    let returnedValue = mostVowels('Wit beyond measure is mans greatest treasure.');
    expect(returnedValue).to.equal('measure');
  });
  it('returns the word with the most vowels even if its the last string in the sentence', () => {
    let returnedValue = mostVowels('Give her hell from us, Peeves.');
    expect(returnedValue).to.equal('Peeves');
  });
  it('returns an empty string if none of the inputted words have vowels', () => {
    let returnedValue = mostVowels('why dry my sly lynx?');
    expect(returnedValue).to.equal('');
  });
});
`,
      difficulty: `hard`,
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
  };
  return maxWord;
  function isVowel(char) {
    let vowels = 'aeiouAEIOU';
    if (vowels.indexOf(char) >= 0) {
      return true;
    } else {
      return false;
    }
  }
};
`,
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
      testSpecs: `describe('myIndexOf', () => {
  it('is a function', () => {
    expect(typeof myIndexOf).to.equal('function');
  });
  it('returns a number', () => {
    let returnedValue = myIndexOf('i love apples', 'apples');
    expect(typeof returnedValue).to.equal('number');
  });
  it('returns the first instance of the searchValue in the source', () => {
    let returnedValue = myIndexOf('here and there', 'here');
    expect(returnedValue).to.equal(0);
  });
  it('returns the first instance of the searchValue at or after the startIdx', () => {
    let returnedValue = myIndexOf('here and there', 'here', 4);
    expect(returnedValue).to.equal(10);
  });
  it('returns -1 if the searchValue is not in the source', () => {
    let returnedValue = myIndexOf('here and there', 'nowhere');
    expect(returnedValue).to.equal(-1);
  });
})
`,
      difficulty: `medium`,
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
    },
    // BoilerPlate Code For Adding Questions ---------------------------------
    // {
    //   title: ``,
    //   question: ``,
    //   starterCode: `/* These prompts are provided to get you started,
    // but are not the only way to attak the problem.
    // Feel free to delete all of the below and start your own code. */`,
    //   testSpecs: ``,
    //   difficulty: ``,
    //   solution: ``,
    // }

    // MATTS EASY QUESTIONS ------------------------------
    // --------------------------------------------------
    // --------------------------------------------------

    {
      title: `Sum of all in an Array`,
      question: `Define a funciton sumAll, that accepts an array as an argument.
      the function should return the sum of all the items in the given array
      For ex:
      sumAll([1,2,3]) ---> return 6
      sumAll([7,3,4]) ---> return 14
      sumAll([1]) -------> return 1`,
      starterCode: `/* These prompts are provided to get you started,
    but are not the only way to attak the problem.
    Feel free to delete all of the below and start your own code. */
    const sumAll = (arr) => {
      let sum = 0;
      return sum;
        }`,
      testSpecs: `describe('sumAll', ()=> {
        it('is a function', () => {
          expect(typeof sumAll).to.equal('function');
        });
        it('returns a number', () => {
          let returnedValue = sumAll([1]);
          expect(typeof returnedValue).to.equal('number');
        });
        it('returns the sum of all elements in an array', ()=> {
          let returnedValue = sumAll([1,2,3]);
          expect(returnedValue).to.equal(6);
        });
        it('returns the sum of all elements of large array', ()=> {
          let returnedValue = sumAll([1,2,3,4,1,2,3,4,1,2,3,4]);
          expect(returnedValue).to.equal(30);
        });
        it('returns the value of single array', () => {
          let returnValue = sumAll([1]);
          expect(returnedValue).to.equal(1);
        });
      });`,
      difficulty: `easy`,
      solution: `//Option 1
      const sumAll = (arr) => {
           let sum = 0;
           for (let i = 0; i < array.length; i++) {
               sum += array[i];
                      }
                return sum;
        }`,
    },
    {
      title: `Is it a OO word?`,
      question: `Define a function, 'doubleO, that accepts one argument;
      a string.
      From the given string determine if the letters "oo" occur next to each other.
      If 'oo' does occur in the string return true if not return false
      For example:
      doubleO("Hello, what is up") ---> return false
      doubleO('Hey what's good') -----> returns true
      doubleo('good') ----> return true`,
      starterCode: `/* These prompts are provided to get you started,
    but are not the only way to attak the problem.
    Feel free to delete all of the below and start your own code. */
    const doubleO = (str) => {
      // return true or false
    }`,
      testSpecs: `describe('doubleO', () => {
        it('is a function', () => {
        expect(typeof doubleO).to.equal('function');
      });
        it('returns a boolean', () => {
          let returnedValue = doubleO('yoooooo');
          expect(typeof returnedValue).to.equal('boolean');
        });
        it('returns true if oo appears in string',() => {
          let returnedValue = doubleO('cool guy');
          expect(returnedValue).to.equal(true);
        });
        it('returns false if oo does not appear in string', () =>{
          let returnedValue = doubleO('hola guapo');
          expect(returnedValue).to.equal(false);
        });
      });`,
      difficulty: `easy`,
      solution: `// Option 1
      const doubleO = (str) => {
        if(str.indexOf('oo') !== -1){
               return true
               }
            return false
          }
      `,
    },
    {
      title: `Who let the dog out???`,
      question: `Define a function named whoWho, the function accepts on argument
      an array of strings. Everytime the word dog appears, move it to a second arr and return
      the new array. If there are no dogs to be let out return an empty array;
      For example:
      whoWho(['hi','how', 'is', 'it', 'going']) ===> return []
      whoWho(['cat','cat', 'dog', 'snake', 'raptop', 'dog']) ===> return [dog, dog]
      whoWho(['you','got','this','dog']) ====> return [dog]`,
      starterCode: `/* These prompts are provided to get you started,
    but are not the only way to attak the problem.
    Feel free to delete all of the below and start your own code. */
    function whoWho(arr){
      let newArr = [];
      return  newArr;
    }
    `,
      testSpecs: `describe('whoWho', () => {
        it('is a function', () => {
          expect(typeof whoWho).to.equal('function');
        });
        it('returns an array', () => {
          let returnedValue = whoWho([]);
          expect(typeof returnedValue).to.equal('object');
        });
        it('returns an empty array if there are no dogs', () => {
          let returnedValue = whoWho(['only','cats','here']);
          expect(returnedValue).to.equal([]);
        });
        it('returns an array containing all the dogs from the first array', () => {
          let returnedValue = whoWhol(['dog', 'dog', 'dog', 'cat', 'dog' ]);
          expect(returnedValue).to.equal(['dog','dog','dog','dog']);
        });

      });`,
      difficulty: `easy`,
      solution: `// Option 1 :
      const whoWho = (arr) => {
        let newArr = [];
        arr.forEach(element => {
          if(element === 'dog'){
            newArr.push('dog')
          }
        })
        return newArr
      }`,
    },
    {
      title: `Double the Array`,
      question: `Write a funciton called doubleIt that takes one parameter,
      an array of numbers and returns a new array with all the values insided being doubled.
      For example:
      doubleIt([1,2,3]) ====> return [2,4,6]
      doubleIt([5,5,5]) ====> return [10 , 10 ,10 ]`,
      starterCode: `/* These prompts are provided to get you started,
    but are not the only way to attak the problem.
    Feel free to delete all of the below and start your own code.
    */
   function doubleIt(array) {
      }`,
      testSpecs: `describe('doubleIt', () => {
        it('is a function', () => {
          expect(typeof doubleIt).to.equal('function');
        });
        it('returns an array', () => {
          let returnedValue = doubleIt([1,2]);
          expect(typeof returnedValue).to.equal('object');
        });
        it('returns a doubled single element array', () => {
          let returnedValue = doubleIt([4]);
          expect(returnedValue).to.equal([8]);
        });
        it('returns a double multi element array', () => {
          let returnedValue = doubleIt([1,2,3,4,5,6]);
          expect(returnedValue).to.equal([2,4,6,8,10,12]);
        });
      });`,
      difficulty: `easy`,
      solution: `//Option 1:
      const doubleIt = (arr) => {
        return arr.map(x => x*2)
      }
      `,
    },
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
