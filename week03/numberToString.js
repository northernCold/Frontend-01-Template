function covertNumberToString(numb) {
  let integer = Math.floor(numb);
  let fraction = Math.round((numb - integer) * 100);
  let char = "";
  let str = "";

  console.log(String(numb))
  while (integer > 0) {
    char = String(integer % 10);
    integer /= 10;
    str = char + str
  }
  fraction !== 0 ? str +=  "." : "";
  while (fraction !== 0) {
    char = String(integer % 10)
    fraction /= 10;
    str = char + str
  }
}

covertNumberToString(213.123)