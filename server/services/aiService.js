const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function analyzeWithAI(player, performance, strength, weakness, overallScore,
  grade, role, milestone) {

    try {

        const prompt = `
        You are a professional basketball analyst.

        Analyze this player's performance.

        Player: ${player.name}

        Raw statistics:
        Points: ${player.points}
        Assists: ${player.assists}
        Rebounds: ${player.rebounds}

        Rule-based performance evaluation:
        Scoring: ${performance.scoring}
        Playmaking: ${performance.playmaking}
        Rebounding: ${performance.rebounding}

        Deterministic evaluation:
        Strength: ${strength}
        Weakness: ${weakness}
        Player role: ${role}

        Milestone:
        Type: ${milestone.type}
        Categories: ${milestone.categories.join(", ") || "None"}

        Application evaluation:
        Overall score: ${overallScore}
        Grade: ${grade}

        Use the raw statistics and structured evaluation as evidence.

        Do not simply repeat the labels.

        Analyze the player according to their identified role.

        For example:
        - A scoring-focused player should be evaluated primarily on scoring impact, while also discussing secondary contributions.
        - A playmaking-focused player should be evaluated on creating opportunities and facilitating offense.
        - A rebounding-focused player should be evaluated on rebounding impact and physical/possession value.
        - An all-around player should be evaluated on how multiple strengths combine.
        - A balanced player should be evaluated on overall versatility.

        Explain:
        - how the player's role is supported by the statistics
        - how the player's strongest skills contribute to that role
        - how the weakest area could limit that role
        - how the player's milestone affects the evaluation, if applicable
        - what the player could improve to become more effective

        Do not invent statistics, achievements, or traits that were not provided.

        The rule-based evaluation is the application's objective statistical
        classification. Do not contradict the provided grade, role, milestone,
        strength, weakness, or performance categories.

        Your job is to explain and contextualize the evaluation, not replace it.
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