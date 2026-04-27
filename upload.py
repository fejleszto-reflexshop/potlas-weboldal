import subprocess

def main():
    p_add = subprocess.run(["C:\\Users\\marton.aron\\AppData\\Local\\Programs\\Git\\cmd\\git.exe", "add", "."])

    p_commit = subprocess.run(["C:\\Users\\marton.aron\\AppData\\Local\\Programs\\Git\\cmd\\git.exe", "commit", "-m", "deploy: new games added"])

    p_push = subprocess.run(["C:\\Users\\marton.aron\\AppData\\Local\\Programs\\Git\\cmd\\git.exe", "push"])


if __name__ == "__main__":
    main()