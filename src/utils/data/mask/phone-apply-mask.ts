export function phoneApplyMask(input: string) {
  input = input.replace(/\D/g, "");
  input = input.replace(/^(\d)/, "+$1");
  input = input.replace(/(.{3})(\d)/, "$1($2");
  input = input.replace(/(.{6})(\d)/, "$1)$2");
  if (input.length == 12) {
    input = input.replace(/(.{1})$/, "-$1");
  } else if (input.length == 13) {
    input = input.replace(/(.{2})$/, "-$1");
  } else if (input.length == 14) {
    input = input.replace(/(.{3})$/, "-$1");
  } else if (input.length == 15) {
    input = input.replace(/(.{4})$/, "-$1");
  } else if (input.length > 15) {
    input = input.replace(/(.{4})$/, "-$1");
  }

  return input;
}
