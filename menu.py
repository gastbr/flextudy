#!/usr/bin/env python3
import os
import subprocess
from enum import Enum
from typing import Optional, List

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

def show_menu() -> None:
    os.system("cls" if os.name == "nt" else "clear")
    print_color("=== Gestor Docker - FastAPI + PostgreSQL ===", Color.BLUE)
    print_color("1. 🏗️  Construir y levantar contenedores", Color.GREEN)
    print_color("2. 🛑 Detener contenedores", Color.YELLOW)
    print_color("3. 🐘 Ejecutar migraciones (Alembic)", Color.GREEN)
    print_color("4. 📜 Ver logs del backend", Color.GREEN)
    print_color("5. 🛑 Detener y eliminar contenedores", Color.RED)
    print_color("6. 🔄 Reconstruir todo", Color.YELLOW)
    print_color("7. 🚪 Salir", Color.RED)

def open_logs_in_new_terminal():
    """Abre los logs en una nueva terminal/consola"""
    command = "docker-compose logs -f backend"
    
    if sys.platform == "win32":
        # Windows
        subprocess.Popen(f"start cmd /k {command}", shell=True)
    elif sys.platform == "darwin":
        # macOS
        subprocess.Popen([
            "osascript",
            "-e", 
            f'tell app "Terminal" to do script "{command}"'
        ])
    else:
        # Linux (asume gnome-terminal)
        try:
            subprocess.Popen([
                "gnome-terminal",
                "--",
                "bash",
                "-c",
                f"{command}; exec bash"
            ])
        except FileNotFoundError:
            # Fallback para otras terminales en Linux
            subprocess.Popen([
                "xterm",
                "-e",
                f"{command}"
            ])


def main() -> None:
    while True:
        show_menu()
        choice = input("👉 Selecciona una opción (1-7): ")
        
        if choice == "1":
            run_command("docker-compose up -d --build", shell=True)
        elif choice == "2":
            run_command("docker-compose stop", shell=True)
        elif choice == "3":
            run_command("docker-compose exec backend alembic upgrade head", shell=True)
        elif choice == "4":
            print_color("Presiona Ctrl+C para salir de los logs...", Color.YELLOW)
            os.system("docker-compose logs -f backend")
        elif choice == "5":
            run_command("docker-compose down", shell=True)
        elif choice == "6":
            if run_command("docker-compose down -v", shell=True):
                run_command("docker-compose up -d --build", shell=True)
        elif choice == "7":
            print_color("¡Hasta luego! 👋", Color.BLUE)
            break
        else:
            print_color("Opción no válida. Intenta nuevamente.", Color.RED)
        
        if choice in ["1", "2", "3", "5", "6"]:
            input("\nPresiona Enter para continuar...")

if __name__ == "__main__":
    main()