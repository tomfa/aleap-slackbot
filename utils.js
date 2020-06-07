module.exports.shuffle = function (a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


module.exports.findAsync = async function(arr, asyncCallback, syncExecution = true) {
  if (syncExecution) {
    for (element of arr) {
      const result = await asyncCallback(element);
      if (result)
        return element
    }
  } else {
      const promises = arr.map(asyncCallback);
      const results = await Promise.all(promises);
      const index = results.findIndex(result => result);
      return arr[index];
    }
}
