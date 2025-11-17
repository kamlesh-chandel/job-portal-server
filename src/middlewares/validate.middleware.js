export const validateRequest = (schema, type = 'body') => {
  return (req, res, next) => {
    let dataToValidate;

    if (type === 'body') dataToValidate = req.body;
    else if (type === 'query') dataToValidate = req.query;
    else if (type === 'params') dataToValidate = req.params;

    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues[0].message,
      });
    }

    // Save validated data in safe place
    if (type === 'body') req.validatedBody = result.data;
    if (type === 'query') req.validatedQuery = result.data;
    if (type === 'params') req.validatedParams = result.data;

    next();
  };
};
