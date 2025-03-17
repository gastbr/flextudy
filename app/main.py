from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
import json

# Creamos la instancia de FastAPI
app = FastAPI()


# Modelo de datos para el usuario (Pydantic)
class User(BaseModel):
    username: str
    password: str


# Simulamos una "base de datos" en un archivo JSON
# Esta función carga los datos desde un archivo JSON local
def load_users():
    try:
        with open("users.json", "r") as file:
            return json.load(file)  # Retorna un diccionario con los usuarios
    except FileNotFoundError:
        return {}  # Si no existe el archivo, retorna un diccionario vacío


# Guarda los usuarios en el archivo JSON
def save_users(users_data):
    with open("users.json", "w") as file:
        json.dump(users_data, file, indent=4)  # Guarda los datos en formato JSON


# Función para verificar las credenciales del usuario
def authenticate_user(username: str, password: str):
    users = load_users()  # Cargamos los usuarios desde el archivo JSON
    user = users.get(username)  # Buscamos al usuario por su nombre
    if (
        user and user["password"] == password
    ):  # Verificamos si existe y si la contraseña coincide
        return True
    return False


# Ruta para registrar un nuevo usuario
@app.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: User):
    users = load_users()  # Cargamos los usuarios existentes
    if user.username in users:  # Verificamos si el usuario ya existe
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Usuario ya registrado"
        )
    users[user.username] = {"password": user.password}  # Añadimos el nuevo usuario
    save_users(users)  # Guardamos los cambios en el archivo JSON
    return {"message": "Usuario registrado exitosamente"}


# Ruta para iniciar sesión
@app.post("/login")
def login(user: User):
    if not authenticate_user(
        user.username, user.password
    ):  # Verificamos las credenciales
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales incorrectas"
        )
    return {"message": "Inicio de sesión exitoso"}


# Ruta para listar todos los usuarios (solo para fines educativos)
@app.get("/users")
def list_users():
    users = load_users()  # Cargamos los usuarios desde el archivo JSON
    return users
