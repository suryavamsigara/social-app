from fastapi import Depends
from sqlalchemy.orm import Session
from .. import models
from ..database import get_db
from collections import deque

class ShortTermMemory:
    def __init__(self, db: Session = Depends(get_db), max_messages=5):
        self.db = db
        self.max_messages = max_messages

    def add(self, user_id: str, role: str, content: str):
        message = models.ChatMessage(
            user_id=user_id,
            role=role,
            content=content
        )
        self.db.add(message)
        self.db.commit()

        self._trim_history(user_id)

    def get_context(self, user_id: str):
        messages = (self.db.query(models.ChatMessage)
            .filter(models.ChatMessage.user_id == user_id)
            .order_by(models.ChatMessage.created_at.desc())
            .limit(self.max_messages)
            .all()
        )
        
        # oldest messages -> newest messages
        return [{"role": m.role, "content": m.content} for m in reversed(messages)]
    
    def _trim_history(self, user_id: int):
        """Delete older messages beyond max_messages"""
        subquery = (
            self.db.query(models.ChatMessage.id)
            .filter(models.ChatMessage.user_id == user_id)
            .order_by(models.ChatMessage.created_at.desc())
            .offset(self.max_messages)
            .subquery()
        )
        
        self.db.query(models.ChatMessage).filter(models.ChatMessage.id.in_(subquery)).delete(synchronize_session=False)
        self.db.commit()