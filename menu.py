#!/usr/bin/env python3
import os
import subprocess
from enum import Enum
from typing import Optional, List
import http.client

class Color(Enum):
    RED = "\033[91m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    RESET = "\033[0m"

def print_color(text: str, color: Color) -> None:
    print(f"{color.value}{text}{Color.RESET.value}")



def run_command(command: str, shell: bool = False) -> bool:
    print_color(f"🚀 Ejecutando: {command}", Color.BLUE)
    try:
        process = subprocess.Popen(
            command,
            shell=shell,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Mostrar salida en tiempo real
        while True:
            output = process.stdout.readline()
            if output == '' and process.poll() is not None:
                break
            if output:
                print(output.strip())
        
        # Verificar si hubo errores
        _, stderr = process.communicate()
        if process.returncode != 0:
            print_color(f"❌ Error en comando: {command}", Color.RED)
            if stderr:
                print_color(f"Detalle: {stderr.strip()}", Color.YELLOW)
            return False
        
        print_color(f"✅ Comando exitoso: {command}", Color.GREEN)
        return True
    except Exception as e:
        print_color(f"❌ Error inesperado en comando: {command}", Color.RED)
        print_color(f"Detalle: {str(e)}", Color.YELLOW)
        return False
    

def is_node_installed() -> bool:
    try:
        subprocess.run(["node", "--version"], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def is_pnpm_installed() -> bool:
    try:
        subprocess.run(["pnpm", "--version"], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def install_pnpm() -> None:
    print("🔧 Instalando pnpm...")
    try:
        run_command("npm install -g pnpm", shell=True)
    except Exception as e:
        print(f"❌ Error al instalar pnpm: {e}")

def setup_frontend_dependencies() -> None:
    if not is_node_installed():
        print(f"❌ Node no esta instalado")
    
    if not is_pnpm_installed():
        install_pnpm()
        print("📦 Instalando dependencias del frontend...")
        run_command("cd frontend && pnpm install", shell=True)


def show_menu() -> None:
    os.system("cls" if os.name == "nt" else "clear")
    print_color("=== Gestor Docker - FastAPI + PostgreSQL ===", Color.BLUE)
    print_color("0. 🚀 Quick Start", Color.GREEN)
    print_color("1. Iniciar front en local", Color.GREEN)
    print_color("2. 📜 Ver logs del backend", Color.GREEN)
    print_color("3. 🏗️  Construir y levantar contenedores", Color.GREEN)
    print_color("4. 📦 Instalar pnpm en fronted", Color.GREEN)
    print_color("5. 🛑 Detener contenedores", Color.YELLOW)
    print_color("6. 🐘 Ejecutar migraciones (Alembic)", Color.GREEN)
    print_color("7. 🛑 Detener y eliminar contenedores", Color.RED)
    print_color("8. 🚪 Salir", Color.RED)



def main() -> None:
    while True:
        show_menu()
        choice = input("👉 Selecciona una opción: ")
        
        if choice == "0":
            run_command("cd backend && docker-compose up -d --build", shell=True)
            run_command("cd backend && docker-compose exec fastapi alembic upgrade head", shell=True)
            try:
                conn = http.client.HTTPConnection("localhost", 8000)  
                conn.request("GET", "/v1/fakers/seed")  
                response = conn.getresponse()
                print(f"✅ GET exitoso. Respuesta: {response.read().decode()}")  # Decodifica la respuesta
                conn.close()
            except Exception as e:
                print(f"❌ Error en GET: {e}")
            run_command("cd frontend && pnpm install", shell=True)
            run_command("cd frontend && pnpm run dev", shell=True)
        elif choice == "1":
            run_command("cd backend && docker-compose up -d --build", shell=True)
            run_command("cd frontend && pnpm run dev", shell=True)
        elif choice == "2":
            print_color("Presiona Ctrl+C para salir de los logs...", Color.YELLOW)
            subprocess.run(["docker-compose", "logs", "-f", "fastapi"], cwd="backend")
        elif choice == "3":
            run_command("cd backend && docker-compose up -d --build", shell=True)
        elif choice == "4":
            frontend_path = os.path.join(os.getcwd(), "frontend")
            subprocess.run("pnpm run dev", shell=True, cwd=frontend_path)
        elif choice == "5":
            run_command("cd backend & docker-compose stop", shell=True)
        elif choice == "6":
            run_command("cd backend & docker-compose exec fastapi alembic upgrade head", shell=True)
        elif choice == "7":
            run_command("cd backend && docker-compose down", shell=True)
        elif choice == "8":
            print_color("¡Hasta luego! 👋", Color.BLUE)
            break
        else:
            print_color("Opción no válida. Intenta nuevamente.", Color.RED)
        
        if choice in ["1", "2", "3", "5", "6", "7", "8", "9"]:
            input("\nPresiona Enter para continuar...")

if __name__ == "__main__":
    main()