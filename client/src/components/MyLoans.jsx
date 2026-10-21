import { useState } from "react";

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

function ReturnChecklist({ loan, onSubmit, onCancel }) {
  const [allPartsReturned, setAllPartsReturned] = useState(false);
  const [undamaged, setUndamaged] = useState(false);
  const [comment, setComment] = useState("");

  const commentRequired = !allPartsReturned || !undamaged;

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(loan.id, { allPartsReturned, undamaged, comment });
  }

  return (
    <form className="return-checklist" onSubmit={handleSubmit}>
      <fieldset>
        <legend>Return checklist</legend>

        <label>
          <input
            type="checkbox"
            checked={allPartsReturned}
            onChange={(event) => setAllPartsReturned(event.target.checked)}
          />
          All parts and accessories are returned
        </label>

        <label>
          <input
            type="checkbox"
            checked={undamaged}
            onChange={(event) => setUndamaged(event.target.checked)}
          />
          The equipment is undamaged and works
        </label>
      </fieldset>

      <label htmlFor={`return-comment-${loan.id}`}>
        {commentRequired ? "What is missing or damaged?" : "Comment (optional)"}
      </label>
      <textarea
        id={`return-comment-${loan.id}`}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        maxLength={500}
        rows={2}
        required={commentRequired}
      />

      <div className="loan-actions">
        <button type="submit">Confirm return</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function MyLoans({ loans, onReturn }) {
  const [returningLoanId, setReturningLoanId] = useState(null);

  async function handleChecklistSubmit(loanId, checklist) {
    const returned = await onReturn(loanId, checklist);

    if (returned) {
      setReturningLoanId(null);
    }
  }

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
              <li className="loan-row loan-row-with-form" key={loan.id}>
                <div className="loan-row-top">
                  <div className="loan-main">
                    <strong>{loan.equipment.name}</strong>
                    <span>
                      Unit: {loan.equipmentUnit?.identifier ?? "Not specified"}
                    </span>
                    <span>
                      {formatDate(loan.startDate)} to {formatDate(loan.endDate)}
                    </span>
                    {loan.returnedAt && (
                      <span>Returned {formatDate(loan.returnedAt)}</span>
                    )}
                  </div>

                  <div className="loan-actions">
                    <span className={`status-pill loan-status-${status.key}`}>
                      {status.label}
                    </span>

                    {status.key === "active" && returningLoanId !== loan.id && (
                      <button
                        type="button"
                        onClick={() => setReturningLoanId(loan.id)}
                      >
                        Return
                      </button>
                    )}
                  </div>
                </div>

                {returningLoanId === loan.id && (
                  <ReturnChecklist
                    loan={loan}
                    onSubmit={handleChecklistSubmit}
                    onCancel={() => setReturningLoanId(null)}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default MyLoans;
