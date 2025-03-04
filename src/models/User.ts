import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err: Error | undefined, salt: string) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err: Error | undefined, hash: string) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword: string) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err: Error | undefined, isMatch: boolean) => {
      if (err) reject(err);
      if (!isMatch) reject(false);

      resolve(true);
    });
  });
};

mongoose.model('User', userSchema);
