// function f() {
//   return function g() {
//     g = f();
//     g();
//   }
// }
// f()
function f() {
	return function() {
		return g();
	};
}
function g() {
	return function() {
		return f();
	};
}
t = f();
