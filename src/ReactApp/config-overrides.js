const { override, addLessLoader, fixBabelImports } = require("customize-cra");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      "@primary-color": "#778da9",
      "@warning-color": "#ec547a",
      "@success-color": "#5bceae",
      "@border-radius-base": "4px",
      "@border-color-base": "#90A8BE",
      "@error-color": "rgb(236, 84, 122)"
    }
  })
);
