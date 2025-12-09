import mongoose from "mongoose";

const performanceEnum = ["excellent", "good", "average", "poor"];
const resultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: false
    },
    title: {
        type: String,
        required: true
    },
    technology: {
        type: String,
        required: true,
        trim: true,
        enum: [
            "JavaScript",
            "Python",
            "Java",
            "C++",
            "Ruby",
            "Go",
            "PHP",
            "C#",
            "TypeScript",
            "Swift"
        ]
    },
    level: {
        type: String,
        required: true,
        trim: true,
        enum: ["Beginner", "Intermediate", "Advanced", "Expert"]
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    correct: {
        type: Number,
        required: true
    },
    wrong: {
        type: Number,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    performance: {
        type: String,
        required: true,
        enum: performanceEnum,
        default: "Needs Work"
    },
}, { timestamps: true });
// Create and export the model
resultSchema.pre('save', function (next) {
    const total = Number(this.totalQuestions);
    const correct = Number(this.correct);
    this.score = total ? Math.round((correct / total) * 100) : 0;
    if (this.score >= 85) this.performance = "excellent";
    else if (this.score >= 70) this.performance = "good";
    else if (this.score >= 50) this.performance = "average";
    else this.performance = "poor";
    if ((this.wrong === undefined || this.wrong === null) && total) {
        this.wrong = math.max(0, total - correct);
    }

    next();

});
const Result = mongoose.model("Result", resultSchema);
export default Result;
