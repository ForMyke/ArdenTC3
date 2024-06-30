export function replaceRepeatedPatterns(expression) {
  const regex = /(\w)\(\1\)\*/g;
  return expression.replace(regex, "$1^+");
}
