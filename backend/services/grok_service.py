from openai import AsyncOpenAI
from groq import AsyncGroq
import os, base64, asyncio
import google.generativeai as genai
from dotenv import load_dotenv

# Load env variables
load_dotenv()

# Get keys from environment
grok_api_key = os.getenv("GROK_API_KEY")
groq_api_key = os.getenv("GROQ_API_KEY")

# Self-healing check: If the GROK_API_KEY starts with 'gsk_', it's actually a Groq key.
if grok_api_key and grok_api_key.startswith("gsk_"):
    groq_api_key = grok_api_key
    grok_api_key = None

# Two clients
grok_client = AsyncOpenAI(
    api_key=grok_api_key or "placeholder",
    base_url="https://api.x.ai/v1"
)

groq_client = AsyncGroq(
    api_key=groq_api_key
)

# Configure Gemini
gemini_api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
if gemini_api_key:
    genai.configure(api_key=gemini_api_key)

async def call_grok(messages: list, image_bytes: bytes = None) -> str:
    # 1. Fallback to Gemini if configured
    gemini_api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if gemini_api_key:
        try:
            model_name = "gemini-1.5-flash"
            
            system_instruction = None
            contents = []
            for msg in messages:
                if msg["role"] == "system":
                    system_instruction = msg["content"]
                else:
                    role = "user" if msg["role"] == "user" else "model"
                    # If content is a list (multimodal format), handle extraction of text
                    text_content = ""
                    if isinstance(msg["content"], list):
                        for item in msg["content"]:
                            if item.get("type") == "text":
                                text_content += item.get("text", "")
                    else:
                        text_content = msg["content"]
                    
                    contents.append({"role": role, "parts": [text_content]})
            
            if system_instruction:
                model = genai.GenerativeModel(model_name, system_instruction=system_instruction)
            else:
                model = genai.GenerativeModel(model_name)
                
            if image_bytes:
                # Append image part to last message's parts list
                img_part = {"mime_type": "image/jpeg", "data": image_bytes}
                contents[-1]["parts"].append(img_part)
                
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(None, lambda: model.generate_content(contents))
            return response.text
        except Exception as e:
            print(f"Gemini API fallback error: {e}")

    # Image provided → use Grok-3 Vision (xAI)
    if image_bytes:
        b64 = base64.b64encode(image_bytes).decode("utf-8")
        for msg in reversed(messages):
            if msg["role"] == "user":
                msg["content"] = [
                    {"type": "text", "text": msg["content"]},
                    {"type": "image_url", "image_url": {
                        "url": f"data:image/jpeg;base64,{b64}"
                    }}
                ]
                break

        response = await grok_client.chat.completions.create(
            model="grok-2-vision-1212",  # vision model
            messages=messages,
            temperature=0.3,
            max_tokens=1500
        )

    # No image → use Groq (fast + cheap)
    else:
        response = await groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.3,
            max_tokens=1500
        )

    return response.choices[0].message.content