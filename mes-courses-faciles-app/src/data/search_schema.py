import os

search_dir = "src"
query = "productSchema"

results = []
for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.endswith((".ts", ".tsx", ".js", ".jsx")):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    for line_num, line in enumerate(f, 1):
                        if query in line:
                            results.append((path, line_num, line.strip()))
            except Exception:
                pass

print(f"Found {len(results)} occurrences of '{query}':")
for r in results:
    print(f"{r[0]}:{r[1]} - {r[2]}")
