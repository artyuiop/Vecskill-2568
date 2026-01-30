const db = require("../config/db");
const { send, err } = require("../utils/help");


// Function รวมชื่อ
const fn = (a = "u", al = "fullName") =>
  db.raw(`CONCAT( ${a}.fname,' ', ${a}.lname) as ${al}`);

// Function สถานะ
const statusCase = (field , sumField , countField) => {
  return db.raw(`
    CASE 
      WHEN COUNT(${field}) = 0 THEN 'ยังไม่ดำเนิน'
      WHEN SUM(${sumField} = 'completed') < COUNT(${countField}) THEN 'กำลังดำเนินอยู่'
      ELSE 'เสร็จสิ้น' END as status
    `)
}

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
      statusCase('a.id', 'a.status', 'i.id'),
    )
}

// Map push Level
const mapIndicators = (rows) => {
  const map = {};
  rows.forEach(r => {
    map[r.id] ??= { ...r, level: [] };
    if (r.level_id)
      map[r.id].level.push({
        id: r.level_id,
        level: r.level,
        description: r.level_description,
      });
  });
  return Object.values(map);
};  

const exist = async (res ,table, where) => {
  const record = await db(table).where(where).first()
  if (!record) {
    send(res, { msg: 'ไม่พบข้อมูล' }, 404)
    return null
  }
  return record
}


module.exports = { fn, trackStatusFuc , mapIndicators, exist , statusCase};