import { useState } from "react";

function EquipmentForm({
  initialEquipment = null,
  onSubmit,
  onCancel,
  title = "Add equipment",
  submitLabel = "Add equipment",
}) {
  const [name, setName] = useState(initialEquipment?.name ?? "");
  const [typeModel, setTypeModel] = useState(initialEquipment?.typeModel ?? "");
  const [totalQuantity, setTotalQuantity] = useState(
    initialEquipment?.totalQuantity ?? 1,
  );
  const [location, setLocation] = useState(initialEquipment?.location ?? "");
  const [condition, setCondition] = useState(
    initialEquipment?.condition ?? "Available",
  );

  async function handleSubmit(event) {
    event.preventDefault();

    const saved = await onSubmit({
      name,
      typeModel,
      totalQuantity: Number(totalQuantity),
      location,
      condition,
    });

    if (saved) {
      onCancel();
    }
  }

  return (
    <section className="details-section equipment-form-section">
      <h2>{title}</h2>

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

        <button type="submit">{submitLabel}</button>

        <button className="secondary-button" type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </section>
  );
}

export default EquipmentForm;
