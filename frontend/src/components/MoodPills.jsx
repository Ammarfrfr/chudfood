export const MoodPills = ({ pills, onSelect }) => {
  return (
    <div className="mood-pills">
      {pills.map((pill, index) => (
        <div
          key={index}
          className="pill"
          onClick={() => onSelect(pill)}
        >
          {pill}
        </div>
      ))}
    </div>
  );
};

