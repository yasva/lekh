function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", { timeZone: "UTC" });
}

function ProjectDetails({ project, onBack, onEquipmentSelect }) {
  return (
    <>
      <div className="equipment-navigation">
        <button className="back-button" type="button" onClick={onBack}>
          ← Back to project library
        </button>
      </div>

      <h1 className="page-title">{project.title}</h1>
      <p className="page-description">
        Recorded {formatDate(project.createdAt)}
      </p>

      <section className="details-section">
        <h2>Description</h2>

        <div className="guide-card">
          <p>{project.description}</p>
        </div>
      </section>

      <section className="details-section">
        <h2>Equipment used</h2>

        <ul className="loan-list">
          {project.equipment.map((item) => (
            <li className="loan-row" key={item.id}>
              <div className="loan-main">
                <strong>{item.name}</strong>
              </div>

              <div className="loan-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => onEquipmentSelect(item.id)}
                >
                  Open equipment
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default ProjectDetails;
