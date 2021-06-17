import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({ msg: "No token. Denied." });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified)
      return res.status(401).json({ msg: "Invalid token. Denied." });

    req.user = verified.id;
    next();
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
    console.log(err);
  }
};

export default auth;
