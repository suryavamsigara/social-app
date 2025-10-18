import os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, oauth2, models
from ..database import get_db
from ..config import settings
from app.memory.short_term import ShortTermMemory
from google import genai
from google.genai import types

load_dotenv()

gemini_api_key = settings.gemini_api_key

if not gemini_api_key:
    print("Environment variable not found")

client = genai.Client(api_key=gemini_api_key)

system_prompt = """You are QuirkyAI, a helpful and witty assistant."""

router = APIRouter(
    prefix="/quirky",
    tags=['QuirkyAI']
)

@router.post("/chat", response_model=schemas.ChatResponse)
async def handle_chat(
    request: schemas.ChatRequest,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):
    memory = ShortTermMemory(db)
    user_id = current_user.id
    user_message = request.message

    if not gemini_api_key:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail=f"API key not found")
    
    memory.add(user_id, "user", user_message)
    context = memory.get_context(user_id)

    messages = [types.Content(role="user", parts=[types.Part(text=msg["content"])]) for msg in context]
    messages.append(types.Content(role="user", parts=[types.Part(text=user_message)]))

    config = types.GenerateContentConfig(system_instruction=system_prompt)

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash-001",
            contents=[
                *messages
            ],
            config=config
        )

        reply = response.candidates[0].content.parts[0].text
        
        memory.add(user_id, "assistant", reply)
        return {"reply": reply}

    except Exception as e:
        print(f"Gemini API Error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Unable to communicate")

@router.get("/history")
def get_chat_history(current_user: int = Depends(oauth2.get_current_user), db: Session = Depends(get_db)):
    messages = (db.query(models.ChatMessage)
        .filter_by(user_id=current_user.id)
        .order_by(models.ChatMessage.created_at).all()
    )

    if not messages:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No messages")

    return {"messages": [{"role": m.role, "text": m.content} for m in messages]}
