function usedFunction() {
  return "I am used";
}

function unusedFunction() {
  return "I am never called";
}

function anotherUnused() {
  console.log("Dead code");
}

export const result = usedFunction();
