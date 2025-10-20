from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from .vector_db import get_embeddings, upsert_vectors, query_similar, index

def index_single_post(post: schemas.Post, db: Session):
    post = db.query(models.Post).filter(models.Post.id == post.id).first()
    embedding = get_embeddings([post.content])[0]

    vector = [
        {
            "id": str(post.id),
            "values": embedding,
            "metadata": {
                "post_id": post.id,
                "owner_id": post.owner_id,
            },
        }
    ]
    upsert_vectors(vector)

def index_posts_in_vector_db(db: Session):
    """
    Indexing all posts in Pinecone for retrieval
    """
    posts = db.query(models.Post).all()

    if not posts:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"No posts found to index")
    
    vector_ids = [str(post.id) for post in posts]
    existing_vectors = index.fetch(ids=vector_ids)

    already_indexed_ids = set(existing_vectors.vectors.keys())
    posts_to_index = [post for post in posts if str(post.id) not in already_indexed_ids]

    if not posts_to_index:
        print("All posts already indexed")
        return {"message": "All posts already indexed"}
    
    contents = [post.content for post in posts_to_index]
    embeddings = get_embeddings(contents)

    vectors = [
        {
            "id": str(post.id),
            "values": embeddings[i],
            "metadata": {
                "post_id": post.id,
                "owner_id": post.owner_id
            },
        }
        for i, post in enumerate(posts_to_index)
    ]
    
    upsert_vectors(vectors)
    print(f"Indexed {len(vectors)} posts")
    return {"message": f"Indexed {len(vectors)} posts in Pinecone."}

SIMILARITY_THRESHOLD = 0.2

def recommend_posts(db: Session, query: str, top_k: int=5):
    results = query_similar(query, top_k=100)
    relevant_matches = [
        match for match in results.get('matches', [])
        if match['score'] >= SIMILARITY_THRESHOLD
    ]

    if not relevant_matches:
        return []
    
    post_ids = [int(match['id']) for match in relevant_matches]
    posts = db.query(models.Post).filter(models.Post.id.in_(post_ids)).all()

    return posts
