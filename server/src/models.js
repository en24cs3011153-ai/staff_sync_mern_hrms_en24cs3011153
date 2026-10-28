import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["hr", "manager", "employee"], default: "employee" },
  department: { type: String, default: "General" },
  jobTitle: { type: String, default: "Employee" },
  phone: { type: String, default: "" },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const leaveSchema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: "User", required: true },
  leaveType: { type: String, enum: ["Annual", "Sick", "Personal", "Unpaid"], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true, maxlength: 1000 },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  reviewedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  reviewNote: { type: String, default: "" }
}, { timestamps: true });

const attendanceSchema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: "User", required: true },
  dateKey: { type: String, required: true },
  checkIn: { type: Date, default: null },
  checkOut: { type: Date, default: null }
}, { timestamps: true });
attendanceSchema.index({ employee: 1, dateKey: 1 }, { unique: true });

const announcementSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  body: { type: String, required: true, maxlength: 5000 },
  audience: { type: String, enum: ["all", "hr", "manager", "employee"], default: "all" },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const trainingSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  trainer: { type: String, default: "" },
  date: { type: Date, required: true },
  durationHours: { type: Number, min: 0.5, default: 1 },
  capacity: { type: Number, min: 1, default: 30 },
  enrollments: [{ type: Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

const RealUser = mongoose.models.User || model("User", userSchema);
const RealLeave = mongoose.models.Leave || model("Leave", leaveSchema);
const RealAttendance = mongoose.models.Attendance || model("Attendance", attendanceSchema);
const RealAnnouncement = mongoose.models.Announcement || model("Announcement", announcementSchema);
const RealTraining = mongoose.models.Training || model("Training", trainingSchema);

// In-memory fallback layer for seamless operation without external MongoDB
let idCounter = 100;
function genId() {
  idCounter += 1;
  return `65d000000000000000000${idCounter.toString().padStart(3, "0")}`;
}

const defaultPasswordHash = bcrypt.hashSync("StaffSync123!", 10);

const memoryUsers = [
  {
    _id: "65d000000000000000000001",
    name: "StaffSync HR",
    email: "hr@staffsync.local",
    passwordHash: defaultPasswordHash,
    role: "hr",
    department: "People Operations",
    jobTitle: "HR Administrator",
    phone: "+1 555-0101",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "65d000000000000000000002",
    name: "Morgan Manager",
    email: "manager@staffsync.local",
    passwordHash: defaultPasswordHash,
    role: "manager",
    department: "Engineering",
    jobTitle: "Team Manager",
    phone: "+1 555-0102",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "65d000000000000000000003",
    name: "Alex Employee",
    email: "employee@staffsync.local",
    passwordHash: defaultPasswordHash,
    role: "employee",
    department: "Engineering",
    jobTitle: "Software Engineer",
    phone: "+1 555-0103",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const memoryLeaves = [
  {
    _id: "65d000000000000000000010",
    employee: "65d000000000000000000003",
    leaveType: "Annual",
    startDate: new Date(Date.now() + 10 * 86400000),
    endDate: new Date(Date.now() + 14 * 86400000),
    reason: "Summer family retreat",
    status: "approved",
    reviewedBy: "65d000000000000000000002",
    reviewNote: "Approved, have a great time!",
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 86400000)
  },
  {
    _id: "65d000000000000000000011",
    employee: "65d000000000000000000003",
    leaveType: "Personal",
    startDate: new Date(Date.now() + 30 * 86400000),
    endDate: new Date(Date.now() + 31 * 86400000),
    reason: "Personal appointment",
    status: "pending",
    reviewedBy: null,
    reviewNote: "",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const todayKey = () => new Date().toISOString().slice(0, 10);
const memoryAttendances = [
  {
    _id: "65d000000000000000000020",
    employee: "65d000000000000000000003",
    dateKey: todayKey(),
    checkIn: new Date(Date.now() - 1000 * 60 * 60 * 3),
    checkOut: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const memoryAnnouncements = [
  {
    _id: "65d000000000000000000030",
    title: "Welcome to StaffSync",
    body: "Welcome! Please keep your profile up to date and review the employee handbook.",
    audience: "all",
    author: "65d000000000000000000001",
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 86400000 * 5)
  },
  {
    _id: "65d000000000000000000031",
    title: "Q4 Town Hall & Team Recognition",
    body: "Join us this Friday at 3:00 PM for company milestones, team shout-outs, and open Q&A.",
    audience: "all",
    author: "65d000000000000000000001",
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 86400000 * 2)
  }
];

const memoryTrainings = [
  {
    _id: "65d000000000000000000040",
    title: "Workplace Communication Essentials",
    description: "A practical introduction to clear and respectful workplace communication.",
    trainer: "People Operations",
    date: new Date(Date.now() + 7 * 86400000),
    durationHours: 2,
    capacity: 30,
    enrollments: ["65d000000000000000000003"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "65d000000000000000000041",
    title: "Leadership & Effective Mentoring",
    description: "Strategies for empowering team members, giving constructive feedback, and leading with empathy.",
    trainer: "Executive Coaching",
    date: new Date(Date.now() + 14 * 86400000),
    durationHours: 3,
    capacity: 20,
    enrollments: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

function isConnected() {
  return mongoose.connection.readyState === 1;
}

function cloneDoc(doc) {
  if (!doc) return null;
  return JSON.parse(JSON.stringify(doc));
}

function resolveUser(userId, fields) {
  if (!userId) return null;
  const idStr = String(userId._id || userId);
  const u = memoryUsers.find((x) => String(x._id) === idStr);
  if (!u) return null;
  if (!fields) return cloneDoc(u);
  const fieldList = fields.split(" ").filter(Boolean);
  const res = { _id: u._id };
  for (const f of fieldList) {
    if (f !== "-passwordHash" && u[f] !== undefined) res[f] = u[f];
  }
  return res;
}

class QueryChain {
  constructor(dataPromise) {
    this.promise = Promise.resolve(dataPromise);
  }

  select(fields) {
    this.promise = this.promise.then((res) => {
      if (!res) return null;
      const isArray = Array.isArray(res);
      const items = isArray ? res : [res];
      const excluded = (fields || "").split(" ").filter((f) => f.startsWith("-")).map((f) => f.slice(1));
      const filtered = items.map((item) => {
        const copy = cloneDoc(item);
        if (copy) {
          for (const ex of excluded) delete copy[ex];
        }
        return copy;
      });
      return isArray ? filtered : filtered[0];
    });
    return this;
  }

  sort(sortObj) {
    this.promise = this.promise.then((res) => {
      if (!Array.isArray(res)) return res;
      const key = Object.keys(sortObj || {})[0];
      if (!key) return res;
      const dir = sortObj[key] === -1 ? -1 : 1;
      return [...res].sort((a, b) => {
        const valA = a[key] ?? "";
        const valB = b[key] ?? "";
        if (valA < valB) return -1 * dir;
        if (valA > valB) return 1 * dir;
        return 0;
      });
    });
    return this;
  }

  limit(n) {
    this.promise = this.promise.then((res) => {
      if (!Array.isArray(res)) return res;
      return res.slice(0, n);
    });
    return this;
  }

  populate(field, select) {
    this.promise = this.promise.then((res) => {
      if (!res) return null;
      const isArray = Array.isArray(res);
      const items = isArray ? res : [res];
      for (const item of items) {
        if (!item) continue;
        if (field === "employee" || field === "reviewedBy" || field === "author") {
          item[field] = resolveUser(item[field], select);
        } else if (field === "enrollments" && Array.isArray(item.enrollments)) {
          item.enrollments = item.enrollments.map((id) => resolveUser(id, select)).filter(Boolean);
        }
      }
      return isArray ? items : items[0];
    });
    return this;
  }

  then(onFulfilled, onRejected) {
    return this.promise.then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this.promise.catch(onRejected);
  }
}

// User model proxy
export const User = {
  findOne(filter) {
    if (isConnected()) return RealUser.findOne(filter);
    const found = memoryUsers.find((u) => {
      if (filter.email && u.email.toLowerCase() !== filter.email.toLowerCase()) return false;
      return true;
    });
    return new QueryChain(found ? cloneDoc(found) : null);
  },
  findById(id) {
    if (isConnected()) return RealUser.findById(id);
    const found = memoryUsers.find((u) => String(u._id) === String(id));
    return new QueryChain(found ? cloneDoc(found) : null);
  },
  find(filter = {}) {
    if (isConnected()) return RealUser.find(filter);
    const results = memoryUsers.filter((u) => {
      if (filter.department && u.department !== filter.department) return false;
      return true;
    });
    return new QueryChain(results.map(cloneDoc));
  },
  async findByIdAndUpdate(id, update, options = {}) {
    if (isConnected()) return RealUser.findByIdAndUpdate(id, update, options);
    const index = memoryUsers.findIndex((u) => String(u._id) === String(id));
    if (index === -1) return new QueryChain(null);
    Object.assign(memoryUsers[index], update, { updatedAt: new Date() });
    return new QueryChain(cloneDoc(memoryUsers[index]));
  },
  async create(data) {
    if (isConnected()) return RealUser.create(data);
    const exists = memoryUsers.some((u) => u.email.toLowerCase() === (data.email || "").toLowerCase());
    if (exists) {
      const err = new Error("Email already exists");
      err.code = 11000;
      throw err;
    }
    const doc = {
      _id: genId(),
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      role: data.role || "employee",
      department: data.department || "General",
      jobTitle: data.jobTitle || "Employee",
      phone: data.phone || "",
      active: data.active !== undefined ? data.active : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryUsers.push(doc);
    return cloneDoc(doc);
  },
  async updateOne(filter, update, options = {}) {
    if (isConnected()) return RealUser.updateOne(filter, update, options);
    const u = memoryUsers.find((x) => x.email === filter.email);
    if (!u && options.upsert) {
      const newDoc = { _id: genId(), ...(update.$setOnInsert || {}), createdAt: new Date(), updatedAt: new Date() };
      memoryUsers.push(newDoc);
    }
    return { acknowledged: true };
  }
};

// Leave model proxy
export const Leave = {
  find(filter = {}) {
    if (isConnected()) return RealLeave.find(filter);
    const results = memoryLeaves.filter((l) => {
      if (filter.employee && String(l.employee) !== String(filter.employee)) return false;
      return true;
    });
    return new QueryChain(results.map(cloneDoc));
  },
  async findByIdAndUpdate(id, update, options = {}) {
    if (isConnected()) return RealLeave.findByIdAndUpdate(id, update, options);
    const idx = memoryLeaves.findIndex((l) => String(l._id) === String(id));
    if (idx === -1) return new QueryChain(null);
    Object.assign(memoryLeaves[idx], update, { updatedAt: new Date() });
    return new QueryChain(cloneDoc(memoryLeaves[idx]));
  },
  async create(data) {
    if (isConnected()) return RealLeave.create(data);
    const doc = {
      _id: genId(),
      employee: String(data.employee),
      leaveType: data.leaveType,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      reason: data.reason,
      status: "pending",
      reviewedBy: null,
      reviewNote: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryLeaves.unshift(doc);
    return cloneDoc(doc);
  }
};

// Attendance model proxy
export const Attendance = function (data) {
  this.data = {
    _id: genId(),
    employee: String(data.employee),
    dateKey: data.dateKey,
    checkIn: null,
    checkOut: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  this.save = async () => {
    const idx = memoryAttendances.findIndex(
      (a) => String(a.employee) === String(this.data.employee) && a.dateKey === this.data.dateKey
    );
    if (idx !== -1) {
      memoryAttendances[idx] = { ...memoryAttendances[idx], ...this.data, updatedAt: new Date() };
      return cloneDoc(memoryAttendances[idx]);
    }
    memoryAttendances.unshift(this.data);
    return cloneDoc(this.data);
  };
};

Attendance.find = function (filter = {}) {
  if (isConnected()) return RealAttendance.find(filter);
  const results = memoryAttendances.filter((a) => {
    if (filter.employee && String(a.employee) !== String(filter.employee)) return false;
    return true;
  });
  return new QueryChain(results.map(cloneDoc));
};

Attendance.findOne = function (filter = {}) {
  if (isConnected()) return RealAttendance.findOne(filter);
  const found = memoryAttendances.find((a) => {
    if (filter.employee && String(a.employee) !== String(filter.employee)) return false;
    if (filter.dateKey && a.dateKey !== filter.dateKey) return false;
    return true;
  });
  if (!found) return new QueryChain(null);
  const inst = new Attendance(found);
  inst.data = cloneDoc(found);
  inst.checkIn = found.checkIn;
  inst.checkOut = found.checkOut;
  inst.save = async function () {
    const idx = memoryAttendances.findIndex((x) => String(x._id) === String(found._id));
    if (idx !== -1) {
      memoryAttendances[idx].checkIn = inst.checkIn;
      memoryAttendances[idx].checkOut = inst.checkOut;
      memoryAttendances[idx].updatedAt = new Date();
    }
    return cloneDoc(memoryAttendances[idx]);
  };
  return new QueryChain(inst);
};

// Announcement model proxy
export const Announcement = {
  find(filter = {}) {
    if (isConnected()) return RealAnnouncement.find(filter);
    let results = memoryAnnouncements;
    if (filter.$or) {
      const allowedRoles = filter.$or.map((o) => o.audience).filter(Boolean);
      results = results.filter((a) => allowedRoles.includes(a.audience) || a.audience === "all");
    }
    return new QueryChain(results.map(cloneDoc));
  },
  async create(data) {
    if (isConnected()) return RealAnnouncement.create(data);
    const doc = {
      _id: genId(),
      title: data.title,
      body: data.body,
      audience: data.audience || "all",
      author: String(data.author),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryAnnouncements.unshift(doc);
    return cloneDoc(doc);
  },
  async updateOne(filter, update, options = {}) {
    if (isConnected()) return RealAnnouncement.updateOne(filter, update, options);
    const exists = memoryAnnouncements.find((a) => a.title === filter.title);
    if (!exists && options.upsert) {
      memoryAnnouncements.push({ _id: genId(), ...(update.$setOnInsert || {}), createdAt: new Date(), updatedAt: new Date() });
    }
    return { acknowledged: true };
  }
};

// Training model proxy
export const Training = {
  find(filter = {}) {
    if (isConnected()) return RealTraining.find(filter);
    return new QueryChain(memoryTrainings.map(cloneDoc));
  },
  findById(id) {
    if (isConnected()) return RealTraining.findById(id);
    const found = memoryTrainings.find((t) => String(t._id) === String(id));
    if (!found) return new QueryChain(null);
    const inst = cloneDoc(found);
    inst.save = async function () {
      const idx = memoryTrainings.findIndex((x) => String(x._id) === String(id));
      if (idx !== -1) {
        memoryTrainings[idx].enrollments = inst.enrollments;
        memoryTrainings[idx].updatedAt = new Date();
      }
      return cloneDoc(memoryTrainings[idx]);
    };
    return new QueryChain(inst);
  },
  async create(data) {
    if (isConnected()) return RealTraining.create(data);
    const doc = {
      _id: genId(),
      title: data.title,
      description: data.description,
      trainer: data.trainer || "",
      date: new Date(data.date),
      durationHours: Number(data.durationHours || 1),
      capacity: Number(data.capacity || 30),
      enrollments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryTrainings.push(doc);
    return cloneDoc(doc);
  },
  async updateOne(filter, update, options = {}) {
    if (isConnected()) return RealTraining.updateOne(filter, update, options);
    const exists = memoryTrainings.find((t) => t.title === filter.title);
    if (!exists && options.upsert) {
      memoryTrainings.push({ _id: genId(), ...(update.$setOnInsert || {}), createdAt: new Date(), updatedAt: new Date() });
    }
    return { acknowledged: true };
  }
};
