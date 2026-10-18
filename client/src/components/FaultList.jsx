function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", { timeZone: "UTC" });
}

function FaultList({ faults, onResolve, onUnitSelect }) {
  const openCount = faults.filter((fault) => fault.status === "OPEN").length;

  return (
    <>
      <div className="section-heading">
        <h1 className="page-title">Reported faults</h1>
      </div>

      <p className="page-description">{openCount} open</p>

      {faults.length === 0 ? (
        <div className="guide-card">
          <p>No faults have been reported.</p>
        </div>
      ) : (
        <ul className="loan-list">
          {faults.map((fault) => (
            <li className="loan-row" key={fault.id}>
              <div className="loan-main">
                <strong>
                  {fault.equipmentUnit.equipment.name} ·{" "}
                  {fault.equipmentUnit.identifier}
                </strong>
                <span>{fault.description}</span>
                <span>
                  Reported {formatDate(fault.createdAt)} by{" "}
                  {fault.reporter.username} · {fault.equipmentUnit.location}
                </span>
              </div>

              <div className="loan-actions">
                <span
                  className={`status-pill fault-status-${fault.status.toLowerCase()}`}
                >
                  {fault.status === "OPEN" ? "Open" : "Resolved"}
                </span>

                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => onUnitSelect(fault.equipmentUnit.id)}
                >
                  View unit
                </button>

                {fault.status === "OPEN" && (
                  <button type="button" onClick={() => onResolve(fault.id)}>
                    Mark resolved
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default FaultList;
