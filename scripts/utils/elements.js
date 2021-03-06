const Table = (children) => `<table>${children}</table>`;

const TableHead = (children) => `<thead>${children}</thead>`;

const TableRow = (children) => `<tr>${children}</tr>`;

const TableHeader = (children) => `<th>${children}</th>`;

const TableBody = (children) => `<tbody>${children}</tbody>`;

const TableData = (children) => `<td>${children}</td>`;

const Strike = (children) => `<strike>${children}</strike>`;

const Link = ({ children, href }) =>
  `<a href="${href}" target="_blank">${children}</a>`;

const Bold = (children) => `<b>${children}</b>`;

const Italic = (children) => `<i>${children}</i>`;

const Underline = (children) => `<u>${children}</u>`;

const Mark = (children) => `<mark>${children}</mark>`;

const Span = ({ children, title } = { children, title: "" }) =>
  `<span title="${title}">${children}</span>`;

const DataTable = ({ columns, rows }) => {
  let bodyRows = "";
  for (let i = 0; i < rows.length; i++) {
    let rowsData = "";
    const row = rows[i];
    for (let j = 0; j < columns.length; j++) {
      const field = columns[j].field;
      const data = row[field];
      rowsData += TableData(data);
    }

    bodyRows += TableRow(rowsData);
  }

  const headers = columns.map((column) => TableHeader(column.header)).join("");
  const head = TableHead(headers);
  const body = TableBody(bodyRows);
  return Table([head, body].join(""));
};

module.exports = {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableData,
  Strike,
  Link,
  Bold,
  Italic,
  Underline,
  Mark,
  Span,
  DataTable,
};
