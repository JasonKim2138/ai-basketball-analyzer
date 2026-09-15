const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function analyzeWithAI(player) {

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

    return JSON.parse(response.output_text);
}

module.exports = { analyzeWithAI };