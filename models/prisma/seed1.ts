import { faker } from "@faker-js/faker";
import { RoomSize, RoomType } from "@prisma/client";
import prisma from ".";
import { convertFileToBase64 } from "../../configs/fileUpload";

const seedRoom = async () => {
  const data = [];

  const roomTypes = [RoomType.VIP, RoomType.DELUX, RoomType.LIVING_SUITE];
  const roomSizes = [
    RoomSize.SINGLE,
    RoomSize.DOUBLE,
    RoomSize.TRIPLE,
    RoomSize.FAMILY,
  ];

  for (let i = 0; i < 2; i++) {
    const imageSrc = {
      path: `D:/TNT/PROJECT/Hotel_booking/app/assets/images/img/portfolio/${
        Math.floor(Math.random() * 6) + 1
      }.jpg`,
    } as Express.Multer.File;
    const image = await convertFileToBase64(imageSrc, false);

    data.push({
      roomID: faker.datatype.uuid(), //
      description: faker.commerce.productDescription(),
      type: faker.helpers.arrayElement(roomTypes),
      size: faker.helpers.arrayElement(roomSizes),
      price: parseFloat(faker.commerce.price()),
      pictures: image,
      isAvailable: true,
    });
  }

  await prisma.room.createMany({ data });
};

seedRoom()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
