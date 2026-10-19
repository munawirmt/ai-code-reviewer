async function reviewCode() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const userCode = document.getElementById('userCode').value.trim();
    const resultContainer = document.getElementById('resultContainer');
    const loading = document.getElementById('loading');
    const outputContent = document.getElementById('outputContent');

    // പരിശോധനകൾ
    if (!apiKey) {
        alert("ദയവായി നിങ്ങളുടെ Groq API Key നൽകുക!");
        return;
    }
    if (!userCode) {
        alert("ദയവായി കുറച്ചു കോഡ് പേസ്റ്റ് ചെയ്യുക!");
        return;
    }

    // റിസൾട്ട് ബോക്സ് കാണിക്കുക, ലോഡിംഗ് കാണിക്കുക
    resultContainer.classList.remove('hidden');
    loading.classList.remove('hidden');
    outputContent.innerHTML = "";

    const prompt = `You are an expert software engineer and code reviewer. Analyze the following code:
1. Find any bugs or syntax errors.
2. Suggest performance improvements or optimizations.
3. Point out security vulnerabilities if any.
4. Provide the corrected/refactored version of the code.

Here is the code:
${userCode}`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }]
            })
        });

        const data = await response.json();
        
        loading.classList.add('hidden');

        if (data.choices && data.choices.length > 0) {
            outputContent.innerHTML = data.choices[0].message.content;
        } else {
            outputContent.innerHTML = "എന്തെങ്കിലും പ്രശ്നം സംഭവിച്ചിരിക്കുന്നു. വീണ്ടും ശ്രമിക്കുക.";
        }

    } catch (error) {
        loading.classList.add('hidden');
        outputContent.innerHTML = "Error: " + error.message;
    }
}