import { useState } from "react";

function EquipmentForm({ onCreate, onCancel }) {
  const [name, setName] = useState("");
  const [typeModel, setTypeModel] = useState("");
  const [totalQuantity, setTotalQuantity] = useState(1);
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState("Available");

  async function handleSubmit(event) {
    event.preventDefault();

    const created = await onCreate({
      name,
      typeModel,
      totalQuantity: Number(totalQuantity),
      location,
      condition,
    });

    if (created) {
      onCancel();
    }
  }

  return (
    <section className="details-section equipment-form-section">
      <h2>Add equipment</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="equipment-name">Name</label>
        <input
          id="equipment-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <label htmlFor="equipment-model">Type / model</label>
        <input
          id="equipment-model"
          type="text"
          value={typeModel}
          onChange={(event) => setTypeModel(event.target.value)}
          required
        />

        <label htmlFor="equipment-quantity">Quantity</label>
        <input
          id="equipment-quantity"
          type="number"
          min="1"
          value={totalQuantity}
          onChange={(event) => setTotalQuantity(event.target.value)}
          required
        />

        <label htmlFor="equipment-location">Location</label>
        <input
          id="equipment-location"
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          required
        />

        <label htmlFor="equipment-condition">Condition / status</label>
        <input
          id="equipment-condition"
          type="text"
          value={condition}
          onChange={(event) => setCondition(event.target.value)}
          required
        />

        <button type="submit">Add equipment</button>

        <button
          className="secondary-button"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </form>
    </section>
  );
}

export default EquipmentForm;
