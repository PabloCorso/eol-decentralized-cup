const Table = (children) => `<table>${children}</table>`;

const TableHead = (children) => `<thead>${children}</thead>`;

const TableRow = (children) => `<tr>${children}</tr>`;

const TableHeader = (children) => `<th>${children}</th>`;

const TableBody = (children) => `<tbody>${children}</tbody>`;

const TableData = (children, { className } = { className: "" }) =>
  className
    ? `<td class="${className}">${children}</td>`
    : `<td>${children}</td>`;

module.exports = {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableData,
};
