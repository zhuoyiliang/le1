// "use strict"


function methodName(params) {
  // params = '12'
  arguments[0] = 12
  console.log(arguments);
  console.log(params);
}

methodName(13)