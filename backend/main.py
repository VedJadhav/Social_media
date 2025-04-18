from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import models, schemas, crud
from database import engine, get_db
from fastapi.middleware.cors import CORSMiddleware  # ✅ Import CORS Middleware
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

# ✅ Enable CORS to allow frontend (React) to communicate with backend (FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from React frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

Instrumentator().instrument(app).expose(app)


@app.get("/posts", response_model=list[schemas.Post])
def read_posts(db: Session = Depends(get_db)):
    return crud.get_posts(db)

@app.post("/posts", response_model=schemas.Post)
def create_post(post: schemas.PostCreate, db: Session = Depends(get_db)):
    return crud.create_post(db, post)

@app.post("/posts/{post_id}/like")
def like_post(post_id: int, db: Session = Depends(get_db)):
    return crud.like_post(db, post_id)
@app.post("/posts/{post_id}/comment", response_model=schemas.Comment)
def add_comment(post_id: int, comment: schemas.CommentCreate, db: Session = Depends(get_db)):
    db_comment = crud.add_comment(db, post_id, comment)
    if db_comment is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_comment