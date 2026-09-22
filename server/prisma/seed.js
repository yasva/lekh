require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const equipmentData = [
  {
    name: "Raspberry Pi",
    typeModel: "Raspberry Pi 5",
    location: "Lab A - Shelf 1",
    totalQuantity: 10,
    availableQuantity: 8,
    condition: "Available",
    guide: {
      setup:
        "Connect the Raspberry Pi to a monitor, keyboard, mouse, power supply, and network if required.",
      usage:
        "Use the Raspberry Pi for programming, electronics, and laboratory projects. Shut down the operating system before disconnecting power.",
    },
  },
  {
    name: "Arduino",
    typeModel: "Arduino Uno",
    location: "Lab A - Shelf 1",
    totalQuantity: 12,
    availableQuantity: 9,
    condition: "Available",
    guide: {
      setup:
        "Connect the Arduino Uno to a computer using a USB cable and select the correct board and port in the Arduino IDE.",
      usage:
        "Upload sketches through the Arduino IDE and connect external components according to the project circuit.",
    },
  },
  {
    name: "Oscilloscope",
    typeModel: "Rigol DS1054Z",
    location: "Lab B - Workbench 2",
    totalQuantity: 4,
    availableQuantity: 3,
    condition: "Available",
    guide: {
      setup:
        "Connect the probe to the selected channel and verify the probe attenuation setting before taking measurements.",
      usage:
        "Use the oscilloscope to inspect electrical signals. Adjust voltage and time scales to display the signal clearly.",
    },
  },
  {
    name: "Logic Analyzer",
    typeModel: "Saleae Logic 8",
    location: "Lab B - Shelf 3",
    totalQuantity: 3,
    availableQuantity: 2,
    condition: "Available",
  },
];

async function main() {
  for (const item of equipmentData) {
    const existingEquipment = await prisma.equipment.findFirst({
      where: {
        name: item.name,
        typeModel: item.typeModel,
      },
    });

    if (existingEquipment) {
      console.log(`Skipping existing equipment: ${item.name}`);
      continue;
    }

    const equipment = await prisma.equipment.create({
      data: {
        name: item.name,
        typeModel: item.typeModel,
        location: item.location,
        totalQuantity: item.totalQuantity,
        availableQuantity: item.availableQuantity,
        condition: item.condition,
        ...(item.guide && {
          guides: {
            create: {
              setup: item.guide.setup,
              usage: item.guide.usage,
            },
          },
        }),
      },
    });

    console.log(`Created equipment: ${equipment.name}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
