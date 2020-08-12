export default {
  files: ["test/*.js"],
  require: ['@babel/register'],
  babel: {
    testOptions: {
      babelrc: true
    }
  }
};