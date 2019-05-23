/** @module log */
const Log = require('../model/log');

module.exports = {
  /**
   * @typedef {Object} LogType - ประเภทของ log
   * @property {string} IMPORT_EXPORT_SIDEMENU - ดำเนินการ import, export
   * จากเมนูด้านซ้ายมือ(ไม่ใช่ csv)
   */
  /**
   * สำหรับเพิ่ม log ว่ามีกิจกรรมอะไรทำโดย user อะไร
   * @param {Object} logObject - ค่าที่จะนำลงเก็บ
   * @param {LogType} logObject.type - ประเภทของ logtype
   * @param {string} logObject.detail - รายละเอียด
   * @param {User.name} logObject.user - ชื่อ username ของคนที่ดำเนินการ
   * @param {timestamp} logObject.create_time - timestamp Date.getTime() เวลาที่ทำการนั้น
   * @param {string} logObject.work_id - id ของงานที่ต้องการอ้างอิง
   * @returns {Promise} - log.save() and return promise when success
   */
  createLog(logObject) {
    const log = new Log(logObject);
    return log.save();
  },

  /**
   * ใช่สำหรับเรียกดูรายการ log ที่ทำทั้งหมดจาก user ที่ระบุ
   *
   * @param {User.name} username - ชื่อของ User
   * @returns {Array.<Log>} - รายการทั้งหมดที่ทำจาก User นั้นๆ
   */
  getMyLog(username) {
    return Log.find({ user: username })
      .sort({ created_time: 'desc' })
      .exec();
  },
};
