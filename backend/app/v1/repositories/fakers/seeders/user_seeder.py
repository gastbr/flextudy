from app.v1.repositories.fakers.factories.user_factory import UserFactory

def user_seeder(db):
    # Generate users
    users = [UserFactory() for _ in range(20)]
    
    db.add_all(users)
    db.flush()  # Assign user IDs without committing
    print("Users seeded successfully!")