async function requestRecipe(path, ingredientsArr) {
    const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: ingredientsArr }),
    })

    if (!response.ok) {
        const message = await response.text()
        throw new Error(message || "Recipe request failed.")
    }

    const data = await response.json()
    return data.recipe
}

// 🚨👉 ALERT: Read message below! You've been warned! 👈🚨
// If you're following along on your local machine instead of
// here on Scrimba, make sure you don't commit your API keys
// to any repositories and don't deploy your project anywhere
// live online. Otherwise, anyone could inspect your source
// and find your API keys/tokens. If you want to deploy
// this project, you'll need to create a backend of some kind,
// either your own or using some serverless architecture where
// your API calls can be made. Doing so will keep your
// API keys private.
//
// This file calls a local backend so keys never ship to the browser.

export async function getRecipeFromChefClaude(ingredientsArr) {
    return requestRecipe("/api/recipe/claude", ingredientsArr)
}

export async function getRecipeFromMistral(ingredientsArr) {
    return requestRecipe("/api/recipe/mistral", ingredientsArr)
}
