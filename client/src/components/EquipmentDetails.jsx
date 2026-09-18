function EquipmentDetails({ equipment, guide }) {
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
          </>
        ) : (
          <p>No guide available.</p>
        )}
      </section>
    </section>
  );
}

export default EquipmentDetails;
