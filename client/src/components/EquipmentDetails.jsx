import { useState } from "react";

function EquipmentDetails({
  equipment,
  guide,
  user,
  onGuideCreate,
  onGuideUpdate,
}) {
  const [setup, setSetup] = useState("");
  const [usage, setUsage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <section>
      <h2>{equipment.name}</h2>

      <p>
        <strong>Type/Model:</strong> {equipment.typeModel}
      </p>

      <p>
        <strong>Location:</strong> {equipment.location}
      </p>

      <p>
        <strong>Total quantity:</strong> {equipment.totalQuantity}
      </p>

      <p>
        <strong>Available quantity:</strong> {equipment.availableQuantity}
      </p>

      <p>
        <strong>Condition/Status:</strong> {equipment.condition}
      </p>

      <section>
        <h3>Equipment Guide</h3>

        {guide ? (
          <>
            <h4>Setup</h4>
            <p>{guide.setup}</p>

            <h4>Usage</h4>
            <p>{guide.usage}</p>

            {(user.role === "MAINTAINER" || user.role === "ADMIN") && (
              <button
                type="button"
                onClick={() => {
                  setSetup(guide.setup);
                  setUsage(guide.usage);
                  setIsEditing(true);
                }}
              >
                Edit guide
              </button>
            )}
          </>
        ) : (
          <p>No guide available.</p>
        )}
      </section>

      {(user.role === "MAINTAINER" || user.role === "ADMIN") && (
        <section>
          <h3>
            {isEditing ? "Edit Equipment Guide" : "Create Equipment Guide"}
          </h3>

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
          </form>
        </section>
      )}
    </section>
  );
}

export default EquipmentDetails;
