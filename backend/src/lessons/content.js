// Lesson content & task engine data.
// Each lesson id (matching backend/prisma/seed.js) maps to an ordered array of tasks.
// Task types:
//   - 'click_cell'      : user must click the correct cell in a rendered grid
//   - 'multiple_choice'  : user picks one option
//   - 'formula'          : user types a formula into a target cell; checked against `answers`
//
// `grid` (when present) describes a small mock worksheet: cols (letters), rowCount,
// and `values` keyed by cell ref (e.g. "A1") for pre-filled cell contents. Grid sample
// data (item names, prices, etc.) is intentionally left in English in both languages —
// only the instructional text (title/prompt/hint/option labels) is localized — since the
// underlying answers reference cell addresses (B2, C2, ...) which are language-independent.
//
// `answers` for formula tasks are normalized (whitespace stripped, uppercased) before comparison,
// so provide all equivalent forms (e.g. "=B2*C2" and "=C2*B2"). Multiple-choice validation
// compares option `id`s, not their translated `text`, so localization never touches answer logic.
//
// `ar` fields hold Arabic translations of the display-only strings (title/prompt/hint/options[].text).
// Anything without an `ar` override silently falls back to English (see localizeTask/localizeLesson).

const grid = (cols, rowCount, values) => ({ cols, rowCount, values });

