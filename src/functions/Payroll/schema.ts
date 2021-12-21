export default {
  type: "object",
  properties: {
    salary: { type: 'number' },
    id: { type: 'string' },
    medicalWithheld: { type: 'number' },
    taxPercentWithheld: { type: 'number' },
  },
  required: ['id','salary','medicalWithheld','taxPercentWithheld']
} as const;
