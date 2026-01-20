const db = require('../config/db')
const { send, err } = require('../utils/help')


// เพิ่มตัวชี้วัด && แก้ไข
exports.AddOrUpdateIndic = async (req, res) => {
  try {
    const { id } = req.params
    const { eval_id, name, description, weight, type } = req.body

    if (![name, eval_id, description, weight, type].every(Boolean)) return send(res, { msg: "กรุณากรอกข้อมูลให้ครบ" }, 403)

    if (!['score', 'boolean'].includes(type)) return send(res, { msg: "type ไม่ถูกต้อง!" }, 403)
    

    // evalCheck
    const Eval = await db('evaluations').where({ id: eval_id }).first()
    if (!Eval) return send(res, { msg: "ไม่มีรอบการประเมินนี้!!" }, 403)

    if (id) {
      // UPDATE
      const indic = await db('indicators').where({ id }).first()
      if (!indic) return send(res, { msg: "ไม่พบตัวชี้วัด!" }, 403)

      await db('indicators').where({ id }).update({ eval_id, name, description, weight, type })

      send(res, { msg: "แก้ไขตัวชี้วัดสำเร็จ" })
    } else {
      // INSERT
      await db('indicators').insert({eval_id, name, description,weight,type})
      send(res, { msg: "เพิ่มตัวชี้วัดสำเร็จ" })
    }
  } catch (e) {
    err(res, e)
  }
}


// ดูตัวชี้วัดตามรอบประเมิน
exports.ListIndic = async (req, res) => {
  try {
    const { eval_id } = req.params

    const rows = await db('indicators').where({ eval_id })
    send(res, rows)
  } catch (e) {
    err(res, e)
  }
}


// Levels
exports.AddLevels = async (req, res) => {
  try {
    const { indic_id } = req.params

    const indicator = await db('indicators').where({ id: indic_id }).first()
    const Level = await db('levels').where({ indic_id }).first()

    if (Level) return send(res, { msg: "มีตัวชี้วัดอยู่แล้ว!" }, 403)
    if (!indicator) return send(res, { msg: "ไม่มีตัวชี้วัด" }, 403)
    if (indicator.type !== 'score') return send(res, { msg: "type ไม่ถูกต้อง" }, 403)

    // Loop 1-4 Levels
    for (const { level, description } of req.body) {
      if (!level || level < 1 || level > 4) return send(res, { msg: "ระดับคะแนนต้อง 1-4" }, 403)
      await db('levels').insert({indic_id,level,description})
    }

    send(res, { msg: "เพิ่มระดับคะแนนสำเร็จ" })
  } catch (e) {
    err(res, e)
  }
}


exports.ListLevels = async (req, res) => {
  try {
    const { indic_id } = req.params

    const levels = await db('levels').select('level', 'description').where({ indic_id }).orderBy('level', 'asc')

    if (levels.length === 0) return send(res, { msg: "ไม่พบระดับคะแนน" }, 404)

    send(res, {indicator: +indic_id, levels})
  } catch (e) {
    err(res, e)
  }
}


exports.changeLevels = async (req, res) => {
  try {
    const { indic_id } = req.params

    for (const { level, description } of req.body) {
      await db('levels').where({ indic_id, level }).update({ description })
    }

    send(res, { msg: "แก้ไขสเกลคะแนนสำเร็จ!!" })
  } catch (e) {
    err(res, e)
  }
}


// evidence
exports.AddEvidence = async (req, res) => {
  try {
    const { indic_id } = req.params
    const uid = req.user.id
    const file = req.file
    const { file_url, description } = req.body

    const indic = await db('indicators').where({ id: indic_id }).first()

    const evidence = await db('evidence').where({ indic_id, user_id: uid }).first()

    if (evidence) return send(res, { msg: "มีหลักฐานแล้วกรุณาลบก่อน" }, 403)
    if (!indic) return send(res, { msg: "ไม่พบตัวชี้วัด" }, 401)

    // console.log(file)
    // file upload
    if (file) {
      await db('evidence').insert({ indic_id, user_id: uid,file_path: file.filename ,description})
      return send(res, { msg: "เพิ่มหลักฐานสำเร็จ"})
    }

    // url upload
    if (file_url) {
        await db('evidence').insert({indic_id,user_id: uid, file_url,description})
        return send(res, { msg: "เพิ่มหลักฐานสำเร็จ" })
    }
    
    send(res, { msg: "กรุณากรอกหลักฐาน" }, 403)
  } catch (e) {
    err(res, e)
  }
}


exports.delEvid = async (req, res) => {
  try {
    const { evid_id } = req.params

    const row = await db('evidence').where({ id: evid_id }).first()
    if (!row) return send(res, { msg: "ไม่พบหลักฐาน" }, 403)

    await db('evidence').where({ id: evid_id }).del()

    send(res, { msg: "ลบหลักฐานสำเร็จ!" })
  } catch (e) {
    err(res, e)
  }
}
