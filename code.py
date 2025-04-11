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


def show_menu() -> None:
    os.system("cls" if os.name == "nt" else "clear")
    print_color("===RUN VISUALSTUDIO ===", Color.BLUE)
    print_color("1. 🚀 RUN", Color.GREEN)


def main() -> None:
    while True:
        show_menu()
        choice = input("👉 Selecciona una opción: ")
        if choice == "1":
            run_command("cd backend & code .", shell=True)
            run_command("cd frontend & code .", shell=True)
            # run_command("code .", shell=True)
        # elif choice == "2":
        #     run_command("cd backend & docker-compose up -d --build", shell=True)
        #     run_command("cd frontend & pnpm run dev", shell=True)
        else:
            print_color("Opción no válida. Intenta nuevamente.", Color.RED)


if __name__ == "__main__":
    main()