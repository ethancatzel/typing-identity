const PASSAGES = [
  "Who washes the windows by Harold the fox.",
  "The quick brown fox washes the dishes and stares out Wendy's window.",
  "Humpdy Dumpty washes windows and jumps over the wall.",
  "Windows by the sea shore require regular washes to see out.",
];

const Passage: React.FC = () => {
  return (
    <p className="py-2 font-mono text-center border-y">
      {PASSAGES[Math.floor(Math.random() * PASSAGES.length)]}
    </p>
  );
};

export default Passage;
