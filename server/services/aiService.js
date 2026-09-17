const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function analyzeWithAI(player) {

    try {

        const prompt = `
You are a professional basketball analyst.

Analyze this player's performance:

Player: ${player.name}
Points: ${player.points}
Assists: ${player.assists}
Rebounds: ${player.rebounds}

Analyze the player's scoring, playmaking, rebounding,
strengths, weaknesses, and overall performance.
`;

        const response = await client.responses.create({
            model: "gpt-5.6-luna",
            input: prompt,
            text: {
                format: {
                    type: "json_schema",
                    name: "basketball_analysis",
                    strict: true,
                    schema: {
                        type: "object",
                        properties: {
                            scoringAnalysis: {
                                type: "string"
                            },
                            playmakingAnalysis: {
                                type: "string"
                            },
                            reboundingAnalysis: {
                                type: "string"
                            },
                            strength: {
                                type: "string"
                            },
                            weakness: {
                                type: "string"
                            },
                            overall: {
                                type: "string"
                            }
                        },
                        required: [
                            "scoringAnalysis",
                            "playmakingAnalysis",
                            "reboundingAnalysis",
                            "strength",
                            "weakness",
                            "overall"
                        ],
                        additionalProperties: false
                    }
                }
            }
        });

        const aiAnalysis = JSON.parse(response.output_text);

        return {
            aiAnalysis,
            aiAvailable: true
        };

    } catch (error) {

        console.error("OpenAI analysis failed:", error.message);

        return {
            aiAvailable: false,

            aiAnalysis: {
                overall: "AI analysis is currently unavailable.",
                strength: "Unable to generate AI analysis.",
                weakness: "Unable to generate AI analysis.",
                scoringAnalysis: "AI analysis unavailable.",
                playmakingAnalysis: "AI analysis unavailable.",
                reboundingAnalysis: "AI analysis unavailable."
            }
        };
    }
}

module.exports = { analyzeWithAI };