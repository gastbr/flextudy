from app.config.db import engine, SessionLocal
from app.v1.repositories.fakers.seeders.usertype_seeder import usertype_seeder
from app.v1.repositories.fakers.seeders.user_seeder import user_seeder

# Create tables
Base.metadata.create_all(engine)

# Create a session
db = SessionLocal()

# Call seeders
seed_user_types(db)
seed_users(db)

# Commit the changes
db.commit()
db.close()

print("Database seeded successfully!")