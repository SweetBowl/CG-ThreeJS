module.exports = {
    "extends": "airbnb-base",
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "jquery": true
    },
    "rules": {
        "arrow-body-style": 0,
        "no-trailing-spaces": 0,
        "comma-dangle": 0,
        "linebreak-style": 0,
        "global-require": 0,
        "eslint linebreak-style": [0, "error", "windows"],
        "radix": 0,
        "max-len": [
            2,
            {
                "code": 120,
                "ignorePattern": "^import"
            }
        ],
        "jsx-a11y/label-has-for": [ 0, {
            "components": [ "Label" ],
            "required": {
                "every": [ "nesting", "id" ]
            },
            "allowChildren": false
        }],
        "class-methods-use-this": 0,
        "eol-last": 0,
    }
};
