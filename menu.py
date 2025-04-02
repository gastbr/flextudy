#!/usr/bin/env python3
import os
import subprocess
from enum import Enum
from typing import Optional

class Color(Enum):
    RED = "\033[91m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    RESET = "\033[0m"

def print_color(text: str, color: Color) -> None:
    print(f"{color.value}{text}{Color.RESET.value}")

def run_command(command: str, shell: bool = False) -> bool:
    try:
        result = subprocess.run(
            command if shell else command.split(),
            check=True,
            shell=shell,
            text=True,
            capture_output=True
        )
        print_color(f"✅ Comando exitoso: {command}", Color.GREEN)
        return True
    except subprocess.CalledProcessError as e:
        print_color(f"❌ Error en comando: {command}", Color.RED)
        print_color(f"Detalle: {e.stderr}", Color.YELLOW)
        return False

def show_menu() -> None:
    os.system("cls" if os.name == "nt" else "clear")
    print_color("=== Gestor Docker - FastAPI + PostgreSQL ===", Color.BLUE)
    print_color("1. 🏗️  Construir y levantar contenedores", Color.GREEN)
    print_color("2. 🐘 Ejecutar migraciones (Alembic)", Color.YELLOW)
    print_color("3. 📜 Ver logs del backend", Color.GREEN)
    print_color("4. 🛑 Detener y eliminar contenedores", Color.RED)
    print_color("5. 🔄 Reconstruir todo", Color.YELLOW)
    print_color("6. 🚪 Salir", Color.RED)

def main() -> None:
    while True:
        show_menu()
        choice = input("👉 Selecciona una opción (1-6): ")
        
        if choice == "1":
            run_command("docker-compose up -d --build", shell=True)
        elif choice == "2":
            run_command("docker-compose exec backend alembic upgrade head", shell=True)
        elif choice == "3":
            print_color("Presiona Ctrl+C para salir de los logs...", Color.YELLOW)
            os.system("docker-compose logs -f backend")
        elif choice == "4":
            run_command("docker-compose down", shell=True)
        elif choice == "5":
            if run_command("docker-compose down -v", shell=True):
                run_command("docker-compose up -d --build", shell=True)
        elif choice == "6":
            print_color("¡Hasta luego! 👋", Color.BLUE)
            break
        else:
            print_color("Opción no válida. Intenta nuevamente.", Color.RED)
        
        if choice in ["1", "2", "4", "5"]:
            input("\nPresiona Enter para continuar...")

if __name__ == "__main__":
    main()