import { useState } from "react";

const STATUS_LABELS = {
  AVAILABLE: "Available",
  ON_LOAN: "On loan",
  OUT_OF_SERVICE: "Out of service",
};

const emptyUnit = {
  identifier: "",
  location: "",
  condition: "Good",
  status: "AVAILABLE",
};

function UnitList({ units, user, onUnitCreate, onUnitUpdate, onUnitSelect }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState(null);
  const [form, setForm] = useState(emptyUnit);

  const canManage = user.role === "MAINTAINER" || user.role === "ADMIN";

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function startAdd() {
    setForm(emptyUnit);
    setEditingUnitId(null);
    setShowAddForm(true);
  }

  function startEdit(unit) {
    setForm({
      identifier: unit.identifier,
      location: unit.location,
      condition: unit.condition,
      status: unit.status,
    });
    setShowAddForm(false);
    setEditingUnitId(unit.id);
  }

  function closeForm() {
    setShowAddForm(false);
    setEditingUnitId(null);
    setForm(emptyUnit);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const saved =
      editingUnitId !== null
        ? await onUnitUpdate(editingUnitId, form)
        : await onUnitCreate(form);

    if (saved) {
      closeForm();
    }
  }

  const isFormOpen = showAddForm || editingUnitId !== null;

  return (
    <section className="details-section">
      <div className="section-heading">
        <h2>Units</h2>

        {canManage && !isFormOpen && (
          <button className="secondary-button" type="button" onClick={startAdd}>
            Add unit
          </button>
        )}
      </div>

      {isFormOpen && (
        <form className="unit-form" onSubmit={handleSubmit}>
          <h3>{editingUnitId !== null ? "Edit unit" : "Add unit"}</h3>

          <label htmlFor="unit-identifier">Identifier</label>
          <input
            id="unit-identifier"
            type="text"
            value={form.identifier}
            onChange={(event) => updateField("identifier", event.target.value)}
            placeholder="e.g. OSC-005"
            required
          />

          <label htmlFor="unit-location">Location</label>
          <input
            id="unit-location"
            type="text"
            value={form.location}
            onChange={(event) => updateField("location", event.target.value)}
            required
          />

          <label htmlFor="unit-condition">Condition</label>
          <input
            id="unit-condition"
            type="text"
            value={form.condition}
            onChange={(event) => updateField("condition", event.target.value)}
            required
          />

          {editingUnitId !== null && (
            <>
              <label htmlFor="unit-status">Status</label>
              <select
                id="unit-status"
                value={form.status}
                onChange={(event) => updateField("status", event.target.value)}
              >
                <option value="AVAILABLE">Available</option>
                <option value="OUT_OF_SERVICE">Out of service</option>
                {form.status === "ON_LOAN" && (
                  <option value="ON_LOAN">On loan</option>
                )}
              </select>
            </>
          )}

          <button type="submit">
            {editingUnitId !== null ? "Save unit" : "Add unit"}
          </button>

          <button
            className="secondary-button"
            type="button"
            onClick={closeForm}
          >
            Cancel
          </button>
        </form>
      )}

      {units.length === 0 ? (
        <div className="guide-card">
          <p>No units registered.</p>
        </div>
      ) : (
        <ul className="unit-list">
          {units.map((unit) => (
            <li className="unit-row" key={unit.id}>
              <div className="unit-main">
                <strong>{unit.identifier}</strong>
                <span>{unit.location}</span>
                <span>Condition: {unit.condition}</span>
              </div>

              <div className="unit-actions">
                <span
                  className={`status-pill status-${unit.status.toLowerCase()}`}
                >
                  {STATUS_LABELS[unit.status]}
                </span>

                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => onUnitSelect(unit.id)}
                >
                  View
                </button>

                {canManage && (
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => startEdit(unit)}
                  >
                    Edit
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default UnitList;
