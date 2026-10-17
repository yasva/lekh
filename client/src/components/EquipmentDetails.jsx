import { useRef, useState } from "react";
import UnitList from "./UnitList";

function EquipmentDetails({
  equipment,
  guide,
  troubleshooting,
  units,
  user,
  onLoanRequest,
  onGuideCreate,
  onGuideUpdate,
  onTroubleshootingCreate,
  onTroubleshootingUpdate,
  onUnitCreate,
  onUnitUpdate,
  onUnitSelect,
}) {
  const [setup, setSetup] = useState("");
  const [usage, setUsage] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [editingTroubleshootingId, setEditingTroubleshootingId] =
    useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const editSectionRef = useRef(null);
  const guideSectionRef = useRef(null);
  const [loanStartDate, setLoanStartDate] = useState("");
  const [loanEndDate, setLoanEndDate] = useState("");
  const [loanUnitId, setLoanUnitId] = useState("");

  const availableUnits = units.filter((unit) => unit.status === "AVAILABLE");
  const selectedUnit = availableUnits.find(
    (unit) => unit.id === Number(loanUnitId),
  );

  async function handleLoanSubmit(event) {
    event.preventDefault();

    const submitted = await onLoanRequest(
      Number(loanUnitId),
      loanStartDate,
      loanEndDate,
    );

    if (submitted) {
      setLoanUnitId("");
      setLoanStartDate("");
      setLoanEndDate("");
    }
  }

  async function handleGuideSubmit(event) {
    event.preventDefault();

    if (isEditing) {
      const updated = await onGuideUpdate(setup, usage);

      if (updated) {
        setSetup("");
        setUsage("");
        setIsEditing(false);
      }

      return;
    }

    const created = await onGuideCreate(setup, usage);

    if (created) {
      setSetup("");
      setUsage("");
    }
  }

  function handleEditGuide() {
    setSetup(guide.setup);
    setUsage(guide.usage);
    setIsEditing(true);

    setTimeout(() => {
      editSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  function handleCancelEdit() {
    setSetup("");
    setUsage("");
    setIsEditing(false);

    setTimeout(() => {
      guideSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  function handleEditTroubleshooting(item) {
    setProblem(item.problem);
    setSolution(item.solution);
    setEditingTroubleshootingId(item.id);
  }

  function handleCancelTroubleshootingEdit() {
    setProblem("");
    setSolution("");
    setEditingTroubleshootingId(null);
  }

  async function handleTroubleshootingSubmit(event) {
    event.preventDefault();

    let success;

    if (editingTroubleshootingId !== null) {
      success = await onTroubleshootingUpdate(
        editingTroubleshootingId,
        problem,
        solution,
      );
    } else {
      success = await onTroubleshootingCreate(problem, solution);
    }

    if (success) {
      setProblem("");
      setSolution("");
      setEditingTroubleshootingId(null);
    }
  }

  return (
    <section className="equipment-details">
      <div className="equipment-details-header">
        <div>
          <p className="equipment-category">{equipment.category}</p>
          <h1>{equipment.name}</h1>
          <p className="equipment-model">{equipment.typeModel}</p>
        </div>

        <span className="condition-badge">{equipment.condition}</span>
      </div>

      <section className="details-section">
        <h2>Equipment information</h2>

        <div className="information-card">
          <div className="information-item">
            <span>Location</span>
            <strong>{equipment.location}</strong>
          </div>

          <div className="information-item">
            <span>Availability</span>
            <strong>
              {equipment.availableQuantity} of {equipment.totalQuantity}{" "}
              available
            </strong>
          </div>

          <div className="information-item">
            <span>Total quantity</span>
            <strong>{equipment.totalQuantity}</strong>
          </div>

          <div className="information-item">
            <span>Condition</span>
            <strong>{equipment.condition}</strong>
          </div>
        </div>
      </section>

      <UnitList
        units={units}
        user={user}
        onUnitCreate={onUnitCreate}
        onUnitUpdate={onUnitUpdate}
        onUnitSelect={onUnitSelect}
      />

      {user.role === "STUDENT" && (
        <section className="details-section">
          <h2>Request equipment</h2>

          {availableUnits.length === 0 ? (
            <div className="guide-card">
              <p>No units are available right now.</p>
            </div>
          ) : (
            <form onSubmit={handleLoanSubmit}>
              <label htmlFor="loan-unit">Unit</label>
              <select
                id="loan-unit"
                value={loanUnitId}
                onChange={(event) => setLoanUnitId(event.target.value)}
                required
              >
                <option value="">Choose a unit</option>
                {availableUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.identifier}
                  </option>
                ))}
              </select>

              {selectedUnit && (
                <p className="loan-unit-info">
                  {selectedUnit.identifier} is available at{" "}
                  {selectedUnit.location}. Condition: {selectedUnit.condition}.
                </p>
              )}

              <label htmlFor="loan-start-date">Start date</label>
              <input
                id="loan-start-date"
                type="date"
                value={loanStartDate}
                onChange={(event) => setLoanStartDate(event.target.value)}
                required
              />

              <label htmlFor="loan-end-date">End date</label>
              <input
                id="loan-end-date"
                type="date"
                value={loanEndDate}
                onChange={(event) => setLoanEndDate(event.target.value)}
                required
              />

              <button type="submit">Request loan</button>
            </form>
          )}
        </section>
      )}

      <section ref={guideSectionRef} className="details-section">
        <div className="section-heading">
          <h2>Equipment Guide</h2>

          {guide && (user.role === "MAINTAINER" || user.role === "ADMIN") && (
            <button
              className="secondary-button"
              type="button"
              onClick={handleEditGuide}
            >
              Edit guide
            </button>
          )}
        </div>

        {guide ? (
          <div className="guide-card">
            <div className="guide-section">
              <h3>Setup</h3>
              <p>{guide.setup}</p>
            </div>

            <div className="guide-section">
              <h3>Usage</h3>
              <p>{guide.usage}</p>
            </div>
          </div>
        ) : (
          <div className="guide-card">
            <p>No guide available.</p>
          </div>
        )}
      </section>

      <section className="details-section">
        <h2>Troubleshooting</h2>

        {troubleshooting.length > 0 ? (
          <div className="guide-card">
            {troubleshooting.map((item) => (
              <div className="guide-section" key={item.id}>
                <div className="section-heading">
                  <h3>{item.problem}</h3>

                  {(user.role === "MAINTAINER" || user.role === "ADMIN") && (
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => handleEditTroubleshooting(item)}
                    >
                      Edit
                    </button>
                  )}
                </div>

                <p>
                  <strong>Possible solution:</strong> {item.solution}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="guide-card">
            <p>No troubleshooting information available.</p>
          </div>
        )}
      </section>

      {(user.role === "MAINTAINER" || user.role === "ADMIN") && (
        <section className="details-section guide-management">
          <h2>
            {editingTroubleshootingId !== null
              ? "Edit Troubleshooting Information"
              : "Add Troubleshooting Information"}
          </h2>

          <form onSubmit={handleTroubleshootingSubmit}>
            <label htmlFor="troubleshooting-problem">Common problem</label>
            <textarea
              id="troubleshooting-problem"
              value={problem}
              onChange={(event) => setProblem(event.target.value)}
              required
            />

            <label htmlFor="troubleshooting-solution">Possible solution</label>
            <textarea
              id="troubleshooting-solution"
              value={solution}
              onChange={(event) => setSolution(event.target.value)}
              required
            />

            <button type="submit">
              {editingTroubleshootingId !== null
                ? "Save changes"
                : "Add troubleshooting"}
            </button>

            {editingTroubleshootingId !== null && (
              <button
                className="secondary-button"
                type="button"
                onClick={handleCancelTroubleshootingEdit}
              >
                Cancel
              </button>
            )}
          </form>
        </section>
      )}

      {(user.role === "MAINTAINER" || user.role === "ADMIN") &&
        (!guide || isEditing) && (
          <section
            ref={editSectionRef}
            className="details-section guide-management"
          >
            <h2>
              {isEditing ? "Edit Equipment Guide" : "Create Equipment Guide"}
            </h2>

            <form onSubmit={handleGuideSubmit}>
              <label htmlFor="guide-setup">Setup instructions</label>
              <textarea
                id="guide-setup"
                value={setup}
                onChange={(event) => setSetup(event.target.value)}
                required
              />

              <label htmlFor="guide-usage">Usage instructions</label>
              <textarea
                id="guide-usage"
                value={usage}
                onChange={(event) => setUsage(event.target.value)}
                required
              />

              <button type="submit">
                {isEditing ? "Save changes" : "Create guide"}
              </button>

              {isEditing && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              )}
            </form>
          </section>
        )}
      <button
        className="scroll-top-button"
        type="button"
        aria-label="Back to top"
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        ↑
      </button>
    </section>
  );
}

export default EquipmentDetails;
