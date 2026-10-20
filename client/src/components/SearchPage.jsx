import { useState } from "react";

function SearchPage({
  results,
  onSearch,
  onEquipmentSelect,
  onGuideSelect,
  onProjectSelect,
}) {
  const [term, setTerm] = useState(results?.term ?? "");

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(term);
  }

  const total = results
    ? results.equipment.length + results.guides.length + results.projects.length
    : 0;

  return (
    <>
      <h1 className="page-title">Search</h1>
      <p className="page-description">Search equipment, guides and projects.</p>

      <form className="search-form" onSubmit={handleSubmit}>
        <label htmlFor="global-search">Search for</label>
        <input
          id="global-search"
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          minLength={2}
          required
        />
        <button type="submit">Search</button>
      </form>

      {results && (
        <>
          <p className="page-description">
            {total} {total === 1 ? "result" : "results"} for “{results.term}”
          </p>

          <section className="details-section">
            <h2>Equipment ({results.equipment.length})</h2>

            {results.equipment.length === 0 ? (
              <div className="guide-card">
                <p>No equipment matches.</p>
              </div>
            ) : (
              <ul className="loan-list">
                {results.equipment.map((item) => (
                  <li className="loan-row" key={item.id}>
                    <div className="loan-main">
                      <strong>{item.name}</strong>
                      <span>
                        {item.typeModel} · {item.category}
                      </span>
                    </div>

                    <div className="loan-actions">
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => onEquipmentSelect(item.id)}
                      >
                        Open
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="details-section">
            <h2>Guides ({results.guides.length})</h2>

            {results.guides.length === 0 ? (
              <div className="guide-card">
                <p>No guides match.</p>
              </div>
            ) : (
              <ul className="loan-list">
                {results.guides.map((guide) => (
                  <li className="loan-row" key={guide.id}>
                    <div className="loan-main">
                      <strong>Guide for {guide.equipmentName}</strong>
                      <span>{guide.snippet}</span>
                    </div>

                    <div className="loan-actions">
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => onGuideSelect(guide.equipmentId)}
                      >
                        Open
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="details-section">
            <h2>Projects ({results.projects.length})</h2>

            {results.projects.length === 0 ? (
              <div className="guide-card">
                <p>No projects match.</p>
              </div>
            ) : (
              <ul className="loan-list">
                {results.projects.map((project) => (
                  <li className="loan-row" key={project.id}>
                    <div className="loan-main">
                      <strong>{project.title}</strong>
                      <span>{project.snippet}</span>
                    </div>

                    <div className="loan-actions">
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => onProjectSelect(project.id)}
                      >
                        Open
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </>
  );
}

export default SearchPage;
