const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema({
  studentId: String,
  professorId: String,
  status: String // PENDING / APPROVED / REVOKED
});

module.exports = mongoose.model("Permission", PermissionSchema);