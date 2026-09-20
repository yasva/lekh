import { useRef, useState } from "react";

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
  const editSectionRef = useRef(null);
  const guideSectionRef = useRef(null);

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

  return (
    <section className="equipment-details">
      <div className="equipment-details-header">
        <div>
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
