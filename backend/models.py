from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Post(Base):
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    user = Column(String, index=True)
    title = Column(String, index=True)  # Add title column
    content = Column(String)
    likes = Column(Integer, default=0)

    comments = relationship("Comment", back_populates="post")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    user = Column(String)
    text = Column(String)

    post = relationship("Post", back_populates="comments")
    
