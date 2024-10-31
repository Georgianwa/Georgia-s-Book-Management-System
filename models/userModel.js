const mongoose = require("mongoose");


const userSChema = new mongoose.Schema({
    id: {type: String, unique:true},
    firstName: { 
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v.length>=3;
            },
            message: props => `${props.value} is too short,\nname must be at least 9 characters long`
        },
        trim: true
     },


    lastName: { 
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v.length>=3;
            },
            message: props => `${props.value} is too short,\nname must be at least 9 characters long`
        },
        trim: true
     },
    
    
    username: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                return v.length>=5;
            },
            message: (props) => `${props.value} is too short,\nusername must be at least 5 characters long`
        },
        trim: true
    },
    
    age: { type: String, min: 16, max: 100 },
    
    email: { type: String, unique: true},
    
    password: {
        type: String, 
        required: [true, "Password must be provided"],
        minlength:[8, "password must be at least 8 characters"],
        maxlength:[35, "password cannot exceed 35 characters"],
        validate: {
            validator: function(v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.\d)(?=.*[!@#$$%^&*]).{8, }$/.test(v);
            },
            message: props => "Password must contain :\nAt least one capital letter\nAt least one small letter\nAt least one number\nAt least one special character"
        }
    },

    inventory: {
        followers: Number,
        following: Number
    },
    
    created_at: {type: Date, default: Date.now}
});


userSChema.virtual("name").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model("User", userSChema);


module.exports = User;
