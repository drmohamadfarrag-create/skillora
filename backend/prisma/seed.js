import {PrismaClient} from '@prisma/client'; const db=new PrismaClient();
const names=['Navigate Your Excel Workspace','Enter and Edit Workplace Data','Format Professional Worksheets','Manage Rows and Columns','Work with Basic Calculations','Build Your First Business Formula','Use SUM and AVERAGE','Use COUNT and IF','Sort and Filter Workplace Data','Create Excel Tables','Apply Conditional Formatting','Use Data Validation','Find and Replace Data','Prepare Print Layouts','Create Basic Charts','Analyze with PivotTables','Final Workplace Challenge'];
const namesAr=['التنقل في مساحة عمل إكسل','إدخال البيانات وتعديلها','تنسيق أوراق العمل باحترافية','إدارة الصفوف والأعمدة','إجراء الحسابات الأساسية','إنشاء أول صيغة عمل','استخدام SUM وAVERAGE','استخدام COUNT وIF','فرز البيانات وتصفيتها','إنشاء جداول إكسل','تطبيق التنسيق الشرطي','استخدام التحقق من صحة البيانات','البحث عن البيانات واستبدالها','إعداد تخطيطات الطباعة','إنشاء رسوم بيانية أساسية','التحليل باستخدام الجداول المحورية','التحدي النهائي لبيئة العمل'];
const area=i=>i<1?'Getting Started':i<4?'Working with Data':i<5?'Calculations & Formulas':i<8?'Calculations & Formulas':i<10?'Organizing & Analyzing Data':i<12?'Making Data Professional':i<14?'Working with Data':i<15?'Making Data Professional':i<17?'Reporting & Visualization':'Reporting & Visualization';
const AREA_AR={'Getting Started':'البداية','Working with Data':'العمل مع البيانات','Calculations & Formulas':'الحسابات والصيغ','Organizing & Analyzing Data':'تنظيم البيانات وتحليلها','Making Data Professional':'إعداد بيانات احترافية','Reporting & Visualization':'إعداد التقارير والتمثيل البصري'};
for(let i=0;i<names.length;i++){
  const a=area(i);
  await db.lesson.upsert({
    where:{id:`lesson-${i+1}`},
    update:{title:names[i],area:a,titleAr:namesAr[i],areaAr:AREA_AR[a]},
    create:{id:`lesson-${i+1}`,title:names[i],area:a,titleAr:namesAr[i],areaAr:AREA_AR[a],sortOrder:i+1},
  });
}
console.log(`Seeded ${names.length} lessons (en/ar).`);
await db.$disconnect();
