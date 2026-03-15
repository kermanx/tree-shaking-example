// function f() {
//   return function g() {
//     g = f();
//     g();
//   }
// }
// f()
function f(a, b) {
	return function s() {
		return g(a, b);
	};
}
function g(a, b) {
	return function t() {
		return f(a + 1, b * 2);
	};
}
t = f(1, 2);
