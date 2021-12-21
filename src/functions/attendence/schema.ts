export default {
  type: "object",
  properties: {
    date: { type: 'string' },
    in: { type: 'string' },
    out: { type: 'string' },
  },
  required: ['in','date','out']
} as const;
