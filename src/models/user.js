const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    trim: true,
    default: 0,
    validate(value) {
      if(value < 0){
        throw new Error('Age must be a positive number.')
      }
    }
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      const isEmailValid = isEmail(value)
      if(!isEmailValid){
        throw new Error('Email is invalid.')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value){
      if(value.toLowerCase().includes('password')){
        throw new Error('Password cannot contain "password".')
      }
    }
  }
})

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if(!user){
    throw new Error('Unable to login.')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch){
    throw new Error('Unable to login.')
  }

  return user
}

// hash password
userSchema.pre('save', async function(next) {
  
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 8) 
  }
  
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
