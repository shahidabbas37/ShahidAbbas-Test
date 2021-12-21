export default {
  type: "object",
  properties: {
    fulllName: { type: 'string' },
    dateOfBirth: { type: 'string' },
    address: { type: 'string' },
    jobRole: { type: 'string' },
    fullTime: { type: 'boolen' },
    contractLengthDays: { type: 'number' },
    department: { type: 'string' },
    salary: { type: 'number' },
    dateJoined: { type: 'string' },
    status: { type: 'string' },
    phone: { type: 'string' },
    email: { type: 'string' },
  },
  required: ['fullName', 'email', 'dateOfBirth', 'address', 'jobRole', 'fullTime', 'contractLengthDays', 'department', 'salary', 'dateJoined', 'status', 'phone']
} as const;
