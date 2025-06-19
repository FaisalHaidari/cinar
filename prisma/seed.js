const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    // Burada sadece menü ve admin verilerini ekleyebilirsiniz
    const categories = [
      'Oyuncaklar',
      'Sağlık ve Veteriner Ürünleri',
      'Mama ve Besin Ürünleri',
      'Kafesler ve Barınaklar',
    ];
    await prisma.category.deleteMany({});
    for (const name of categories) {
      await prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    }
    console.log('Seed işlemi tamamlandı!')
  } catch (error) {
    console.error('Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then(() => {
    console.log('Seeded categories');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 