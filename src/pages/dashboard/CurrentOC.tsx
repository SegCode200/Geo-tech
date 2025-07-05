

const CurrentCO = () => {
  return (
    <div className="bg-white flex flex-col py-9 w-full shadow-md p-4 mb-4">
      <h2 className="text-xl font-bold mb-4">Current C Of O</h2>
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left">
            <th className="px-4 py-2">Id</th>
            <th className="px-4 py-2">Clean</th>
            <th className="px-4 py-2">Dirty</th>
            <th className="px-4 py-2">Inspected</th>
            <th className="px-4 py-2">Available rooms</th>
            <th className="px-4 py-2">Clean</th>
            <th className="px-4 py-2">Dirty</th>
            <th className="px-4 py-2">Inspected</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">A104</td>
            <td className="border px-4 py-2">90</td>
            <td className="border px-4 py-2">4</td>
            <td className="border px-4 py-2">60</td>
            <td className="border px-4 py-2">20</td>
            <td className="border px-4 py-2">30</td>
            <td className="border px-4 py-2">19</td>
            <td className="border px-4 py-2">30</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CurrentCO;