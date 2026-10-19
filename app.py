import streamlit as st
from groq import Groq

st.set_page_config(page_title="AI Code Reviewer", page_icon="💻", layout="wide")

st.title("💻 AI-Powered Code Reviewer & Assistant")
st.write("നിങ്ങളുടെ കോഡ് ഇവിടെ നൽകി ബഗുകളും തിരുത്തലുകളും കണ്ടെത്തൂ!")

st.sidebar.header("Configuration")
api_key = st.sidebar.text_input("Enter your Groq API Key:", type="password")

user_code = st.text_area("Paste your code here:", height=200, placeholder="def add(a, b):\n    return a + b")

if st.button("Review Code 🚀"):
    if not api_key:
        st.warning("ദയവായി നിങ്ങളുടെ Groq API Key നൽകുക!")
    elif not user_code.strip():
        st.warning("ദയവായി കുറച്ചു കോഡ് പേസ്റ്റ് ചെയ്യുക!")
    else:
        try:
            client = Groq(api_key=api_key)
            
            prompt = f"""
            You are an expert software engineer and code reviewer. Analyze the following code:
            1. Find any bugs or syntax errors.
            2. Suggest performance improvements or optimizations.
            3. Point out security vulnerabilities if any.
            4. Provide the corrected/refactored version of the code.

            Here is the code:
            {user_code}
            """
            
            with st.spinner("Analyzing your code... Please wait... ⏳"):
                chat_completion = client.chat.completions.create(
                    messages=[
                        {
                            "role": "user",
                            "content": prompt,
                        }
                    ],
                    model="openai/gpt-oss-20b",  # 👈 നിലവിൽ സജീവമായ ഏറ്റവും പുതിയ മോഡൽ നെയിം
                )
                
                st.success("Review Completed Successfully!")
                st.markdown("### 📋 Review Report:")
                st.markdown(chat_completion.choices[0].message.content)
                
        except Exception as e:
            st.error(f"എന്തെങ്കിലും തകരാറുണ്ടായിരിക്കുന്നു: {e}")