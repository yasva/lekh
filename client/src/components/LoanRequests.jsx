function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", { timeZone: "UTC" });
}

function LoanRequests({ requests, onDecision }) {
  return (
    <>
      <div className="section-heading">
        <h1 className="page-title">Loan requests</h1>
      </div>

      {requests.length === 0 ? (
        <div className="guide-card">
          <p>There are no pending loan requests.</p>
        </div>
      ) : (
        <ul className="loan-list">
          {requests.map((request) => (
            <li className="loan-row" key={request.id}>
              <div className="loan-main">
                <strong>{request.equipment.name}</strong>
                <span>
                  Unit: {request.equipmentUnit?.identifier ?? "Not specified"}
                </span>
                <span>Requested by: {request.borrower.username}</span>
                <span>
                  {formatDate(request.startDate)} to{" "}
                  {formatDate(request.endDate)}
                </span>
              </div>

              <div className="loan-actions">
                <button
                  type="button"
                  onClick={() => onDecision(request.id, "approve")}
                >
                  Approve
                </button>

                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => onDecision(request.id, "reject")}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default LoanRequests;
