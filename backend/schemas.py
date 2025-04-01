from pydantic import BaseModel
from typing import List

class CommentBase(BaseModel):
    user: str
    text: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    post_id: int

    class Config:
        orm_mode = True

class PostBase(BaseModel):
    user: str
    content: str

class PostCreate(PostBase):
    pass

class Post(PostBase):
    id: int
    likes: int
    comments: List[Comment] = []

    class Config:
        orm_mode = True

