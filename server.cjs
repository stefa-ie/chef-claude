require("dotenv").config()
const express = require("express")
const Anthropic = require("@anthropic-ai/sdk")
const { InferenceClient } = require("@huggingface/inference")

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`

const { ANTHROPIC_API_KEY, HF_ACCESS_TOKEN, PORT = 5174 } = process.env

if (!HF_ACCESS_TOKEN) {
    throw new Error("Missing HF_ACCESS_TOKEN environment variable.")
}

const anthropic = ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: ANTHROPIC_API_KEY })
    : null
const hf = new InferenceClient(HF_ACCESS_TOKEN)
if (!anthropic) {
    console.warn("ANTHROPIC_API_KEY not set. Falling back to Hugging Face.")
}

const app = express()
app.use(express.json())

function sendError(res, error, fallback) {
    const message = error?.message || fallback
    console.error(message, error)
    res.status(500).json({ error: message })
}

function getIngredients(req) {
    const { ingredients } = req.body || {}
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return null
    }
    return ingredients.map(String)
}

app.post("/api/recipe/claude", async (req, res) => {
    const ingredients = getIngredients(req)
    if (!ingredients) {
        return res.status(400).send("Provide a non-empty ingredients array.")
    }

    const ingredientsString = ingredients.join(", ")
    try {
        if (!anthropic) {
            // Try using a different, more reliable model
            const response = await hf.chatCompletion({
                model: "meta-llama/Llama-3.2-3B-Instruct",
                messages: [
                    { 
                        role: "user", 
                        content: `${SYSTEM_PROMPT}\n\nI have ${ingredientsString}. Please give me a recipe you'd recommend I make!` 
                    }
                ],
                max_tokens: 512,
                temperature: 0.7,
            })
            return res.json({ recipe: response.choices[0].message.content })
        }

        const msg = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: [
                {
                    role: "user",
                    content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
                },
            ],
        })
        res.json({ recipe: msg.content[0].text })
    } catch (error) {
        sendError(res, error, "Claude request failed.")
    }
})

app.post("/api/recipe/mistral", async (req, res) => {
    const ingredients = getIngredients(req)
    if (!ingredients) {
        return res.status(400).send("Provide a non-empty ingredients array.")
    }

    const ingredientsString = ingredients.join(", ")
    try {
        const response = await hf.chatCompletion({
            model: "meta-llama/Llama-3.2-3B-Instruct",
            messages: [
                { 
                    role: "user", 
                    content: `${SYSTEM_PROMPT}\n\nI have ${ingredientsString}. Please give me a recipe you'd recommend I make!` 
                }
            ],
            max_tokens: 512,
            temperature: 0.7,
        })
        res.json({ recipe: response.choices[0].message.content })
    } catch (error) {
        sendError(res, error, "Mistral request failed.")
    }
})

app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`)
})
