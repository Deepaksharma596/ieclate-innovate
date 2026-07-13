const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Admin Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Admin Password is required']
    },
    mobileNumber: {
        type: String,
        required: [true, 'Registered Mobile Number is required'],
        trim: true
    }
}, {
    timestamps: true
});

// Pre-save Hook: Hash admin passwords securely before database insertion
AdminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method for security dashboard checks
AdminSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);
