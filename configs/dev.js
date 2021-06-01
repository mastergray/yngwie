const path = require('path');

// Configures webpack for testing yngwie.js:
module.exports = {
  mode:"development",
  entry: './src/main.js',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './test',
  },
  output: {
    path: path.resolve(__dirname, '../test'),
    filename: 'yngwie.js',
    library:{
      name:"Yngwie",
      type:"umd"
    }
  }
};
