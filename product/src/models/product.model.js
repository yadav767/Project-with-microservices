import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    price:{
        amount:{
            type:Number,
            required:true
        },
        currency:{
            type:String,
            enum:['INR','USD'],
            default:"INR"
        }
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    images:[{
        url:String,
        thubmnail:String,
        id:String
    }]

})


productSchema.index({title:"text",description:"text"})  

const mongooseModel=mongoose.model("product",productSchema)

export default mongooseModel