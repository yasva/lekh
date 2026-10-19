import { useState } from "react";

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", { timeZone: "UTC" });
}

function ProjectLibrary({
  projects,
  equipmentList,
  onProjectCreate,
  onProjectSelect,
}) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [equipmentIds, setEquipmentIds] = useState([]);

  function toggleEquipment(id) {
    setEquipmentIds((current) =>
      current.includes(id)
        ? current.filter((equipmentId) => equipmentId !== id)
        : [...current, id],
    );
  }

  function closeForm() {
    setShowForm(false);
    setTitle("");
    setDescription("");
    setEquipmentIds([]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const saved = await onProjectCreate({ title, description, equipmentIds });

    if (saved) {
      closeForm();
    }
  }

  return (
    <>
      <div className="section-heading">
        <h1 className="page-title">Project library</h1>

        {!showForm && (
          <button type="button" onClick={() => setShowForm(true)}>
            Record a project
          </button>
        )}
      </div>

      <p className="page-description">
        Finished projects and the equipment they used.
      </p>

      {showForm && (
        <section className="details-section">
          <h2>Record a finished project</h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="project-title">Title</label>
            <input
              id="project-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              required
            />

            <label htmlFor="project-description">Description</label>
            <textarea
              id="project-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={2000}
              required
            />

            <fieldset className="project-equipment-options">
              <legend>Equipment used</legend>

              {equipmentList.map((item) => (
                <label key={item.id}>
                  <input
                    type="checkbox"
                    checked={equipmentIds.includes(item.id)}
                    onChange={() => toggleEquipment(item.id)}
                  />
                  {item.name}
                </label>
              ))}
            </fieldset>

            <button type="submit" disabled={equipmentIds.length === 0}>
              Save project
            </button>

            <button
              className="secondary-button"
              type="button"
              onClick={closeForm}
            >
              Cancel
            </button>
          </form>
        </section>
      )}

      {projects.length === 0 ? (
        <div className="guide-card">
          <p>No projects have been recorded yet.</p>
        </div>
      ) : (
        <ul className="loan-list">
          {projects.map((project) => (
            <li className="loan-row" key={project.id}>
              <div className="loan-main">
                <strong>{project.title}</strong>
                <span>
                  {project.equipment.map((item) => item.name).join(", ")}
                </span>
                <span>Recorded {formatDate(project.createdAt)}</span>
              </div>

              <div className="loan-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => onProjectSelect(project.id)}
                >
                  View
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default ProjectLibrary;
