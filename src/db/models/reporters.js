const mongoose=require('mongoose')
const validator=require('validator')
const { isValidPassword } = require("mongoose-custom-validators");
const bcryptjs = require('bcryptjs')
const jwt=require('jsonwebtoken')

const reporterSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    trim: true,
    minlength:3
    },
    email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(value) {
        if (!validator.isEmail(value)) {
        throw new Error("Undefined Email");
        }
    },
    },
    age: {
    type: Number,
    validate(value) {
        if (value <= 0) {
        throw new Error("Age Can't Be Under 0");
        }
    },
    },
    password: {
    type: String,
    required: true,
    validate: {
        validator: isValidPassword,
        message:
        "Write A Strong Password",
    },
    },
    phone: {
    type: String,
    required: true,
    validate: {
        validator: function (value) {
        return /^(010|011|012)([0-9]{8})$/.test(value);
        },
        message: "Unmatched Phone Number",
    },
    },
    image: {
    type: Buffer,
    },
});

reporterSchema.virtual("newsRelation", {
    localField: "_id",
    foreignField: "reporter",
    ref: "News",
});

reporterSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcryptjs.hash(this.password, 8);
});

reporterSchema.statics.findByCredentials = async (email, password) => {
    const reporter = await Reporter.findOne({ email });
    if (!reporter) {
    throw new Error("Undefined Email Or Password");
    }
    const isMatch = await bcryptjs.compare(password, reporter.password);
    if (!isMatch) {
    throw new Error("Wrong password");
    }
    return reporter;
};


reporterSchema.methods.generateToken = function () {
    const token = jwt.sign({ _id: this._id.toString() }, "secretWord");
    return token;
};

const Reporter = mongoose.model("Reporter", reporterSchema); 
module.exports = Reporter;
