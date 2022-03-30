function testSpecs(specs) {
  return (
    `
  mocha.setup('bdd');
let expect = chai.expect;
let assert = chai.assert;
after(function(){
  let failResults = document.getElementsByClassName('test fail')
  if(failResults.length > 0){
    // for testing on local host
    parent.postMessage('false', "http://localhost:8080")
    // for heroku deployment
    // parent.postMessage('false', "https://capstone-battlescript.herokuapp.com/")
  }
  else{
    // for testing on local host
    parent.postMessage('true', "http://localhost:8080")
    // for heroku deployment
    // parent.postMessage('true', "https://capstone-battlescript.herokuapp.com/")
  }
});` +
    specs +
    `mocha.checkLeaks();
mocha.run();`
  );
}

export default testSpecs;