export const LESSONS = {
  'lesson-1': {
    title: 'Navigate Your Excel Workspace',
    ar: { title: 'التنقل في مساحة عمل إكسل' },
    tasks: [
      {
        id: 'l1-t1',
        type: 'click_cell',
        prompt: 'Click cell C3 to select it.',
        hint: 'Columns run left to right (A, B, C…), rows run top to bottom (1, 2, 3…). C3 is the intersection of column C and row 3.',
        grid: grid(['A', 'B', 'C', 'D'], 5, {}),
        target: 'C3',
        ar: {
          prompt: 'انقر فوق الخلية C3 لتحديدها.',
          hint: 'الأعمدة تمتد من اليسار إلى اليمين (A، B، C...)، والصفوف من الأعلى إلى الأسفل (1، 2، 3...). الخلية C3 هي نقطة تقاطع العمود C مع الصف 3.',
        },
      },
    ],
  },

  'lesson-2': {
    title: 'Enter and Edit Workplace Data',
    ar: { title: 'إدخال البيانات وتعديلها' },
    tasks: [
      {
        id: 'l2-t1',
        type: 'multiple_choice',
        prompt: 'You just typed a value into a cell. Which key confirms the entry and moves selection to the cell below?',
        hint: 'Tab moves right; this key moves down.',
        options: [
          { id: 'a', text: 'Enter' },
          { id: 'b', text: 'Tab' },
          { id: 'c', text: 'Spacebar' },
          { id: 'd', text: 'Esc' },
        ],
        correctOptionId: 'a',
        ar: {
          prompt: 'لقد أدخلت للتو قيمة في خلية. أي مفتاح يؤكد الإدخال وينقل التحديد إلى الخلية الموجودة أسفلها؟',
          hint: 'مفتاح Tab ينقل التحديد إلى اليمين؛ هذا المفتاح ينقله إلى الأسفل.',
          options: [
            { id: 'a', text: 'Enter' },
            { id: 'b', text: 'Tab' },
            { id: 'c', text: 'مفتاح المسافة (Spacebar)' },
            { id: 'd', text: 'Esc' },
          ],
        },
      },
    ],
  },

  'lesson-3': {
    title: 'Format Professional Worksheets',
    ar: { title: 'تنسيق أوراق العمل باحترافية' },
    tasks: [
      {
        id: 'l3-t1',
        type: 'multiple_choice',
        prompt: 'You want a header row to stand out clearly from the data below it. Which formatting choice best achieves this?',
        hint: 'Think about what makes a header readable at a glance, not just colorful.',
        options: [
          { id: 'a', text: 'Bold text with a light fill color' },
          { id: 'b', text: 'Italic red text on every other word' },
          { id: 'c', text: 'A different random color per cell' },
          { id: 'd', text: 'No formatting — headers should match the data' },
        ],
        correctOptionId: 'a',
        ar: {
          prompt: 'تريد أن يبرز صف العناوين بوضوح عن البيانات الموجودة أسفله. أي خيار تنسيق يحقق ذلك بأفضل شكل؟',
          hint: 'فكّر فيما يجعل العنوان مقروءًا بسهولة، لا مجرد ملوّن.',
          options: [
            { id: 'a', text: 'نص عريض (Bold) مع لون تعبئة فاتح' },
            { id: 'b', text: 'نص مائل باللون الأحمر في كل كلمة أخرى' },
            { id: 'c', text: 'لون عشوائي مختلف لكل خلية' },
            { id: 'd', text: 'بدون أي تنسيق — يجب أن تطابق العناوين البيانات' },
          ],
        },
      },
    ],
  },

  'lesson-4': {
    title: 'Manage Rows and Columns',
    ar: { title: 'إدارة الصفوف والأعمدة' },
    tasks: [
      {
        id: 'l4-t1',
        type: 'multiple_choice',
        prompt: 'You need to add a new row between row 2 and row 3, without disturbing existing data. What do you do?',
        hint: 'Right-click a row number to see row-level options.',
        options: [
          { id: 'a', text: 'Right-click the row 3 header and choose Insert' },
          { id: 'b', text: 'Right-click the row 2 header and choose Delete' },
          { id: 'c', text: 'Select cell A3 and press Delete' },
          { id: 'd', text: 'Retype all the data one row lower' },
        ],
        correctOptionId: 'a',
        ar: {
          prompt: 'تحتاج إلى إضافة صف جديد بين الصف 2 والصف 3، دون التأثير على البيانات الموجودة. ماذا تفعل؟',
          hint: 'انقر بزر الماوس الأيمن على رقم الصف لرؤية خيارات خاصة بالصف.',
          options: [
            { id: 'a', text: 'انقر بزر الماوس الأيمن على رأس الصف 3 واختر إدراج (Insert)' },
            { id: 'b', text: 'انقر بزر الماوس الأيمن على رأس الصف 2 واختر حذف (Delete)' },
            { id: 'c', text: 'حدد الخلية A3 واضغط Delete' },
            { id: 'd', text: 'أعد كتابة جميع البيانات في صف أسفل' },
          ],
        },
      },
    ],
  },

  'lesson-5': {
    title: 'Work with Basic Calculations',
    ar: { title: 'إجراء الحسابات الأساسية' },
    tasks: [
      {
        id: 'l5-t1',
        type: 'formula',
        prompt: 'Cell A2 holds hours worked (10) and B2 holds hours of overtime (5). In C2, write a formula that adds them together.',
        hint: 'Formulas start with =, then reference cells directly: =A2+B2',
        grid: grid(['A', 'B', 'C'], 2, { A1: 'Hours', B1: 'Overtime', C1: 'Total', A2: '10', B2: '5' }),
        targetCell: 'C2',
        answers: ['=A2+B2', '=B2+A2'],
        ar: {
          prompt: 'الخلية A2 تحتوي على عدد ساعات العمل (10) والخلية B2 تحتوي على ساعات العمل الإضافي (5). في الخلية C2، اكتب صيغة تجمعهما معًا.',
          hint: 'تبدأ الصيغ بعلامة =، ثم تُشير مباشرة إلى الخلايا: =A2+B2',
        },
      },
    ],
  },

  'lesson-6': {
    title: 'Build Your First Business Formula',
    ar: { title: 'إنشاء أول صيغة عمل' },
    tasks: [
      {
        id: 'l6-t1',
        type: 'formula',
        prompt: 'Row 2 lists a Price and a Quantity. In D2, write a formula that calculates the Total (Price × Quantity).',
        hint: 'Multiplication in a formula uses the * symbol: =B2*C2',
        grid: grid(['A', 'B', 'C', 'D'], 2, { A1: 'Item', B1: 'Price', C1: 'Qty', D1: 'Total', A2: 'Widget', B2: '12', C2: '3' }),
        targetCell: 'D2',
        answers: ['=B2*C2', '=C2*B2'],
        ar: {
          prompt: 'يعرض الصف 2 السعر والكمية. في الخلية D2، اكتب صيغة تحسب الإجمالي (السعر × الكمية).',
          hint: 'الضرب داخل الصيغة يستخدم الرمز *: =B2*C2',
        },
      },
      {
        id: 'l6-t2',
        type: 'formula',
        prompt: 'Row 2 now lists a second item. In D3, calculate its Total the same way (Price × Quantity).',
        hint: 'Same pattern as before, one row down: =B3*C3',
        grid: grid(['A', 'B', 'C', 'D'], 3, {
          A1: 'Item', B1: 'Price', C1: 'Qty', D1: 'Total',
          A2: 'Widget', B2: '12', C2: '3', D2: '36',
          A3: 'Gadget', B3: '8', C3: '5',
        }),
        targetCell: 'D3',
        answers: ['=B3*C3', '=C3*B3'],
        ar: {
          prompt: 'يعرض الجدول الآن عنصرًا ثانيًا. في الخلية D3، احسب إجماليه بالطريقة نفسها (السعر × الكمية).',
          hint: 'نفس النمط السابق، صف واحد للأسفل: =B3*C3',
        },
      },
    ],
  },

  'lesson-7': {
    title: 'Use SUM and AVERAGE',
    ar: { title: 'استخدام SUM وAVERAGE' },
    tasks: [
      {
        id: 'l7-t1',
        type: 'formula',
        prompt: 'Column B (rows 2–5) lists weekly sales. In B6, write a formula that totals the whole range.',
        hint: 'SUM adds up a range: =SUM(B2:B5)',
        grid: grid(['A', 'B'], 6, { A1: 'Week', B1: 'Sales', A2: 'Wk1', B2: '400', A3: 'Wk2', B3: '350', A4: 'Wk3', B4: '500', A5: 'Wk4', B5: '450', A6: 'Total' }),
        targetCell: 'B6',
        answers: ['=SUM(B2:B5)'],
        ar: {
          prompt: 'يعرض العمود B (الصفوف 2–5) المبيعات الأسبوعية. في الخلية B6، اكتب صيغة تجمع النطاق بالكامل.',
          hint: 'تجمع الدالة SUM نطاقًا من الخلايا: =SUM(B2:B5)',
        },
      },
      {
        id: 'l7-t2',
        type: 'formula',
        prompt: 'In B7, write a formula that finds the average weekly sales for the same range (B2:B5).',
        hint: 'AVERAGE works like SUM but returns the mean: =AVERAGE(B2:B5)',
        grid: grid(['A', 'B'], 7, { A1: 'Week', B1: 'Sales', A2: 'Wk1', B2: '400', A3: 'Wk2', B3: '350', A4: 'Wk3', B4: '500', A5: 'Wk4', B5: '450', A6: 'Total', B6: '1700', A7: 'Average' }),
        targetCell: 'B7',
        answers: ['=AVERAGE(B2:B5)'],
        ar: {
          prompt: 'في الخلية B7، اكتب صيغة تحسب متوسط المبيعات الأسبوعية لنفس النطاق (B2:B5).',
          hint: 'تعمل AVERAGE مثل SUM لكنها تُعيد المتوسط: =AVERAGE(B2:B5)',
        },
      },
    ],
  },

  'lesson-8': {
    title: 'Use COUNT and IF',
    ar: { title: 'استخدام COUNT وIF' },
    tasks: [
      {
        id: 'l8-t1',
        type: 'formula',
        prompt: 'Column A (rows 2–6) lists order IDs. In B2, count how many orders there are using COUNT.',
        hint: 'COUNT tallies numeric entries in a range: =COUNT(A2:A6)',
        grid: grid(['A', 'B'], 6, { A1: 'Order #', A2: '1001', A3: '1002', A4: '1003', A5: '1004', A6: '1005', B1: 'Count' }),
        targetCell: 'B2',
        answers: ['=COUNT(A2:A6)'],
        ar: {
          prompt: 'يعرض العمود A (الصفوف 2–6) أرقام الطلبات. في الخلية B2، احسب عدد الطلبات باستخدام COUNT.',
          hint: 'تحسب الدالة COUNT الخلايا الرقمية داخل نطاق: =COUNT(A2:A6)',
        },
      },
      {
        id: 'l8-t2',
        type: 'formula',
        prompt: 'B2 holds a score of 82. In C2, write an IF formula that returns "Pass" if the score is 60 or more, otherwise "Fail".',
        hint: 'IF syntax: =IF(condition,"if true","if false"). Use >= for "60 or more".',
        grid: grid(['A', 'B', 'C'], 2, { A1: 'Student', B1: 'Score', C1: 'Result', A2: 'Learner', B2: '82' }),
        targetCell: 'C2',
        answers: ['=IF(B2>=60,"PASS","FAIL")'],
        ar: {
          prompt: 'تحتوي الخلية B2 على درجة 82. في الخلية C2، اكتب صيغة IF تُعيد "Pass" إذا كانت الدرجة 60 أو أكثر، وإلا تُعيد "Fail".',
          hint: 'صيغة IF: =IF(الشرط,"صحيح","خطأ"). استخدم >= لعبارة "60 أو أكثر".',
        },
      },
    ],
  },

  'lesson-9': {
    title: 'Sort and Filter Workplace Data',
    ar: { title: 'فرز البيانات وتصفيتها' },
    tasks: [
      {
        id: 'l9-t1',
        type: 'multiple_choice',
        prompt: 'You have a table of orders and want to temporarily show only the rows where Region equals "East". Which feature fits best?',
        hint: 'This feature adds dropdown arrows to column headers.',
        options: [
          { id: 'a', text: 'Filter' },
          { id: 'b', text: 'Sort ascending' },
          { id: 'c', text: 'Freeze Panes' },
          { id: 'd', text: 'Merge & Center' },
        ],
        correctOptionId: 'a',
        ar: {
          prompt: 'لديك جدول طلبات وتريد إظهار الصفوف التي تكون فيها المنطقة "East" فقط، بشكل مؤقت. أي ميزة تناسب ذلك؟',
          hint: 'تضيف هذه الميزة أسهم قوائم منسدلة إلى رؤوس الأعمدة.',
          options: [
            { id: 'a', text: 'التصفية (Filter)' },
            { id: 'b', text: 'الفرز التصاعدي' },
            { id: 'c', text: 'تجميد الأجزاء (Freeze Panes)' },
            { id: 'd', text: 'دمج وتوسيط (Merge & Center)' },
          ],
        },
      },
    ],
  },

  'lesson-10': {
    title: 'Create Excel Tables',
    ar: { title: 'إنشاء جداول إكسل' },
    tasks: [
      {
        id: 'l10-t1',
        type: 'multiple_choice',
        prompt: 'You selected a range of data with headers. Which keyboard shortcut converts it into a proper Excel Table?',
        hint: '"T" for Table.',
        options: [
          { id: 'a', text: 'Ctrl+T' },
          { id: 'b', text: 'Ctrl+F' },
          { id: 'c', text: 'Ctrl+K' },
          { id: 'd', text: 'Ctrl+P' },
        ],
        correctOptionId: 'a',
        ar: {
          prompt: 'حدّدت نطاقًا من البيانات يحتوي على رؤوس أعمدة. ما اختصار لوحة المفاتيح الذي يحوّله إلى جدول إكسل حقيقي؟',
          hint: '"T" اختصار لكلمة Table.',
          options: [
            { id: 'a', text: 'Ctrl+T' },
            { id: 'b', text: 'Ctrl+F' },
            { id: 'c', text: 'Ctrl+K' },
            { id: 'd', text: 'Ctrl+P' },
          ],
        },
      },
    ],
  },

  'lesson-11': {
    title: 'Apply Conditional Formatting',
    ar: { title: 'تطبيق التنسيق الشرطي' },
    tasks: [
      {
        id: 'l11-t1',
        type: 'multiple_choice',
        prompt: 'You want every cell with a value over 1000 to automatically turn red. What should you use?',
        hint: 'This feature applies formatting rules based on a cell\'s value.',
        options: [
          { id: 'a', text: 'Conditional Formatting' },
          { id: 'b', text: 'Data Validation' },
          { id: 'c', text: 'Cell Styles' },
          { id: 'd', text: 'Format Painter' },
        ],
        correctOptionId: 'a',
        ar: {
          prompt: 'تريد أن تتحول كل خلية بها قيمة أكبر من 1000 إلى اللون الأحمر تلقائيًا. ماذا تستخدم؟',
          hint: 'تُطبّق هذه الميزة قواعد تنسيق بناءً على قيمة الخلية نفسها.',
          options: [
            { id: 'a', text: 'التنسيق الشرطي (Conditional Formatting)' },
            { id: 'b', text: 'التحقق من صحة البيانات' },
            { id: 'c', text: 'أنماط الخلايا' },
            { id: 'd', text: 'أداة نسخ التنسيق (Format Painter)' },
          ],
        },
      },
    ],
  },

  'lesson-12': {
    title: 'Use Data Validation',
    ar: { title: 'استخدام التحقق من صحة البيانات' },
    tasks: [
      {
        id: 'l12-t1',
        type: 'multiple_choice',
        prompt: 'You want a cell to only accept entries from a fixed dropdown list (e.g. "Small, Medium, Large"). Which feature enforces this?',
        hint: 'It restricts what can be typed into a cell.',
        options: [
          { id: 'a', text: 'Data Validation' },
          { id: 'b', text: 'AutoFill' },
          { id: 'c', text: 'Conditional Formatting' },
          { id: 'd', text: 'Text to Columns' },
        ],
        correctOptionId: 'a',
        ar: {
          prompt: 'تريد أن تقبل الخلية فقط قيمًا من قائمة منسدلة ثابتة (مثل "صغير، متوسط، كبير"). أي ميزة تفرض ذلك؟',
          hint: 'تحدّ هذه الميزة مما يمكن كتابته داخل الخلية.',
          options: [
            { id: 'a', text: 'التحقق من صحة البيانات (Data Validation)' },
            { id: 'b', text: 'التعبئة التلقائية (AutoFill)' },
            { id: 'c', text: 'التنسيق الشرطي' },
            { id: 'd', text: 'تحويل النص إلى أعمدة' },
          ],
        },
      },
    ],
  },

  'lesson-13': {
    title: 'Find and Replace Data',
    ar: { title: 'البحث عن البيانات واستبدالها' },
    tasks: [
      {
        id: 'l13-t1',
        type: 'multiple_choice',
        prompt: 'You need to replace every instance of "2023" with "2024" across a worksheet. What is the fastest way?',
        hint: 'A keyboard shortcut opens a dialog with both a "find" and a "replace" field.',
        options: [
          { id: 'a', text: 'Ctrl+H (Find & Replace)' },
          { id: 'b', text: 'Ctrl+Z (Undo) repeatedly' },
          { id: 'c', text: 'Manually retype each cell' },
          { id: 'd', text: 'Ctrl+S (Save) then edit' },
        ],
        correctOptionId: 'a',
        ar: {
          prompt: 'تحتاج إلى استبدال كل ظهور لـ "2023" بـ "2024" في ورقة العمل بالكامل. ما أسرع طريقة لذلك؟',
          hint: 'اختصار لوحة مفاتيح يفتح مربع حوار به حقلا "بحث" و"استبدال".',
          options: [
            { id: 'a', text: 'Ctrl+H (بحث واستبدال)' },
            { id: 'b', text: 'Ctrl+Z (تراجع) بشكل متكرر' },
            { id: 'c', text: 'إعادة الكتابة يدويًا في كل خلية' },
            { id: 'd', text: 'Ctrl+S (حفظ) ثم التعديل' },
          ],
        },
      },
    ],
  },

  'lesson-14': {
    title: 'Prepare Print Layouts',
    ar: { title: 'إعداد تخطيطات الطباعة' },
    tasks: [
      {
        id: 'l14-t1',
        type: 'multiple_choice',
        prompt: 'Your worksheet spans several printed pages, and you want the header row to repeat at the top of every page. What should you set?',
        hint: 'Found under Page Layout.',
        options: [
          { id: 'a', text: 'Print Titles' },
          { id: 'b', text: 'Page Break Preview' },
          { id: 'c', text: 'Print Area only' },
          { id: 'd', text: 'Freeze Panes' },
        ],
        correctOptionId: 'a',
        ar: {
          prompt: 'تمتد ورقة العمل عبر عدة صفحات مطبوعة، وتريد تكرار صف العناوين أعلى كل صفحة. ما الذي يجب ضبطه؟',
          hint: 'موجودة ضمن تبويب تخطيط الصفحة.',
          options: [
            { id: 'a', text: 'عناوين الطباعة (Print Titles)' },
            { id: 'b', text: 'معاينة فواصل الصفحات' },
            { id: 'c', text: 'منطقة الطباعة فقط' },
            { id: 'd', text: 'تجميد الأجزاء' },
          ],
        },
      },
    ],
  },

  'lesson-15': {
    title: 'Create Basic Charts',
    ar: { title: 'إنشاء رسوم بيانية أساسية' },
    tasks: [
      {
        id: 'l15-t1',
        type: 'multiple_choice',
        prompt: 'You want to show how monthly revenue changed over a full year. Which chart type communicates a trend over time best?',
        hint: 'Think about which chart naturally shows movement across a sequence.',
        options: [
          { id: 'a', text: 'Line chart' },
          { id: 'b', text: 'Pie chart' },
          { id: 'c', text: 'Scatter with no lines' },
          { id: 'd', text: 'Donut chart' },
        ],
        correctOptionId: 'a',
        ar: {
          prompt: 'تريد إظهار كيف تغيّرت الإيرادات الشهرية على مدار عام كامل. أي نوع رسم بياني يُعبّر بشكل أفضل عن اتجاه عبر الزمن؟',
          hint: 'فكّر في الرسم البياني الذي يُظهر طبيعيًا حركة عبر تسلسل.',
          options: [
            { id: 'a', text: 'رسم بياني خطي (Line chart)' },
            { id: 'b', text: 'رسم بياني دائري (Pie chart)' },
            { id: 'c', text: 'مبعثر بدون خطوط (Scatter)' },
            { id: 'd', text: 'رسم بياني حلقي (Donut chart)' },
          ],
        },
      },
    ],
  },

  'lesson-16': {
    title: 'Analyze with PivotTables',
    ar: { title: 'التحليل باستخدام الجداول المحورية' },
    tasks: [
      {
        id: 'l16-t1',
        type: 'multiple_choice',
        prompt: 'You have 5,000 rows of raw sales data and want to quickly summarize total sales by region and product. What tool is built exactly for this?',
        hint: 'It lets you drag fields into Rows, Columns, and Values.',
        options: [
          { id: 'a', text: 'PivotTable' },
          { id: 'b', text: 'Conditional Formatting' },
          { id: 'c', text: 'Data Validation' },
          { id: 'd', text: 'Freeze Panes' },
        ],
        correctOptionId: 'a',
        ar: {
          prompt: 'لديك 5,000 صف من بيانات المبيعات الخام وتريد تلخيص إجمالي المبيعات حسب المنطقة والمنتج بسرعة. ما الأداة المصممة تحديدًا لهذا الغرض؟',
          hint: 'تتيح لك سحب الحقول إلى الصفوف والأعمدة والقيم.',
          options: [
            { id: 'a', text: 'جدول محوري (PivotTable)' },
            { id: 'b', text: 'التنسيق الشرطي' },
            { id: 'c', text: 'التحقق من صحة البيانات' },
            { id: 'd', text: 'تجميد الأجزاء' },
          ],
        },
      },
    ],
  },

  'lesson-17': {
    title: 'Final Workplace Challenge',
    ar: { title: 'التحدي النهائي لبيئة العمل' },
    tasks: [
      {
        id: 'l17-t1',
        type: 'formula',
        prompt: 'Capstone, part 1: In D2, calculate Total Revenue (Price × Units) for this order.',
        hint: 'Same pattern as Lesson 6: =B2*C2',
        grid: grid(['A', 'B', 'C', 'D'], 2, { A1: 'Product', B1: 'Price', C1: 'Units', D1: 'Revenue', A2: 'Laptop Stand', B2: '25', C2: '40' }),
        targetCell: 'D2',
        answers: ['=B2*C2', '=C2*B2'],
        ar: {
          prompt: 'المرحلة الأولى من التحدي النهائي: في الخلية D2، احسب إجمالي الإيراد (السعر × الوحدات) لهذا الطلب.',
          hint: 'نفس نمط الدرس السادس: =B2*C2',
        },
      },
      {
        id: 'l17-t2',
        type: 'formula',
        prompt: 'Capstone, part 2: D2 now holds Revenue (1000). In E2, write an IF formula that returns "Bonus" when Revenue is over 500, otherwise "Standard".',
        hint: '=IF(D2>500,"Bonus","Standard")',
        grid: grid(['A', 'B', 'C', 'D', 'E'], 2, { A1: 'Product', B1: 'Price', C1: 'Units', D1: 'Revenue', E1: 'Tier', A2: 'Laptop Stand', B2: '25', C2: '40', D2: '1000' }),
        targetCell: 'E2',
        answers: ['=IF(D2>500,"BONUS","STANDARD")'],
        ar: {
          prompt: 'المرحلة الثانية: تحتوي الخلية D2 الآن على الإيراد (1000). في الخلية E2، اكتب صيغة IF تُعيد "Bonus" عندما يكون الإيراد أكبر من 500، وإلا تُعيد "Standard".',
          hint: '=IF(D2>500,"Bonus","Standard")',
        },
      },
    ],
  },
};

