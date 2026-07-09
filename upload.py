import subprocess
from datetime import datetime

PROJECT_DIR = "C:\\Projekt\\potlas-weboldal"
GIT = "C:\\Users\\marton.aron\\AppData\\Local\\Programs\\Git\\cmd\\git.exe"

def run_git(args):
    return subprocess.run(
        [GIT, *args],
        cwd=PROJECT_DIR,
        text=True,
        capture_output=True,
        encoding="utf-8",
        errors="replace"
    )

def main():
    CURRENT_DATE = datetime.now().strftime('%Y-%m-%d')
    
    p_add = run_git(["add", "."])
    p_commit = run_git(["commit", "-m", f"deploy: new games added at {CURRENT_DATE}"])
    p_push = run_git(["push"])

    with open(f"{PROJECT_DIR}\\log_upload.log", "a", encoding="utf-8") as file:
        file.write(f"\n--- git add --- {CURRENT_DATE}\n")
        file.write(p_add.stdout + p_add.stderr)

        file.write("\n--- git commit ---\n")
        file.write(p_commit.stdout + p_commit.stderr)

        file.write("\n--- git push ---\n")
        file.write(p_push.stdout + p_push.stderr)

if __name__ == "__main__":
    main()