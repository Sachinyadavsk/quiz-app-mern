import Result from "../models/resultModel.js";
export const createResult = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                status: "fail",
                message: "Unauthorized"
            });
        }
        const { title, technology, level, totalQuestions, correct, wrong } = req.body;
        if (!title || !technology || !level || totalQuestions === undefined || correct === undefined) {
            return res.status(400).json({
                status: "fail",
                message: "Missing required fields"
            });
        }
        //compute score and performance inside the model pre-save hook
        const computedWrong = wrong !== undefined ? Number(wrong) : Math.max(0, Number(totalQuestions) - Number(correct));
        if (!title) {
            return res.status(400).json({
                status: "fail",
                message: "Title is required"
            });
        }

        const payload = {
            title: String(title).trim(),
            technology,
            level,
            totalQuestions: Number(totalQuestions),
            correct: Number(correct),
            wrong: computedWrong,
            user: req.user.id
        };

        const result = new Result(payload);
        await result.save();
        return res.status(201).json({
            status: "success",
            data: result
        });

    } catch (error) {
        console.error("Error creating result:", error);
        return res.status(500).json({
            status: "error",
            message: "Server Error"
        });
    }
}

// LIST RESULTS
export async function listResults(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                status: "fail",
                message: "Unauthorized"
            });
        }

        const { technology } = req.query;
        const query = { user: req.user.id };
        if (technology) {
            query.technology = technology;
        }
        const item = await Result.find(query).sort({ createdAt: -1 }).lean();
        return res.status(200).json({
            status: "success",
            data: item
        });
    } catch (error) {
        console.error("Error listing results:", error);
        return res.status(500).json({
            status: "error",
            message: "Server Error"
        });
    }
}