export function getTask(lessonId, taskId) {
  const lesson = LESSONS[lessonId];
  if (!lesson) return null;
  return lesson.tasks.find(t => t.id === taskId) || null;
}

// Strips answer-bearing fields (`answers`, `correctOptionId`, `target`) out of
// every task before it's sent to a client, and swaps in Arabic display text
// when lang === 'ar' (falling back to English for anything untranslated).
// Everything a learner needs to attempt a task (prompt, grid, options, hint,
// targetCell) survives; the answer key used by checkAnswer() in server.js does not.
function sanitizeTask(task, lang) {
  const { answers, correctOptionId, target, ar, ...safe } = task;
  if (lang !== 'ar' || !ar) return safe;
  const merged = { ...safe, ...ar };
  if (ar.options) {
    // Merge by id so a partially-translated options list still works.
    merged.options = safe.options.map(o => ar.options.find(t => t.id === o.id) || o);
  }
  return merged;
}

// Use this (not the raw LESSONS map) for anything sent to the client.
// `lang` is 'en' (default) or 'ar'.
export function getSafeLessonContent(lessonId, lang = 'en') {
  const lesson = LESSONS[lessonId];
  if (!lesson) return null;
  const title = lang === 'ar' && lesson.ar?.title ? lesson.ar.title : lesson.title;
  return { title, tasks: lesson.tasks.map(t => sanitizeTask(t, lang)) };
}
