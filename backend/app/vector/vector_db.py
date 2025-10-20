import os
from dotenv import load_dotenv
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from ..config import settings

load_dotenv()

pinecone_api_key = settings.pinecone_api_key
pinecone_index_name = settings.pinecone_index_name

pc = None
index = None

if not pinecone_api_key or not pinecone_index_name:
    raise ValueError("Environment variables are not set for Pinecone API or index name")
else:
    pc = Pinecone(api_key=pinecone_api_key)
    try:
        index = pc.Index(pinecone_index_name)
        print(f"Connected to Pinecone index: {pinecone_index_name}")
    except Exception as e:
        print("Error: Could not initialize Pinecone: ", e)

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

def get_embeddings(texts):
    """
    Generate embeddings for a list of texts
    """
    return embedding_model.encode(texts).tolist()

def upsert_vectors(vectors):
    if index is None:
        raise RuntimeError("Pinecone index isn't initialized")
    index.upsert(vectors=vectors)

def query_similar(query_text, top_k=5):
    if index is None:
        raise RuntimeError("Pinecone index isn't intialiazed")
    query_embedding = embedding_model.encode(query_text).tolist()
    result = index.query(vector=query_embedding, top_k=top_k, include_metadata=True)
    return result
