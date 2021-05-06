const html = require("html");

const printResult = (title, content, { pretty } = { pretty: true }) => {
  const htmlResult = pretty
    ? html.prettyPrint(content, { indent_size: 2 })
    : content;
  const toPrint = `<!-- ${title} -->
  
${htmlResult}
`;
  console.log(toPrint);
  return toPrint;
};

module.exports = { printResult };
