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
    </section>
  );
}

export default EquipmentDetails;
