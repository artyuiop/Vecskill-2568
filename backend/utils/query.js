const db = require("../config/db");
const { send, err } = require("../utils/help");


const fn = (a = 'u', al = 'fullName') => db.raw(`CONCAT(${a}.fname,' ',${a}.lname) as ${al}`)
const statusCase = (r , s , c) => {
  return db.raw(`
      CASE
        WHEN COUNT(${r}) = 0 THEN 'ยังไม่ดำเนินการ'
        WHEN SUM(${s} = 'completeed') < COUNT(${c}) THEN 'กำลังดำเนินการ'
        ELSE 'เสร็จสิ้น' END AS status
  `)
}

const trackStatusFn = (eval_id , role , field) => {
  return db('assignments as a')
    .join('users as u', `a.${field}`, 'u.id')
    .join('indicators as i', 'a.eval_id', 'i.eval_id')
    .leftJoin('assessments as asm', q  => {
        q.on('asm.assign_id', 'a.id')
          .andOn('asm.indic_id', 'i.id')
          .andOnVal('asm.role', [role])
    })
    .where('a.eval_id', eval_id)
    .groupBy('u.id')
    .select(fn('u'), statusCase('asm.id', 'asm.status', 'i.id'))
}


const mapInidcaotrs = (row) => {
  const data = {}
  row.forEach(r => {
    data[r.id] ??= {...r , levels: []}
    if(r.level_id) {
      data[r.id].levels.push({
        id: r.level_id,
        level: r.level,
        description: r.level_desc
      })
    }
  })

  return Object.values(data)
}