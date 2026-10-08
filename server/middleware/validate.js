// Generic Zod-validation middleware: validates req[source] against `schema`,
// replaces it with the parsed (typed/defaulted) value, or responds 400 with
// a flat list of field errors. Never trust client input past this point.
const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }
  req[source] = result.data;
  next();
};

module.exports = { validate };
