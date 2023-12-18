import { TypingDistance } from "./actions";

type Props = {
  results: TypingDistance[];
};

const Leaderboard: React.FC<Props> = ({ results }) => {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result, index) => (
          <tr key={result.firstName}>
            <td>{index + 1}</td>
            <td>{result.firstName}</td>
            <td>{result.milliseconds}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Leaderboard;
