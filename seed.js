import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const lessons = [
  ['Navigate Your Excel Workspace','Getting Started'],
  ['Enter and Edit Workplace Data','Working with Data'],
  ['Format Professional Worksheets','Making Data Professional'],
  ['Manage Rows and Columns','Working with Data'],
  ['Work with Basic Calculations','Calculations & Formulas'],
  ['Build Your First Business Formula','Calculations & Formulas'],
  ['Use SUM and AVERAGE','Calculations & Formulas'],
  ['Use COUNT and IF','Calculations & Formulas'],
  ['Sort and Filter Workplace Data','Organizing & Analyzing Data'],
  ['Create Excel Tables','Organizing & Analyzing Data'],
  ['Apply Conditional Formatting','Making Data Professional'],
  ['Use Data Validation','Working with Data'],
  ['Find and Replace Data','Working with Data'],
  ['Prepare Print Layouts','Making Data Professional'],
  ['Create Basic Charts','Reporting & Visualization'],
  ['Analyze with PivotTables','Organizing & Analyzing Data'],
  ['Final Workplace Challenge','Reporting & Visualization']
];

try {
  for (let i = 0; i < lessons.length; i++) {
    const [title, area] = lessons[i];
    await db.lesson.upsert({
      where: { id: `lesson-${i + 1}` },
      update: { title, area, sortOrder: i + 1 },
      create: { id: `lesson-${i + 1}`, title, area, sortOrder: i + 1 }
    });
  }
  console.log(`Seeded ${lessons.length} Skillora lessons.`);
} finally {
  await db.$disconnect();
}
