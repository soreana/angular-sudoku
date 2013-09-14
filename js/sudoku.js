/**
 * @author Igor ivanovic.
 * User: Igor
 * Date: 15.09.13
 * Time: 00:28
 */
(function (window, angular) {
	/**
	 * Sudoku module
	 * @type {module}
	 */
	var sudokuModule = angular.module('sudokuModule', []);


	/**
	 * Solution factory
	 */
	sudokuModule.factory('solutionFactory', ['$http', function ($http) {
		/**
		 * Sudoku algorythm
		 */

		var sudoku,
			solve = function (s, c, even_odd) {
				var box, good, guesses, produces_solution, x, y, filterEvenOdd;

				if (c == null) {
					c = 0;
				}
				if (c === 81) {
					return s;
				} else {

					x = c / 9 | 0;
					y = c % 9;

					if (s[x][y] !== 0) {
						return solve(s, c + 1, even_odd);
					}
				}
				box = function (i) {
					var a = x - x % 3 + (i - i % 3) / 3,
						b = y - y % 3 + i % 3;

					return sudoku[a][b];
				};

				filterEvenOdd = function (g) {
					var n = even_odd[x][y], e = g % 2 === 0;

					if (e) {
						return n === 1;
					} else {
						return n === 0;
					}
				}

				good = function (g) {
					return [0, 1, 2, 3, 4, 5, 6, 7, 8].every(function (i) {
						return filterEvenOdd(g) && g !== s[x][i] && g !== s[i][y] && g !== box(i);
					});
				};
				guesses = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(good);
				produces_solution = function (g) {
					s[x][y] = g;
					return solve(s, c + 1, even_odd);
				};

				return (guesses.some(produces_solution)) || (s[x][y] = 0);
			}
		return {
			/***
			 * Combine arrays
			 * @param a
			 */
			combine: function (a) {
				var c = '';
				[0, 1, 2, 3, 4, 5, 6, 7, 8].every(function (i) {
					c += a.join();
					return true;
				});
				return c;
			},
			/**
			 * Check if sudoku is done
			 * @param s
			 * @param even_odd
			 * @returns {boolean}
			 */
			isDone: function (s, even_odd) {
				var solved, ca, cb;
				sudoku = angular.copy(s);
				solved = solve(sudoku, null, even_odd) ? sudoku : [];

				ca = this.combine(s);
				cb = this.combine(solved);

				return ca === cb;
			},
			/**
			 * Check sudoku
			 */
			errorCheck: function (item, s, even_odd) {

				var s = angular.copy(s),
					c = parseInt(item.value),
					x = item.x,
					y = item.y,
					checkBox = function (n) {

						var bd = [];

						var box = function (i) {
							var a = x - x % 3 + (i - i % 3) / 3,
								b = y - y % 3 + i % 3;

							return s[a][b];
						};

						[0, 1, 2, 3, 4, 5, 6, 7, 8].every(function (i) {
							bd.push(box(i));
							return true;
						});

						return bd.indexOf(n) !== -1;
					},

					checkRow = function (n) {
						var bd = [];
						[0, 1, 2, 3, 4, 5, 6, 7, 8].every(function (i) {
							bd.push(s[x][i]);
							return true;
						});
						return bd.indexOf(n) !== -1;
					},

					checkColumn = function (n) {
						var bd = [];
						[0, 1, 2, 3, 4, 5, 6, 7, 8].every(function (i) {
							bd.push(s[i][y]);
							return true;
						});
						return bd.indexOf(n) !== -1;
					};

				return {
					not_valid_block: checkBox(c),
					not_valid_column: checkColumn(c),
					not_valid_row: checkRow(c)
				}
			},

			/***
			 * transform data to even od
			 * @param data
			 */
			setSudoku: function (data, even_odd) {
				var structure = [], even, current, c = 1;

				for (var i = 0; i < data.length; ++i) {
					for (var j = 0; j < data[i].length; ++j) {
						even = even_odd[i][j] === 1;
						current = data[i][j];
						if (!angular.isArray(structure[i])) {
							structure[i] = [];
						}
						structure[i][j] = {
							isEven: even,
							value: current > 0 ? current : '',
							valid: '',
							x: i,
							y: j,
							c: c
						}
						++c;
					}
				}
				return structure;
			}
		}

	}]);
	/**
	 * Sudoku module controller
	 */
	sudokuModule.controller(
		'sudokuController',
		function ($scope, solutionFactory) {

			/**
			 * even odd
			 */
			var even_odd = [
				[0, 0, 1, 0, 1, 1, 0, 1, 0],
				[0, 0, 1, 0, 1, 1, 0, 0, 1],
				[1, 1, 0, 0, 0, 0, 0, 1, 1],
				[1, 0, 0, 0, 0, 1, 1, 0, 1],
				[0, 1, 1, 1, 1, 0, 0, 0, 0],
				[0, 1, 0, 0, 1, 0, 1, 1, 0],
				[1, 0, 0, 1, 0, 0, 1, 0, 1],
				[0, 0, 0, 1, 0, 1, 1, 1, 0],
				[1, 1, 1, 1, 0, 0, 0, 0, 0]
			];

			/**
			 * Scope sudoku
			 * @type {Array}
			 */

			$scope.sudoku = [
				[1, 0, 0, 0, 0, 0, 0, 0, 3],
				[0, 0, 0, 0, 6, 0, 0, 0, 0],
				[0, 0, 3, 0, 0, 1, 0, 0, 0],
				[0, 7, 0, 1, 0, 0, 0, 0, 0],
				[0, 0, 8, 0, 0, 0, 5, 0, 0],
				[0, 0, 0, 0, 0, 3, 0, 4, 0],
				[0, 0, 0, 8, 0, 0, 6, 0, 0],
				[0, 0, 0, 0, 1, 0, 0, 0, 0],
				[6, 0, 0, 0, 0, 0, 0, 0, 7]
			];

			/**
			 * Clone sudoku
			 */
			$scope.clone = angular.copy($scope.sudoku);


			/***
			 * Not valid item error
			 * @type {boolean}
			 */
			$scope.not_valid_item = false;
			$scope.not_valid_even = false;
			$scope.not_valid_odd = false;
			$scope.not_valid_block = false;
			$scope.not_valid_column = false;
			$scope.not_valid_row = false;

			/**
			 * Return
			 * @param odd
			 */
			$scope.checkClass = function (even) {
				return even === true ? 'even' : 'odd';
			}

			/**
			 * Solution for current sudoku
			 * @type {*}
			 */
			$scope.transform = solutionFactory.setSudoku($scope.sudoku, even_odd);

			/**
			 * Check expression
			 * @param val
			 */
			$scope.expression = function (val) {
				return val > 0 ? val : '';
			}


			/**
			 * Change value event
			 */
			$scope.change = function (item) {

				var c = parseInt(item.value);
				item.valid = '';

				$scope.not_valid_item = false;
				$scope.not_valid_even = false;
				$scope.not_valid_odd = false;
				$scope.not_valid_block = false;
				$scope.not_valid_column = false;
				$scope.not_valid_row = false;

				if (!isNaN(c)) {

					var errors = solutionFactory.errorCheck(item, $scope.sudoku);
					$scope.not_valid_block = errors.not_valid_block;
					$scope.not_valid_column = errors.not_valid_column;
					$scope.not_valid_row = errors.not_valid_row;


					$scope.sudoku[item.x][item.y] = c;

					if (item.isEven) {
						if (c % 2 !== 0) {
							$scope.not_valid_even = true;
							item.valid = 'not_correct';
						}
					} else {
						if (c % 2 === 0) {
							$scope.not_valid_odd = true;
							item.valid = 'not_correct';
						}
					}

					if (
						!$scope.not_valid_block && !$scope.not_valid_column && !$scope.not_valid_row && !$scope.not_valid_even && !$scope.not_valid_odd
						) {
						if (solutionFactory.isDone($scope.sudoku, even_odd)) {
							alert("Congratulations you successfully completed sudoku");
						}
					}


				} else {
					$scope.not_valid_item = true;
				}
			}
		}
	);
}(window, window.angular));