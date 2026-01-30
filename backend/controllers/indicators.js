const db = require('../config/db')
const { send, err } = require('../utils/help')
const { exist } = require('../utils/query')


// เพิ่มตัวชี้วัด && แก้ไข
exports.AddOrUpdateIndic = async (req, res) => {
  try {
    const { id } = req.params
    const { eval_id, name, description, weight, type, type_file } = req.body

    if (![name, eval_id, description, weight, type].every(Boolean)) return send(res, { msg: "กรุณากรอกข้อมูลให้ครบ" }, 403)

    if (!['score', 'boolean'].includes(type)) return send(res, { msg: "type ไม่ถูกต้อง!" }, 403)
      // เช็คว่าตรงไหม
      if (!['png', 'image', 'url'].includes(type_file)) {
        return send(res, { msg: "type_file ไม่ถูกต้อง!" }, 403)
      }
  
    const indicId = id
      ? (await db('indicators').where({ id }).update({ eval_id, name, description, weight, type, type_file }), +id)
      : (await db('indicators').insert({ eval_id, name, description, weight, type, type_file }))[0]


    send(res, { msg: id ? "แก้ไขตัวชี้วัดสำเร็จ!" : "เพิ่มตัวชี้วัดสำเร็จ!", indicId })
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

// เพิ่มสเกลคะแนน
exports.AddLevels = async (req, res) => {
  try {
    const { indic_id } = req.params

    const indicator = await exist(res, 'indicators', {id: indic_id})
    const Level = await db('levels').where({ indic_id }).first()

    if (Level) return send(res, { msg: "มีตัวชี้วัดอยู่แล้ว!" }, 403)
    if (indicator.type !== 'score') return send(res, { msg: "type ไม่ถูกต้อง" }, 403)

    // Loop 1-4 Levels
    for (const { level, description } of req.body) {
      if (!level || level < 1 || level > 4) return send(res, { msg: "ระดับคะแนนต้อง 1-4" }, 403)
      await db('levels').insert({ indic_id, level, description })
    }

    send(res, { msg: "เพิ่มระดับคะแนนสำเร็จ" })
  } catch (e) {
    err(res, e)
  }
}

// ดูตัวสเกลตามตัวชี้วัด
exports.ListLevels = async (req, res) => {
  try {
    const { indic_id } = req.params

    const levels = await db('levels').select('level', 'description').where({ indic_id }).orderBy('level', 'asc')

    if (levels.length === 0) return send(res, { msg: "ไม่พบระดับคะแนน" }, 404)

    send(res, { indicator: +indic_id, levels })
  } catch (e) {
    err(res, e)
  }
}

// แก้ไขสเกลคะแนน
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

// เพิ่มหลักฐาน
exports.AddEvidence = async (req, res) => {
  try {
    const { indic_id } = req.params
    const uid = req.user.id
    const { file_url, description } = req.body
    const file = req.file

    const indic = await exist(res, 'indicators', {id: indic_id})

    const dup = await db('evidence').where({ indic_id, user_id: uid }).first()
    if (dup) return send(res, { msg: "มีหลักฐานแล้ว กรุณาลบก่อน" }, 403)

    // validate file ai ย่อให้
    const rules = {
      url: () => file_url,
      image: () => file && file.mimetype.startsWith('image/'),
      pdf: () => file && file.mimetype === 'application/pdf'
    }

    if (!rules[indic.type_file]?.()) return send(res, { msg: "ไฟล์หรือข้อมูลไม่ถูกต้อง" }, 400)

    await db('evidence').insert({
      indic_id,
      user_id: uid,
      description,
      file_path: file ? file.filename : null,
      file_url: file_url || null
    })

    send(res, { msg: "แนบหลักฐานสำเร็จ" })
  } catch (e) {
    err(res, e)
  }
}

// ยกเลิกหลักฐาน
exports.delEvid = async (req, res) => {
  try {
    const { evid_id } = req.params

    await exist(res, 'evidence', {id: evid_id})

    await db('evidence').where({ id: evid_id }).del()
    send(res, { msg: "ลบหลักฐานสำเร็จ!" })
  } catch (e) {
    err(res, e)
  }
}