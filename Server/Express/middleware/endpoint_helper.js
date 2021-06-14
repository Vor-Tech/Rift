const asyncEndpoint = (endpoint) => {
  return async (req, res, next) => {
    try {
      await endpoint(req, res, next);
    } catch (e) {
      next(e);
    }
  };
};

const toJson = (req, res) => {
  res.status(200).json(req.results);
};
