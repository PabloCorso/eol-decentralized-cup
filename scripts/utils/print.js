const html = require("html");

const prettyPrint = (htmlString) => {
  return html.prettyPrint(htmlString, { indent_size: 2 });
};

const printResult = (title, content) => {
  return `<!-- ${title} -->
  
${content}
`;
};

module.exports = { printResult, prettyPrint };
