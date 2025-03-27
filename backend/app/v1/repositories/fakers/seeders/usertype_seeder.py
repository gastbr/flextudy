from app.v1.models.user_type import UserType


async def usertype_seeder(session):
    # Crear un registro para el usuario admin en la tabla usertype
    admin_user_type = UserType(name="aaaaadmin")
    session.add(admin_user_type)
    teacher_user_type = UserType(name="teacher")
    session.add(teacher_user_type)
    student_user_type = UserType(name="student")
    session.add(student_user_type)

    await session.commit()
    print("Database seeded successfully!")
    return []