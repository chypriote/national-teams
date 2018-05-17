module.exports = {
	"env": {
		"node": true
	},
	"extends": [
		"eslint:recommended",
	],
	"parserOptions": {
		"ecmaVersion": 2016,
		"sourceType": "module"
	},
	"plugins": [
		"lodash",
		"unicorn"
	],
	"rules": {
		"strict": 0,
		"space-before-function-paren": [2, {
			"anonymous": "always",
			"named": "never",
			"asyncArrow": "always"
		}], //space before functions parenthesis
		"quotes": [2, "single"], //strings with single quotes
		"comma-dangle": ['error', {
			"arrays": "always-multiline",
			"objects": "always-multiline",
			"imports": "never",
			"exports": "never",
			"functions": "never"
		}], //comma after last array item
		"prefer-arrow-callback": [1, {"allowNamedFunctions": true}],
		"valid-jsdoc": [0, { //JSDoc is legacy, only show a warning
			prefer: { "return": "returns"},
			preferType: {
				"String": "string",
				"Number": "number",
				"Boolean": "boolean",
				"object": "Object",
				"function": "Function"
			}
		}],
		"vars-on-top": 2,
		"no-var": 1,
		"prefer-template": 2,
		"indent": ["error", 2],
		"padded-blocks": [2, "never"], //Code should start on the first line
		"lines-around-comment": 0, //Conflicts with padded-block
		"capitalized-comments": 1, //Comments must start with uppercase,
		"one-var": [2, "never"],
		"one-var-declaration-per-line": 2,
		"keyword-spacing": 2,

		//Plugins
		"unicorn/explicit-length-check": 2,
		"unicorn/no-abusive-eslint-disable": 2,

		//Those properties could be used
		"require-jsdoc": 0, //enforces JSDoc
	},
	"globals": {
		"$": false,
		"Promise": false,
	},
	"overrides": [
		{
			"files": [ "scripts/*.js" ],
			"env": {
				"browser": true
			},
			"rules": {
				"no-unused-vars": 0,
			}
		}
	]
};
