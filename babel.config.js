module.exports = {
  presets: [
     '@vue/app'
  ],
  "plugins": [
    "@babel/plugin-proposal-optional-chaining","@babel/plugin-proposal-nullish-coalescing-operator",
    ["transform-class-properties", { "spec": true }]

  
  ]
}
