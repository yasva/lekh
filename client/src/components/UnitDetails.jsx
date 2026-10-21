import { useState } from "react";

const STATUS_LABELS = {
  AVAILABLE: "Available",
  ON_LOAN: "On loan",
  OUT_OF_SERVICE: "Out of service",
};

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", { timeZone: "UTC" });
}

function UnitDetails({ unit, onBack, onFaultReport }) {
  const { equipment } = unit;
  const [faultDescription, setFaultDescription] = useState("");

  async function handleFaultSubmit(event) {
    event.preventDefault();

    const reported = await onFaultReport(unit.id, faultDescription);

    if (reported) {
      setFaultDescription("");
    }
  }

  return (
    <>
      <div className="equipment-navigation">
        <button className="back-button" type="button" onClick={onBack}>
          ← Back to {equipment.name}
        </button>
      </div>

      <section className="equipment-details">
        <div className="equipment-details-header">
          <div>
            <p className="equipment-category">{equipment.category}</p>
            <h1>{unit.identifier}</h1>
            <p className="equipment-model">
              {equipment.name} · {equipment.typeModel}
            </p>
          </div>

          <span className={`status-pill status-${unit.status.toLowerCase()}`}>
            {STATUS_LABELS[unit.status]}
          </span>
        </div>

        <section className="details-section">
          <h2>Unit information</h2>

          <div className="information-card">
            <div className="information-item">
              <span>Location</span>
              <strong>{unit.location}</strong>
            </div>

            <div className="information-item">
              <span>Condition</span>
              <strong>{unit.condition}</strong>
            </div>
          </div>
        </section>

        <section className="details-section">
          <h2>Known problems for {equipment.name}</h2>

          {equipment.troubleshooting.length > 0 ? (
            <div className="guide-card">
              {equipment.troubleshooting.map((item) => (
                <div className="guide-section" key={item.id}>
                  <h3>{item.problem}</h3>
                  <p>
                    <strong>Possible solution:</strong> {item.solution}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="guide-card">
              <p>No known problems recorded for this equipment type.</p>
            </div>
          )}
        </section>

        <section className="details-section">
          <h2>Reported faults</h2>

          {unit.faults.length === 0 ? (
            <div className="guide-card">
              <p>No faults have been reported for this unit.</p>
            </div>
          ) : (
            <ul className="loan-list">
              {unit.faults.map((fault) => (
                <li className="loan-row" key={fault.id}>
                  <div className="loan-main">
                    <strong>{fault.description}</strong>
                    <span>
                      Reported {formatDate(fault.createdAt)}
                      {fault.reporter && ` by ${fault.reporter.username}`}
                    </span>
                  </div>
                  <span
                    className={`status-pill fault-status-${fault.status.toLowerCase()}`}
                  >
                    {fault.status === "OPEN" ? "Open" : "Resolved"}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <form className="fault-form" onSubmit={handleFaultSubmit}>
            <label htmlFor="fault-description">Report a fault</label>
            <textarea
              id="fault-description"
              value={faultDescription}
              onChange={(event) => setFaultDescription(event.target.value)}
              placeholder="What is wrong with this unit?"
              maxLength={1000}
              rows={3}
              required
            />

            <button type="submit">Report fault</button>
          </form>
        </section>

        <section className="details-section">
          <h2>Loan history</h2>

          {unit.loans.length === 0 ? (
            <div className="guide-card">
              <p>This unit has not been borrowed yet.</p>
            </div>
          ) : (
            <ul className="loan-list">
              {unit.loans.map((loan) => (
                <li className="loan-row" key={loan.id}>
                  <div className="loan-main">
                    <strong>
                      {formatDate(loan.startDate)} to {formatDate(loan.endDate)}
                    </strong>
                    {loan.borrower && (
                      <span>Borrowed by: {loan.borrower.username}</span>
                    )}
                    {loan.returnedAt && (
                      <span>Returned {formatDate(loan.returnedAt)}</span>
                    )}
                    {loan.returnAllParts !== null && (
                      <span>
                        Checklist:{" "}
                        {loan.returnAllParts ? "all parts" : "parts missing"},{" "}
                        {loan.returnUndamaged ? "undamaged" : "damaged"}
                        {loan.returnComment && ` – ${loan.returnComment}`}
                      </span>
                    )}
                  </div>

                  <span
                    className={`status-pill loan-status-${loan.loanStatus.toLowerCase()}`}
                  >
                    {loan.loanStatus === "RETURNED" ? "Returned" : "Active"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </>
  );
}

export default UnitDetails;
