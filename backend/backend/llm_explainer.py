import google.generativeai as genai
import os

def explain_flags(business_name: str, flags: list, risk: str) -> str:
    if not flags:
        return "This record passed all validation checks. No compliance issues detected."

    try:
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = f"""
You are a compliance analyst at a major financial institution.
A business onboarding record has been flagged by our KYC validation system.

Business Name: {business_name}
Risk Level: {risk}
Flags Detected: {", ".join(flags)}

In 2-3 plain English sentences, explain what these flags mean, 
why they are a compliance risk, and what action should be taken.
Be concise and professional. Do not use bullet points.
"""
        response = model.generate_content(prompt)
        return response.text.strip()

    except Exception as e:
        return f"Explanation unavailable: {str(e)}"
