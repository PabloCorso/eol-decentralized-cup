const Table = (children) => `<table>${children}</table>`;

const TableHead = (children) => `<thead>${children}</thead>`;

const TableRow = (children) => `<tr>${children}</tr>`;

const TableHeader = (children) => `<th>${children}</th>`;

const TableBody = (children) => `<tbody>${children}</tbody>`;

const TableData = (children) => `<td>${children}</td>`;

const Strike = (children) => `<strike>${children}</strike>`;

const Link = ({ children, href }) => `<a href="${href}">${children}</a>`;

module.exports = {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableData,
  Strike,
  Link,
};
