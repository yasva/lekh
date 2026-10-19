require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcrypt");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const userData = [
  { username: "student", role: "STUDENT" },
  { username: "maintainer", role: "MAINTAINER" },
  { username: "admin", role: "ADMIN" },
];

const demoPassword = "password123";

const equipmentData = [
  {
    name: "Raspberry Pi",
    typeModel: "Raspberry Pi 5",
    unitPrefix: "RPI",
    category: "Single-board computer",
    location: "Lab A - Shelf 1",
    totalQuantity: 10,
    condition: "Available",
    approvalRequired: true,
    guide: {
      setup:
        "Connect the Raspberry Pi to a monitor, keyboard, mouse, power supply, and network if required.",
      usage:
        "Use the Raspberry Pi for programming, electronics, and laboratory projects. Shut down the operating system before disconnecting power.",
    },
    troubleshooting: [
      {
        problem: "The Raspberry Pi does not boot and only the red LED is lit.",
        solution:
          "Check that the microSD card is inserted and contains a valid operating system image. Re-flash the card with Raspberry Pi Imager if needed.",
      },
      {
        problem: "A lightning bolt icon appears on the screen.",
        solution:
          "The board is under-powered. Use the official 27 W USB-C power supply instead of a phone charger or a computer USB port.",
      },
    ],
  },
  {
    name: "Arduino",
    typeModel: "Arduino Uno",
    unitPrefix: "ARD",
    category: "Microcontroller",
    location: "Lab A - Shelf 1",
    totalQuantity: 12,
    condition: "Available",
    approvalRequired: true,
    guide: {
      setup:
        "Connect the Arduino Uno to a computer using a USB cable and select the correct board and port in the Arduino IDE.",
      usage:
        "Upload sketches through the Arduino IDE and connect external components according to the project circuit.",
    },
    troubleshooting: [
      {
        problem:
          'Upload fails with "avrdude: stk500_recv(): programmer is not responding".',
        solution:
          "Select the correct port under Tools > Port, disconnect anything wired to pins 0 and 1, and try the upload again.",
      },
    ],
  },
  {
    name: "Oscilloscope",
    typeModel: "Rigol DS1054Z",
    unitPrefix: "OSC",
    category: "Measurement",
    location: "Lab B - Workbench 2",
    totalQuantity: 4,
    condition: "Available",
    approvalRequired: true,
    guide: {
      setup:
        "Connect the probe to the selected channel and verify the probe attenuation setting before taking measurements.",
      usage:
        "Use the oscilloscope to inspect electrical signals. Adjust voltage and time scales to display the signal clearly.",
    },
    troubleshooting: [
      {
        problem: "The measured voltage is ten times too low or too high.",
        solution:
          "The probe switch (1X/10X) does not match the channel's probe setting. Set both to the same attenuation.",
      },
    ],
  },
  {
    name: "Logic Analyzer",
    typeModel: "Saleae Logic 8",
    unitPrefix: "LA",
    category: "Measurement",
    location: "Lab B - Shelf 3",
    totalQuantity: 3,
    condition: "Available",
    approvalRequired: true,
  },
];

async function main() {
  await prisma.$transaction(async (transaction) => {
    await transaction.$executeRawUnsafe(
      'TRUNCATE TABLE "Project", "Fault", "Loan", "Troubleshooting", "Guide", "EquipmentUnit", "Equipment", "User" RESTART IDENTITY CASCADE',
    );

    const passwordHash = await bcrypt.hash(demoPassword, 10);

    for (const user of userData) {
      await transaction.user.create({
        data: {
          username: user.username,
          passwordHash,
          role: user.role,
        },
      });
    }

    for (const item of equipmentData) {
      const equipment = await transaction.equipment.create({
        data: {
          name: item.name,
          typeModel: item.typeModel,
          category: item.category,
          location: item.location,
          totalQuantity: item.totalQuantity,
          availableQuantity: item.totalQuantity,
          condition: item.condition,
          approvalRequired: item.approvalRequired,
          ...(item.guide && {
            guides: {
              create: {
                setup: item.guide.setup,
                usage: item.guide.usage,
              },
            },
          }),
          units: {
            create: Array.from({ length: item.totalQuantity }, (_, index) => ({
              identifier: `${item.unitPrefix}-${String(index + 1).padStart(3, "0")}`,
              location: item.location,
              condition: "Good",
            })),
          },
          ...(item.troubleshooting && {
            troubleshooting: {
              create: item.troubleshooting,
            },
          }),
        },
      });

      console.log(`Created equipment: ${equipment.name}`);
    }

    const student = await transaction.user.findUnique({
      where: { username: "student" },
    });

    const projectEquipment = await transaction.equipment.findMany({
      where: { name: { in: ["Raspberry Pi", "Arduino"] } },
      select: { id: true },
    });

    await transaction.project.create({
      data: {
        title: "Weather station",
        description:
          "Measures temperature and humidity every minute and shows the values on a web page. An Arduino reads the sensor and the Raspberry Pi stores and serves the data.",
        authorId: student.id,
        equipment: {
          connect: projectEquipment,
        },
      },
    });
  });

  const [users, equipment, units, guides, troubleshooting, loans, projects] =
    await Promise.all([
      prisma.user.count(),
      prisma.equipment.count(),
      prisma.equipmentUnit.count(),
      prisma.guide.count(),
      prisma.troubleshooting.count(),
      prisma.loan.count(),
      prisma.project.count(),
    ]);

  console.log(
    `Demo state ready: ${users} users, ${equipment} equipment, ${units} units, ${guides} guides, ${troubleshooting} troubleshooting entries, ${loans} loans, ${projects} projects.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
