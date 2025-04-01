from sqlalchemy.orm import Session
import models, schemas

def get_posts(db: Session):
    return db.query(models.Post).all()

def create_post(db: Session, post: schemas.PostCreate):
    db_post = models.Post(user=post.user, content=post.content, likes=0)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

def like_post(db: Session, post_id: int):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if post:
        post.likes += 1
        db.commit()
    return post

#def add_comment(db: Session, post_id: int, comment: schemas.CommentCreate):
 #   db_comment = models.Comment(post_id=post_id, user=comment.user, text=comment.text)
  #  db.add(db_comment)
   # db.commit()
    #db.refresh(db_comment)
    #return db_comment

def add_comment(db: Session, post_id: int, comment: schemas.CommentCreate):
    db_post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not db_post:
        return None
    db_comment = models.Comment(post_id=post_id, user=comment.user, text=comment.text)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment