function getLoanStatus(loan) {
  if (loan.approvalStatus === "REJECTED") {
    return { key: "rejected", label: "Rejected" };
  }

  if (loan.approvalStatus === "PENDING") {
    return { key: "pending", label: "Pending approval" };
  }

  if (loan.loanStatus === "RETURNED") {
    return { key: "returned", label: "Returned" };
  }

  return { key: "active", label: "Active" };
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", { timeZone: "UTC" });
}

function MyLoans({ loans }) {
  return (
    <>
      <div className="section-heading">
        <h1 className="page-title">My loans</h1>
      </div>

      {loans.length === 0 ? (
        <div className="guide-card">
          <p>You have no loan requests yet.</p>
        </div>
      ) : (
        <ul className="loan-list">
          {loans.map((loan) => {
            const status = getLoanStatus(loan);

            return (
              <li className="loan-row" key={loan.id}>
                <div className="loan-main">
                  <strong>{loan.equipment.name}</strong>
                  <span>
                    Unit: {loan.equipmentUnit?.identifier ?? "Not specified"}
                  </span>
                  <span>
                    {formatDate(loan.startDate)} to {formatDate(loan.endDate)}
                  </span>
                </div>

                <span className={`status-pill loan-status-${status.key}`}>
                  {status.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default MyLoans;
