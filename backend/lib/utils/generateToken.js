import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15d', // Token expiry time
  });

  res.cookie('jwt', token, {
    httpOnly: true, // Prevent client-side access
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'strict', // CSRF protection
  });
};

export default generateToken;
