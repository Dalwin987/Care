import jwt from "jsonwebtoken";

// ==========================================
// ACCESS TOKEN
// ==========================================
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

// ==========================================
// REFRESH TOKEN
// ==========================================
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ==========================================
// VERIFY ACCESS TOKEN
// ==========================================
const verifyAccessToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET
  );
};

// ==========================================
// VERIFY REFRESH TOKEN
// ==========================================
const verifyRefreshToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET
  );
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};