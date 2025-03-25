from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from faker import Faker
from models import Base, User, Post

DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

# Create tables
Base.metadata.create_all(engine)

# Create a session
db = Session()

# Generate users and posts
users = [UserFactory() for _ in range(10)]
db.add_all(users)
db.flush()  # Assign user IDs without committing

posts = []
for user in users:
    for _ in range(5):
        post = PostFactory(author=user)
        posts.append(post)

db.add_all(posts)
db.commit()
db.close()

print("Database seeded successfully!")