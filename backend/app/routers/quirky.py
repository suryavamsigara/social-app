import os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from .. import schemas
from openai import OpenAI

load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    print("Environment variable not found")

openai_client = OpenAI(api_key=openai_api_key)

router = APIRouter(
    prefix="/quirky",
    tags=['QuirkyAI']
)

@router.post("/chat", response_model=schemas.ChatResponse)
def handle_chat(request: schemas.ChatRequest):
    if not openai_api_key:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail=f"API key not found")
    try:
        completion = openai_client.chat.completions.create(
            model="gpt-5-nano",
            messages=[
                {"role": "system", "content": "You are QuirkyAI, a helpful but slightly eccentric and witty assistant."},
                {"role": "user", "content": request.message}
            ]
        )

        response = completion.choices[0].message.content
        return {"reply": response}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Unable to communicate")
