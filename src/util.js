export function rnorm(mean, sd) {
  const x = Math.random();
  const y = Math.random();
  return mean + sd * Math.sqrt(-2 * Math.log(x)) * Math.cos(2 * Math.PI * y);
}
