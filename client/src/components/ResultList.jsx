import ResultCard from "./ResultCard";

function ResultList({ results, onDelete, onUpdate}) {
  return (
    <div>
      {results.map((result) => (
        <ResultCard
          key={result._id}
          result={result}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

export default ResultList;