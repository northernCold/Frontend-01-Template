function getNext(pattern) {
  let j = -1;
  let ret = [-1];
  for (let i = 0; i < pattern.length - 1;) {
    if (j === -1 || pattern[i] === pattern[j]) {
      i++;
      j++;
      ret[i] = j;
    } else {
      j = ret[j]
    }
  }
  return ret;
}
function kmp(str, pattern) {
  const next = getNext(pattern);
  let j = 0;
  for (let i = 0; i < str.length;) {
    if (j === -1 || str[i] === pattern[j]) {
      if (j === pattern.length - 1) return true;
      i++;
      j++;
    } else {
      j = next[j]
    }
  }
  return j === pattern.length - 1;
}

console.log(
  kmp("acabaabaabcaccaabc","abaabcac")
)