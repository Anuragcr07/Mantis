from openai import AsyncOpenAI
from groq import AsyncGroq
import os, base64

# Two clients
grok_client = AsyncOpenAI(
    api_key=os.getenv("GROK_API_KEY"),
    base_url="https://api.x.ai/v1"
)

groq_client = AsyncGroq(
    api_key=os.getenv("GROQ_API_KEY")
)

async def call_grok(messages: list, image_bytes: bytes = None) -> str:

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