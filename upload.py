import subprocess

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
    p_add = run_git(["add", "."])
    p_commit = run_git(["commit", "-m", "deploy: new games added"])
    p_push = run_git(["push"])

    with open(f"{PROJECT_DIR}\\log_upload.log", "a", encoding="utf-8") as file:
        file.write("\n--- git add ---\n")
        file.write(p_add.stdout + p_add.stderr)

        file.write("\n--- git commit ---\n")
        file.write(p_commit.stdout + p_commit.stderr)

        file.write("\n--- git push ---\n")
        file.write(p_push.stdout + p_push.stderr)

if __name__ == "__main__":
    main()