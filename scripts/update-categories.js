const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Create Yiyecek category
    const category1 = await prisma.category.upsert({
      where: { name: 'Yiyecek' },
      update: {},
      create: { name: 'Yiyecek' },
    });
    // Create İçecek category
    const category2 = await prisma.category.upsert({
      where: { name: 'İçecek' },
      update: {},
      create: { name: 'İçecek' },
    });
    console.log('Categories ensured:', category1, category2);

    // Update all menu items to use this category
    const updatedItems = await prisma.menuItem.updateMany({
      where: {
        categoryId: null
      },
      data: {
        categoryId: category1.id
      }
    });

    console.log('Updated menu items:', updatedItems);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 