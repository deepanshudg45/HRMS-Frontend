export const Table = ({ columns, data, loading }: any) => {
  if (loading) return <div>Loading...</div>;

  return (
    <table>
      <thead>
        <tr>
          {columns.map((col: any) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row: any, i: number) => (
          <tr key={i}>
            {columns.map((col: any) => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};