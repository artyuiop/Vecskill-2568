const db = require("../config/db");

// Function รวมชื่อ
const fn = (a = "u", al = "fullName") =>
  db.raw(`CONCAT( ${a}.fname,' ', ${a}.lname) as ${al}`);

// Function ติดตามสถานะ
const trackStatusFuc = (eval_id, role, userField) => {
  return db('assignments as asm')
    .join('users as u', `asm.${userField}`, 'u.id')
    .join('indicators as i', 'i.eval_id', 'asm.eval_id')
    .leftJoin('assessments as a', q => {
      q.on('a.assign_id', '=', 'asm.id')
        .andOn('a.indic_id', '=', 'i.id')
        .andOn('a.role', db.raw('?', [role]))
    })
    .where('asm.eval_id', eval_id)
    .groupBy('u.id')
    .select(
      fn('u', 'fullName'),
      db.raw(`
        CASE
          WHEN SUM(a.status = 'completed') = 0 THEN 'ยังไม่ดำเนิน'
          WHEN SUM(a.status = 'completed') < COUNT(i.id) THEN 'ดำเนินการอยู่'
          ELSE 'เสร็จสิ้น'
        END as status
      `)
    )
}

module.exports = { fn, trackStatusFuc };