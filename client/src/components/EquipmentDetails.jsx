function EquipmentDetails({ equipment }) {
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

        <h4>Setup</h4>
        <p>Check that the equipment is connected and ready for use.</p>

        <h4>Usage</h4>
        <p>Follow the equipment instructions before starting your work.</p>
      </section>
    </section>
  );
}

export default EquipmentDetails;
