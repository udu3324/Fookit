const plate = "plate";
const bowl = "bowl";

const menu = [
  [
    [plate, "toast", "jelly", "peanut_butter", "toast"], //pbnj
    [plate, "toast", "avacado_slices"] //avacado toast
  ]
]

function randomObjective(difficulty) {
  //todo
  return menu[0][0];
}

//count the occurances of each string in array (ty gpt)
function countOccurrences(arr) {
  const occurrences = {};
  for (const item of arr) {
    occurrences[item] = (occurrences[item] || 0) + 1;
  }
  return occurrences;
}

//checks if compare array has all the things in original (ty gpt)
function checkIngredientQuantities(original, compare) {
  const occurrences1 = countOccurrences(original);
  const occurrences2 = countOccurrences(compare);

  // Compare the occurrences of each element in Array 1 with those in Array 2
  for (const item of Object.keys(occurrences1)) {
    if (occurrences2[item] !== occurrences1[item]) {
      return false;
    }
  }

  // If we reach this point, it means all elements in Array 1 have the same occurrences in Array 2
  return true;
}

module.exports = Object.freeze({
    checkIngredientQuantities,
    randomObjective
});