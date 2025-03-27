from app.v1.repositories.fakers.factories.user_type_factory import UserTypeFactory

def usertype_seeder(db):
    user_types = [
        UserTypeFactory(name="Admin"),
        UserTypeFactory(name="Teacher"),
        UserTypeFactory(name="Student")
    ]